import { useState, useEffect } from "react";

interface PerfilFormData {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  bio: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}

interface PerfilModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PerfilFormData) => Promise<void>;
  initialData?: Partial<PerfilFormData>;
}

export default function PerfilModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: PerfilModalProps) {
  const [formData, setFormData] = useState<PerfilFormData>({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    bio: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<PerfilFormData>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name as keyof PerfilFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    // Limpiar error del servidor
    if (serverError) {
      setServerError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PerfilFormData> = {};

    if (!formData.nombre.trim()) newErrors.nombre = "Nombre es requerido";
    if (!formData.apellido.trim()) newErrors.apellido = "Apellido es requerido";
    if (!formData.correo.trim()) newErrors.correo = "Correo es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.correo))
      newErrors.correo = "Correo inválido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setServerError(null);
    try {
      await onSubmit(formData);
      onClose();
      setServerError(null);
    } catch (error: any) {
      console.error("Error al guardar perfil:", error);
      const errorMessage =
        error?.message ||
        "Error al guardar perfil. Por favor, intente nuevamente.";
      setServerError(errorMessage);
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
            {serverError && (
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
                    {serverError}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setServerError(null)}
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

            {/* Información Personal */}
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Información Personal
              </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Nombre */}
              <div>
                <label
                  htmlFor="nombre"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    errors.nombre
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  }`}
                  placeholder="Ingrese su nombre"
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>
                )}
              </div>

              {/* Apellido */}
              <div>
                <label
                  htmlFor="apellido"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    errors.apellido
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  }`}
                  placeholder="Ingrese su apellido"
                />
                {errors.apellido && (
                  <p className="mt-1 text-sm text-red-500">{errors.apellido}</p>
                )}
              </div>

              {/* Correo */}
              <div>
                <label
                  htmlFor="correo"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    errors.correo
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  }`}
                  placeholder="correo@ejemplo.com"
                />
                {errors.correo && (
                  <p className="mt-1 text-sm text-red-500">{errors.correo}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label
                  htmlFor="telefono"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Teléfono
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="+591 XXXXXXXX"
                />
              </div>

              {/* Bio */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Biografía
                </label>
                <input
                  type="text"
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Estudiante de Ingeniería"
                />
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              Redes Sociales
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Facebook */}
              <div>
                <label
                  htmlFor="facebook"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Facebook
                </label>
                <input
                  type="text"
                  id="facebook"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="https://www.facebook.com/..."
                />
              </div>

              {/* Twitter/X */}
              <div>
                <label
                  htmlFor="twitter"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  X.com (Twitter)
                </label>
                <input
                  type="text"
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="https://x.com/..."
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label
                  htmlFor="linkedin"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  LinkedIn
                </label>
                <input
                  type="text"
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="https://www.linkedin.com/in/..."
                />
              </div>

              {/* Instagram */}
              <div>
                <label
                  htmlFor="instagram"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Instagram
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="https://instagram.com/..."
                />
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
