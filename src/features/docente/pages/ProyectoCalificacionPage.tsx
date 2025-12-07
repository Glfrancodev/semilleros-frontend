import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerProyectoPorId, ProyectoDetalle } from "../../../services/proyectoService";
import { obtenerMisProyectosComoJurado} from "../../../services/docenteProyectoService";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ProyectoInfoCard from "../../estudiante/components/ProyectoInfoCard";
import ProyectoBrandingCard from "../../estudiante/components/ProyectoBrandingCard";
import ProyectoIntegrantesCard from "../../estudiante/components/ProyectoIntegrantesCard";
import ProyectoTareasCard from "../../estudiante/components/ProyectoTareasCard";
import ProyectoCalificacionCard from "../components/ProyectoCalificacionCard";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../constants/roles";

export default function ProyectoCalificacionPage() {
  const { idProyecto } = useParams<{ idProyecto: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [proyecto, setProyecto] = useState<ProyectoDetalle | null>(null);
  const [idDocenteProyecto, setIdDocenteProyecto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar que sea docente
    if (user?.rol !== ROLES.DOCENTE) {
      setError("No tienes permisos para acceder a esta página");
      setLoading(false);
      return;
    }

    if (!idProyecto) {
      setError("Proyecto no encontrado");
      setLoading(false);
      return;
    }

    cargarProyecto();
  }, [idProyecto, user?.rol]);

  const cargarProyecto = async () => {
    if (!idProyecto) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔍 Cargando proyecto:", idProyecto);
      
      // Obtener los proyectos donde soy jurado
      const proyectosJurado = await obtenerMisProyectosComoJurado();
      console.log("📋 Proyectos como jurado:", proyectosJurado);
      
      const proyectoJurado = proyectosJurado.find(p => p.idProyecto === idProyecto);
      console.log("🎯 Proyecto encontrado:", proyectoJurado);
      
      if (!proyectoJurado) {
        setError("No tienes permisos para calificar este proyecto");
        setLoading(false);
        return;
      }
      
      console.log("✅ idDocenteProyecto:", proyectoJurado.idDocenteProyecto);
      setIdDocenteProyecto(proyectoJurado.idDocenteProyecto);
      
      // Obtener el detalle del proyecto
      const data = await obtenerProyectoPorId(idProyecto);
      setProyecto(data);
    } catch (err: any) {
      console.error("❌ Error al cargar proyecto:", err);
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md space-y-4">
          <p className="text-red-600 dark:text-red-400">
            {error}
          </p>
          <button
            onClick={() => navigate("/calificar-proyectos")}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!proyecto || !idDocenteProyecto) {
    return null;
  }

  return (
    <>
      <PageMeta
        title={`Calificar: ${proyecto.nombre} | Sistema de Semilleros`}
        description={`Calificación del proyecto ${proyecto.nombre}`}
      />
      <PageBreadcrumb 
        pageTitle={`Calificar: ${proyecto.nombre}`}
      />
      
      <div className="space-y-6">
        {/* Card de información del proyecto */}
        <ProyectoInfoCard proyecto={proyecto} onUpdate={cargarProyecto} />

        {/* Sección de Calificación */}
        <ProyectoCalificacionCard idDocenteProyecto={idDocenteProyecto} />
        
        {/* Card de Branding - Solo lectura */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 opacity-75">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Branding del Proyecto
            </h3>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              Solo lectura
            </span>
          </div>
          <ProyectoBrandingCard proyecto={proyecto} onUpdate={cargarProyecto} />
        </div>
        
        {/* Card de Integrantes */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 opacity-75">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Integrantes del Proyecto
            </h3>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              Solo lectura
            </span>
          </div>
          <ProyectoIntegrantesCard proyecto={proyecto} />
        </div>
        
        {/* Card de Tareas - Solo lectura */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 opacity-75">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Tareas del Proyecto
            </h3>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              Solo lectura
            </span>
          </div>
          <ProyectoTareasCard idProyecto={proyecto.idProyecto} proyecto={proyecto} />
        </div>
      </div>
    </>
  );
}
