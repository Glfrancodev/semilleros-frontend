import { useState, useEffect } from "react";
import { Usuario } from "../../services/usuarioService";
import Button from "../ui/button/Button";

interface AdministrativoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdministrativoFormData) => Promise<void>;
  usuario?: Usuario | null;
  title: string;
}

export interface AdministrativoFormData {
  ci: string;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena?: string;
}

export default function AdministrativoModal({
  isOpen,
  onClose,
  onSubmit,
  usuario,
  title,
}: AdministrativoModalProps) {
  const [formData, setFormData] = useState<AdministrativoFormData>({
    ci: "",
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<AdministrativoFormData>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (usuario) {
      setFormData({
        ci: usuario.ci,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
      });
    } else {
      setFormData({
        ci: "",
        nombre: "",
        apellido: "",
        correo: "",
        contrasena: "",
      });
    }
    setErrors({});
    setServerError(null);
  }, [usuario, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof AdministrativoFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<AdministrativoFormData> = {};
    if (!formData.ci.trim()) newErrors.ci = "CI es requerido";
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre es requerido";
    if (!formData.apellido.trim()) newErrors.apellido = "Apellido es requerido";
    if (!formData.correo.trim()) newErrors.correo = "Correo es requerido";
    if (!usuario && !formData.contrasena?.trim()) newErrors.contrasena = "Contraseña es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      setServerError(error.response?.data?.message || error.message || 'Error al guardar administrativo');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {serverError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CI *
              </label>
              <input
                type="text"
                name="ci"
                value={formData.ci}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.ci
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                }`}
              />
              {errors.ci && <p className="mt-1 text-xs text-red-600">{errors.ci}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Correo *
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.correo
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                }`}
              />
              {errors.correo && <p className="mt-1 text-xs text-red-600">{errors.correo}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.nombre
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                }`}
              />
              {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Apellido *
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.apellido
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                }`}
              />
              {errors.apellido && <p className="mt-1 text-xs text-red-600">{errors.apellido}</p>}
            </div>
          </div>

          {!usuario && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña *
              </label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena || ""}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.contrasena
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                }`}
              />
              {errors.contrasena && <p className="mt-1 text-xs text-red-600">{errors.contrasena}</p>}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : usuario ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
