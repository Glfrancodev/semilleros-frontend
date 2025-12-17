import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerProyectosPublicosActuales,
  obtenerProyectosGanadores,
  Proyecto,
} from "../../../services/proyectoService";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GuiasDescubrirPage() {
  const [proyectosPublicos, setProyectosPublicos] = useState<Proyecto[]>([]);
  const [proyectosGanadores, setProyectosGanadores] = useState<Proyecto[]>([]);
  const [loadingPublicos, setLoadingPublicos] = useState(true);
  const [loadingGanadores, setLoadingGanadores] = useState(true);
  const [currentIndexPublicos, setCurrentIndexPublicos] = useState(0);
  const [currentIndexGanadores, setCurrentIndexGanadores] = useState(0);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 3;

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

  const nextSlide = (type: 'publicos' | 'ganadores') => {
    if (type === 'publicos') {
      setCurrentIndexPublicos((prev) =>
        prev + ITEMS_PER_PAGE >= proyectosPublicos.length ? 0 : prev + ITEMS_PER_PAGE
      );
    } else {
      setCurrentIndexGanadores((prev) =>
        prev + ITEMS_PER_PAGE >= proyectosGanadores.length ? 0 : prev + ITEMS_PER_PAGE
      );
    }
  };

  const prevSlide = (type: 'publicos' | 'ganadores') => {
    if (type === 'publicos') {
      setCurrentIndexPublicos((prev) =>
        prev === 0 ? Math.max(0, proyectosPublicos.length - ITEMS_PER_PAGE) : prev - ITEMS_PER_PAGE
      );
    } else {
      setCurrentIndexGanadores((prev) =>
        prev === 0 ? Math.max(0, proyectosGanadores.length - ITEMS_PER_PAGE) : prev - ITEMS_PER_PAGE
      );
    }
  };

  const ProjectCard = ({ proyecto, isWinner = false }: { proyecto: any; isWinner?: boolean }) => (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative h-full"
      onClick={() => handleVerProyecto(proyecto.idProyecto)}
    >
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
          {proyecto.nombre}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 min-h-[4.5rem]">
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

  const Carousel = ({
    items,
    currentIndex,
    onNext,
    onPrev,
    isWinner = false
  }: {
    items: any[];
    currentIndex: number;
    onNext: () => void;
    onPrev: () => void;
    isWinner?: boolean;
  }) => {
    const visibleItems = items.slice(currentIndex, currentIndex + ITEMS_PER_PAGE);
    const hasNext = currentIndex + ITEMS_PER_PAGE < items.length;
    const hasPrev = currentIndex > 0;

    return (
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleItems.map((item) => (
            <ProjectCard key={item.idProyecto} proyecto={item} isWinner={isWinner} />
          ))}
        </div>

        {items.length > ITEMS_PER_PAGE && (
          <>
            {hasPrev && (
              <button
                onClick={onPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-3 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-lg z-10"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={onNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-3 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-lg z-10"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </>
        )}

        {items.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(items.length / ITEMS_PER_PAGE) }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (isWinner) {
                    setCurrentIndexGanadores(index * ITEMS_PER_PAGE);
                  } else {
                    setCurrentIndexPublicos(index * ITEMS_PER_PAGE);
                  }
                }}
                className={`w-2 h-2 rounded-full transition ${Math.floor(currentIndex / ITEMS_PER_PAGE) === index
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                aria-label={`Ir a página ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
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
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Proyectos Actuales
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Proyectos públicos de la feria actual
          </p>
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
          <Carousel
            items={proyectosPublicos}
            currentIndex={currentIndexPublicos}
            onNext={() => nextSlide('publicos')}
            onPrev={() => prevSlide('publicos')}
          />
        )}
      </div>

      {/* Proyectos Ganadores */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Proyectos Ganadores
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Proyectos destacados de ferias anteriores
          </p>
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
          <Carousel
            items={proyectosGanadores}
            currentIndex={currentIndexGanadores}
            onNext={() => nextSlide('ganadores')}
            onPrev={() => prevSlide('ganadores')}
            isWinner
          />
        )}
      </div>
    </div>
  );
}
