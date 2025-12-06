import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { useState, useRef, useEffect } from "react";
import { Semestre } from "../../services/semestreService";
import { useNavigate } from "react-router-dom";

interface SemestresTableProps {
  semestres: Semestre[];
  totalSemestres: number;
  visibleColumns: {
    numero: boolean;
    fechaCreacion: boolean;
    fechaActualizacion: boolean;
  };
  showColumnSettings: boolean;
  onToggleColumnSettings: () => void;
  onToggleColumn: (column: keyof SemestresTableProps['visibleColumns']) => void;
}

export default function SemestresTableSimple({ 
  semestres,
  totalSemestres,
  visibleColumns,
  showColumnSettings,
  onToggleColumnSettings,
  onToggleColumn,
}: SemestresTableProps) {
  const navigate = useNavigate();
  const [settingsDropdownPosition, setSettingsDropdownPosition] = useState<{ top: number; right: number } | null>(null);
  const settingsButtonRef = useRef<HTMLDivElement>(null);

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
      if (showColumnSettings) onToggleColumnSettings();
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [showColumnSettings, onToggleColumnSettings]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleVerMaterias = (semestre: Semestre) => {
    navigate(`/materias/${semestre.idSemestre}`, { 
      state: { numeroSemestre: semestre.numero } 
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header con estadísticas y configuración */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-4 dark:border-white/[0.05]">
        {/* Total de semestres */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total de Semestres:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{totalSemestres.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Botón Table Settings */}
        <div className="flex items-center gap-2">
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
                  checked={visibleColumns.numero}
                  onChange={() => onToggleColumn('numero')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Número</span>
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
              {visibleColumns.numero && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  NÚMERO
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
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {semestres.map((semestre) => (
              <TableRow key={semestre.idSemestre}>
                {/* NÚMERO */}
                {visibleColumns.numero && (
                  <TableCell className="px-5 py-4 text-start">
                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {semestre.numero}
                    </span>
                  </TableCell>
                )}

                {/* FECHA CREACIÓN */}
                {visibleColumns.fechaCreacion && (
                  <TableCell className="px-5 py-4 text-start">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(semestre.fechaCreacion)}
                    </span>
                  </TableCell>
                )}

                {/* FECHA ACTUALIZACIÓN */}
                {visibleColumns.fechaActualizacion && (
                  <TableCell className="px-5 py-4 text-start">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(semestre.fechaActualizacion)}
                    </span>
                  </TableCell>
                )}

                {/* ACCIONES */}
                <TableCell className="px-5 py-4 text-start">
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => handleVerMaterias(semestre)}
                    startIcon={
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    }
                  >
                    Ver Materias
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
