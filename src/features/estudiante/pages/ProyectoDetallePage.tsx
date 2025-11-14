import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerProyectoPorId, ProyectoDetalle } from "../../../services/proyectoService";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ProyectoInfoCard from "../components/ProyectoInfoCard";
import ProyectoBrandingCard from "../components/ProyectoBrandingCard";
import ProyectoIntegrantesCard from "../components/ProyectoIntegrantesCard";
import ProyectoTareasCard from "../components/ProyectoTareasCard";

export default function ProyectoDetallePage() {
  const { idProyecto } = useParams<{ idProyecto: string }>();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState<ProyectoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idProyecto) {
      navigate("/estudiante/proyectos/mis-proyectos");
      return;
    }
    
    cargarProyecto();
  }, [idProyecto, navigate]);

  const cargarProyecto = async () => {
    if (!idProyecto) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerProyectoPorId(idProyecto);
      setProyecto(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar el proyecto");
      console.error("Error al cargar proyecto:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20 lg:p-6">
        <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-400">
          Error al cargar el proyecto
        </h3>
        <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
        <button
          onClick={cargarProyecto}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!proyecto) {
    return null;
  }

  return (
    <>
      <PageMeta
        title={`${proyecto.nombre} | Sistema de Semilleros`}
        description={`Detalles del proyecto ${proyecto.nombre}`}
      />
      <PageBreadcrumb 
        pageTitle={proyecto.nombre}
      />
      
      <div className="space-y-6">
        {/* Card de información del proyecto */}
        <ProyectoInfoCard proyecto={proyecto} />
        
        {/* Card de Branding */}
        <ProyectoBrandingCard proyecto={proyecto} onUpdate={cargarProyecto} />
        
        {/* Card de Integrantes */}
        <ProyectoIntegrantesCard proyecto={proyecto} />
        
        {/* Card de Tareas */}
        <ProyectoTareasCard idProyecto={proyecto.idProyecto} />
      </div>
    </>
  );
}
