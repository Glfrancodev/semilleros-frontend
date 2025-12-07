import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../components/ui/button/Button";
import { actualizarRevision, obtenerRevisionesPorProyecto, Revision } from "../../../services/revisionService";
import { ProyectoDetalle } from "../../../services/proyectoService";
import { ROLES } from "../../../constants/roles";
import toast from "react-hot-toast";

interface Tarea {
  orden: number;
  nombre: string;
  descripcion: string;
  fechaLimite: string;
  idTarea: string;
  esFinal?: boolean;
}

interface TareasOrganizadas {
  enProceso: Tarea[];
  completado: Tarea[];
  pendiente: Tarea[];
}

interface ProyectoTareasCardProps {
  idProyecto: string;
  proyecto?: ProyectoDetalle;
}



interface Integrante {
  idEstudianteProyecto: string;
  codigo: string;
  nombreCompleto: string;
  esLider: boolean;
  idUsuario?: string;
}

export default function ProyectoTareasCard({ idProyecto, proyecto }: ProyectoTareasCardProps) {
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

  // Verificar si el proyecto está bloqueado por falta de aprobaciones
  const proyectoBloqueado = proyecto && (proyecto.estaAprobado !== true || proyecto.estaAprobadoTutor !== true);  const [revisionSeleccionada, setRevisionSeleccionada] = useState<{
    tarea: Tarea;
    revision: Revision;
    editable: boolean;
  } | null>(null);
  const [calificacionInput, setCalificacionInput] = useState<string>("");
  const [comentarioInput, setComentarioInput] = useState("");
  const [guardandoCalificacion, setGuardandoCalificacion] = useState(false);
  const [errorCalificacion, setErrorCalificacion] = useState<string | null>(null);

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
  const esAdmin = user?.rol === ROLES.ADMIN;

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
        setRevisionSeleccionada({
          tarea,
          revision,
          editable: esAdmin && !esCompletado,
        });
        setCalificacionInput(
          typeof revision.puntaje === "number" ? String(revision.puntaje) : ""
        );
        setComentarioInput(revision.comentario ?? "");
        setErrorCalificacion(null);
      }
    };

    return (
      <div
        key={tarea.idTarea}
        onClick={handleClick}
        className={`rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-white/10 dark:bg-[#1c2639] ${
          revision ? "cursor-pointer" : ""
        } ${revision ? "hover:border-gray-300 dark:hover:border-white/25" : "hover:border-gray-200 dark:hover:border-white/15"}`}
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
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200 transition-colors"
            >
              {esAdmin && !esCompletado ? "Calificar" : "Ver revisión"}
            </button>
          </div>
        )}
    </div>
    );
  };

  const handleGuardarCalificacion = async () => {
    if (!revisionSeleccionada || !revisionSeleccionada.editable) return;
    const puntaje =
      calificacionInput.trim() === "" ? null : Number(calificacionInput.trim());

    if (puntaje !== null && (Number.isNaN(puntaje) || puntaje < 0 || puntaje > 100)) {
      setErrorCalificacion("La calificación debe estar entre 0 y 100.");
      return;
    }

    setGuardandoCalificacion(true);
    setErrorCalificacion(null);
    try {
      await actualizarRevision(revisionSeleccionada.revision.idRevision, {
        puntaje,
        comentario: comentarioInput.trim() || null,
        revisado: true,
      });
      await Promise.all([cargarRevisiones(), cargarTareas()]);
      setErrorCalificacion(null);
      setRevisionSeleccionada(null);
      toast.success("Calificación guardada correctamente");
    } catch (err) {
      console.error("Error al guardar calificación:", err);
      setErrorCalificacion("No se pudo guardar la calificación. Intenta nuevamente.");
      toast.error("No se pudo guardar la calificación");
    } finally {
      setGuardandoCalificacion(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="mb-5 flex items-center justify-between lg:mb-7">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Lista de Tareas</h3>
        {esLiderActual && tareaEnProceso && (
          <Button
            size="sm"
            variant="primary"
            disabled={!!revisionEnCurso || enviandoRevision || proyectoBloqueado}
            onClick={handleEnviarRevision}
          >
            {enviandoRevision ? "Enviando..." : "Enviar Revisión"}
          </Button>
        )}
            {errorRevision && (
              <div className="mb-3 text-sm text-red-600 dark:text-red-400">{errorRevision}</div>
            )}
      </div>

      {proyectoBloqueado && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          El proyecto debe estar aprobado por el Administrador y el Tutor antes de poder enviar tareas para revisión.
        </div>
      )}

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
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRevisionSeleccionada(null)} />
          <div className="relative z-[1000000] w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl transition-colors dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-start justify-between border-b border-gray-200 p-6 dark:border-gray-700">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Revisión de tarea
                </p>
                <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                  Detalle de Revisión
                </h4>
              </div>
              <button
                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                onClick={() => setRevisionSeleccionada(null)}
                aria-label="Cerrar modal de revisión"
              >
                ✕
              </button>
            </div>
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "calc(90vh - 140px)" }}
            >
              <div className="p-6 space-y-6 text-sm text-gray-700 dark:text-gray-100">
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {revisionSeleccionada.tarea.orden}. {revisionSeleccionada.tarea.nombre}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {revisionSeleccionada.tarea.descripcion || "Sin descripción"}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/5 flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-white">
                    Calificación
                  </span>
                  {revisionSeleccionada.editable ? (
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={calificacionInput}
                      onChange={(e) => setCalificacionInput(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-transparent"
                      placeholder="Ingresa un puntaje (0-100)"
                    />
                  ) : (
                    <span className="text-xl font-semibold text-primary-600 dark:text-primary-300">
                      {revisionSeleccionada.revision.puntaje ?? "Sin calificación"} / 100
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-white mb-2">
                    Comentario
                  </p>
                  {revisionSeleccionada.editable ? (
                    <textarea
                      value={comentarioInput}
                      onChange={(e) => setComentarioInput(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-transparent"
                      placeholder="Añade un comentario"
                    />
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-white">
                      {revisionSeleccionada.revision.comentario || "Sin comentario"}
                    </div>
                  )}
                </div>
                {revisionSeleccionada.editable && errorCalificacion && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errorCalificacion}</p>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 p-6 flex flex-col gap-3 text-right dark:border-gray-700 sm:flex-row sm:justify-end">
              <Button size="sm" variant="outline" onClick={() => setRevisionSeleccionada(null)}>
                Cerrar
              </Button>
              {revisionSeleccionada.editable && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleGuardarCalificacion}
                  disabled={guardandoCalificacion}
                >
                  {guardandoCalificacion ? "Guardando..." : "Guardar calificación"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

