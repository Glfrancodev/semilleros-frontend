import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ProfileHeader from "../components/ProfileHeader";
import ProfileInfo from "../components/ProfileInfo";
import ProyectosEstudiante from "../components/ProyectosEstudiante";
import { getPublicProfile, UserProfile } from "../services/profileService";

export default function PublicProfilePage() {
  const { idEstudiante } = useParams<{ idEstudiante: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [idEstudiante]);

  const loadProfile = async () => {
    if (!idEstudiante) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getPublicProfile(idEstudiante);
      setProfile(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar el perfil");
      console.error("Error al cargar perfil público:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20 lg:p-6">
        <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-400">
          Error al cargar el perfil
        </h3>
        <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900/20 lg:p-6">
        <p className="text-gray-600 dark:text-gray-400">Perfil no encontrado</p>
      </div>
    );
  }

  const fullName = `${profile.nombre} ${profile.apellido}`;

  return (
    <>
      <PageMeta
        title={`${fullName} | Sistema de Semilleros`}
        description={`Perfil público de ${fullName}`}
      />
      <PageBreadcrumb pageTitle={fullName} />
      
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Perfil de {fullName}
          </h3>
          
          <div className="space-y-6">
            <ProfileHeader profile={profile} />
            <ProfileInfo profile={profile} />
          </div>
        </div>

        {/* Proyectos del estudiante */}
        <ProyectosEstudiante idEstudiante={idEstudiante!} />
      </div>
    </>
  );
}
