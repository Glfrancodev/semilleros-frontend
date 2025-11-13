import { useState, useEffect, useCallback, useRef } from "react";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { UserProfile, updateProfile, uploadProfilePhoto } from "../services/profileService";
import { useAuth } from "../../../context/AuthContext";
import UserAvatar from "../../../components/common/UserAvatar";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSuccess: () => void;
}

export default function ProfileEditModal({
  isOpen,
  onClose,
  profile,
  onSuccess,
}: ProfileEditModalProps) {
  const { user, updateToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    bio: profile.bio || "",
    instagram: profile.instagram || "",
    linkedin: profile.linkedin || "",
    github: profile.github || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    instagram?: string;
    linkedin?: string;
    github?: string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        bio: profile.bio || "",
        instagram: profile.instagram || "",
        linkedin: profile.linkedin || "",
        github: profile.github || "",
      });
      setError(null);
      setValidationErrors({});
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [isOpen, profile]);

  const validateSocialMedia = useCallback((name: string, value: string): string | null => {
    if (!value) return null; // Empty is valid
    
    const patterns: Record<string, RegExp> = {
      instagram: /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/[a-zA-Z0-9._-]+\/?$/,
      linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+\/?$/,
      github: /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/,
    };

    const pattern = patterns[name];
    if (pattern && !pattern.test(value)) {
      const messages: Record<string, string> = {
        instagram: "URL de Instagram inválida. Ejemplo: https://instagram.com/usuario",
        linkedin: "URL de LinkedIn inválida. Ejemplo: https://linkedin.com/in/usuario",
        github: "URL de GitHub inválida. Ejemplo: https://github.com/usuario",
      };
      return messages[name];
    }
    return null;
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validar redes sociales en tiempo real
    if (name === "instagram" || name === "linkedin" || name === "github") {
      const validationError = validateSocialMedia(name, value);
      setValidationErrors((prev) => ({
        ...prev,
        [name]: validationError || undefined,
      }));
    }
  }, [validateSocialMedia]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten archivos de imagen');
        return;
      }
      
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe superar los 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  }, []);

  const handleUploadPhoto = async () => {
    if (!selectedFile) return;
    
    setUploadingPhoto(true);
    setError(null);
    
    try {
      const { token } = await uploadProfilePhoto(selectedFile);
      
      // Actualizar token en el contexto (esto actualizará el avatar automáticamente)
      updateToken(token);
      
      // Limpiar preview
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Notificar éxito
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al subir la foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validar todas las redes sociales antes de enviar
    const errors: typeof validationErrors = {};
    if (formData.instagram) {
      const instagramError = validateSocialMedia("instagram", formData.instagram);
      if (instagramError) errors.instagram = instagramError;
    }
    if (formData.linkedin) {
      const linkedinError = validateSocialMedia("linkedin", formData.linkedin);
      if (linkedinError) errors.linkedin = linkedinError;
    }
    if (formData.github) {
      const githubError = validateSocialMedia("github", formData.github);
      if (githubError) errors.github = githubError;
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      await updateProfile(profile.idUsuario, formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-[1000000] w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Editar Biografía y Redes Sociales
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Actualiza tu biografía y enlaces a redes sociales
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="p-6">
            {/* Error del servidor */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="flex-shrink-0 rounded-lg p-1 text-red-600 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
            {/* Foto de Perfil */}
            <div className="mb-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
                Foto de Perfil
              </h5>
              
              <div className="flex items-center gap-6">
                {/* Avatar Preview */}
                <div>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-24 w-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <UserAvatar
                      fotoPerfil={user?.fotoPerfil}
                      iniciales={user?.iniciales}
                      nombre={`${profile.nombre} ${profile.apellido}`}
                      size="xl"
                    />
                  )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {!selectedFile ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Seleccionar foto
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleUploadPhoto}
                        disabled={uploadingPhoto}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        {uploadingPhoto ? "Subiendo..." : "Subir foto"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG o GIF (máx. 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Información Personal */}
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Información Personal
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Nombre</Label>
                  <Input
                    type="text"
                    name="nombre"
                    value={profile.nombre}
                    disabled
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Apellido</Label>
                  <Input
                    type="text"
                    name="apellido"
                    value={profile.apellido}
                    disabled
                  />
                </div>

                <div className="col-span-2">
                  <Label>Correo Electrónico</Label>
                  <Input
                    type="email"
                    name="correo"
                    value={profile.correo}
                    disabled
                  />
                </div>

                <div className="col-span-2">
                  <Label>Biografía</Label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Redes Sociales
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                <div>
                  <Label>Instagram</Label>
                  <Input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/usuario"
                  />
                  {validationErrors.instagram && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {validationErrors.instagram}
                    </p>
                  )}
                </div>

                <div>
                  <Label>LinkedIn</Label>
                  <Input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/usuario"
                  />
                  {validationErrors.linkedin && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {validationErrors.linkedin}
                    </p>
                  )}
                </div>

                <div>
                  <Label>GitHub</Label>
                  <Input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/usuario"
                  />
                  {validationErrors.github && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {validationErrors.github}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="border-t border-gray-200 p-6 dark:border-gray-700">
            <div className="flex gap-3 sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
