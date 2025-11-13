import { useState, useEffect } from "react";
import UsuariosTableSimple from "./UsuariosTableSimple";
import UsuarioModal, { UsuarioFormData } from "../modals/UsuarioModal";
import CustomSelect from "../common/CustomSelect";
import { Usuario, obtenerUsuarios, toggleEstadoUsuario as toggleEstadoUsuarioService, crearUsuario, actualizarUsuario } from "../../services/usuarioService";
import { crearEstudiante, actualizarEstudiante } from "../../services/estudianteService";
import { crearDocente, actualizarDocente } from "../../services/docenteService";
import { obtenerRoles } from "../../services/rolService";

export default function UsuariosTableWithFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");

  // Estado de columnas visibles
  const [visibleColumns, setVisibleColumns] = useState({
    usuario: true,           // Foto + Nombre + Apellido
    ci: false,
    correo: true,
    rol: true,
    redesSociales: false,     // Instagram + LinkedIn + GitHub
    bio: false,
    estaActivo: true,
    fechaCreacion: false,
    codigo: false,
  });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await obtenerUsuarios();
      setUsuarios(data.usuarios);
      setTotalUsuarios(data.count);
      setError(null);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuarios según los criterios
  const filteredData = usuarios.filter(usuario => {
    const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`.toLowerCase();
    const matchesSearch = 
      nombreCompleto.includes(searchTerm.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.ci.includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && usuario.estaActivo) ||
      (statusFilter === "inactive" && !usuario.estaActivo);
    
    const matchesRole =
      roleFilter === "all" ||
      usuario.Rol.nombre.toLowerCase() === roleFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Paginación
  const itemsPerPage = parseInt(rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setShowModal(true);
  };

  const handleDelete = async (idUsuario: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      console.log('Eliminar usuario:', idUsuario);
      // TODO: Implementar eliminación
      await cargarUsuarios();
    }
  };

  const handleToggleStatus = async (idUsuario: string) => {
    try {
      await toggleEstadoUsuarioService(idUsuario);
      await cargarUsuarios(); // Recargar la lista
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al cambiar el estado del usuario');
    }
  };

  const handleAddUser = () => {
    setSelectedUsuario(null);
    setShowModal(true);
  };

  const handleSubmitUsuario = async (data: UsuarioFormData) => {
    try {
      if (selectedUsuario) {
        // ============ ACTUALIZAR USUARIO EXISTENTE ============
        // 1. Actualizar datos básicos del usuario
        await actualizarUsuario(selectedUsuario.idUsuario, {
          ci: data.ci,
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
          idRol: data.idRol
        });

        // 2. Obtener el rol seleccionado para saber si es Estudiante o Docente
        const roles = await obtenerRoles();
        const rolSeleccionado = roles.find(r => r.idRol === data.idRol);
        const esEstudiante = rolSeleccionado?.nombre.toLowerCase() === "estudiante";
        const esDocente = rolSeleccionado?.nombre.toLowerCase() === "docente";

        // 3. Actualizar o crear Estudiante/Docente según corresponda
        if (esEstudiante) {
          if (selectedUsuario.Estudiante) {
            // Actualizar estudiante existente
            await actualizarEstudiante(selectedUsuario.Estudiante.idEstudiante, {
              codigoEstudiante: data.codigoEstudiante!
            });
          } else {
            // Crear nuevo estudiante (cambió de rol a Estudiante)
            await crearEstudiante({
              codigoEstudiante: data.codigoEstudiante!,
              idUsuario: selectedUsuario.idUsuario
            });
          }
        } else if (esDocente) {
          if (selectedUsuario.Docente) {
            // Actualizar docente existente
            await actualizarDocente(selectedUsuario.Docente.idDocente, {
              codigoDocente: data.codigoDocente!
            });
          } else {
            // Crear nuevo docente (cambió de rol a Docente)
            await crearDocente({
              codigoDocente: data.codigoDocente!,
              idUsuario: selectedUsuario.idUsuario
            });
          }
        }
      } else {
        // ============ CREAR NUEVO USUARIO ============
        try {
          // 1. Crear el usuario primero
          const responseUsuario = await crearUsuario({
            ci: data.ci,
            nombre: data.nombre,
            apellido: data.apellido,
            correo: data.correo,
            contrasena: data.contrasena!,
            idRol: data.idRol
          });

          console.log('Usuario creado:', responseUsuario); // Debug

          // Extraer el idUsuario de la respuesta
          const idUsuario = responseUsuario.idUsuario;
          
          if (!idUsuario) {
            throw new Error('No se recibió el ID del usuario creado');
          }

          // 2. Obtener el rol seleccionado
          const roles = await obtenerRoles();
          const rolSeleccionado = roles.find(r => r.idRol === data.idRol);
          const esEstudiante = rolSeleccionado?.nombre.toLowerCase() === "estudiante";
          const esDocente = rolSeleccionado?.nombre.toLowerCase() === "docente";

          // 3. Crear Estudiante o Docente según el rol
          if (esEstudiante && data.codigoEstudiante) {
            console.log('Creando estudiante con idUsuario:', idUsuario); // Debug
            await crearEstudiante({
              codigoEstudiante: data.codigoEstudiante,
              idUsuario: idUsuario
            });
          } else if (esDocente && data.codigoDocente) {
            console.log('Creando docente con idUsuario:', idUsuario); // Debug
            await crearDocente({
              codigoDocente: data.codigoDocente,
              idUsuario: idUsuario
            });
          }
        } catch (error) {
          console.error('Error en el proceso de creación:', error);
          throw error;
        }
      }
      
      await cargarUsuarios(); // Recargar la lista
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      throw err; // Re-throw para que el modal pueda manejarlo
    }
  };

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const statusOptions = [
    { value: "all", label: "Todos los estados" },
    { value: "active", label: "Activo" },
    { value: "inactive", label: "Inactivo" },
  ];

  // Opciones dinámicas de roles basadas en los usuarios cargados
  const roleOptions = [
    { value: "all", label: "Todos los roles" },
    ...Array.from(new Set(usuarios.map(u => u.Rol.nombre))).map(rol => ({
      value: rol.toLowerCase(),
      label: rol
    }))
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600 dark:text-gray-400">Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
        {error}
        <button 
          onClick={cargarUsuarios}
          className="ml-4 underline hover:no-underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03] sm:flex-row sm:items-center">
        {/* Buscador */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre, correo o CI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
          />
        </div>

        {/* Filtro de Estado */}
        <CustomSelect
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-full sm:w-48"
        />

        {/* Filtro de Rol */}
        <CustomSelect
          options={roleOptions}
          value={roleFilter}
          onChange={setRoleFilter}
          className="w-full sm:w-48"
        />
      </div>

      {/* Tabla */}
      <UsuariosTableSimple 
        usuarios={paginatedData}
        totalUsuarios={totalUsuarios}
        visibleColumns={visibleColumns}
        showColumnSettings={showColumnSettings}
        onToggleColumnSettings={() => setShowColumnSettings(!showColumnSettings)}
        onToggleColumn={toggleColumn}
        onAddUser={handleAddUser}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {/* Paginación */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03] sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
          <CustomSelect
            options={[
              { value: "10", label: "10" },
              { value: "25", label: "25" },
              { value: "50", label: "50" },
              { value: "100", label: "100" },
            ]}
            value={rowsPerPage}
            onChange={setRowsPerPage}
            className="w-20"
            dropdownPosition="top"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm text-gray-600 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]"
          >
            &lt;
          </button>
          
          {/* Números de página con lógica de elipsis */}
          {(() => {
            const pageNumbers = [];
            const maxVisiblePages = 5;
            
            if (totalPages <= maxVisiblePages) {
              // Mostrar todas las páginas si son pocas
              for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                      currentPage === i
                        ? 'text-white bg-blue-600 border-blue-600'
                        : 'text-gray-600 border-gray-300 hover:bg-gray-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    {i}
                  </button>
                );
              }
            } else {
              // Lógica con elipsis para muchas páginas
              pageNumbers.push(
                <button
                  key={1}
                  onClick={() => setCurrentPage(1)}
                  className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                    currentPage === 1
                      ? 'text-white bg-blue-600 border-blue-600'
                      : 'text-gray-600 border-gray-300 hover:bg-gray-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  1
                </button>
              );

              if (currentPage > 3) {
                pageNumbers.push(
                  <span key="ellipsis1" className="px-2 text-sm text-gray-600 dark:text-gray-400">
                    ...
                  </span>
                );
              }

              const start = Math.max(2, currentPage - 1);
              const end = Math.min(totalPages - 1, currentPage + 1);

              for (let i = start; i <= end; i++) {
                pageNumbers.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                      currentPage === i
                        ? 'text-white bg-blue-600 border-blue-600'
                        : 'text-gray-600 border-gray-300 hover:bg-gray-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    {i}
                  </button>
                );
              }

              if (currentPage < totalPages - 2) {
                pageNumbers.push(
                  <span key="ellipsis2" className="px-2 text-sm text-gray-600 dark:text-gray-400">
                    ...
                  </span>
                );
              }

              pageNumbers.push(
                <button
                  key={totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                    currentPage === totalPages
                      ? 'text-white bg-blue-600 border-blue-600'
                      : 'text-gray-600 border-gray-300 hover:bg-gray-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  {totalPages}
                </button>
              );
            }
            
            return pageNumbers;
          })()}
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm text-gray-600 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Modal de Usuario */}
      <UsuarioModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUsuario(null);
        }}
        onSubmit={handleSubmitUsuario}
        usuario={selectedUsuario}
        title={selectedUsuario ? 'Editar Usuario' : 'Crear Usuario'}
      />
    </div>
  );
}
