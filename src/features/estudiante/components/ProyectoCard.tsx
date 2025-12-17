import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Proyecto } from "../../../services/proyectoService";
import Button from "../../../components/ui/button/Button";
import ImagenNoEncontrada from "../../../assets/ImagenNoEncontrada.png";

interface ProyectoCardProps {
  proyecto: Proyecto;
}

export default function ProyectoCard({ proyecto }: ProyectoCardProps) {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const imageSrc = imageError || !proyecto.urlLogo
    ? ImagenNoEncontrada
    : proyecto.urlLogo;

  const handleReadMore = () => {
    navigate(`/estudiante/proyectos/${proyecto.idProyecto}`);
  };

  return (
    <div className="overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      {/* Imagen del proyecto */}
      <div className="w-full h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={imageSrc}
          alt={proyecto.nombre}
          className="object-cover w-full h-full"
          onError={() => setImageError(true)}
        />
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Título */}
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {proyecto.nombre}
        </h3>

        {/* Descripción */}
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {proyecto.descripcion}
        </p>

        {/* Badges de estado */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Estado de aprobación de idea */}
          {(proyecto.estaAprobado === null || proyecto.estaAprobadoTutor === null) && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
              Idea en Pendiente
            </span>
          )}
          {(proyecto.estaAprobado === false || proyecto.estaAprobadoTutor === false) && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
              Idea Rechazada
            </span>
          )}
          {proyecto.estaAprobado === true && proyecto.estaAprobadoTutor === true && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
              Idea Aprobada
            </span>
          )}

          {/* Estado de exposición */}
          {proyecto.esFinal === true && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              Aprobado para exposición
            </span>
          )}
          {proyecto.esFinal === false && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
              Rechazado para exposición
            </span>
          )}
        </div>

        {/* Información adicional */}
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300 w-20">Materia:</span>
            <span className="text-gray-600 dark:text-gray-400">{proyecto.materia}</span>
          </div>

          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300 w-20">Grupo:</span>
            <span className="text-gray-600 dark:text-gray-400">{proyecto.grupo}</span>
          </div>

          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300 w-20">Docente:</span>
            <span className="text-gray-600 dark:text-gray-400">{proyecto.nombreDocente}</span>
          </div>
        </div>

        {/* Botón "Read more" */}
        <Button
          variant="primary"
          size="sm"
          className="w-full mt-4"
          onClick={handleReadMore}
        >
          Read more
        </Button>
      </div>
    </div>
  );
}
