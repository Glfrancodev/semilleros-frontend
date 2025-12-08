import { useState, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ProyectosTableWithFilters from "../../../components/tables/ProyectosTableWithFilters";
import Button from "../../../components/ui/button/Button";
import { finalizarFeria, obtenerFeriaActiva } from "../../../services/feriaService";
import toast from "react-hot-toast";
import ConfirmModal from "../../../components/modals/ConfirmModal";

export default function ProyectoPage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feriaActivaId, setFeriaActivaId] = useState<string | null>(null);

  useEffect(() => {
    cargarFeriaActiva();
  }, []);

  const cargarFeriaActiva = async () => {
    try {
      const feria = await obtenerFeriaActiva();
      if (feria) {
        setFeriaActivaId(feria.idFeria);
      }
    } catch (error) {
      console.error("Error al cargar feria activa:", error);
    }
  };

  const handleFinalizarFeria = async () => {
    if (!feriaActivaId) {
      toast.error("No hay una feria activa para finalizar");
      return;
    }

    try {
      setIsLoading(true);
      const response = await finalizarFeria(feriaActivaId);
      toast.success(response.message || "Feria finalizada exitosamente");
      setShowConfirmModal(false);
      // Recargar página después de 1 segundo
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error("Error al finalizar feria:", error);
      toast.error(error.response?.data?.message || "Error al finalizar la feria");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Tareas y Revisiones | Semilleros"
        description="Resumen de tareas de la feria activa"
      />
      <PageBreadcrumb pageTitle="Tareas y Revisiones" />

      <div className="space-y-4">
        {feriaActivaId && (
          <Button 
            variant="danger" 
            size="md"
            onClick={() => setShowConfirmModal(true)}
            className="w-full"
          >
            Finalizar Feria
          </Button>
        )}
        
        <ProyectosTableWithFilters />
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleFinalizarFeria}
        title="Finalizar Feria"
        message="¿Estás seguro de que deseas finalizar la feria activa? Esta acción calculará los ganadores y cambiará el estado de la feria a 'Finalizado'. Esta acción no se puede deshacer."
        confirmText="Sí, finalizar"
        cancelText="Cancelar"
        isLoading={isLoading}
      />
    </>
  );
}
