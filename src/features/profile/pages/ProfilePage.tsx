import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ProfileHeader from "../components/ProfileHeader";
import ProfileInfo from "../components/ProfileInfo";
import ProfileEditModal from "../components/ProfileEditModal";
import { getProfile, UserProfile } from "../services/profileService";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar el perfil");
      console.error("Error al cargar perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleUpdateSuccess = () => {
    loadProfile(); // Recargar el perfil después de actualizar
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
        <button
          onClick={loadProfile}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <>
      <PageMeta
        title="Perfil de Usuario | Sistema de Semilleros"
        description="Visualiza y edita tu información de perfil"
      />
      <PageBreadcrumb pageTitle="Perfil" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Mi Perfil
        </h3>
        
        <div className="space-y-6">
          <ProfileHeader profile={profile} />
          <ProfileInfo profile={profile} onEdit={handleEdit} />
        </div>
      </div>

      {/* Modal de edición */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        profile={profile}
        onSuccess={handleUpdateSuccess}
      />
    </>
  );
}
