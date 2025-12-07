import { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import CustomSelect from "../common/CustomSelect";
import toast from "react-hot-toast";
import {
  type ProyectoAprobadoFeria,
  type Docente,
  type Jurado,
  obtenerDocentes,
  asignarJurado,
  eliminarJurado,
  obtenerJuradosPorProyecto,
} from "../../services/docenteProyectoService";

interface AsignarJuradosModalProps {
  isOpen: boolean;
  proyecto: ProyectoAprobadoFeria | null;
  onClose: () => void;
}

export default function AsignarJuradosModal({
  isOpen,
  proyecto,
  onClose,
}: AsignarJuradosModalProps) {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [jurados, setJurados] = useState<Jurado[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState<string>("");

  useEffect(() => {
    if (isOpen && proyecto) {
      cargarDatos();
    }
  }, [isOpen, proyecto?.idProyecto]);

  const cargarDatos = async () => {
    if (!proyecto) return;
    
    try {
      setLoading(true);
      const [docentesData, juradosData] = await Promise.all([
        obtenerDocentes(),
        obtenerJuradosPorProyecto(proyecto.idProyecto),
      ]);
      setDocentes(docentesData);
      setJurados(juradosData);
    } catch (error: any) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarJurado = async () => {
    if (!proyecto) return;
    
    if (!docenteSeleccionado) {
      toast.error("Selecciona un docente");
      return;
    }

    if (jurados.length >= 3) {
      toast.error("Ya hay 3 jurados asignados");
      return;
    }

    // Verificar si el docente ya está asignado
    if (jurados.some((j) => j.idDocente === docenteSeleccionado)) {
      toast.error("Este docente ya está asignado como jurado");
      return;
    }

    try {
      setProcesando(true);
      await asignarJurado(proyecto.idProyecto, docenteSeleccionado);
      toast.success("Jurado asignado correctamente");
      setDocenteSeleccionado("");
      await cargarDatos();
    } catch (error: any) {
      console.error("Error al asignar jurado:", error);
      toast.error(error?.response?.data?.message || "Error al asignar el jurado");
    } finally {
      setProcesando(false);
    }
  };

  const handleEliminarJurado = async (idDocenteProyecto: string) => {
    if (!confirm("¿Estás seguro de eliminar este jurado?")) {
      return;
    }

    try {
      setProcesando(true);
      await eliminarJurado(idDocenteProyecto);
      toast.success("Jurado eliminado correctamente");
      await cargarDatos();
    } catch (error: any) {
      console.error("Error al eliminar jurado:", error);
      toast.error(error?.response?.data?.message || "Error al eliminar el jurado");
    } finally {
      setProcesando(false);
    }
  };

  const handleGuardar = () => {
    onClose();
  };

  const docentesDisponibles = docentes.filter(
    (d) => !jurados.some((j) => j.idDocente === d.idDocente)
  );

  const docenteOptions = docentesDisponibles.map((d) => ({
    value: d.idDocente,
    label: d.nombreCompleto,
  }));

  if (!isOpen || !proyecto) return null;

  return (
    <div className="fixed inset-0 z-100000000 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Asignar Jurados
              </p>
              <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {proyecto.nombre}
              </h4>
            </div>
            <button
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6" style={{ maxHeight: "calc(90vh - 200px)", overflowY: "auto" }}>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
              <p className="mt-2 text-sm text-gray-500">Cargando...</p>
            </div>
          ) : (
            <>
              {/* Agregar nuevo jurado */}
              {jurados.length < 3 && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Agregar Jurado ({jurados.length}/3)
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <CustomSelect
                        options={docenteOptions}
                        value={docenteSeleccionado}
                        onChange={setDocenteSeleccionado}
                        placeholder="Selecciona un docente"
                        className="w-full"
                      />
                    </div>
                    <Button
                      onClick={handleAgregarJurado}
                      disabled={procesando || !docenteSeleccionado}
                      size="sm"
                    >
                      {procesando ? "Agregando..." : "+ Agregar"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Lista de jurados asignados */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Jurados Asignados ({jurados.length})
                </label>

                {jurados.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No hay jurados asignados aún
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {jurados.map((jurado, index) => (
                      <div
                        key={jurado.idDocenteProyecto}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {jurado.nombreCompleto}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleEliminarJurado(jurado.idDocenteProyecto)}
                          disabled={procesando}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 disabled:opacity-50"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {jurados.length === 3 && (
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    ✓ Se han asignado los 3 jurados requeridos para este proyecto.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex gap-3 justify-end dark:border-gray-700">
          <Button variant="outline" onClick={onClose} disabled={procesando}>
            Cerrar
          </Button>
          <Button onClick={handleGuardar} disabled={procesando}>
            Guardar cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
