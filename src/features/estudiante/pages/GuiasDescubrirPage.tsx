import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerProyectosPublicosActuales,
  obtenerProyectosGanadores,
  Proyecto,
} from "../../../services/proyectoService";

export default function GuiasDescubrirPage() {
  const [proyectosPublicos, setProyectosPublicos] = useState<Proyecto[]>([]);
  const [proyectosGanadores, setProyectosGanadores] = useState<Proyecto[]>([]);
  const [loadingPublicos, setLoadingPublicos] = useState(true);
  const [loadingGanadores, setLoadingGanadores] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    void cargarProyectos();
  }, []);

  const cargarProyectos = async () => {
    await Promise.all([cargarProyectosPublicos(), cargarProyectosGanadores()]);
  };

  const cargarProyectosPublicos = async () => {
    try {
      setLoadingPublicos(true);
      const data = await obtenerProyectosPublicosActuales();
      setProyectosPublicos(data);
    } catch (err) {
      console.error("Error al cargar proyectos públicos:", err);
    } finally {
      setLoadingPublicos(false);
    }
  };

  const cargarProyectosGanadores = async () => {
    try {
      setLoadingGanadores(true);
      const data = await obtenerProyectosGanadores();
      setProyectosGanadores(data);
    } catch (err) {
      console.error("Error al cargar proyectos ganadores:", err);
    } finally {
      setLoadingGanadores(false);
    }
  };

  const handleVerProyecto = (idProyecto: string) => {
    navigate(`/estudiante/proyecto/${idProyecto}`);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Descubrir Proyectos
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Explora proyectos públicos y ganadores de ferias anteriores
        </p>
      </div>

      {/* Proyectos Públicos Actuales */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Proyectos Actuales
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Proyectos públicos de la feria actual
            </p>
          </div>
        </div>

        {loadingPublicos ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : proyectosPublicos.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay proyectos públicos disponibles
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aún no hay proyectos públicos en la feria actual
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6" style={{ minWidth: "min-content" }}>
                {proyectosPublicos.map((proyecto) => (
                  <div
                    key={proyecto.idProyecto}
                    className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleVerProyecto(proyecto.idProyecto)}
                  >
                    {proyecto.urlLogo ? (
                      <img
                        src={proyecto.urlLogo}
                        alt={proyecto.nombre}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-6xl text-white opacity-50">📊</span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {proyecto.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {proyecto.descripcion || "Sin descripción"}
                      </p>
                      <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <span>📚</span>
                          <span>{proyecto.materia}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>👥</span>
                          <span>{proyecto.grupo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Proyectos Ganadores */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Proyectos Ganadores
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Proyectos destacados de ferias anteriores
            </p>
          </div>
        </div>

        {loadingGanadores ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : proyectosGanadores.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏆</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay proyectos ganadores disponibles
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aún no hay proyectos ganadores registrados
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6" style={{ minWidth: "min-content" }}>
                {proyectosGanadores.map((proyecto: any) => (
                  <div
                    key={proyecto.idProyecto}
                    className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative"
                    onClick={() => handleVerProyecto(proyecto.idProyecto)}
                  >
                    {/* Badge de ganador */}
                    <div className="absolute top-4 right-4 z-10 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <span>🏆</span>
                      {proyecto.puesto && <span>{proyecto.puesto}° Lugar</span>}
                    </div>

                    {proyecto.urlLogo ? (
                      <img
                        src={proyecto.urlLogo}
                        alt={proyecto.nombre}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                        <span className="text-6xl text-white opacity-50">🏆</span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {proyecto.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {proyecto.descripcion || "Sin descripción"}
                      </p>
                      <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400">
                        {proyecto.feriaGanadora && (
                          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-medium">
                            <span>🎖️</span>
                            <span>{proyecto.feriaGanadora}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span>📚</span>
                          <span>{proyecto.materia}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>👥</span>
                          <span>{proyecto.grupo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
