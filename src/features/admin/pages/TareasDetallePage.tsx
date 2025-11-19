import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Button from "../../../components/ui/button/Button";
import Badge from "../../../components/ui/badge/Badge";
import {
  obtenerResumenFeriaActiva,
  type ResumenFeriaActiva,
  type TareaResumenFeria,
} from "../../../services/feriaService";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function TareasDetallePage() {
  const { idTarea } = useParams<{ idTarea: string }>();
  const navigate = useNavigate();
  const [tarea, setTarea] = useState<TareaResumenFeria | null>(null);
  const [resumen, setResumen] = useState<ResumenFeriaActiva | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadDetalle();
  }, [idTarea]);

  const loadDetalle = async () => {
    if (!idTarea) {
      setError("No se proporcionó la tarea a revisar.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await obtenerResumenFeriaActiva();
      const tareaEncontrada = data.tareas.find((item) => item.idTarea === idTarea) ?? null;
      if (!tareaEncontrada) {
        setError("No encontramos información para la tarea seleccionada.");
      }
      setTarea(tareaEncontrada);
      setResumen(data);
    } catch (err) {
      console.error(err);
      setError("Hubo un problema al cargar la tarea. Intenta nuevamente.");
      setTarea(null);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-300">
          Cargando información de la tarea...
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-white/[0.05] dark:bg-white/[0.03]">
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              Volver
            </Button>
            <Button size="sm" onClick={loadDetalle}>
              Reintentar
            </Button>
          </div>
        </div>
      );
    }

    if (!tarea || !resumen) {
      return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-300">
          No hay información disponible para esta tarea.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tarea</p>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{tarea.nombre}</h2>
          </div>
          <div className="flex gap-2">
            <Badge variant="light" color="primary" size="sm">
              Orden #{tarea.orden}
            </Badge>
            <Badge variant="light" color="info" size="sm">
              Feria {resumen.semestre}-{resumen.anio}
            </Badge>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Descripción</p>
              <p className="text-base text-gray-900 dark:text-white">{tarea.descripcion}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white/[0.6] p-4 dark:border-white/[0.05] dark:bg-white/[0.02]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Fecha límite</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatDate(tarea.fechaLimite)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white/[0.6] p-4 dark:border-white/[0.05] dark:bg-white/[0.02]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Envíos recibidos</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tarea.enviadosRevision.toLocaleString()} / {resumen.cantidadProyectosInscritos.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Enviados / Inscritos</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white/[0.6] p-4 dark:border-white/[0.05] dark:bg-white/[0.02]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Pendientes de revisión</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tarea.pendientesRevision.toLocaleString()} / {tarea.enviadosRevision.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pendientes / Enviados</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white/[0.6] p-4 dark:border-white/[0.05] dark:bg-white/[0.02]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Feria activa</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {resumen.nombreFeria}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Volver
            </Button>
            <Button size="sm" onClick={() => console.log("Iniciar revisión de tarea", tarea.idTarea)}>
              Iniciar revisión
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <PageMeta
        title="Detalle de Tarea | Semilleros"
        description="Información detallada de la tarea seleccionada"
      />
      <PageBreadcrumb pageTitle="Detalle de Tarea" />
      {renderContent()}
    </>
  );
}
