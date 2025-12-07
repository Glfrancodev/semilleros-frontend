import { useState, useEffect } from "react";
import { Feria, Tarea } from "../../services/feriaService";
import Button from "../ui/button/Button";

interface FeriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeriaFormData) => Promise<void>;
  feria?: Feria | null;
  title: string;
}

export interface FeriaFormData {
  nombre: string;
  semestre: number;
  año: number;
  estaActivo: boolean;
  tareas: (Omit<Tarea, 'idTarea' | 'idFeria' | 'fechaCreacion' | 'fechaActualizacion'> & { esFinal?: boolean })[];
}

export default function FeriaModal({
  isOpen,
  onClose,
  onSubmit,
  feria,
  title,
}: FeriaModalProps) {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<FeriaFormData>({
    nombre: "",
    semestre: 1,
    año: currentYear,
    estaActivo: true,
    tareas: [
      {
        nombre: "Inscripción",
        descripcion: "Tarea de inscripción al proyecto",
        fechaLimite: "",
        orden: 0,
        esFinal: false,
      }
    ],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Cargar datos de la feria si es edición
  useEffect(() => {
    if (feria) {
      setFormData({
        nombre: feria.nombre,
        semestre: feria.semestre,
        año: feria.año,
        estaActivo: feria.estaActivo,
        tareas: feria.tareas && feria.tareas.length > 0 ? feria.tareas.map(t => ({
          nombre: t.nombre,
          descripcion: t.descripcion || "",
          fechaLimite: t.fechaLimite ? t.fechaLimite.slice(0, 16) : "", // Format for datetime-local
          orden: t.orden,
          esFinal: t.esFinal || false,
        })) : [
          {
            nombre: "Inscripción",
            descripcion: "Tarea de inscripción al proyecto",
            fechaLimite: "",
            orden: 0,
            esFinal: false,
          }
        ],
      });
    } else {
      setFormData({
        nombre: "",
        semestre: 1,
        año: currentYear,
        estaActivo: true,
        tareas: [
          {
            nombre: "Inscripción",
            descripcion: "Tarea de inscripción al proyecto",
            fechaLimite: "",
            orden: 0,
            esFinal: false,
          }
        ],
      });
    }
  }, [feria, currentYear]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleTareaChange = (index: number, field: keyof Tarea, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      tareas: prev.tareas.map((tarea, i) => {
        // Si estamos marcando esFinal en una tarea, desmarcar todas las demás
        if (field === 'esFinal' && value === true) {
          if (i === index) {
            return { ...tarea, esFinal: true };
          } else {
            return { ...tarea, esFinal: false };
          }
        }
        // Para otros campos o cuando se desmarca esFinal
        return i === index ? { ...tarea, [field]: value } : tarea;
      }),
    }));

    if (errors[`tarea${index}_${field}`]) {
      setErrors((prev) => ({
        ...prev,
        [`tarea${index}_${field}`]: undefined,
      }));
    }
  };

  const agregarTarea = () => {
    const nuevoOrden = formData.tareas.length;
    setFormData(prev => ({
      ...prev,
      tareas: [
        ...prev.tareas,
        {
          nombre: "",
          descripcion: "",
          fechaLimite: "",
          orden: nuevoOrden,
          esFinal: false,
        }
      ],
    }));
  };

  const eliminarTarea = (index: number) => {
    if (index === 0) {
      alert("No se puede eliminar la tarea de Inscripción");
      return;
    }

    setFormData(prev => ({
      ...prev,
      tareas: prev.tareas.filter((_, i) => i !== index).map((tarea, i) => ({
        ...tarea,
        orden: i, // Reordenar
      })),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = "Nombre es requerido";
    if (formData.semestre < 1 || formData.semestre > 2) newErrors.semestre = "Semestre debe ser 1 o 2";
    if (formData.año < 2000) newErrors.año = "Año inválido";

    // Validar tareas siempre
    formData.tareas.forEach((tarea, index) => {
      if (!tarea.nombre.trim()) {
        newErrors[`tarea${index}_nombre`] = "Nombre de tarea requerido";
      }
      if (!tarea.fechaLimite) {
        newErrors[`tarea${index}_fechaLimite`] = "Fecha límite requerida";
      }
    });

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
      // Resetear formulario
      setFormData({
        nombre: "",
        semestre: 1,
        año: currentYear,
        estaActivo: true,
        tareas: [
          {
            nombre: "Inscripción",
            descripcion: "Tarea de inscripción al proyecto",
            fechaLimite: "",
            orden: 0,
            esFinal: false,
          }
        ],
      });
      setErrors({});
      setServerError(null);
    } catch (error: any) {
      console.error("Error al guardar feria:", error);
      const errorMessage = error?.message || "Error al guardar feria. Por favor, intente nuevamente.";
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
      <div className="relative z-[1000000] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
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

          <div className="space-y-6">
            {/* Información básica de la feria */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Nombre */}
              <div className="md:col-span-2">
                <label
                  htmlFor="nombre"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Nombre de la Feria <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${errors.nombre
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    }`}
                  placeholder="Ej: Feria de Proyectos 2025"
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>
                )}
              </div>

              {/* Semestre */}
              <div>
                <label
                  htmlFor="semestre"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Semestre <span className="text-red-500">*</span>
                </label>
                <select
                  id="semestre"
                  name="semestre"
                  value={formData.semestre}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${errors.semestre
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    }`}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </select>
                {errors.semestre && (
                  <p className="mt-1 text-sm text-red-500">{errors.semestre}</p>
                )}
              </div>

              {/* Año */}
              <div>
                <label
                  htmlFor="año"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Año <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="año"
                  name="año"
                  value={formData.año}
                  onChange={handleChange}
                  min={2000}
                  max={2100}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${errors.año
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    }`}
                />
                {errors.año && (
                  <p className="mt-1 text-sm text-red-500">{errors.año}</p>
                )}
              </div>
            </div>

            {/* Estado Activo */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="estaActivo"
                name="estaActivo"
                checked={formData.estaActivo}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label
                htmlFor="estaActivo"
                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Feria Activa
              </label>
            </div>

            {/* Tareas */}
            <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tareas de la Feria
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={agregarTarea}
                >
                  + Agregar Tarea
                </Button>
              </div>

              <div className="space-y-4">
                {[...formData.tareas].reverse().map((tarea, reverseIndex) => {
                  const index = formData.tareas.length - 1 - reverseIndex;
                  return (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        Tarea {index} {index === 0 && "(Inscripción - Obligatoria)"}
                      </h4>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => eliminarTarea(index)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                          Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={tarea.nombre}
                          onChange={(e) => handleTareaChange(index, 'nombre', e.target.value)}
                          disabled={index === 0}
                          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors[`tarea${index}_nombre`]
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                            }`}
                          placeholder="Nombre de la tarea"
                        />
                        {errors[`tarea${index}_nombre`] && (
                          <p className="mt-1 text-xs text-red-500">{errors[`tarea${index}_nombre`]}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                          Descripción
                        </label>
                        <textarea
                          value={tarea.descripcion}
                          onChange={(e) => handleTareaChange(index, 'descripcion', e.target.value)}
                          rows={2}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="Descripción de la tarea"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                          Fecha Límite <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          value={tarea.fechaLimite}
                          onChange={(e) => handleTareaChange(index, 'fechaLimite', e.target.value)}
                          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors[`tarea${index}_fechaLimite`]
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            }`}
                        />
                        {errors[`tarea${index}_fechaLimite`] && (
                          <p className="mt-1 text-xs text-red-500">{errors[`tarea${index}_fechaLimite`]}</p>
                        )}
                      </div>

                      {/* Checkbox de Tarea Final - Solo en la última tarea */}
                      {index === formData.tareas.length - 1 && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`esFinal${index}`}
                            checked={tarea.esFinal || false}
                            onChange={(e) => handleTareaChange(index, 'esFinal', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <label
                            htmlFor={`esFinal${index}`}
                            className="ml-2 text-xs font-medium text-gray-700 dark:text-gray-300"
                          >
                            Tarea Final de la Feria
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                );
                })}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="mt-6 flex justify-end gap-3">
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
              {loading ? "Guardando..." : feria ? "Actualizar" : "Crear Feria"}
            </Button>
          </div>
        </form>
      </div >
    </div >
  );
}
