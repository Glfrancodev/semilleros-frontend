import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { useState, useRef, useEffect } from "react";
import { type ProyectoAprobadoFeria } from "../../services/docenteProyectoService";

interface ProyectosJuradosTableProps {
  proyectos: ProyectoAprobadoFeria[];
  totalProyectos: number;
  onAsignarJurados: (proyecto: ProyectoAprobadoFeria) => void;
}

export default function ProyectosJuradosTableSimple({
  proyectos,
  totalProyectos,
  onAsignarJurados,
}: ProyectosJuradosTableProps) {
  const [openIntegrantesDropdown, setOpenIntegrantesDropdown] = useState<string | null>(null);
  const [integrantesDropdownPosition, setIntegrantesDropdownPosition] = useState<{ top: number; right: number } | null>(null);
  const integrantesButtonRef = useRef<HTMLButtonElement>(null);

  const toggleIntegrantesDropdown = (idProyecto: string) => {
    setOpenIntegrantesDropdown(openIntegrantesDropdown === idProyecto ? null : idProyecto);
  };

  // Calcular posición del dropdown de integrantes
  useEffect(() => {
    if (openIntegrantesDropdown && integrantesButtonRef.current) {
      const rect = integrantesButtonRef.current.getBoundingClientRect();
      setIntegrantesDropdownPosition({
        top: rect.top - 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [openIntegrantesDropdown]);

  // Cerrar dropdown al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (openIntegrantesDropdown) setOpenIntegrantesDropdown(null);
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [openIntegrantesDropdown]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header con estadísticas */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-4 dark:border-white/[0.05]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              All Projects:
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalProyectos.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                ID PROYECTO
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                NOMBRE
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                DESCRIPCIÓN
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                INTEGRANTES
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                JURADOS
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {proyectos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No hay proyectos aprobados para feria
                </TableCell>
              </TableRow>
            ) : (
              proyectos.map((proyecto) => {
                const primerIntegrante = proyecto.integrantes[0];
                const otrosIntegrantes = proyecto.integrantes.slice(1);

                return (
                  <TableRow key={proyecto.idProyecto}>
                    {/* ID PROYECTO */}
                    <TableCell className="px-5 py-4 text-start">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {proyecto.idProyecto.substring(0, 8)}...
                      </code>
                    </TableCell>

                    {/* NOMBRE */}
                    <TableCell className="px-5 py-4 text-start">
                      <span className="text-theme-sm font-medium text-gray-800 dark:text-white/90 break-words">
                        {proyecto.nombre}
                      </span>
                    </TableCell>

                    {/* DESCRIPCIÓN */}
                    <TableCell className="px-5 py-4 text-start">
                      <span className="text-sm text-gray-600 dark:text-gray-400 break-words">
                        {proyecto.descripcion || "Sin descripción"}
                      </span>
                    </TableCell>

                    {/* INTEGRANTES */}
                    <TableCell className="px-5 py-4 text-start">
                      <div className="relative flex items-center gap-2">
                        {proyecto.integrantes.length > 0 ? (
                          <>
                            {/* Mostrar primer integrante */}
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {primerIntegrante.nombreCompleto}
                              {primerIntegrante.esLider && (
                                <span className="ml-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                                  (Líder)
                                </span>
                              )}
                            </span>

                            {/* Botón +N si hay más integrantes */}
                            {otrosIntegrantes.length > 0 && (
                              <div className="relative">
                                <button
                                  ref={openIntegrantesDropdown === proyecto.idProyecto ? integrantesButtonRef : null}
                                  onClick={() => toggleIntegrantesDropdown(proyecto.idProyecto)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                  aria-label={`${otrosIntegrantes.length} more integrantes`}
                                >
                                  +{otrosIntegrantes.length}
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
                                        {otrosIntegrantes.map((integrante, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-300"
                                          >
                                            <span>
                                              {integrante.nombreCompleto}
                                              {integrante.esLider && (
                                                <span className="ml-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                                                  (Líder)
                                                </span>
                                              )}
                                            </span>
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
                          <span className="text-sm text-gray-400 dark:text-gray-500">Sin integrantes</span>
                        )}
                      </div>
                    </TableCell>

                    {/* JURADOS */}
                    <TableCell className="px-5 py-4 text-start">
                      <Badge
                        size="sm"
                        color={
                          proyecto.cantidadJurados === 3 ? "success" : "warning"
                        }
                      >
                        {proyecto.cantidadJurados} / 3
                      </Badge>
                    </TableCell>

                    {/* ACCIONES */}
                    <TableCell className="px-5 py-4 text-start">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => onAsignarJurados(proyecto)}
                      >
                        {proyecto.cantidadJurados < 3
                          ? "Asignar Jurados"
                          : "Ver Jurados"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
