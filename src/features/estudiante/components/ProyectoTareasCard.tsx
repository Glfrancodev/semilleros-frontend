import { useEffect, useState } from "react";
import api from "../../../services/api";

interface Tarea {
  orden: number;
  nombre: string;
  descripcion: string;
  fechaLimite: string;
  idTarea: string;
}

interface TareasOrganizadas {
  enProceso: Tarea[];
  completado: Tarea[];
  pendiente: Tarea[];
}

interface ProyectoTareasCardProps {
  idProyecto: string;
}

export default function ProyectoTareasCard({ idProyecto }: ProyectoTareasCardProps) {
  const [tareas, setTareas] = useState<TareasOrganizadas>({
    enProceso: [],
    completado: [],
    pendiente: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarTareas();
  }, [idProyecto]);

  const cargarTareas = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/proyectos/${idProyecto}/tareas-organizadas`);
      setTareas(response.data.data);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <p className="text-center text-gray-600 dark:text-gray-400">Cargando tareas...</p>
      </div>
    );
  }

  const renderTarea = (tarea: Tarea, esCompletado: boolean = false) => (
    <div
      key={tarea.idTarea}
      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className={`font-medium text-gray-900 dark:text-white ${esCompletado ? 'line-through opacity-60' : ''}`}>
          {tarea.orden}. {tarea.nombre}
        </h4>
      </div>
      <p className={`text-sm text-gray-600 dark:text-gray-400 mb-2 ${esCompletado ? 'line-through opacity-60' : ''}`}>
        {tarea.descripcion || "Sin descripción"}
      </p>
      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Fecha límite: {new Date(tarea.fechaLimite).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        Lista de Tareas
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* En Proceso */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              En Proceso ({tareas.enProceso.length})
            </h4>
          </div>
          <div className="space-y-3">
            {tareas.enProceso.length > 0 ? (
              tareas.enProceso.map(t => renderTarea(t, false))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No hay tareas en proceso
              </p>
            )}
          </div>
        </div>

        {/* Completado */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Completado ({tareas.completado.length})
            </h4>
          </div>
          <div className="space-y-3">
            {tareas.completado.length > 0 ? (
              tareas.completado.map(t => renderTarea(t, true))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No hay tareas completadas
              </p>
            )}
          </div>
        </div>

        {/* Pendiente */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Pendiente ({tareas.pendiente.length})
            </h4>
          </div>
          <div className="space-y-3">
            {tareas.pendiente.length > 0 ? (
              tareas.pendiente.map(t => renderTarea(t, false))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No hay tareas pendientes
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
