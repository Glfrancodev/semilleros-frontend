import React, { useState, useEffect } from "react";
import { Materia } from "../../services/materiaService";
import { obtenerAreasCategorias, AreaCategoria } from "../../services/areaService";
import { obtenerDocentes, Docente } from "../../services/docenteService";
import Button from "../ui/button/Button";

interface MateriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MateriaFormData) => Promise<void>;
  materia?: Materia | null;
  title: string;
  idSemestre: string;
}

interface GrupoData {
  sigla: string;
  idDocente: string;
}

export interface MateriaFormData {
  sigla: string;
  nombre: string;
  idAreaCategoria: string;
  idSemestre: string;
  grupos?: GrupoData[];
}

export default function MateriaModal({
  isOpen,
  onClose,
  onSubmit,
  materia,
  title,
  idSemestre,
}: MateriaModalProps) {
  const [formData, setFormData] = useState<MateriaFormData>({
    sigla: "",
    nombre: "",
    idAreaCategoria: "",
    idSemestre: idSemestre,
    grupos: [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [areasCategorias, setAreasCategorias] = useState<AreaCategoria[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [grupos, setGrupos] = useState<GrupoData[]>([]);
  const [nuevoGrupo, setNuevoGrupo] = useState<GrupoData>({ sigla: "", idDocente: "" });

  // Cargar áreas-categorías y docentes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areasData, docentesData] = await Promise.all([
          obtenerAreasCategorias(),
          obtenerDocentes(),
        ]);
        setAreasCategorias(areasData);
        setDocentes(docentesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Cargar datos de la materia si es edición
  useEffect(() => {
    if (materia) {
      setFormData({
        sigla: materia.sigla,
        nombre: materia.nombre,
        idAreaCategoria: materia.idAreaCategoria,
        idSemestre: materia.idSemestre,
        grupos: materia.grupoMaterias ? materia.grupoMaterias.map(gm => ({
          sigla: gm.grupo.sigla,
          idDocente: gm.docente.idDocente
        })) : [],
      });
      setGrupos(materia.grupoMaterias ? materia.grupoMaterias.map(gm => ({
        sigla: gm.grupo.sigla,
        idDocente: gm.docente.idDocente
      })) : []);
    } else {
      setFormData({
        sigla: "",
        nombre: "",
        idAreaCategoria: "",
        idSemestre: idSemestre,
        grupos: [],
      });
      setGrupos([]);
    }
    setNuevoGrupo({ sigla: "", idDocente: "" });
    setErrors({});
    setServerError(null);
  }, [materia, isOpen, idSemestre]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!formData.sigla.trim()) {
      newErrors.sigla = "La sigla es requerida";
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.idAreaCategoria) {
      newErrors.idAreaCategoria = "El área-categoría es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        grupos: grupos,
      });
      onClose();
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Error al guardar la materia");
    } finally {
      setLoading(false);
    }
  };

  const agregarGrupo = () => {
    if (!nuevoGrupo.sigla.trim()) {
      setErrors((prev) => ({ ...prev, grupoSigla: "La sigla del grupo es requerida" }));
      return;
    }
    if (!nuevoGrupo.idDocente) {
      setErrors((prev) => ({ ...prev, grupoDocente: "El docente es requerido" }));
      return;
    }

    setGrupos((prev) => [...prev, nuevoGrupo]);
    setNuevoGrupo({ sigla: "", idDocente: "" });
    setErrors((prev) => ({ ...prev, grupoSigla: undefined, grupoDocente: undefined }));
  };

  const eliminarGrupo = (index: number) => {
    setGrupos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10000000000 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl dark:bg-gray-800 my-8">
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700 z-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              type="button"
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error del servidor */}
          {serverError && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
              {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sigla */}
            <div>
              <label htmlFor="sigla" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sigla <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="sigla"
                name="sigla"
                value={formData.sigla}
                onChange={handleChange}
                className={`w-full rounded-lg border ${errors.sigla ? 'border-red-500' : 'border-gray-300'
                  } bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                placeholder="Ej: INF-123"
              />
              {errors.sigla && <p className="mt-1 text-sm text-red-500">{errors.sigla}</p>}
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full rounded-lg border ${errors.nombre ? 'border-red-500' : 'border-gray-300'
                  } bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                placeholder="Ej: Programación I"
              />
              {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
            </div>

            {/* Área-Categoría */}
            <div>
              <label htmlFor="idAreaCategoria" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Área-Categoría <span className="text-red-500">*</span>
              </label>
              <select
                id="idAreaCategoria"
                name="idAreaCategoria"
                value={formData.idAreaCategoria}
                onChange={handleChange}
                className={`w-full rounded-lg border ${errors.idAreaCategoria ? 'border-red-500' : 'border-gray-300'
                  } bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
              >
                <option value="">Seleccionar área-categoría</option>
                {areasCategorias.map((ac) => (
                  <option key={ac.idAreaCategoria} value={ac.idAreaCategoria}>
                    {ac.area?.nombre} - {ac.Categoria?.nombre || ac.categoria?.nombre}
                  </option>
                ))}
              </select>
              {errors.idAreaCategoria && <p className="mt-1 text-sm text-red-500">{errors.idAreaCategoria}</p>}
            </div>

            {/* Añadir Grupos */}
            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Añadir Grupos
              </h3>

              {/* Formulario para añadir grupo */}
              <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50 md:grid-cols-2">
                <div>
                  <label htmlFor="grupoSigla" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sigla del Grupo
                  </label>
                  <input
                    type="text"
                    id="grupoSigla"
                    value={nuevoGrupo.sigla}
                    onChange={(e) => {
                      setNuevoGrupo((prev) => ({ ...prev, sigla: e.target.value }));
                      setErrors((prev) => ({ ...prev, grupoSigla: undefined }));
                    }}
                    className={`w-full rounded-lg border ${errors.grupoSigla ? 'border-red-500' : 'border-gray-300'
                      } bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                    placeholder="Ej: A, B, 01"
                  />
                  {errors.grupoSigla && <p className="mt-1 text-sm text-red-500">{errors.grupoSigla}</p>}
                </div>

                <div>
                  <label htmlFor="grupoDocente" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Docente
                  </label>
                  <select
                    id="grupoDocente"
                    value={nuevoGrupo.idDocente}
                    onChange={(e) => {
                      setNuevoGrupo((prev) => ({ ...prev, idDocente: e.target.value }));
                      setErrors((prev) => ({ ...prev, grupoDocente: undefined }));
                    }}
                    className={`w-full rounded-lg border ${errors.grupoDocente ? 'border-red-500' : 'border-gray-300'
                      } bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                  >
                    <option value="">Seleccionar docente</option>
                    {docentes.map((doc) => (
                      <option key={doc.idDocente} value={doc.idDocente}>
                        {doc.usuario?.nombre || doc.codigoDocente}
                      </option>
                    ))}
                  </select>
                  {errors.grupoDocente && <p className="mt-1 text-sm text-red-500">{errors.grupoDocente}</p>}
                </div>

                <div className="md:col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={agregarGrupo}
                    className="w-full"
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Agregar Grupo
                  </Button>
                </div>
              </div>

              {/* Lista de grupos agregados */}
              {grupos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Grupos agregados ({grupos.length}):
                  </p>
                  {grupos.map((grupo, index) => {
                    const docente = docentes.find((d) => d.idDocente === grupo.idDocente);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            Grupo {grupo.sigla}
                          </span>
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            - {docente?.usuario?.nombre || docente?.codigoDocente}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => eliminarGrupo(index)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>


            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white dark:bg-gray-800 pb-2 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
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
                {loading ? "Guardando..." : materia ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
