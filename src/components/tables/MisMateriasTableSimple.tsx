import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MateriaDocente } from "../../services/grupoMateriaService";

interface MisMateriasTableProps {
  data: MateriaDocente[];
  totalMaterias: number;
}

export default function MisMateriasTableSimple({ data, totalMaterias }: MisMateriasTableProps) {
  const navigate = useNavigate();
  const [openGruposDropdown, setOpenGruposDropdown] = useState<string | null>(null);
  const [gruposDropdownPosition, setGruposDropdownPosition] = useState<{ top: number; right: number } | null>(null);
  const gruposButtonRef = useRef<HTMLButtonElement>(null);

  const toggleGruposDropdown = (idMateria: string) => {
    setOpenGruposDropdown(openGruposDropdown === idMateria ? null : idMateria);
  };

  // Calcular posición del dropdown de grupos
  useEffect(() => {
    if (openGruposDropdown && gruposButtonRef.current) {
      const rect = gruposButtonRef.current.getBoundingClientRect();
      setGruposDropdownPosition({
        top: rect.top - 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [openGruposDropdown]);

  // Cerrar dropdown al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (openGruposDropdown) setOpenGruposDropdown(null);
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [openGruposDropdown]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header con estadísticas */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-4 dark:border-white/[0.05]">
        {/* Total de materias */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total de Materias:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{totalMaterias.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {/* Tabla */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                NOMBRE
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                SIGLA
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                ÁREA-CATEGORÍA
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                GRUPOS
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                  No hay materias para mostrar
                </TableCell>
              </TableRow>
            ) : (
              data.map((materia) => {
                const grupos = materia.grupos || [];
                const cantidadGrupos = materia.cantidadGrupos || 0;

                return (
                  <TableRow key={materia.idMateria}>
                    {/* NOMBRE */}
                    <TableCell className="px-5 py-4 text-start align-top">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {materia.nombre}
                      </span>
                    </TableCell>

                    {/* SIGLA */}
                    <TableCell className="px-5 py-4 text-start align-top">
                      <span className="text-gray-600 text-theme-sm dark:text-gray-300">
                        {materia.sigla}
                      </span>
                    </TableCell>

                    {/* ÁREA-CATEGORÍA */}
                    <TableCell className="px-5 py-4 text-start align-top">
                      <span className="text-gray-600 text-theme-sm dark:text-gray-300">
                        {materia.area} - {materia.categoria}
                      </span>
                    </TableCell>

                    {/* GRUPOS */}
                    <TableCell className="px-5 py-4 text-start align-top">
                      <div className="flex items-center gap-2">
                        {grupos.length > 0 ? (
                          <>
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              {grupos[0].sigla}
                            </span>
                            {cantidadGrupos > 1 && (
                              <div className="relative">
                                <button
                                  ref={openGruposDropdown === materia.idMateria ? gruposButtonRef : null}
                                  onClick={() => toggleGruposDropdown(materia.idMateria)}
                                  className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  +{cantidadGrupos - 1}
                                </button>
                                {openGruposDropdown === materia.idMateria && gruposDropdownPosition && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-10"
                                      onClick={() => setOpenGruposDropdown(null)}
                                    />
                                    <div
                                      className="fixed z-50 min-w-[120px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                                      style={{
                                        top: `${gruposDropdownPosition.top}px`,
                                        right: `${gruposDropdownPosition.right}px`,
                                      }}
                                    >
                                      {grupos.slice(1).map((grupo) => (
                                        <div
                                          key={grupo.idGrupo}
                                          className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
                                        >
                                          {grupo.sigla}
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400 text-theme-sm dark:text-gray-500">Sin grupos</span>
                        )}
                      </div>
                    </TableCell>

                    {/* ACCIONES */}
                    <TableCell className="px-5 py-4 text-start align-top">
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => navigate(`/mis-materias/${materia.idMateria}/proyectos`)}
                      >
                        Ver Proyectos
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
