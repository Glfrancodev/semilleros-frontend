import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import Button from "../../../components/ui/button/Button";
import ImagenNoEncontrada from "../../../assets/ImagenNoEncontrada.png";

interface ProyectoEstudiante {
  idProyecto: string;
  nombre: string;
  descripcion: string;
  urlLogo: string | null;
  area: string | null;
  categoria: string | null;
  promedio: string | null;
  lugarGanador: number | null;
  nombreFeria: string | null;
  esLider: boolean;
}

interface ProyectosEstudianteProps {
  idEstudiante: string;
}

export default function ProyectosEstudiante({ idEstudiante }: ProyectosEstudianteProps) {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState<ProyectoEstudiante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProyectos();
  }, [idEstudiante]);

  const cargarProyectos = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/estudiantes/${idEstudiante}/proyectos`);
      setProyectos(response.data.data.items || []);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
      setProyectos([]);
    } finally {
      setLoading(false);
    }
  };

  const getMedalInfo = (lugar: number) => {
    switch (lugar) {
      case 1:
        return { emoji: "🥇", text: "Primer Lugar", color: "text-yellow-600 dark:text-yellow-400" };
      case 2:
        return { emoji: "🥈", text: "Segundo Lugar", color: "text-gray-600 dark:text-gray-400" };
      case 3:
        return { emoji: "🥉", text: "Tercer Lugar", color: "text-orange-600 dark:text-orange-400" };
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Proyectos de Feria</h2>
        </div>
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando proyectos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (proyectos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Proyectos de Feria</h2>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📄</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay proyectos registrados
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aún no ha participado en proyectos de feria
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Proyectos de Feria</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((proyecto) => {
            const medal = proyecto.lugarGanador ? getMedalInfo(proyecto.lugarGanador) : null;
            
            return (
              <div
                key={proyecto.idProyecto}
                className="overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                {/* Imagen del proyecto */}
                <div className="relative w-full h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img
                    src={proyecto.urlLogo || ImagenNoEncontrada}
                    alt={proyecto.nombre}
                    className="object-cover w-full h-full"
                  />
                  
                  {/* Medalla en esquina superior derecha */}
                  {medal && (
                    <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full px-3 py-1.5 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-1.5">
                      <span className="text-xl">{medal.emoji}</span>
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-5">
                  {/* Título */}
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {proyecto.nombre}
                  </h3>

                  {/* Badge de lugar ganador */}
                  {medal && proyecto.nombreFeria && (
                    <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                      <span className={`text-xs font-semibold ${medal.color}`}>
                        {medal.text}
                      </span>
                    </div>
                  )}

                  {/* Descripción */}
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {proyecto.descripcion || "Sin descripción"}
                  </p>

                  {/* Información adicional */}
                  <div className="space-y-2 mb-4">
                    {proyecto.nombreFeria && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300 w-16">Feria:</span>
                        <span className="text-gray-600 dark:text-gray-400 line-clamp-1">{proyecto.nombreFeria}</span>
                      </div>
                    )}

                    {proyecto.area && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300 w-16">Área:</span>
                        <span className="text-gray-600 dark:text-gray-400">{proyecto.area}</span>
                      </div>
                    )}

                    {proyecto.categoria && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300 w-16">Categoría:</span>
                        <span className="text-gray-600 dark:text-gray-400">{proyecto.categoria}</span>
                      </div>
                    )}

                    {proyecto.promedio && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300 w-16">Nota:</span>
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          {proyecto.promedio}/100
                        </span>
                      </div>
                    )}

                    {proyecto.esLider && (
                      <div className="flex items-center text-sm">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-medium">
                          <span>👑</span>
                          <span>Líder del proyecto</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Botón "Ver Detalle" */}
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(`/estudiante/proyectos/${proyecto.idProyecto}`)}
                  >
                    Ver Detalle
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
