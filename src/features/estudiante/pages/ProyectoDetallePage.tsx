import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerProyectoPorId, ProyectoDetalle } from "../../../services/proyectoService";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ProyectoInfoCard from "../components/ProyectoInfoCard";
import ProyectoBrandingCard from "../components/ProyectoBrandingCard";
import ProyectoIntegrantesCard from "../components/ProyectoIntegrantesCard";
import ProyectoTareasCard from "../components/ProyectoTareasCard";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../constants/roles";
import api from "../../../services/api";

export default function ProyectoDetallePage() {
  const { idProyecto } = useParams<{ idProyecto: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [proyecto, setProyecto] = useState<ProyectoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [puedeVer, setPuedeVer] = useState(false);

  useEffect(() => {
    if (!idProyecto) {
      setError("Proyecto no encontrado");
      setLoading(false);
      return;
    }

    cargarProyecto();
  }, [idProyecto, user?.idUsuario, user?.rol]);

  const cargarProyecto = async () => {
    if (!idProyecto) return;

    try {
      setLoading(true);
      setError(null);
      const data = await obtenerProyectoPorId(idProyecto);
      setProyecto(data);
      const acceso = await determinarAcceso(data);
      setPuedeVer(acceso);
      if (!acceso) {
        setLoading(false);
        return;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar el proyecto");
      console.error("Error al cargar proyecto:", err);
      setPuedeVer(false);
    } finally {
      setLoading(false);
    }
  };

  const determinarAcceso = async (detalle: ProyectoDetalle): Promise<boolean> => {
    if (!idProyecto) return false;

    if (user?.rol === ROLES.ADMIN) {
      return true;
    }

    if (user?.idUsuario) {
      const esIntegrante = await esUsuarioIntegrante();
      if (esIntegrante) return true;
      if (detalle.esPublico) return true;
      setError("Este proyecto es privado. Solo sus integrantes pueden verlo.");
      return false;
    }

    if (detalle.esPublico) {
      return true;
    }

    setError("Este proyecto es privado. Debes iniciar sesión y formar parte del proyecto para verlo.");
    return false;
  };

  const esUsuarioIntegrante = async (): Promise<boolean> => {
    if (!user?.idUsuario) return false;
    try {
      const response = await api.get(`/proyectos/${idProyecto}/integrantes`);
      const items = response.data?.data?.items || [];
      return items.some((integrante: any) => integrante.idUsuario && integrante.idUsuario === user.idUsuario);
    } catch (err) {
      console.error("Error al verificar integrantes:", err);
      return false;
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

  if (error && !puedeVer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md space-y-4">
          <p className="text-red-600 dark:text-red-400">
            {error}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!proyecto || !puedeVer) {
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
        <ProyectoInfoCard proyecto={proyecto} onUpdate={cargarProyecto} estadoFeria={proyecto.estadoFeria} />

        {/* Card de Branding */}
        <ProyectoBrandingCard proyecto={proyecto} onUpdate={cargarProyecto} estadoFeria={proyecto.estadoFeria} />

        {/* Card de Integrantes */}
        <ProyectoIntegrantesCard proyecto={proyecto} estadoFeria={proyecto.estadoFeria} />

        {/* Card de Tareas */}
        <ProyectoTareasCard idProyecto={proyecto.idProyecto} proyecto={proyecto} estadoFeria={proyecto.estadoFeria} />
      </div>
    </>
  );
}
