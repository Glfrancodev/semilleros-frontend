import { useState } from "react";
import { Proyecto } from "../../../services/proyectoService";
import Button from "../../../components/ui/button/Button";
import ImagenNoEncontrada from "../../../assets/ImagenNoEncontrada.png";

interface ProyectoCardProps {
  proyecto: Proyecto;
}

export default function ProyectoCard({ proyecto }: ProyectoCardProps) {
  const [imageError, setImageError] = useState(false);

  const imageSrc = imageError || !proyecto.urlLogo 
    ? ImagenNoEncontrada 
    : proyecto.urlLogo;

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
        >
          Read more
        </Button>
      </div>
    </div>
  );
}
