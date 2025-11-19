import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Button from "../../../components/ui/button/Button";
import Badge from "../../../components/ui/badge/Badge";
import CustomSelect from "../../../components/common/CustomSelect";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import {
  obtenerDetalleTarea,
  type ProyectoRevision,
  type TareaDetalle,
} from "../../../services/tareaService";

type ColumnKey =
  | "idProyecto"
  | "nombre"
  | "descripcion"
  | "revisado"
  | "fechaEnvio"
  | "acciones";

const statusFilterOptions = [
  { value: "all", label: "Todos los estados" },
  { value: "revisado", label: "Revisados" },
  { value: "pendiente", label: "Pendientes" },
];

const rowsPerPageOptions = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

const columnLabels: Record<ColumnKey, string> = {
  idProyecto: "ID Proyecto",
  nombre: "Nombre",
  descripcion: "Descripción",
  revisado: "Estado",
  fechaEnvio: "Fecha de envío",
  acciones: "Acciones",
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const renderEstadoBadge = (revisado: boolean) => {
  if (revisado) {
    return (
      <Badge variant="light" color="success" size="sm">
        Revisado
      </Badge>
    );
  }
  return (
    <Badge variant="light" color="warning" size="sm">
      Pendiente
    </Badge>
  );
};

export default function TareasDetallePage() {
  const { idTarea } = useParams<{ idTarea: string }>();
  const navigate = useNavigate();

  const [detalle, setDetalle] = useState<TareaDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    idProyecto: true,
    nombre: true,
    descripcion: true,
    revisado: true,
    fechaEnvio: true,
    acciones: true,
  });

  useEffect(() => {
    void loadDetalle();
  }, [idTarea]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, rowsPerPage]);

  const loadDetalle = async () => {
    if (!idTarea) {
      setError("No se proporcionó la tarea a revisar.");
      setLoading(false);
      setDetalle(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await obtenerDetalleTarea(idTarea);
      setDetalle(data);
    } catch (err) {
      console.error(err);
      setError("Hubo un problema al cargar la tarea seleccionada.");
      setDetalle(null);
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

  const filteredProyectos = useMemo(() => {
    if (!detalle) return [];

    return detalle.proyectos.filter((proyecto) => {
      const normalizedSearch = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !normalizedSearch ||
        proyecto.nombre.toLowerCase().includes(normalizedSearch) ||
        proyecto.descripcion.toLowerCase().includes(normalizedSearch) ||
        proyecto.idProyecto.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "revisado" && proyecto.revisado) ||
        (statusFilter === "pendiente" && !proyecto.revisado);

      return matchesSearch && matchesStatus;
    });
  }, [detalle, searchTerm, statusFilter]);

  const itemsPerPage = parseInt(rowsPerPage, 10) || 10;
  const totalPages = Math.max(1, Math.ceil(filteredProyectos.length / itemsPerPage) || 1);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedProyectos = filteredProyectos.slice(startIndex, startIndex + itemsPerPage);
  const startDisplay = filteredProyectos.length === 0 ? 0 : startIndex + 1;
  const endDisplay =
    filteredProyectos.length === 0
      ? 0
      : Math.min(startIndex + paginatedProyectos.length, filteredProyectos.length);

  const activeColumns = Object.entries(visibleColumns)
    .filter(([, isVisible]) => isVisible)
    .map(([key]) => key as ColumnKey);
  const columnCount = activeColumns.length || 1;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-300">
          Cargando información de la tarea...
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-white/[0.05] dark:bg-white/[0.03]">
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              Volver
            </Button>
            <Button size="sm" onClick={loadDetalle}>
              Reintentar
            </Button>
          </div>
        </div>
      );
    }

    if (!detalle) {
      return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-300">
          No hay información disponible para esta tarea.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tarea</p>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{detalle.nombre}</h2>
          </div>
          <div className="flex gap-2">
            <Badge variant="light" color="primary" size="sm">
              Orden #{detalle.orden}
            </Badge>
            <Badge variant="light" color="info" size="sm">
              Feria {detalle.idFeria}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Fecha límite</p>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
              {formatDate(detalle.fechaLimite)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Revisiones enviadas</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {detalle.revisionesEnviadas.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pendientes</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {detalle.revisionesPendientes.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Descripción</p>
            <p className="mt-1 text-base text-gray-900 dark:text-white">{detalle.descripcion}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03] sm:flex-row sm:items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre, descripción o ID..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
            />
          </div>

          <CustomSelect
            options={statusFilterOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full sm:w-56"
          />
        </div>

        {/* Tabla */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-4 dark:border-white/[0.05]">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">Proyectos enviados</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {filteredProyectos.length.toLocaleString()}
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

              <Button size="xs" variant="outline" onClick={() => navigate(-1)}>
                Volver
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {visibleColumns.idProyecto && (
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      ID PROYECTO
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
                  {visibleColumns.revisado && (
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      ESTADO
                    </TableCell>
                  )}
                  {visibleColumns.fechaEnvio && (
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      FECHA DE ENVÍO
                    </TableCell>
                  )}
                  {visibleColumns.acciones && (
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-end text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      ACCIONES
                    </TableCell>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {paginatedProyectos.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columnCount}
                      className="px-5 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No hay proyectos que coincidan con los filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProyectos.map((proyecto: ProyectoRevision) => (
                    <TableRow key={proyecto.idProyecto} className="align-top">
                      {visibleColumns.idProyecto && (
                        <TableCell className="px-5 py-4 text-sm text-gray-900 dark:text-white">
                          {proyecto.idProyecto}
                        </TableCell>
                      )}
                      {visibleColumns.nombre && (
                        <TableCell className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                          {proyecto.nombre}
                        </TableCell>
                      )}
                      {visibleColumns.descripcion && (
                        <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {proyecto.descripcion || "Sin descripción"}
                        </TableCell>
                      )}
                      {visibleColumns.revisado && (
                        <TableCell className="px-5 py-4">{renderEstadoBadge(proyecto.revisado)}</TableCell>
                      )}
                      {visibleColumns.fechaEnvio && (
                        <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(proyecto.fechaEnvio)}
                        </TableCell>
                      )}
                    {visibleColumns.acciones && (
                      <TableCell className="px-5 py-4 text-end">
                        {!proyecto.revisado ? (
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => navigate(`/admin/proyectos/${proyecto.idProyecto}`)}
                          >
                            Revisar
                          </Button>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                        )}
                      </TableCell>
                    )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Paginación */}
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
            {startDisplay}-{endDisplay} de {filteredProyectos.length}
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
  };

  return (
    <>
      <PageMeta
        title="Detalle de Tarea | Semilleros"
        description="Listado de proyectos enviados para la tarea seleccionada"
      />
      <PageBreadcrumb pageTitle="Detalle de Tarea" />
      {renderContent()}
    </>
  );
}
