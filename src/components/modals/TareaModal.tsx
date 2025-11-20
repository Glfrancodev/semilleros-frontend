import { useState, useEffect } from "react";
import Button from "../ui/button/Button";

export interface TareaFormData {
  nombre: string;
  descripcion: string;
  fechaLimite: string;
}

interface TareaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TareaFormData) => Promise<void>;
  nextOrden: number;
}

export default function TareaModal({
  isOpen,
  onClose,
  onSubmit,
  nextOrden,
}: TareaModalProps) {
  const [formData, setFormData] = useState<TareaFormData>({
    nombre: "",
    descripcion: "",
    fechaLimite: "",
  });
  const [errors, setErrors] = useState<Partial<TareaFormData>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setFormData({
      nombre: "",
      descripcion: "",
      fechaLimite: "",
    });
    setErrors({});
    setServerError(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof TareaFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: Partial<TareaFormData> = {};
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre es requerido";
    if (!formData.descripcion.trim()) newErrors.descripcion = "Descripción es requerida";
    if (!formData.fechaLimite.trim()) newErrors.fechaLimite = "Fecha límite es requerida";
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
    } catch (err: any) {
      setServerError(err?.message || "No se pudo crear la tarea.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-[1000000] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Añadir Tarea</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {serverError && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <svg className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1 text-sm text-red-700 dark:text-red-300">{serverError}</div>
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
                        <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Orden: {nextOrden}
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  errors.nombre
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                }`}
                placeholder="Nombre de la tarea"
              />
              {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  errors.descripcion
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                }`}
                placeholder="Descripción breve de la tarea"
              />
              {errors.descripcion && <p className="mt-1 text-sm text-red-500">{errors.descripcion}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fecha límite <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="fechaLimite"
                value={formData.fechaLimite}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  errors.fechaLimite
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                }`}
              />
              {errors.fechaLimite && <p className="mt-1 text-sm text-red-500">{errors.fechaLimite}</p>}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading}>
              {loading ? "Guardando..." : "Crear tarea"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
