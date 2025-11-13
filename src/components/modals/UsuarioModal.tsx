import { useState, useEffect } from "react";
import { Usuario } from "../../services/usuarioService";
import { obtenerRoles, Rol } from "../../services/rolService";
import Button from "../ui/button/Button";

interface UsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UsuarioFormData) => Promise<void>;
  usuario?: Usuario | null;
  title: string;
}

export interface UsuarioFormData {
  ci: string;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena?: string;
  idRol: string;
  // Campos específicos de Estudiante
  codigoEstudiante?: string;
  // Campos específicos de Docente
  codigoDocente?: string;
}

export default function UsuarioModal({
  isOpen,
  onClose,
  onSubmit,
  usuario,
  title,
}: UsuarioModalProps) {
  const [formData, setFormData] = useState<UsuarioFormData>({
    ci: "",
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    idRol: "",
    codigoEstudiante: "",
    codigoDocente: "",
  });
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<UsuarioFormData>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Obtener el rol seleccionado
  const selectedRol = roles.find(r => r.idRol === formData.idRol);
  const isEstudiante = selectedRol?.nombre.toLowerCase() === "estudiante";
  const isDocente = selectedRol?.nombre.toLowerCase() === "docente";

  // Cargar roles
  useEffect(() => {
    if (isOpen) {
      cargarRoles();
    }
  }, [isOpen]);

  // Cargar datos del usuario si es edición
  useEffect(() => {
    if (usuario) {
      setFormData({
        ci: usuario.ci,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        idRol: usuario.idRol,
        codigoEstudiante: usuario.Estudiante?.codigoEstudiante || "",
        codigoDocente: usuario.Docente?.codigoDocente || "",
      });
    } else {
      setFormData({
        ci: "",
        nombre: "",
        apellido: "",
        correo: "",
        contrasena: "",
        idRol: "",
        codigoEstudiante: "",
        codigoDocente: "",
      });
    }
  }, [usuario]);

  const cargarRoles = async () => {
    try {
      const data = await obtenerRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo
    if (errors[name as keyof UsuarioFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UsuarioFormData> = {};

    if (!formData.ci.trim()) newErrors.ci = "CI es requerido";
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre es requerido";
    if (!formData.apellido.trim()) newErrors.apellido = "Apellido es requerido";
    if (!formData.correo.trim()) newErrors.correo = "Correo es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.correo))
      newErrors.correo = "Correo inválido";
    if (!usuario && !formData.contrasena?.trim())
      newErrors.contrasena = "Contraseña es requerida";
    if (!formData.idRol) newErrors.idRol = "Rol es requerido";
    
    // Validar campos específicos según el rol
    if (isEstudiante && !formData.codigoEstudiante?.trim()) {
      newErrors.codigoEstudiante = "Código de estudiante es requerido";
    }
    if (isDocente && !formData.codigoDocente?.trim()) {
      newErrors.codigoDocente = "Código de docente es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setServerError(null); // Limpiar error previo
    try {
      await onSubmit(formData);
      onClose();
      // Resetear formulario
      setFormData({
        ci: "",
        nombre: "",
        apellido: "",
        correo: "",
        contrasena: "",
        idRol: "",
        codigoEstudiante: "",
        codigoDocente: "",
      });
      setErrors({});
      setServerError(null);
    } catch (error: any) {
      console.error("Error al guardar usuario:", error);
      // Mostrar el error al usuario
      const errorMessage = error?.message || "Error al guardar usuario. Por favor, intente nuevamente.";
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
      <div className="relative z-[1000000] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
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
        <form onSubmit={handleSubmit} className="p-6">
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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* CI */}
            <div>
              <label
                htmlFor="ci"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                CI <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="ci"
                name="ci"
                value={formData.ci}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  errors.ci
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                }`}
                placeholder="Ingrese el CI"
              />
              {errors.ci && (
                <p className="mt-1 text-sm text-red-500">{errors.ci}</p>
              )}
            </div>

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
                placeholder="Ingrese el nombre"
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
                placeholder="Ingrese el apellido"
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
                placeholder="ejemplo@correo.com"
              />
              {errors.correo && (
                <p className="mt-1 text-sm text-red-500">{errors.correo}</p>
              )}
            </div>

            {/* Contraseña (solo en creación) */}
            {!usuario && (
              <div>
                <label
                  htmlFor="contrasena"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="contrasena"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    errors.contrasena
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  }`}
                  placeholder="Ingrese la contraseña"
                />
                {errors.contrasena && (
                  <p className="mt-1 text-sm text-red-500">{errors.contrasena}</p>
                )}
              </div>
            )}

            {/* Rol */}
            <div className={usuario ? "sm:col-span-2" : ""}>
              <label
                htmlFor="idRol"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                id="idRol"
                name="idRol"
                value={formData.idRol}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  errors.idRol
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                }`}
              >
                <option value="">Seleccione un rol</option>
                {roles.map((rol) => (
                  <option key={rol.idRol} value={rol.idRol}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
              {errors.idRol && (
                <p className="mt-1 text-sm text-red-500">{errors.idRol}</p>
              )}
            </div>

            {/* Código Estudiante - Solo si el rol es Estudiante */}
            {isEstudiante && (
              <div className="sm:col-span-2">
                <label
                  htmlFor="codigoEstudiante"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Código de Estudiante <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="codigoEstudiante"
                  name="codigoEstudiante"
                  value={formData.codigoEstudiante}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    errors.codigoEstudiante
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  }`}
                  placeholder="Ingrese el código de estudiante"
                />
                {errors.codigoEstudiante && (
                  <p className="mt-1 text-sm text-red-500">{errors.codigoEstudiante}</p>
                )}
              </div>
            )}

            {/* Código Docente - Solo si el rol es Docente */}
            {isDocente && (
              <div className="sm:col-span-2">
                <label
                  htmlFor="codigoDocente"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Código de Docente <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="codigoDocente"
                  name="codigoDocente"
                  value={formData.codigoDocente}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    errors.codigoDocente
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  }`}
                  placeholder="Ingrese el código de docente"
                />
                {errors.codigoDocente && (
                  <p className="mt-1 text-sm text-red-500">{errors.codigoDocente}</p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={loading}
            >
              {loading ? "Guardando..." : usuario ? "Actualizar" : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
