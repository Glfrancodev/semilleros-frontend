import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Button from "../ui/button/Button";
import { MoreDotIcon } from "../../assets/icons";
import { useState, useRef, useEffect } from "react";
import { Materia } from "../../services/materiaService";

interface MateriasTableProps {
  materias: Materia[];
  totalMaterias: number;
  visibleColumns: {
    sigla: boolean;
    nombre: boolean;
    areaCategoria: boolean;
    grupos: boolean;
    fechaCreacion: boolean;
    fechaActualizacion: boolean;
  };
  showColumnSettings: boolean;
  onToggleColumnSettings: () => void;
  onToggleColumn: (column: keyof MateriasTableProps['visibleColumns']) => void;
  onAddMateria: () => void;
  onEdit: (materia: Materia) => void;
  onDelete: (idMateria: string) => void;
}

export default function MateriasTableSimple({ 
  materias,
  totalMaterias,
  visibleColumns,
  showColumnSettings,
  onToggleColumnSettings,
  onToggleColumn,
  onAddMateria,
  onEdit,
  onDelete
}: MateriasTableProps) {
  const [openActionsDropdown, setOpenActionsDropdown] = useState<string | null>(null);
  const [openGruposDropdown, setOpenGruposDropdown] = useState<string | null>(null);
  const [actionsDropdownPosition, setActionsDropdownPosition] = useState<{ top: number; right: number } | null>(null);
  const [gruposDropdownPosition, setGruposDropdownPosition] = useState<{ top: number; right: number } | null>(null);
  const [settingsDropdownPosition, setSettingsDropdownPosition] = useState<{ top: number; right: number } | null>(null);
  const actionsButtonRef = useRef<HTMLButtonElement>(null);
  const gruposButtonRef = useRef<HTMLButtonElement>(null);
  const settingsButtonRef = useRef<HTMLDivElement>(null);

  const toggleActionsDropdown = (idMateria: string) => {
    setOpenActionsDropdown(openActionsDropdown === idMateria ? null : idMateria);
  };

  const toggleGruposDropdown = (idMateria: string) => {
    setOpenGruposDropdown(openGruposDropdown === idMateria ? null : idMateria);
  };

  useEffect(() => {
    if (openActionsDropdown && actionsButtonRef.current) {
      const rect = actionsButtonRef.current.getBoundingClientRect();
      setActionsDropdownPosition({
        top: rect.top - 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [openActionsDropdown]);

  useEffect(() => {
    if (openGruposDropdown && gruposButtonRef.current) {
      const rect = gruposButtonRef.current.getBoundingClientRect();
      setGruposDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [openGruposDropdown]);

  useEffect(() => {
    if (showColumnSettings && settingsButtonRef.current) {
      const rect = settingsButtonRef.current.getBoundingClientRect();
      setSettingsDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [showColumnSettings]);

  useEffect(() => {
    const handleScroll = () => {
      if (openActionsDropdown) setOpenActionsDropdown(null);
      if (openGruposDropdown) setOpenGruposDropdown(null);
      if (showColumnSettings) onToggleColumnSettings();
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [openActionsDropdown, openGruposDropdown, showColumnSettings, onToggleColumnSettings]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-4 dark:border-white/[0.05]">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total de Materias:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{totalMaterias.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <div ref={settingsButtonRef}>
            <Button variant="outline" size="xs" onClick={onToggleColumnSettings}
              startIcon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}>
              Table settings
            </Button>
          </div>
          <Button variant="primary" size="xs" onClick={onAddMateria}
            startIcon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
            Añadir Materia
          </Button>
        </div>
      </div>
      
      {showColumnSettings && settingsDropdownPosition && (
        <><div className="fixed inset-0 z-10" onClick={onToggleColumnSettings} />
          <div className="fixed z-50 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
            style={{ top: `${settingsDropdownPosition.top}px`, right: `${settingsDropdownPosition.right}px` }}>
            <div className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Columnas Visibles</div>
            <div className="space-y-2">
              {Object.entries({ sigla: 'Sigla', nombre: 'Nombre', areaCategoria: 'Área-Categoría', grupos: 'Grupos', fechaCreacion: 'Fecha Creación', fechaActualizacion: 'Fecha Actualización' }).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={visibleColumns[key as keyof typeof visibleColumns]} onChange={() => onToggleColumn(key as keyof typeof visibleColumns)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
      
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {visibleColumns.sigla && <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">SIGLA</TableCell>}
              {visibleColumns.nombre && <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">NOMBRE</TableCell>}
              {visibleColumns.areaCategoria && <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">ÁREA-CATEGORÍA</TableCell>}
              {visibleColumns.grupos && <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">GRUPOS</TableCell>}
              {visibleColumns.fechaCreacion && <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">FECHA CREACIÓN</TableCell>}
              {visibleColumns.fechaActualizacion && <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">FECHA ACTUALIZACIÓN</TableCell>}
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">ACCIONES</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {materias.map((materia) => (
              <TableRow key={materia.idMateria}>
                {visibleColumns.sigla && <TableCell className="px-5 py-4 text-start"><span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{materia.sigla}</span></TableCell>}
                {visibleColumns.nombre && <TableCell className="px-5 py-4 text-start"><span className="text-sm text-gray-600 dark:text-gray-400">{materia.nombre}</span></TableCell>}
                {visibleColumns.areaCategoria && <TableCell className="px-5 py-4 text-start"><span className="text-sm text-gray-600 dark:text-gray-400">{materia.areaCategoria?.nombre || 'N/A'}</span></TableCell>}
                {visibleColumns.grupos && (
                  <TableCell className="px-5 py-4 text-start">
                    {materia.grupoMaterias && materia.grupoMaterias.length > 0 ? (
                      <div className="relative inline-flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Grupo {materia.grupoMaterias[0].grupo.sigla}
                        </span>
                        {materia.grupoMaterias.length > 1 && (
                          <>
                            <button
                              ref={openGruposDropdown === materia.idMateria ? gruposButtonRef : null}
                              onClick={() => toggleGruposDropdown(materia.idMateria)}
                              className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                            >
                              +{materia.grupoMaterias.length - 1}
                            </button>
                            {openGruposDropdown === materia.idMateria && gruposDropdownPosition && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setOpenGruposDropdown(null)} />
                                <div
                                  className="fixed z-50 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                                  style={{ top: `${gruposDropdownPosition.top}px`, right: `${gruposDropdownPosition.right}px` }}
                                >
                                  <div className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                                    Grupos de {materia.sigla}
                                  </div>
                                  <div className="space-y-2">
                                    {materia.grupoMaterias.map((gm) => (
                                      <div
                                        key={gm.idGrupoMateria}
                                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/50"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                            {gm.grupo.sigla}
                                          </div>
                                          <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                              Grupo {gm.grupo.sigla}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                              {gm.docente.usuario.nombre}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500">Sin grupos</span>
                    )}
                  </TableCell>
                )}
                {visibleColumns.fechaCreacion && <TableCell className="px-5 py-4 text-start"><span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(materia.fechaCreacion)}</span></TableCell>}
                {visibleColumns.fechaActualizacion && <TableCell className="px-5 py-4 text-start"><span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(materia.fechaActualizacion)}</span></TableCell>}
                <TableCell className="px-5 py-4 text-start">
                  <div className="relative">
                    <button ref={openActionsDropdown === materia.idMateria ? actionsButtonRef : null} onClick={() => toggleActionsDropdown(materia.idMateria)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                      <MoreDotIcon />
                    </button>
                    {openActionsDropdown === materia.idMateria && actionsDropdownPosition && (
                      <><div className="fixed inset-0 z-10" onClick={() => setOpenActionsDropdown(null)} />
                        <div className="fixed z-50 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                          style={{ bottom: `${window.innerHeight - actionsDropdownPosition.top}px`, right: `${actionsDropdownPosition.right}px` }}>
                          <div className="mb-2 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">Acciones</div>
                          <div className="space-y-1">
                            <button onClick={() => { onEdit(materia); setOpenActionsDropdown(null); }}
                              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </div>
                              <span>Editar</span>
                            </button>
                            <button onClick={() => { onDelete(materia.idMateria); setOpenActionsDropdown(null); }}
                              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-red-600 dark:border-gray-600 dark:bg-gray-700 dark:text-red-400">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </div>
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
