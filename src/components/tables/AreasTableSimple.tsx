import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { MoreDotIcon } from "../../assets/icons";
import { useState, useRef, useEffect } from "react";
import { Area } from "../../services/areaService";

interface AreasTableProps {
  areas: Area[];
  totalAreas: number;
  visibleColumns: {
    nombre: boolean;
    categorias: boolean;
    materias: boolean;
    fechaCreacion: boolean;
    fechaActualizacion: boolean;
    creadoPor: boolean;
    actualizadoPor: boolean;
  };
  showColumnSettings: boolean;
  onToggleColumnSettings: () => void;
  onToggleColumn: (column: keyof AreasTableProps['visibleColumns']) => void;
  onAddArea: () => void;
  onEdit: (area: Area) => void;
  onDelete: (idArea: string) => void;
}

export default function AreasTableSimple({
  areas,
  totalAreas,
  visibleColumns,
  showColumnSettings,
  onToggleColumnSettings,
  onToggleColumn,
  onAddArea,
  onEdit,
  onDelete
}: AreasTableProps) {
  const [openActionsDropdown, setOpenActionsDropdown] = useState<string | null>(null);
  const [openCategoriasDropdown, setOpenCategoriasDropdown] = useState<string | null>(null);
  const [openMateriasDropdown, setOpenMateriasDropdown] = useState<string | null>(null);
  const [actionsDropdownPosition, setActionsDropdownPosition] = useState<{ top: number; right: number } | null>(null);
  const [categoriasDropdownPosition, setCategoriasDropdownPosition] = useState<{ top: number; right: number } | null>(null);
  const [materiasDropdownPosition, setMateriasDropdownPosition] = useState<{ top: number; right: number } | null>(null);
  const [settingsDropdownPosition, setSettingsDropdownPosition] = useState<{ top: number; right: number } | null>(null);
  const actionsButtonRef = useRef<HTMLButtonElement>(null);
  const categoriasButtonRef = useRef<HTMLButtonElement>(null);
  const materiasButtonRef = useRef<HTMLButtonElement>(null);
  const settingsButtonRef = useRef<HTMLDivElement>(null);

  const toggleActionsDropdown = (idArea: string) => {
    setOpenActionsDropdown(openActionsDropdown === idArea ? null : idArea);
  };

  const toggleCategoriasDropdown = (idArea: string) => {
    setOpenCategoriasDropdown(openCategoriasDropdown === idArea ? null : idArea);
  };

  const toggleMateriasDropdown = (idArea: string) => {
    setOpenMateriasDropdown(openMateriasDropdown === idArea ? null : idArea);
  };

  // Calcular posición del dropdown de actions
  useEffect(() => {
    if (openActionsDropdown && actionsButtonRef.current) {
      const rect = actionsButtonRef.current.getBoundingClientRect();
      setActionsDropdownPosition({
        top: rect.top - 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [openActionsDropdown]);

  // Calcular posición del dropdown de categorías
  useEffect(() => {
    if (openCategoriasDropdown && categoriasButtonRef.current) {
      const rect = categoriasButtonRef.current.getBoundingClientRect();
      setCategoriasDropdownPosition({
        top: rect.top - 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [openCategoriasDropdown]);

  // Calcular posición del dropdown de materias
  useEffect(() => {
    if (openMateriasDropdown && materiasButtonRef.current) {
      const rect = materiasButtonRef.current.getBoundingClientRect();
      setMateriasDropdownPosition({
        top: rect.top - 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [openMateriasDropdown]);

  // Calcular posición del dropdown de settings
  useEffect(() => {
    if (showColumnSettings && settingsButtonRef.current) {
      const rect = settingsButtonRef.current.getBoundingClientRect();
      setSettingsDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [showColumnSettings]);

  // Cerrar dropdowns al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (openActionsDropdown) setOpenActionsDropdown(null);
      if (openCategoriasDropdown) setOpenCategoriasDropdown(null);
      if (openMateriasDropdown) setOpenMateriasDropdown(null);
      if (showColumnSettings) onToggleColumnSettings();
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [openActionsDropdown, openCategoriasDropdown, openMateriasDropdown, showColumnSettings, onToggleColumnSettings]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header con estadísticas y configuración */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-4 dark:border-white/[0.05]">
        {/* Total de áreas */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total de Áreas:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{totalAreas.toLocaleString()}</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2">
          {/* Botón Table Settings */}
          <div ref={settingsButtonRef}>
            <Button
              variant="outline"
              size="xs"
              onClick={onToggleColumnSettings}
              startIcon={
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            >
              Table settings
            </Button>
          </div>

          {/* Botón Añadir Área */}
          <Button
            variant="primary"
            size="xs"
            onClick={onAddArea}
            startIcon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Añadir Área
          </Button>
        </div>
      </div>

      {/* Panel de configuración de columnas - Posicionado con fixed */}
      {showColumnSettings && settingsDropdownPosition && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={onToggleColumnSettings}
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
                  checked={visibleColumns.nombre}
                  onChange={() => onToggleColumn('nombre')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Nombre</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.categorias}
                  onChange={() => onToggleColumn('categorias')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Categorías</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.materias}
                  onChange={() => onToggleColumn('materias')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Materias</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.fechaCreacion}
                  onChange={() => onToggleColumn('fechaCreacion')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Fecha Creación</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.fechaActualizacion}
                  onChange={() => onToggleColumn('fechaActualizacion')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Fecha Actualización</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.creadoPor}
                  onChange={() => onToggleColumn('creadoPor')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Creado Por</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.actualizadoPor}
                  onChange={() => onToggleColumn('actualizadoPor')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Actualizado Por</span>
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
              {visibleColumns.nombre && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  NOMBRE
                </TableCell>
              )}
              {visibleColumns.categorias && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  CATEGORÍAS
                </TableCell>
              )}
              {visibleColumns.materias && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  MATERIAS
                </TableCell>
              )}
              {visibleColumns.fechaCreacion && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  FECHA CREACIÓN
                </TableCell>
              )}
              {visibleColumns.fechaActualizacion && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  FECHA ACTUALIZACIÓN
                </TableCell>
              )}
              {visibleColumns.creadoPor && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  CREADO POR
                </TableCell>
              )}
              {visibleColumns.actualizadoPor && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  ACTUALIZADO POR
                </TableCell>
              )}
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {areas.map((area) => (
              <TableRow key={area.idArea}>
                {/* NOMBRE */}
                {visibleColumns.nombre && (
                  <TableCell className="px-5 py-4 text-start">
                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90 break-words">
                      {area.nombre}
                    </span>
                  </TableCell>
                )}

                {/* CATEGORÍAS */}
                {visibleColumns.categorias && (
                  <TableCell className="px-5 py-4 text-start">
                    <div className="relative flex items-center gap-2">
                      {area.areaCategorias && area.areaCategorias.length > 0 ? (
                        <>
                          {/* Mostrar solo la primera categoría */}
                          <Badge
                            size="sm"
                            color="light"
                          >
                            {area.areaCategorias[0].Categoria?.nombre || area.areaCategorias[0].categoria?.nombre}
                          </Badge>

                          {/* Botón +N si hay más categorías */}
                          {area.areaCategorias.length > 1 && (
                            <div className="relative">
                              <button
                                ref={openCategoriasDropdown === area.idArea ? categoriasButtonRef : null}
                                onClick={() => toggleCategoriasDropdown(area.idArea)}
                                className="flex h-6 w-auto min-w-[24px] items-center justify-center rounded-full border border-gray-300 bg-white px-2 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                aria-label={`${area.areaCategorias.length - 1} more categories`}
                              >
                                +{area.areaCategorias.length - 1}
                              </button>

                              {/* Dropdown */}
                              {openCategoriasDropdown === area.idArea && categoriasDropdownPosition && (
                                <>
                                  <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setOpenCategoriasDropdown(null)}
                                  />

                                  <div
                                    className="fixed z-50 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                                    style={{
                                      bottom: `${window.innerHeight - categoriasDropdownPosition.top}px`,
                                      right: `${categoriasDropdownPosition.right}px`,
                                    }}
                                  >
                                    <div className="mb-2 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                      Categorías ({area.areaCategorias.length})
                                    </div>
                                    <div className="max-h-60 space-y-1 overflow-y-auto">
                                      {area.areaCategorias.map((ac) => (
                                        <div
                                          key={ac.idAreaCategoria}
                                          className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-300"
                                        >
                                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                            <svg className="h-3 w-3 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                          </div>
                                          <span>{ac.Categoria?.nombre || ac.categoria?.nombre}</span>
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
                        <span className="text-sm text-gray-400 dark:text-gray-500">Sin categorías</span>
                      )}
                    </div>
                  </TableCell>
                )}

                {/* MATERIAS */}
                {visibleColumns.materias && (
                  <TableCell className="px-5 py-4 text-start">
                    <div className="relative flex items-center gap-2">
                      {(() => {
                        // Recopilar todas las materias de todas las areaCategorias
                        const todasLasMaterias = area.areaCategorias?.flatMap(ac => ac.materias || []) || [];

                        return todasLasMaterias.length > 0 ? (
                          <>
                            {/* Mostrar solo la primera materia */}
                            <Badge
                              size="sm"
                              color="light"
                            >
                              {todasLasMaterias[0].nombre}
                            </Badge>

                            {/* Botón +N si hay más materias */}
                            {todasLasMaterias.length > 1 && (
                              <div className="relative">
                                <button
                                  ref={openMateriasDropdown === area.idArea ? materiasButtonRef : null}
                                  onClick={() => toggleMateriasDropdown(area.idArea)}
                                  className="flex h-6 w-auto min-w-[24px] items-center justify-center rounded-full border border-gray-300 bg-white px-2 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                  aria-label={`${todasLasMaterias.length - 1} more subjects`}
                                >
                                  +{todasLasMaterias.length - 1}
                                </button>

                                {/* Dropdown */}
                                {openMateriasDropdown === area.idArea && materiasDropdownPosition && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-10"
                                      onClick={() => setOpenMateriasDropdown(null)}
                                    />

                                    <div
                                      className="fixed z-50 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                                      style={{
                                        bottom: `${window.innerHeight - materiasDropdownPosition.top}px`,
                                        right: `${materiasDropdownPosition.right}px`,
                                      }}
                                    >
                                      <div className="mb-2 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                        Materias ({todasLasMaterias.length})
                                      </div>
                                      <div className="max-h-60 space-y-1 overflow-y-auto">
                                        {todasLasMaterias.map((materia) => (
                                          <div
                                            key={materia.idMateria}
                                            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-300"
                                          >
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                              <svg className="h-3 w-3 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                              </svg>
                                            </div>
                                            <span>{materia.nombre}</span>
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
                          <span className="text-sm text-gray-400 dark:text-gray-500">Sin materias</span>
                        );
                      })()}
                    </div>
                  </TableCell>
                )}

                {/* FECHA CREACIÓN */}
                {visibleColumns.fechaCreacion && (
                  <TableCell className="px-5 py-4 text-start">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(area.fechaCreacion)}
                    </span>
                  </TableCell>
                )}

                {/* FECHA ACTUALIZACIÓN */}
                {visibleColumns.fechaActualizacion && (
                  <TableCell className="px-5 py-4 text-start">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(area.fechaActualizacion)}
                    </span>
                  </TableCell>
                )}

                {/* CREADO POR */}
                {visibleColumns.creadoPor && (
                  <TableCell className="px-5 py-4 text-start">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {area.creador?.usuario ? `${area.creador.usuario.nombre} ${area.creador.usuario.apellido}` : area.creador?.codigoAdministrativo || "-"}
                    </span>
                  </TableCell>
                )}

                {/* ACTUALIZADO POR */}
                {visibleColumns.actualizadoPor && (
                  <TableCell className="px-5 py-4 text-start">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {area.actualizador?.usuario ? `${area.actualizador.usuario.nombre} ${area.actualizador.usuario.apellido}` : area.actualizador?.codigoAdministrativo || "-"}
                    </span>
                  </TableCell>
                )}

                {/* ACCIONES */}
                <TableCell className="px-5 py-4 text-start">
                  <div className="relative">
                    <button
                      ref={openActionsDropdown === area.idArea ? actionsButtonRef : null}
                      onClick={() => toggleActionsDropdown(area.idArea)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                      <MoreDotIcon />
                    </button>

                    {/* Dropdown de acciones */}
                    {openActionsDropdown === area.idArea && actionsDropdownPosition && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenActionsDropdown(null)}
                        />

                        <div
                          className="fixed z-50 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                          style={{
                            bottom: `${window.innerHeight - actionsDropdownPosition.top}px`,
                            right: `${actionsDropdownPosition.right}px`,
                          }}
                        >
                          <div className="mb-2 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Acciones
                          </div>
                          <div className="space-y-1">
                            <button
                              onClick={() => {
                                onEdit(area);
                                setOpenActionsDropdown(null);
                              }}
                              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </div>
                              <span>Editar</span>
                            </button>

                            <button
                              onClick={() => {
                                onDelete(area.idArea);
                                setOpenActionsDropdown(null);
                              }}
                              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-red-600 dark:border-gray-600 dark:bg-gray-700 dark:text-red-400">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
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
