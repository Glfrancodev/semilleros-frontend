import { useEffect, useState } from "react";
import { obtenerMisProyectos, Proyecto } from "../../../services/proyectoService";
import ProyectoCard from "../components/ProyectoCard";
import Button from "../../../components/ui/button/Button";

export default function MisProyectosPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarProyectos();
  }, []);

  const cargarProyectos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerMisProyectos();
      setProyectos(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar los proyectos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Error al cargar proyectos
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <Button 
            onClick={cargarProyectos}
            variant="primary"
            size="sm"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mis Proyectos
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gestiona y trabaja en tus proyectos de investigación
        </p>
      </div>

      {/* Contenedor principal */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Proyectos
          </h2>
        </div>

        <div className="p-6">
          {/* Lista de proyectos */}
          {proyectos.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📁</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No tienes proyectos
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aún no estás participando en ningún proyecto de investigación
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proyectos.map((proyecto) => (
                <ProyectoCard key={proyecto.idProyecto} proyecto={proyecto} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
