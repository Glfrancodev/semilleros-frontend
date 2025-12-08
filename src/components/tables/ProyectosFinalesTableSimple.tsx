import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { ProyectoFinal } from "../../services/feriaService";

interface VisibleColumns {
  idProyecto: boolean;
  nombre: boolean;
  descripcion: boolean;
  integrantes: boolean;
  notaPromedio: boolean;
}

interface ProyectosFinalesTableSimpleProps {
  proyectos: ProyectoFinal[];
  totalProyectos: number;
  visibleColumns: VisibleColumns;
  onToggleColumn: (column: keyof VisibleColumns) => void;
}

interface DropdownPosition {
  top: number;
  right: number;
}

export default function ProyectosFinalesTableSimple({
  proyectos,
  totalProyectos,
  visibleColumns,
  onToggleColumn,
}: ProyectosFinalesTableSimpleProps) {
  const navigate = useNavigate();
  
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [openIntegrantesDropdown, setOpenIntegrantesDropdown] = useState<string | null>(null);
  const [settingsDropdownPosition, setSettingsDropdownPosition] = useState<DropdownPosition | null>(null);
  const [integrantesDropdownPosition, setIntegrantesDropdownPosition] = useState<DropdownPosition | null>(null);

  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const integrantesButtonRef = useRef<HTMLButtonElement>(null);

  // Calcular posición del dropdown de configuración
  useEffect(() => {
    if (showColumnSettings && settingsButtonRef.current) {
      const rect = settingsButtonRef.current.getBoundingClientRect();
      setSettingsDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    } else {
      setSettingsDropdownPosition(null);
    }
  }, [showColumnSettings]);

  // Calcular posición del dropdown de integrantes
  useEffect(() => {
    if (openIntegrantesDropdown && integrantesButtonRef.current) {
      const rect = integrantesButtonRef.current.getBoundingClientRect();
      setIntegrantesDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    } else {
      setIntegrantesDropdownPosition(null);
    }
  }, [openIntegrantesDropdown]);

  // Cerrar dropdowns al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowColumnSettings(false);
      setOpenIntegrantesDropdown(null);
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const toggleIntegrantesDropdown = (idProyecto: string) => {
    setOpenIntegrantesDropdown(prev => prev === idProyecto ? null : idProyecto);
  };

  const handleRevisar = (idProyecto: string) => {
    navigate(`/estudiante/proyectos/${idProyecto}`);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header con estadísticas y botones de acción */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-gray-50 px-5 py-4 dark:border-white/[0.05] dark:bg-white/[0.02]">
        {/* Estadísticas */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 text-theme-sm dark:text-white">
            Proyectos Finales:
          </span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            {totalProyectos}
          </span>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2">
          {/* Botón de configuración de tabla */}
          <button
            ref={showColumnSettings ? settingsButtonRef : null}
            onClick={() => setShowColumnSettings(!showColumnSettings)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span className="hidden sm:inline">Table settings</span>
          </button>
        </div>
      </div>

      {/* Panel de configuración de columnas - Posicionado con fixed */}
      {showColumnSettings && settingsDropdownPosition && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowColumnSettings(false)}
          />
          <div 
            className="fixed z-50 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
            style={{
              top: `${settingsDropdownPosition.top}px`,
              right: `${settingsDropdownPosition.right}px`,
            }}
          >
            <div className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
              Columnas Visibles
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.idProyecto}
                  onChange={() => onToggleColumn('idProyecto')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">ID</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.nombre}
                  onChange={() => onToggleColumn('nombre')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Nombre</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.descripcion}
                  onChange={() => onToggleColumn('descripcion')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Descripción</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.integrantes}
                  onChange={() => onToggleColumn('integrantes')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Integrantes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.notaPromedio}
                  onChange={() => onToggleColumn('notaPromedio')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Nota Promedio</span>
              </label>
            </div>
          </div>
        </>
      )}

      {/* Tabla */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {visibleColumns.idProyecto && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  ID
                </TableCell>
              )}
              {visibleColumns.nombre && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  NOMBRE
                </TableCell>
              )}
              {visibleColumns.descripcion && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  DESCRIPCIÓN
                </TableCell>
              )}
              {visibleColumns.integrantes && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  INTEGRANTES
                </TableCell>
              )}
              {visibleColumns.notaPromedio && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  NOTA PROMEDIO
                </TableCell>
              )}
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {proyectos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-5 py-8 text-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    No se encontraron proyectos finales
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              proyectos.map((proyecto) => (
                <TableRow key={proyecto.idProyecto}>
                  {/* ID */}
                  {visibleColumns.idProyecto && (
                    <TableCell className="px-5 py-4 text-start align-top">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                        #{proyecto.idProyecto}
                      </span>
                    </TableCell>
                  )}

                  {/* NOMBRE */}
                  {visibleColumns.nombre && (
                    <TableCell className="px-5 py-4 text-start align-top">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90 break-words block">
                        {proyecto.nombre}
                      </span>
                    </TableCell>
                  )}

                  {/* DESCRIPCIÓN */}
                  {visibleColumns.descripcion && (
                    <TableCell className="px-5 py-4 text-start">
                      <span className="text-sm text-gray-600 dark:text-gray-400 break-words">
                        {proyecto.descripcion}
                      </span>
                    </TableCell>
                  )}

                  {/* INTEGRANTES */}
                  {visibleColumns.integrantes && (
                    <TableCell className="px-5 py-4 text-start">
                      <div className="relative flex items-center gap-2">
                        {proyecto.integrantes.length > 0 ? (
                          <>
                            {/* Mostrar solo el primer integrante */}
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {proyecto.integrantes[0].nombreCompleto}
                            </span>

                            {/* Botón +N si hay más integrantes */}
                            {proyecto.integrantes.length > 1 && (
                              <div className="relative">
                                <button
                                  ref={openIntegrantesDropdown === proyecto.idProyecto ? integrantesButtonRef : null}
                                  onClick={() => toggleIntegrantesDropdown(proyecto.idProyecto)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                  aria-label={`${proyecto.integrantes.length - 1} more integrantes`}
                                >
                                  +{proyecto.integrantes.length - 1}
                                </button>

                                {/* Dropdown */}
                                {openIntegrantesDropdown === proyecto.idProyecto && integrantesDropdownPosition && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-10"
                                      onClick={() => setOpenIntegrantesDropdown(null)}
                                    />
                                    
                                    <div 
                                      className="fixed z-50 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                                      style={{
                                        bottom: `${window.innerHeight - integrantesDropdownPosition.top}px`,
                                        right: `${integrantesDropdownPosition.right}px`,
                                      }}
                                    >
                                      <div className="mb-2 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                        Integrantes
                                      </div>
                                      <div className="space-y-1">
                                        {proyecto.integrantes.map((integrante) => (
                                          <div
                                            key={integrante.idEstudiante}
                                            className="rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300"
                                          >
                                            {integrante.nombreCompleto}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                        )}
                      </div>
                    </TableCell>
                  )}

                  {/* NOTA PROMEDIO */}
                  {visibleColumns.notaPromedio && (
                    <TableCell className="px-5 py-4 text-start">
                      <span className="inline-flex items-center rounded-full bg-success-50 px-3 py-1 text-sm font-medium text-success-700 dark:bg-success-950 dark:text-success-300">
                        {proyecto.notaPromedio.toFixed(1)}
                      </span>
                    </TableCell>
                  )}

                  {/* ACCIONES */}
                  <TableCell className="px-5 py-4 text-start">
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => handleRevisar(proyecto.idProyecto)}
                    >
                      Revisar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
