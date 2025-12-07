import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ProyectoJurado } from "../../services/docenteProyectoService";
import Button from "../ui/button/Button";

interface CalificarProyectosTableProps {
  proyectos: ProyectoJurado[];
  totalProyectos: number;
  onCalificar: (idProyecto: string) => void;
}

export default function CalificarProyectosTableSimple({ 
  proyectos,
  totalProyectos,
  onCalificar
}: CalificarProyectosTableProps) {

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header con estadísticas */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-4 dark:border-white/[0.05]">
        {/* Total de proyectos */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Proyectos a Calificar:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{totalProyectos.toLocaleString()}</span>
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
                ID
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                NOMBRE
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                DESCRIPCIÓN
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
                <TableCell colSpan={4} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                  No hay proyectos para calificar
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

                  {/* ACCIONES */}
                  <TableCell className="px-5 py-4 text-start align-top">
                    <Button
                      variant="primary"
                      size="xs" 
                      onClick={() => onCalificar(proyecto.idProyecto)}
                    >
                      Calificar
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
