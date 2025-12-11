import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MateriasTableSimple from "./MateriasTableSimple";
import MateriaModal, { MateriaFormData } from "../modals/MateriaModal";
import CustomSelect from "../common/CustomSelect";
import { Materia, obtenerMateriasPorSemestre, eliminarMateria, crearMateria, actualizarMateria } from "../../services/materiaService";

export default function MateriasTableWithFilters() {
  const { idSemestre } = useParams<{ idSemestre: string }>();

  const [materias, setMaterias] = useState<Materia[]>([]);
  const [totalMaterias, setTotalMaterias] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    sigla: true,
    nombre: true,
    areaCategoria: true,
    grupos: true,
    fechaCreacion: false,
    fechaActualizacion: false,
    creadoPor: false,
    actualizadoPor: false,
  });

  useEffect(() => {
    cargarMaterias();
  }, [idSemestre]);

  const cargarMaterias = async () => {
    if (!idSemestre) return;
    try {
      setIsLoading(true);
      const data = await obtenerMateriasPorSemestre(idSemestre);
      setMaterias(data.items);
      setTotalMaterias(data.count);
      setError(null);
    } catch (err) {
      setError('Error al cargar materias');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = materias.filter(materia => {
    const matchesSearch =
      materia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materia.sigla.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const itemsPerPage = parseInt(rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleAddMateria = () => {
    setSelectedMateria(null);
    setIsModalOpen(true);
  };

  const handleEdit = (materia: Materia) => {
    setSelectedMateria(materia);
    setIsModalOpen(true);
  };

  const handleDelete = async (idMateria: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta materia?")) {
      try {
        await eliminarMateria(idMateria);
        await cargarMaterias();
      } catch (error) {
        console.error("Error al eliminar la materia:", error);
        alert("Hubo un error al eliminar la materia");
      }
    }
  };

  const handleSubmitMateria = async (data: MateriaFormData) => {
    try {
      if (selectedMateria) {
        await actualizarMateria(selectedMateria.idMateria, {
          sigla: data.sigla,
          nombre: data.nombre,
          idAreaCategoria: data.idAreaCategoria,
          grupos: data.grupos
        });
      } else {
        await crearMateria({
          sigla: data.sigla,
          nombre: data.nombre,
          idAreaCategoria: data.idAreaCategoria,
          idSemestre: data.idSemestre,
          grupos: data.grupos
        });
      }
      setIsModalOpen(false);
      setSelectedMateria(null);
      await cargarMaterias();
    } catch (error) {
      console.error('Error al guardar materia:', error);
      throw error;
    }
  };

  const handleToggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600 dark:text-gray-400">Cargando materias...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
        {error}
        <button
          onClick={cargarMaterias}
          className="ml-4 underline hover:no-underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03] sm:flex-row sm:items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre o sigla..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tabla */}
      <MateriasTableSimple
        materias={paginatedData}
        totalMaterias={totalMaterias}
        visibleColumns={visibleColumns}
        showColumnSettings={showColumnSettings}
        onToggleColumnSettings={() => setShowColumnSettings(!showColumnSettings)}
        onToggleColumn={handleToggleColumn}
        onAddMateria={handleAddMateria}
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

      {/* Modal */}
      {isModalOpen && idSemestre && (
        <MateriaModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMateria(null);
          }}
          onSubmit={handleSubmitMateria}
          materia={selectedMateria}
          title={selectedMateria ? 'Editar Materia' : 'Crear Materia'}
          idSemestre={idSemestre}
        />
      )}
    </div>
  );
}
