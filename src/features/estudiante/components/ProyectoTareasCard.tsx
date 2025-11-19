
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
    } catch (error) {
      console.error("Error al cargar revisiones:", error);
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

      {/* Tabla de tareas con columnas de igual ancho */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-1/7 px-3 py-2 font-semibold text-left">ORDEN</th>
              <th className="w-1/7 px-3 py-2 font-semibold text-left">NOMBRE</th>
              <th className="w-1/7 px-3 py-2 font-semibold text-left">DESCRIPCIÓN</th>
              <th className="w-1/7 px-3 py-2 font-semibold text-left">ENVIADOS / INSCRITOS</th>
              <th className="w-1/7 px-3 py-2 font-semibold text-left">PENDIENTES / ENVIADOS</th>
              <th className="w-1/7 px-3 py-2 font-semibold text-left">FECHA LÍMITE</th>
              <th className="w-1/7 px-3 py-2 font-semibold text-left">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {[...tareas.enProceso, ...tareas.completado, ...tareas.pendiente].map((tarea) => (
              <tr key={tarea.idTarea} className="border-b border-gray-100 dark:border-gray-800">
                <td className="px-3 py-2">#{tarea.orden}</td>
                <td className="px-3 py-2 font-semibold">{tarea.nombre}</td>
                <td className="px-3 py-2">{tarea.descripcion || "Sin descripción"}</td>
                <td className="px-3 py-2">{/* TODO: Enviados / Inscritos */}</td>
                <td className="px-3 py-2">{/* TODO: Pendientes / Enviados */}</td>
                <td className="px-3 py-2">{new Date(tarea.fechaLimite).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td className="px-3 py-2">
                  <Button size="xs" variant="outline" onClick={() => {/* TODO: Acción revisar */}}>
                    Revisar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* (Eliminado: grid de columnas viejas, solo tabla ahora) */}
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

                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-white">
                    Calificación
                  </span>
                  <span className="text-xl font-semibold text-primary-600 dark:text-primary-300">
                    {revisionSeleccionada.revision.puntaje ?? "Sin calificación"} / 100
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-white mb-2">
                    Comentario
                  </p>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-white">
                    {revisionSeleccionada.revision.comentario || "Sin comentario"}
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 p-6 text-right dark:border-gray-700">
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
