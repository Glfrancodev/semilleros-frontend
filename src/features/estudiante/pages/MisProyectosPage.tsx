import { useEffect, useState } from "react";
import {
  obtenerMisInvitaciones,
  responderInvitacion,
  obtenerMisProyectosActuales,
  obtenerMisProyectosPasados,
  obtenerMisProyectosInvitadosActuales,
  obtenerMisProyectosInvitadosPasados,
  Proyecto,
  InvitacionProyecto,
} from "../../../services/proyectoService";
import ProyectoCard from "../components/ProyectoCard";
import Button from "../../../components/ui/button/Button";

export default function MisProyectosPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [proyectosInvitado, setProyectosInvitado] = useState<Proyecto[]>([]);
  const [invitaciones, setInvitaciones] = useState<InvitacionProyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProyectos, setLoadingProyectos] = useState(false);
  const [loadingInvitado, setLoadingInvitado] = useState(true);
  const [loadingInvitaciones, setLoadingInvitaciones] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInvitacionesModal, setShowInvitacionesModal] = useState(false);
  const [mostrarPasados, setMostrarPasados] = useState(false);
  const [mostrarPasadosInvitado, setMostrarPasadosInvitado] = useState(false);

  useEffect(() => {
    void cargarTodo();
  }, []);

  const cargarTodo = async () => {
    await Promise.all([cargarProyectos(), cargarProyectosInvitado(), cargarInvitaciones()]);
  };

  const cargarProyectos = async () => {
    try {
      setLoadingProyectos(true);
      setError(null);
      const data = mostrarPasados
        ? await obtenerMisProyectosPasados()
        : await obtenerMisProyectosActuales();
      setProyectos(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar los proyectos");
    } finally {
      setLoadingProyectos(false);
      setLoading(false);
    }
  };

  const handleToggleProyectos = async () => {
    setMostrarPasados(!mostrarPasados);
    try {
      setLoadingProyectos(true);
      const data = !mostrarPasados
        ? await obtenerMisProyectosPasados()
        : await obtenerMisProyectosActuales();
      setProyectos(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar los proyectos");
    } finally {
      setLoadingProyectos(false);
    }
  };

  const cargarProyectosInvitado = async () => {
    try {
      setLoadingInvitado(true);
      const data = mostrarPasadosInvitado
        ? await obtenerMisProyectosInvitadosPasados()
        : await obtenerMisProyectosInvitadosActuales();
      setProyectosInvitado(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar los proyectos invitados");
    } finally {
      setLoadingInvitado(false);
    }
  };

  const handleToggleProyectosInvitado = async () => {
    setMostrarPasadosInvitado(!mostrarPasadosInvitado);
    try {
      setLoadingInvitado(true);
      const data = !mostrarPasadosInvitado
        ? await obtenerMisProyectosInvitadosPasados()
        : await obtenerMisProyectosInvitadosActuales();
      setProyectosInvitado(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar los proyectos invitados");
    } finally {
      setLoadingInvitado(false);
    }
  };

  const cargarInvitaciones = async () => {
    try {
      setLoadingInvitaciones(true);
      const data = await obtenerMisInvitaciones();
      setInvitaciones(data.items || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar las invitaciones");
    } finally {
      setLoadingInvitaciones(false);
    }
  };

  const manejarRespuestaInvitacion = async (idEstudianteProyecto: string, aceptar: boolean) => {
    try {
      setLoadingInvitaciones(true);
      await responderInvitacion(idEstudianteProyecto, aceptar);
      await Promise.all([cargarInvitaciones(), cargarProyectosInvitado()]);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al procesar la invitación");
    } finally {
      setLoadingInvitaciones(false);
    }
  };

  // Filtrar proyectos según el estado del toggle
  const proyectosFiltrados = proyectos;
  const proyectosInvitadoFiltrados = proyectosInvitado;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😕</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar proyectos</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={cargarTodo} variant="primary" size="sm">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Proyectos</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gestiona y trabaja en tus proyectos de investigación
          </p>
        </div>
      </div>

      {/* Proyectos líder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Proyectos</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {mostrarPasados ? "Proyectos Pasados" : "Proyectos Actuales"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={mostrarPasados}
                onChange={handleToggleProyectos}
                className="sr-only peer"
                disabled={loadingProyectos}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="p-6">
          {loadingProyectos ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : proyectosFiltrados.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No tienes proyectos</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aún no estás participando en ningún proyecto de investigación
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proyectosFiltrados.map((proyecto) => (
                <ProyectoCard key={proyecto.idProyecto} proyecto={proyecto} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Proyectos de Invitado */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Proyectos de Invitado</h2>
            <Button
              variant="primary"
              onClick={() => {
                void cargarInvitaciones();
                setShowInvitacionesModal(true);
              }}
              size="sm"
            >
              Invitaciones
              {invitaciones.filter((inv) => inv.invitacion === null).length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center text-xs font-semibold px-2 py-0.5 bg-red-600 text-white rounded-full">
                  {invitaciones.filter((inv) => inv.invitacion === null).length}
                </span>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {mostrarPasadosInvitado ? "Proyectos Pasados" : "Proyectos Actuales"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={mostrarPasadosInvitado}
                onChange={handleToggleProyectosInvitado}
                className="sr-only peer"
                disabled={loadingInvitado}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="p-6">
          {loadingInvitado ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : proyectosInvitadoFiltrados.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No tienes proyectos como invitado
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aún no formas parte de proyectos como colaborador.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proyectosInvitadoFiltrados.map((proyecto) => (
                <ProyectoCard key={proyecto.idProyecto} proyecto={proyecto} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Invitaciones */}
      {showInvitacionesModal && (
        <div className="fixed inset-0 z-999999999 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mis Invitaciones</h3>
              <button
                onClick={() => setShowInvitacionesModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3">
              {loadingInvitaciones ? (
                <div className="text-center text-gray-500 dark:text-gray-400">Cargando invitaciones...</div>
              ) : invitaciones.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  No tienes invitaciones pendientes.
                </div>
              ) : (
                invitaciones.map((inv) => (
                  <div
                    key={inv.idEstudianteProyecto}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                        {inv.proyecto.nombre}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Materia: {inv.proyecto.materia || "Sin materia"} · Grupo: {inv.proyecto.grupo || "Sin grupo"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Líder: {inv.proyecto.lider || "Sin líder"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {inv.invitacion === null ? (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => void manejarRespuestaInvitacion(inv.idEstudianteProyecto, true)}
                            disabled={loadingInvitaciones}
                          >
                            Aceptar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => void manejarRespuestaInvitacion(inv.idEstudianteProyecto, false)}
                            disabled={loadingInvitaciones}
                          >
                            Rechazar
                          </Button>
                        </>
                      ) : inv.invitacion === true ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          Aceptada
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                          Rechazada
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
