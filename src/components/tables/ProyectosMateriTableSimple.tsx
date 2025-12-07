import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { Proyecto } from "../../services/proyectoService";

interface ProyectosMateriTableProps {
  proyectos: Proyecto[];
  totalProyectos?: number;
  onRevisar: (idProyecto: string) => void;
}

export default function ProyectosMateriTableSimple({ 
  proyectos,
  totalProyectos,
  onRevisar
}: ProyectosMateriTableProps) {
  const getEstadoBadge = (estaAprobadoTutor: boolean | null | undefined) => {
    // Verificar explícitamente null/undefined
    if (estaAprobadoTutor === null || estaAprobadoTutor === undefined) {
      return <Badge color="warning">Pendiente</Badge>;
    }
    // Verificar true
    if (estaAprobadoTutor === true) {
      return <Badge color="success">Aprobado</Badge>;
    }
    // false
    return <Badge color="error">Rechazado</Badge>;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header con estadísticas */}
      {totalProyectos !== undefined && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-4 dark:border-white/[0.05]">
          {/* Total de proyectos */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total de Proyectos:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{totalProyectos.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Tabla */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                ID
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                NOMBRE
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                DESCRIPCIÓN
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                GRUPO
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                ESTADO
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {proyectos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                  No hay proyectos para mostrar
                </TableCell>
              </TableRow>
            ) : (
              proyectos.map((proyecto) => (
                <TableRow key={proyecto.idProyecto}>
                  {/* ID */}
                  <TableCell className="px-5 py-4 text-start align-top">
                    <span className="text-gray-600 text-theme-sm dark:text-gray-300 font-mono text-xs">
                      {proyecto.idProyecto.substring(0, 8)}...
                    </span>
                  </TableCell>

                  {/* NOMBRE */}
                  <TableCell className="px-5 py-4 text-start align-top">
                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {proyecto.nombre}
                    </span>
                  </TableCell>

                  {/* DESCRIPCIÓN */}
                  <TableCell className="px-5 py-4 text-start align-top">
                    <span className="text-gray-600 text-theme-sm dark:text-gray-300 line-clamp-2">
                      {proyecto.descripcion}
                    </span>
                  </TableCell>

                  {/* GRUPO */}
                  <TableCell className="px-5 py-4 text-start align-top">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {proyecto.grupoSigla || 'Sin grupo'}
                    </span>
                  </TableCell>

                  {/* ESTADO */}
                  <TableCell className="px-5 py-4 text-start align-top">
                    {getEstadoBadge(proyecto.estaAprobadoTutor)}
                  </TableCell>

                  {/* ACCIONES */}
                  <TableCell className="px-5 py-4 text-start align-top">
                    <Button
                      variant="primary"
                      size="xs" 
                      onClick={() => onRevisar(proyecto.idProyecto)}
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
