import { useEffect, useState, useRef } from "react";
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

  const carouselPublicosRef = useRef<HTMLDivElement>(null);
  const carouselGanadoresRef = useRef<HTMLDivElement>(null);

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
    navigate(`/estudiante/proyectos/${idProyecto}`);
  };

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left'
        ? ref.current.scrollLeft - scrollAmount
        : ref.current.scrollLeft + scrollAmount;

      ref.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const ProjectCard = ({ proyecto, isWinner = false }: { proyecto: any; isWinner?: boolean }) => (
    <div
      className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative"
      onClick={() => handleVerProyecto(proyecto.idProyecto)}
    >
      {/* Badge de ganador */}
      {isWinner && proyecto.puesto && (
        <div className="absolute top-4 right-4 z-10 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
          <span>🏆</span>
          <span>{proyecto.puesto}° Lugar</span>
        </div>
      )}

      {proyecto.urlLogo ? (
        <img
          src={proyecto.urlLogo}
          alt={proyecto.nombre}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className={`w-full h-48 ${isWinner ? 'bg-gradient-to-br from-yellow-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'} flex items-center justify-center`}>
          <span className="text-6xl text-white opacity-50">{isWinner ? '🏆' : '📊'}</span>
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
          {isWinner && proyecto.feriaGanadora && (
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-medium">
              <span>🎖️</span>
              <span className="line-clamp-1">{proyecto.feriaGanadora}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span>📚</span>
            <span className="line-clamp-1">{proyecto.materia}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span>{proyecto.grupo}</span>
          </div>
        </div>
      </div>
    </div>
  );

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
          {!loadingPublicos && proyectosPublicos.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel(carouselPublicosRef, 'left')}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scrollCarousel(carouselPublicosRef, 'right')}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
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
            <div
              ref={carouselPublicosRef}
              className="overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-6" style={{ width: 'max-content' }}>
                {proyectosPublicos.map((proyecto) => (
                  <ProjectCard key={proyecto.idProyecto} proyecto={proyecto} />
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
          {!loadingGanadores && proyectosGanadores.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel(carouselGanadoresRef, 'left')}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scrollCarousel(carouselGanadoresRef, 'right')}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
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
            <div
              ref={carouselGanadoresRef}
              className="overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-6" style={{ width: 'max-content' }}>
                {proyectosGanadores.map((proyecto: any) => (
                  <ProjectCard key={proyecto.idProyecto} proyecto={proyecto} isWinner />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
