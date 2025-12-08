import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Button from "../../../components/ui/button/Button";
import ProyectosFinalesTable from "../../../components/tables/ProyectosFinalesTable";
import { obtenerFeriaPorId, Feria } from "../../../services/feriaService";
import Badge from "../../../components/ui/badge/Badge";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../constants/roles";

export default function FeriaDetallePage() {
  const { idFeria } = useParams<{ idFeria: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [feria, setFeria] = useState<Feria | null>(null);
  
  const isAdmin = user?.rol === ROLES.ADMIN;

  useEffect(() => {
    cargarDetalleFeria();
  }, [idFeria]);

  const cargarDetalleFeria = async () => {
    if (!idFeria) return;
    
    try {
      setLoading(true);
      const data = await obtenerFeriaPorId(idFeria);
      setFeria(data);
    } catch (error) {
      console.error("Error al cargar feria:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageMeta
          title="Detalle de Feria | Semilleros"
          description="Información detallada de la feria"
        />
        <PageBreadcrumb pageTitle="Detalle de Feria" />
        <div className="flex justify-center items-center py-20">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!feria) {
    return (
      <>
        <PageMeta
          title="Detalle de Feria | Semilleros"
          description="Información detallada de la feria"
        />
        <PageBreadcrumb pageTitle="Detalle de Feria" />
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-white/[0.05] dark:bg-white/[0.03]">
          <p className="text-gray-600 dark:text-gray-400">Feria no encontrada</p>
          {isAdmin && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/ferias")}
              className="mt-4"
            >
              ← Volver a Ferias
            </Button>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`${feria.nombre} | Semilleros`}
        description="Información detallada de la feria"
      />
      <PageBreadcrumb pageTitle={feria.nombre} />

      <div className="space-y-4">
        {/* Header con información de la feria */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {feria.nombre}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="light" color="primary" size="sm">
                  Semestre {feria.semestre}
                </Badge>
                <Badge variant="light" color="primary" size="sm">
                  Año {feria.año}
                </Badge>
                <Badge 
                  variant="light" 
                  color={feria.estado === 'Activo' ? 'success' : feria.estado === 'Finalizado' ? 'light' : 'warning'} 
                  size="sm"
                >
                  {feria.estado}
                </Badge>
              </div>
            </div>
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/ferias")}
              >
                ← Volver a Ferias
              </Button>
            )}
          </div>

          {/* Botón Ver Ganadores - Solo si la feria está finalizada y tiene ganadores */}
          {feria.estado === 'Finalizado' && feria.ganadores && (
            <Button 
              variant="primary" 
              size="md"
              onClick={() => navigate(`/ferias/${feria.idFeria}/ganadores`)}
              className="w-full"
            >
              🏆 Ver Ganadores
            </Button>
          )}
        </div>

        {/* Tabla de proyectos finales */}
        {idFeria && <ProyectosFinalesTable idFeria={idFeria} />}
      </div>
    </>
  );
}
