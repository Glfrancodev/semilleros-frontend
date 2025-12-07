import { useState, useEffect } from "react";
import FeriasTableSimple from "./FeriasTableSimple";
import FeriaModal, { FeriaFormData } from "../modals/FeriaModal";
import CustomSelect from "../common/CustomSelect";
import { Feria, obtenerFerias, eliminarFeria, crearFeria, actualizarFeria } from "../../services/feriaService";

export default function FeriasTableWithFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ferias, setFerias] = useState<Feria[]>([]);
  const [totalFerias, setTotalFerias] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeria, setSelectedFeria] = useState<Feria | null>(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");

  // Estado de columnas visibles
  const [visibleColumns, setVisibleColumns] = useState({
    nombre: true,
    semestre: true,
    año: true,
    estaActivo: true,
    tareas: true,
    fechaCreacion: false,
    fechaActualizacion: false,
  });

  // Cargar ferias al montar el componente
  useEffect(() => {
    cargarFerias();
  }, []);

  const cargarFerias = async () => {
    try {
      setIsLoading(true);
      const data = await obtenerFerias();
      setFerias(data.items);
      setTotalFerias(data.count);
    } catch (err) {
      console.error('Error al cargar ferias:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar ferias según los criterios
  const filteredData = ferias.filter(feria => {
    const matchesSearch =
      feria.nombre.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Paginación
  const itemsPerPage = parseInt(rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleEdit = (feria: Feria) => {
    setSelectedFeria(feria);
    setIsModalOpen(true);
  };

  const handleDelete = async (idFeria: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta feria?')) {
      try {
        await eliminarFeria(idFeria);
        await cargarFerias();
      } catch (err) {
        console.error('Error al eliminar feria:', err);
        alert('Error al eliminar la feria');
      }
    }
  };

  const handleAddFeria = () => {
    setSelectedFeria(null);
    setIsModalOpen(true);
  };

  const handleSubmitFeria = async (data: FeriaFormData) => {
    try {
      if (selectedFeria) {
        // Actualizar feria existente
        await actualizarFeria(selectedFeria.idFeria, {
          nombre: data.nombre,
          semestre: data.semestre,
          año: data.año,
          estaActivo: data.estaActivo,
          tareas: data.tareas
        });
      } else {
        // Crear nueva feria con tareas
        await crearFeria({
          nombre: data.nombre,
          semestre: data.semestre,
          año: data.año,
          estaActivo: data.estaActivo,
          tareas: data.tareas
        });
      }

      await cargarFerias(); // Recargar la lista
    } catch (err) {
      console.error('Error al guardar feria:', err);
      throw err; // Re-throw para que el modal pueda manejarlo
    }
  };

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600 dark:text-gray-400">Cargando ferias...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de búsqueda y filtros */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar ferias por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-white/[0.1] dark:bg-white/[0.03] dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <FeriasTableSimple
        ferias={paginatedData}
        totalFerias={totalFerias}
        visibleColumns={visibleColumns}
        showColumnSettings={showColumnSettings}
        onToggleColumnSettings={() => setShowColumnSettings(!showColumnSettings)}
        onToggleColumn={toggleColumn}
        onAddFeria={handleAddFeria}
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
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${currentPage === i
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
                  className={`px-3 py-1 text-sm rounded-lg border transition-colors ${currentPage === 1
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
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${currentPage === i
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
                  className={`px-3 py-1 text-sm rounded-lg border transition-colors ${currentPage === totalPages
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

      {/* Modal de Feria */}
      <FeriaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFeria(null);
        }}
        onSubmit={handleSubmitFeria}
        feria={selectedFeria}
        title={selectedFeria ? 'Editar Feria' : 'Crear Feria'}
      />
    </div>
  );
}
