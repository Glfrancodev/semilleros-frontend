import { useState, useEffect } from "react";
import AreasTableSimple from "./AreasTableSimple";
import AreaModal, { AreaFormData } from "../modals/AreaModal";
import CustomSelect from "../common/CustomSelect";
import { 
  Area, 
  obtenerAreas, 
  crearArea, 
  actualizarArea, 
  eliminarArea,
  crearAreaCategoria,
  eliminarAreaCategoria,
  obtenerCategoriasPorArea
} from "../../services/areaService";

export default function AreasTableWithFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [areas, setAreas] = useState<Area[]>([]);
  const [totalAreas, setTotalAreas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");

  // Estado de columnas visibles
  const [visibleColumns, setVisibleColumns] = useState({
    nombre: true,
    categorias: true,
    materias: true,
    fechaCreacion: false,
    fechaActualizacion: false,
  });

  // Cargar áreas al montar el componente
  useEffect(() => {
    cargarAreas();
  }, []);

  const cargarAreas = async () => {
    try {
      setLoading(true);
      const data = await obtenerAreas();
      setAreas(data.areas);
      setTotalAreas(data.count);
      setError(null);
    } catch (err) {
      setError('Error al cargar áreas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar áreas según los criterios
  const filteredData = areas.filter(area => {
    const matchesSearch = 
      area.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Paginación
  const itemsPerPage = parseInt(rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleEdit = (area: Area) => {
    setSelectedArea(area);
    setShowModal(true);
  };

  const handleDelete = async (idArea: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta área?')) {
      try {
        await eliminarArea(idArea);
        await cargarAreas();
      } catch (err) {
        console.error('Error al eliminar área:', err);
        alert('Error al eliminar el área');
      }
    }
  };

  const handleAddArea = () => {
    setSelectedArea(null);
    setShowModal(true);
  };

  const handleSubmitArea = async (data: AreaFormData) => {
    try {
      if (selectedArea) {
        // ============ ACTUALIZAR ÁREA EXISTENTE ============
        // 1. Actualizar datos básicos del área
        await actualizarArea(selectedArea.idArea, {
          nombre: data.nombre
        });

        // 2. Obtener categorías actuales del área
        const categoriasActuales = await obtenerCategoriasPorArea(selectedArea.idArea);
        const idsCategoriasActuales = categoriasActuales.map(c => c.idCategoria);

        // 3. Determinar categorías a agregar y eliminar
        const categoriasAgregar = data.categorias.filter(id => !idsCategoriasActuales.includes(id));
        const categoriasEliminar = categoriasActuales.filter(c => !data.categorias.includes(c.idCategoria));

        // 4. Eliminar categorías que ya no están seleccionadas
        for (const categoria of categoriasEliminar) {
          await eliminarAreaCategoria(categoria.idAreaCategoria);
        }

        // 5. Agregar nuevas categorías seleccionadas
        for (const idCategoria of categoriasAgregar) {
          await crearAreaCategoria(selectedArea.idArea, idCategoria);
        }
      } else {
        // ============ CREAR NUEVA ÁREA ============
        // 1. Crear el área primero
        const areaCreada = await crearArea({
          nombre: data.nombre
        });

        // 2. Crear las relaciones AreaCategoria para cada categoría seleccionada
        for (const idCategoria of data.categorias) {
          await crearAreaCategoria(areaCreada.idArea, idCategoria);
        }
      }
      
      await cargarAreas(); // Recargar la lista
    } catch (err) {
      console.error('Error al guardar área:', err);
      throw err; // Re-throw para que el modal pueda manejarlo
    }
  };

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600 dark:text-gray-400">Cargando áreas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
        {error}
        <button 
          onClick={cargarAreas}
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
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tabla */}
      <AreasTableSimple 
        areas={paginatedData}
        totalAreas={totalAreas}
        visibleColumns={visibleColumns}
        showColumnSettings={showColumnSettings}
        onToggleColumnSettings={() => setShowColumnSettings(!showColumnSettings)}
        onToggleColumn={toggleColumn}
        onAddArea={handleAddArea}
        onEdit={handleEdit}
        onDelete={handleDelete}
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

      {/* Modal de Área */}
      <AreaModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedArea(null);
        }}
        onSubmit={handleSubmitArea}
        area={selectedArea}
        title={selectedArea ? 'Editar Área' : 'Crear Área'}
      />
    </div>
  );
}
