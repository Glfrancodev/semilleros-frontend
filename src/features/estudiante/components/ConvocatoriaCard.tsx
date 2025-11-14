import { useState } from "react";
import { Convocatoria } from "../../../services/convocatoriaService";
import { 
  crearProyecto, 
  crearEstudianteProyecto, 
  CrearProyectoData 
} from "../../../services/proyectoService";
import { obtenerEstudianteActual } from "../../../services/estudianteService";
import Button from "../../../components/ui/button/Button";
import InscripcionConvocatoriaModal, {
  InscripcionFormData,
} from "../../../components/modals/InscripcionConvocatoriaModal";

interface ConvocatoriaCardProps {
  convocatoria: Convocatoria;
  onInscripcionExitosa?: () => void;
}

export default function ConvocatoriaCard({
  convocatoria,
  onInscripcionExitosa,
}: ConvocatoriaCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInscripcion = async (data: InscripcionFormData) => {
    try {
      // 1. Crear el proyecto
      const proyectoData: CrearProyectoData = {
        nombre: data.nombreProyecto,
        descripcion: data.descripcionProyecto,
        idGrupoMateria: data.idGrupoMateria,
        idConvocatoria: convocatoria.idConvocatoria,
      };
      
      const proyectoCreado = await crearProyecto(proyectoData);
      
      // 2. Obtener el estudiante actual
      const estudiante = await obtenerEstudianteActual();
      
      // 3. Crear la relación EstudianteProyecto
      await crearEstudianteProyecto(
        proyectoCreado.idProyecto,
        estudiante.idEstudiante
      );
      
      // Llamar callback si existe
      if (onInscripcionExitosa) {
        onInscripcionExitosa();
      }
    } catch (error: any) {
      console.error("Error en la inscripción:", error);
      // El error se propaga al modal para que lo muestre
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        "Error al crear el proyecto"
      );
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
        {/* Título */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {convocatoria.nombre}
        </h3>

        {/* Año y Semestre */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
            {convocatoria.año} - Semestre {convocatoria.semestre}
          </span>
        </div>

        {/* Descripción */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {convocatoria.descripcion || "Sin descripción disponible"}
        </p>

        {/* Botón */}
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={() => setIsModalOpen(true)}
        >
          Inscribir
        </Button>
      </div>

      {/* Modal de Inscripción */}
      <InscripcionConvocatoriaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleInscripcion}
        convocatoriaNombre={convocatoria.nombre}
      />
    </>
  );
}
