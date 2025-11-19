
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../components/ui/button/Button";
import { obtenerRevisionesPorProyecto, Revision } from "../../../services/revisionService";

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



interface Integrante {
  idEstudianteProyecto: string;
  codigo: string;
  nombreCompleto: string;
  esLider: boolean;
  idUsuario?: string;
}

export default function ProyectoTareasCard({ idProyecto }: ProyectoTareasCardProps) {
  const { user } = useAuth();
  const [tareas, setTareas] = useState<TareasOrganizadas>({
    enProceso: [],
    completado: [],
    pendiente: [],
  });
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingIntegrantes, setLoadingIntegrantes] = useState(true);
  const [enviandoRevision, setEnviandoRevision] = useState(false);
  const [errorRevision, setErrorRevision] = useState<string | null>(null);
  const [revisionesMap, setRevisionesMap] = useState<Record<string, Revision>>({});
  const [revisionSeleccionada, setRevisionSeleccionada] = useState<{
    tarea: Tarea;
    revision: Revision;
  } | null>(null);

  useEffect(() => {
    cargarTareas();
    cargarIntegrantes();
    cargarRevisiones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const cargarIntegrantes = async () => {
    try {
      setLoadingIntegrantes(true);
      const response = await api.get(`/proyectos/${idProyecto}/integrantes`);
      const data = response.data.data;
      const items = data.items || [];
      const mapped: Integrante[] = items.map((item: any) => ({
        idEstudianteProyecto: item.idEstudianteProyecto,
        codigo: item.codigo || "Sin código",
        nombreCompleto: item.nombreCompleto || "Sin nombre",
        esLider: item.esLider,
        idUsuario: item.idUsuario,
      }));
      setIntegrantes(mapped);
    } catch (err) {
      console.error("Error al cargar integrantes:", err);
      setIntegrantes([]);
    } finally {
      setLoadingIntegrantes(false);
    }
  };

  const cargarRevisiones = async () => {
    try {
      const revisiones = await obtenerRevisionesPorProyecto(idProyecto);
      const map: Record<string, Revision> = {};
      revisiones.forEach((rev) => {
        if (rev.idTarea) {
          map[rev.idTarea] = rev;
        }
      });
      setRevisionesMap(map);
    } catch (error) {
      console.error("Error al cargar revisiones:", error);
      setRevisionesMap({});
    }
  };

  // Obtener la tarea en proceso actual (solo una puede estarlo)
  const tareaEnProceso = tareas.enProceso && tareas.enProceso.length > 0 ? tareas.enProceso[0] : null;
  const revisionEnCurso = tareaEnProceso && 'enRevision' in tareaEnProceso && (tareaEnProceso as any).enRevision;

  // Función para enviar revisión
  const handleEnviarRevision = async () => {
    if (!tareaEnProceso) return;
    setEnviandoRevision(true);
    setErrorRevision(null);
    try {
      await api.post("/revisiones", {
        idProyecto,
        idTarea: tareaEnProceso.idTarea,
      });
      await cargarTareas();
      await cargarRevisiones();
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("revision-status-changed", {
            detail: { idProyecto },
          })
        );
      }
    } catch (err: any) {
      setErrorRevision(err?.response?.data?.message || err?.message || "Error al enviar revisión");
    } finally {
      setEnviandoRevision(false);
    }
  };


  if (loading || loadingIntegrantes) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <p className="text-center text-gray-600 dark:text-gray-400">Cargando tareas...</p>
      </div>
    );
  }
  // Determinar si el usuario actual es el líder
  const esLiderActual = integrantes.some(
    (i) => i.esLider && i.idUsuario && user && i.idUsuario === user.idUsuario
  );

  const renderTarea = (tarea: Tarea, esCompletado: boolean = false) => {
    const revision = revisionesMap[tarea.idTarea];
    const handleClick = () => {
      if (revision) {
        setRevisionSeleccionada({ tarea, revision });
      }
    };

    return (
      <div
        key={tarea.idTarea}
        onClick={handleClick}
        className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 ${
          revision ? "cursor-pointer hover:border-primary-300 focus-within:border-primary-400" : ""
        }`}
      >
      <div className="flex items-start justify-between mb-2">
        <h4 className={`font-medium text-gray-900 dark:text-white ${esCompletado ? 'line-through opacity-60' : ''}`}>
          {tarea.orden}. {tarea.nombre}
        </h4>
        {/* Etiqueta En Revisión */}
        {('enRevision' in tarea && (tarea as any).enRevision) && (
          <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800 text-xs font-semibold border border-yellow-300">
            En Revisión
          </span>
        )}
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
        {revision && (
          <div className="mt-3 text-right">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              Ver revisión
            </button>
          </div>
        )}
    </div>
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="mb-5 flex items-center justify-between lg:mb-7">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Lista de Tareas</h3>
        {esLiderActual && tareaEnProceso && (
          <Button
            size="sm"
            variant="primary"
            disabled={!!revisionEnCurso || enviandoRevision}
            onClick={handleEnviarRevision}
          >
            {enviandoRevision ? "Enviando..." : "Enviar Revisión"}
          </Button>
        )}
            {errorRevision && (
              <div className="mb-3 text-sm text-red-600 dark:text-red-400">{errorRevision}</div>
            )}
      </div>

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
      {revisionSeleccionada && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Detalle de Revisión</h4>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
                onClick={() => setRevisionSeleccionada(null)}
                aria-label="Cerrar modal de revisión"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {revisionSeleccionada.tarea.orden}. {revisionSeleccionada.tarea.nombre}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {revisionSeleccionada.tarea.descripcion || "Sin descripción"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800 dark:text-white">Calificación</span>
                <span className="text-base font-semibold text-primary-600 dark:text-primary-400">
                  {revisionSeleccionada.revision.puntaje ?? "Sin calificación"} / 100
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-800 dark:text-white">Comentario</span>
                <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {revisionSeleccionada.revision.comentario || "Sin comentario"}
                </p>
              </div>
            </div>
            <div className="mt-6 text-right">
              <Button size="sm" variant="primary" onClick={() => setRevisionSeleccionada(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
