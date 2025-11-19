import {
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../common/CustomSelect";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import {
  obtenerResumenFeriaActiva,
  type ResumenFeriaActiva,
  type TareaResumenFeria,
} from "../../services/feriaService";

type ColumnKey =
  | "orden"
  | "nombre"
  | "descripcion"
  | "enviados"
  | "pendientes"
  | "fechaLimite"
  | "acciones";

const revisionOptions = [
  { value: "all", label: "Todas las tareas" },
  { value: "pendientes", label: "Con pendientes de revisión" },
  { value: "sinPendientes", label: "Sin pendientes de revisión" },
];

const envioOptions = [
  { value: "all", label: "Todos los enviados" },
  { value: "conEnvios", label: "Con envíos registrados" },
  { value: "sinEnvios", label: "Sin envíos registrados" },
];

const rowsPerPageOptions = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

const columnLabels: Record<ColumnKey, string> = {
  orden: "Orden",
  nombre: "Nombre",
  descripcion: "Descripción",
  enviados: "Enviados / Inscritos",
  pendientes: "Pendientes / Enviados",
  fechaLimite: "Fecha límite",
  acciones: "Acciones",
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function ProyectosTableWithFilters() {
  const navigate = useNavigate();
  const [resumen, setResumen] = useState<ResumenFeriaActiva | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [revisionFilter, setRevisionFilter] = useState("all");
  const [envioFilter, setEnvioFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    orden: true,
    nombre: true,
    descripcion: true,
    enviados: true,
    pendientes: true,
    fechaLimite: true,
    acciones: true,
  });

  useEffect(() => {
    void loadResumen();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, revisionFilter, envioFilter, rowsPerPage]);

  const loadResumen = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerResumenFeriaActiva();
      setResumen(data);
    } catch (err) {
      console.error(err);
      setError("No pudimos cargar el resumen de la feria activa.");
      setResumen(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleColumn = (column: ColumnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const filteredTareas = useMemo(() => {
    if (!resumen) return [];

    return resumen.tareas
      .filter((tarea) => {
        const normalizedSearch = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !normalizedSearch ||
          tarea.nombre.toLowerCase().includes(normalizedSearch) ||
          tarea.descripcion.toLowerCase().includes(normalizedSearch);

        const matchesRevision =
          revisionFilter === "all" ||
          (revisionFilter === "pendientes" && tarea.pendientesRevision > 0) ||
          (revisionFilter === "sinPendientes" && tarea.pendientesRevision === 0);

        const matchesEnvio =
          envioFilter === "all" ||
          (envioFilter === "conEnvios" && tarea.enviadosRevision > 0) ||
          (envioFilter === "sinEnvios" && tarea.enviadosRevision === 0);

        return matchesSearch && matchesRevision && matchesEnvio;
      })
      .sort((a, b) => a.orden - b.orden);
  }, [resumen, searchTerm, revisionFilter, envioFilter]);

  const itemsPerPage = parseInt(rowsPerPage, 10) || 10;
  const totalPages = Math.max(1, Math.ceil(filteredTareas.length / itemsPerPage) || 1);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedTareas = filteredTareas.slice(startIndex, startIndex + itemsPerPage);
  const startDisplay = filteredTareas.length === 0 ? 0 : startIndex + 1;
  const endDisplay =
    filteredTareas.length === 0
      ? 0
      : Math.min(startIndex + paginatedTareas.length, filteredTareas.length);

  const inscritosTotal = resumen?.cantidadProyectosInscritos ?? 0;
  const pendientesAprobacion = resumen?.cantidadProyectosPendientesAprobacion ?? 0;
  const finales = resumen?.cantidadProyectosFinales ?? 0;
  const pendientesVsInscritos = inscritosTotal - pendientesAprobacion;

  const activeColumns = Object.entries(visibleColumns)
    .filter(([, isVisible]) => isVisible)
    .map(([key]) => key as ColumnKey);

  const columnCount = activeColumns.length || 1;

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-300">
        Cargando resumen de feria...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-white/[0.05] dark:bg-white/[0.03]">
        <p className="text-gray-700 dark:text-gray-300">{error}</p>
        <Button onClick={loadResumen} size="sm">
          Reintentar
        </Button>
      </div>
    );
  }

  if (!resumen) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-300">
        No hay una feria activa disponible en este momento.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Resumen general */}
      <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Feria activa</p>
          <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            {resumen.nombreFeria}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Semestre {resumen.semestre} - Año {resumen.anio}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Proyectos inscritos</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {inscritosTotal.toLocaleString()}
          </p>
          <Badge variant="light" color="warning" size="sm">
            Pendientes de aprobación: {pendientesAprobacion.toLocaleString()}
          </Badge>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Proyectos aprobados</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {pendientesVsInscritos.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Proyectos finales</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {finales.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03] sm:flex-row sm:items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
          />
        </div>

        <CustomSelect
          options={revisionOptions}
          value={revisionFilter}
          onChange={setRevisionFilter}
          className="w-full sm:w-56"
        />

        <CustomSelect
          options={envioOptions}
          value={envioFilter}
          onChange={setEnvioFilter}
          className="w-full sm:w-56"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-4 dark:border-white/[0.05]">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Tareas activas</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredTareas.length.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="outline"
                size="xs"
                onClick={() => setShowColumnSettings((prev) => !prev)}
                startIcon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
              >
                Table settings
              </Button>

              {showColumnSettings && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowColumnSettings(false)} />
                  <div className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                      Columnas visibles
                    </div>
                    <div className="space-y-2">
                      {(Object.keys(columnLabels) as ColumnKey[]).map((column) => (
                        <label
                          key={column}
                          className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumns[column]}
                            onChange={() => toggleColumn(column)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          {columnLabels[column]}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Button size="xs" onClick={() => console.log("AÃ±adir tarea")}>
              Añadir tarea
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {visibleColumns.orden && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    ORDEN
                  </TableCell>
                )}
                {visibleColumns.nombre && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    NOMBRE
                  </TableCell>
                )}
                {visibleColumns.descripcion && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    DESCRIPCIÓN
                  </TableCell>
                )}
                {visibleColumns.enviados && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    ENVIADOS / INSCRITOS
                  </TableCell>
                )}
                {visibleColumns.pendientes && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    PENDIENTES / ENVIADOS
                  </TableCell>
                )}
                {visibleColumns.fechaLimite && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    FECHA LÍMITE
                  </TableCell>
                )}
                {visibleColumns.acciones && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    ACCIONES
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedTareas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columnCount}
                    className="px-5 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No hay tareas que coincidan con los filtros seleccionados.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTareas.map((tarea: TareaResumenFeria) => (
                  <TableRow key={tarea.idTarea} className="align-top">
                    {visibleColumns.orden && (
                      <TableCell
                        className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        #{tarea.orden}
                      </TableCell>
                    )}
                    {visibleColumns.nombre && (
                      <TableCell className="px-5 py-4" >
                        <p className="font-semibold text-gray-900 dark:text-white">{tarea.nombre}</p>
                      </TableCell>
                    )}
                    {visibleColumns.descripcion && (
                      <TableCell
                        className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300"
                      >
                        {tarea.descripcion}
                      </TableCell>
                    )}
                    {visibleColumns.enviados && (
                      <TableCell className="px-5 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {tarea.enviadosRevision.toLocaleString()} / {inscritosTotal.toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Enviados / Inscritos</p>
                      </TableCell>
                    )}
                    {visibleColumns.pendientes && (
                      <TableCell className="px-5 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {tarea.pendientesRevision.toLocaleString()} / {tarea.enviadosRevision.toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pendientes / Enviados</p>
                      </TableCell>
                    )}
                    {visibleColumns.fechaLimite && (
                      <TableCell
                        className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300"

                      >
                        {formatDate(tarea.fechaLimite)}
                      </TableCell>
                    )}
                    {visibleColumns.acciones && (
                      <TableCell className="px-5 py-4 text-start" >
                        <div className="flex justify-start">
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={() => navigate(`/proyectos/tareas/${tarea.idTarea}`)}
                          >
                            Revisar
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* PaginaciÃ³n */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03] sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
          <CustomSelect
            options={rowsPerPageOptions}
            value={rowsPerPage}
            onChange={setRowsPerPage}
            className="w-20"
            dropdownPosition="top"
          />
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {startDisplay}-{endDisplay} de {filteredTareas.length}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={safeCurrentPage === 1}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]"
          >
            &lt;
          </button>

          {(() => {
            const pageButtons: ReactNode[] = [];
            const maxVisiblePages = 5;

            if (totalPages <= maxVisiblePages) {
              for (let i = 1; i <= totalPages; i += 1) {
                pageButtons.push(
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentPage(i)}
                    className={`rounded-lg border px-3 py-1 text-sm transition-colors ${
                      safeCurrentPage === i
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                    }`}
                  >
                    {i}
                  </button>
                );
              }
            } else {
              pageButtons.push(
                <button
                  key={1}
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className={`rounded-lg border px-3 py-1 text-sm transition-colors ${
                    safeCurrentPage === 1
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                  }`}
                >
                  1
                </button>
              );

              if (safeCurrentPage > 3) {
                pageButtons.push(
                  <span key="ellipsis-start" className="px-2 text-sm text-gray-600 dark:text-gray-400">
                    ...
                  </span>
                );
              }

              const start = Math.max(2, safeCurrentPage - 1);
              const end = Math.min(totalPages - 1, safeCurrentPage + 1);

              for (let i = start; i <= end; i += 1) {
                pageButtons.push(
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentPage(i)}
                    className={`rounded-lg border px-3 py-1 text-sm transition-colors ${
                      safeCurrentPage === i
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                    }`}
                  >
                    {i}
                  </button>
                );
              }

              if (safeCurrentPage < totalPages - 2) {
                pageButtons.push(
                  <span key="ellipsis-end" className="px-2 text-sm text-gray-600 dark:text-gray-400">
                    ...
                  </span>
                );
              }

              pageButtons.push(
                <button
                  key={totalPages}
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  className={`rounded-lg border px-3 py-1 text-sm transition-colors ${
                    safeCurrentPage === totalPages
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                  }`}
                >
                  {totalPages}
                </button>
              );
            }

            return pageButtons;
          })()}

          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={safeCurrentPage === totalPages}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}



