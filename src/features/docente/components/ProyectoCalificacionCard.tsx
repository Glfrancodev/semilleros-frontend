import { useState, useEffect } from "react";
import { Calificacion, CalificacionInput, obtenerCalificacionesProyecto, calificarProyecto } from "../../../services/calificacionService";
import Button from "../../../components/ui/button/Button";
import toast from "react-hot-toast";

interface ProyectoCalificacionCardProps {
  idDocenteProyecto: string;
}

export default function ProyectoCalificacionCard({ idDocenteProyecto }: ProyectoCalificacionCardProps) {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [puntajes, setPuntajes] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yaCalificado, setYaCalificado] = useState(false);

  useEffect(() => {
    cargarCalificaciones();
  }, [idDocenteProyecto]);

  const cargarCalificaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔍 Cargando calificaciones para idDocenteProyecto:", idDocenteProyecto);
      const data = await obtenerCalificacionesProyecto(idDocenteProyecto);
      console.log("✅ Calificaciones obtenidas:", data);
      setCalificaciones(data);

      // Verificar si ya fue calificado
      const calificado = data.some(cal => cal.calificado);
      setYaCalificado(calificado);

      // Inicializar puntajes con los valores actuales
      const initialPuntajes: { [key: string]: number } = {};
      data.forEach(cal => {
        initialPuntajes[cal.idCalificacion] = cal.puntajeObtenido;
      });
      setPuntajes(initialPuntajes);
    } catch (err: any) {
      console.error("❌ Error al cargar calificaciones:", err);
      setError(err.response?.data?.message || "Error al cargar calificaciones");
      console.error("Error al cargar calificaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePuntajeChange = (idCalificacion: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setPuntajes(prev => ({
        ...prev,
        [idCalificacion]: numValue
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (yaCalificado) {
      toast("Este proyecto ya ha sido calificado y no puede modificarse", {
        icon: '⚠️',
      });
      return;
    }

    // Validar que todos los puntajes estén dentro del rango
    const errores: string[] = [];
    calificaciones.forEach(cal => {
      const puntaje = puntajes[cal.idCalificacion];
      if (puntaje === undefined || puntaje === null) {
        errores.push(`Falta puntaje para "${cal.subCalificacion.nombre}"`);
      } else if (puntaje > cal.subCalificacion.maximoPuntaje) {
        errores.push(
          `El puntaje para "${cal.subCalificacion.nombre}" (${puntaje}) excede el máximo permitido (${cal.subCalificacion.maximoPuntaje})`
        );
      } else if (puntaje < 0) {
        errores.push(`El puntaje para "${cal.subCalificacion.nombre}" no puede ser negativo`);
      }
    });

    if (errores.length > 0) {
      toast.error(errores.join(". "));
      return;
    }

    try {
      setSubmitting(true);

      const calificacionesInput: CalificacionInput[] = calificaciones.map(cal => ({
        idCalificacion: cal.idCalificacion,
        puntajeObtenido: puntajes[cal.idCalificacion]
      }));

      await calificarProyecto(idDocenteProyecto, calificacionesInput);
      
      toast.success("Proyecto calificado exitosamente");
      
      // Recargar calificaciones para actualizar el estado
      await cargarCalificaciones();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error al calificar el proyecto";
      toast.error(errorMsg);
      console.error("Error al calificar proyecto:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const calcularPuntajeTotal = () => {
    return Object.values(puntajes).reduce((sum, puntaje) => sum + (puntaje || 0), 0);
  };

  const calcularPuntajeMaximoTotal = () => {
    return calificaciones.reduce((sum, cal) => sum + cal.subCalificacion.maximoPuntaje, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600 dark:text-gray-400">Cargando calificaciones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
        {error}
        <button 
          onClick={cargarCalificaciones}
          className="ml-4 underline hover:no-underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (calificaciones.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
        <p className="text-gray-600 dark:text-gray-400">
          No hay criterios de calificación configurados para este proyecto.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Calificación del Proyecto
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {yaCalificado 
              ? "Este proyecto ya ha sido calificado" 
              : "Asigna un puntaje a cada criterio de evaluación"}
          </p>
        </div>
        {yaCalificado && (
          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            ✓ Calificado
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tabla de calificaciones */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Criterio
                </th>
                <th className="pb-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Puntaje Máximo
                </th>
                <th className="pb-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Puntaje Obtenido
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {calificaciones.map((cal) => (
                <tr key={cal.idCalificacion}>
                  <td className="py-4 text-sm text-gray-800 dark:text-gray-200">
                    {cal.subCalificacion.nombre}
                  </td>
                  <td className="py-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    {cal.subCalificacion.maximoPuntaje}
                  </td>
                  <td className="py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      max={cal.subCalificacion.maximoPuntaje}
                      step="0.1"
                      value={puntajes[cal.idCalificacion] || 0}
                      onChange={(e) => handlePuntajeChange(cal.idCalificacion, e.target.value)}
                      disabled={yaCalificado}
                      className={`w-24 rounded-lg border px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 ${
                        yaCalificado
                          ? "bg-gray-100 cursor-not-allowed dark:bg-gray-800"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      }`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-gray-300 dark:border-gray-600">
              <tr>
                <td className="pt-4 text-sm font-bold text-gray-800 dark:text-gray-200">
                  Total
                </td>
                <td className="pt-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300">
                  {calcularPuntajeMaximoTotal()}
                </td>
                <td className="pt-4 text-center text-sm font-bold text-blue-600 dark:text-blue-400">
                  {calcularPuntajeTotal().toFixed(1)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Botón de calificar */}
        {!yaCalificado && (
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="min-w-[150px]"
            >
              {submitting ? "Guardando..." : "Calificar Proyecto"}
            </Button>
          </div>
        )}

        {yaCalificado && (
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              ℹ️ Este proyecto ya ha sido calificado. Las calificaciones no pueden modificarse una vez enviadas.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
