import { useEffect, useState } from "react";
import { obtenerConvocatorias, Convocatoria } from "../../../services/convocatoriaService";
import { obtenerEventos, Evento } from "../../../services/eventoService";
import ConvocatoriaCard from "../components/ConvocatoriaCard";
import EventoCard from "../components/EventoCard";
import Button from "../../../components/ui/button/Button";

export default function ConvocatoriasPage() {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loadingConvocatorias, setLoadingConvocatorias] = useState(true);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [errorConvocatorias, setErrorConvocatorias] = useState<string | null>(null);
  const [errorEventos, setErrorEventos] = useState<string | null>(null);

  useEffect(() => {
    cargarConvocatorias();
    cargarEventos();
  }, []);

  const cargarConvocatorias = async () => {
    try {
      setLoadingConvocatorias(true);
      setErrorConvocatorias(null);
      const data = await obtenerConvocatorias();
      setConvocatorias(data);
    } catch (err: any) {
      setErrorConvocatorias(err.response?.data?.message || "Error al cargar las convocatorias");
    } finally {
      setLoadingConvocatorias(false);
    }
  };

  const cargarEventos = async () => {
    try {
      setLoadingEventos(true);
      setErrorEventos(null);
      const data = await obtenerEventos();
      setEventos(data);
    } catch (err: any) {
      setErrorEventos(err.response?.data?.message || "Error al cargar los eventos");
    } finally {
      setLoadingEventos(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Convocatorias y Eventos
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Explora y participa en convocatorias académicas y eventos de investigación
        </p>
      </div>

      {/* Sección de Convocatorias */}
      <div className="mb-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Convocatorias
          </h2>
        </div>

        <div className="p-6">
          {loadingConvocatorias ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Cargando convocatorias...</p>
              </div>
            </div>
          ) : errorConvocatorias ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-400 text-sm">{errorConvocatorias}</p>
              <Button 
                onClick={cargarConvocatorias}
                variant="danger"
                size="xs"
                className="mt-2"
              >
                Reintentar
              </Button>
            </div>
          ) : convocatorias.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📢</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No hay convocatorias disponibles
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Actualmente no hay convocatorias abiertas
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {convocatorias.map((convocatoria) => (
                <ConvocatoriaCard key={convocatoria.idConvocatoria} convocatoria={convocatoria} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sección de Eventos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Eventos
          </h2>
        </div>

        <div className="p-6">
          {loadingEventos ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Cargando eventos...</p>
              </div>
            </div>
          ) : errorEventos ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-400 text-sm">{errorEventos}</p>
              <Button 
                onClick={cargarEventos}
                variant="danger"
                size="xs"
                className="mt-2"
              >
                Reintentar
              </Button>
            </div>
          ) : eventos.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No hay eventos disponibles
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Actualmente no hay eventos programados
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventos.map((evento) => (
                <EventoCard key={evento.idEvento} evento={evento} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
