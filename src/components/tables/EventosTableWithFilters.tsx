import { useState, useEffect } from "react";
import EventosTableSimple from "./EventosTableSimple";
import EventoModal, { EventoFormData } from "../modals/EventoModal";
import CustomSelect from "../common/CustomSelect";
import { Evento, obtenerEventos, crearEvento, actualizarEvento, eliminarEvento } from "../../services/eventoService";

export default function EventosTableWithFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [totalEventos, setTotalEventos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");

  // Estado de columnas visibles
  const [visibleColumns, setVisibleColumns] = useState({
    nombre: true,
    descripcion: true,
    fechaProgramada: true,
    inscritos: true,
    estaActivo: true,
    fechaCreacion: false,
    fechaActualizacion: false,
  });

  // Cargar eventos al montar el componente
  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      setLoading(true);
      const data = await obtenerEventos();
      setEventos(data.eventos);
      setTotalEventos(data.count);
      setError(null);
    } catch (err) {
      setError('Error al cargar eventos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar eventos según los criterios
  const filteredData = eventos.filter(evento => {
    const matchesSearch = 
      evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evento.descripcion && evento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  // Paginación
  const itemsPerPage = parseInt(rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleEdit = (evento: Evento) => {
    setSelectedEvento(evento);
    setShowModal(true);
  };

  const handleDelete = async (idEvento: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      try {
        await eliminarEvento(idEvento);
        await cargarEventos();
      } catch (err) {
        console.error('Error al eliminar evento:', err);
        alert('Error al eliminar el evento');
      }
    }
  };

  const handleAddEvento = () => {
    setSelectedEvento(null);
    setShowModal(true);
  };

  const handleSubmitEvento = async (data: EventoFormData) => {
    try {
      if (selectedEvento) {
        // Actualizar evento existente
        await actualizarEvento(selectedEvento.idEvento, {
          nombre: data.nombre,
          descripcion: data.descripcion,
          fechaProgramada: data.fechaProgramada,
          capacidadMaxima: data.capacidadMaxima,
          estaActivo: data.estaActivo
        });
      } else {
        // Crear nuevo evento
        await crearEvento({
          nombre: data.nombre,
          descripcion: data.descripcion,
          fechaProgramada: data.fechaProgramada,
          capacidadMaxima: data.capacidadMaxima,
          estaActivo: data.estaActivo
        });
      }
      
      await cargarEventos(); // Recargar la lista
    } catch (err) {
      console.error('Error al guardar evento:', err);
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
        <div className="text-gray-600 dark:text-gray-400">Cargando eventos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
        {error}
        <button 
          onClick={cargarEventos}
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
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tabla */}
      <EventosTableSimple 
        eventos={paginatedData}
        totalEventos={totalEventos}
        visibleColumns={visibleColumns}
        showColumnSettings={showColumnSettings}
        onToggleColumnSettings={() => setShowColumnSettings(!showColumnSettings)}
        onToggleColumn={toggleColumn}
        onAddEvento={handleAddEvento}
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

      {/* Modal de Evento */}
      <EventoModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedEvento(null);
        }}
        onSubmit={handleSubmitEvento}
        evento={selectedEvento}
        title={selectedEvento ? 'Editar Evento' : 'Crear Evento'}
      />
    </div>
  );
}
