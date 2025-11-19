import { useState } from "react";
import { Tarea } from "../../../services/tareaService";
import { 
  crearProyecto, 
  crearEstudianteProyecto, 
  CrearProyectoData 
} from "../../../services/proyectoService";
import { crearRevision } from "../../../services/revisionService";
import { obtenerEstudianteActual } from "../../../services/estudianteService";
import Button from "../../../components/ui/button/Button";
import InscripcionConvocatoriaModal, {
  InscripcionFormData,
} from "../../../components/modals/InscripcionConvocatoriaModal";

interface ConvocatoriaCardProps {
  tarea: Tarea;
  onInscripcionExitosa?: () => void;
}

export default function ConvocatoriaCard({
  tarea,
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
      };
      
      const proyectoCreado = await crearProyecto(proyectoData);
      
      // 2. Obtener el estudiante actual
      const estudiante = await obtenerEstudianteActual();
      
      // 3. Crear la relación EstudianteProyecto con esLider e invitacion en true
      await crearEstudianteProyecto(
        proyectoCreado.idProyecto,
        estudiante.idEstudiante,
        true,  // esLider: el creador del proyecto es el líder
        true   // invitacion: autoacepta la invitación ya que él creó el proyecto
      );
      
      // 4. Crear la revisión a la tarea de orden 0 (inscripción)
      await crearRevision({
        idProyecto: proyectoCreado.idProyecto,
        idTarea: tarea.idTarea,
      });
      
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
        {/* Nombre de la Feria */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {tarea.feria?.nombre || "Feria sin nombre"}
        </h3>

        {/* Año y Semestre de la Feria */}
        {tarea.feria && (
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
              {tarea.feria.año} - Semestre {tarea.feria.semestre}
            </span>
          </div>
        )}

        {/* Descripción de la Tarea */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            {tarea.nombre}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {tarea.descripcion || "Sin descripción"}
          </p>
        </div>

        {/* Fecha límite */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Fecha límite: {new Date(tarea.fechaLimite).toLocaleDateString()}
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
        convocatoriaNombre={tarea.feria?.nombre || "Feria"}
      />
    </>
  );
}
