import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProyectoDetalle } from "../../../services/proyectoService";
import api from "../../../services/api";
import Button from "../../../components/ui/button/Button";
import { useAuth } from "../../../context/AuthContext";

interface ProyectoIntegrantesCardProps {
  proyecto: ProyectoDetalle;
}

interface Integrante {
  idEstudianteProyecto: string;
  codigo: string;
  nombreCompleto: string;
  esLider: boolean;
  idUsuario?: string;
  idEstudiante?: string;
}

interface InvitacionProyectoItem {
  idEstudianteProyecto: string;
  codigo: string;
  nombreCompleto: string;
  invitacion: boolean | null;
}

export default function ProyectoIntegrantesCard({ proyecto }: ProyectoIntegrantesCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [invitaciones, setInvitaciones] = useState<InvitacionProyectoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingInvitaciones, setLoadingInvitaciones] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [nuevoEstudianteCodigo, setNuevoEstudianteCodigo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarIntegrantes();
    cargarInvitaciones();
  }, [proyecto.idProyecto]);

  const cargarIntegrantes = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/proyectos/${proyecto.idProyecto}/integrantes`);
      const data = response.data.data;
      const items = data.items || [];
      const mapped: Integrante[] = items.map((item: any) => ({
        idEstudianteProyecto: item.idEstudianteProyecto,
        codigo: item.codigo || "Sin código",
        nombreCompleto: item.nombreCompleto || "Sin nombre",
        esLider: item.esLider,
        idUsuario: item.idUsuario,
        idEstudiante: item.idEstudiante,
      }));
      setIntegrantes(mapped);
    } catch (err) {
      console.error("Error al cargar integrantes:", err);
      setIntegrantes([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarInvitaciones = async () => {
    try {
      setLoadingInvitaciones(true);
      const res = await api.get(`/estudiante-proyectos/proyecto/${proyecto.idProyecto}`);
      const data = res.data.data?.items || [];
      const formateadas: InvitacionProyectoItem[] = data.map((item: any) => ({
        idEstudianteProyecto: item.idEstudianteProyecto,
        codigo: item.codigo || "Sin código",
        nombreCompleto: item.nombreCompleto || "Sin nombre",
        invitacion: item.invitacion,
      }));
      setInvitaciones(formateadas);
    } catch (err) {
      console.error("Error al cargar invitaciones:", err);
    } finally {
      setLoadingInvitaciones(false);
    }
  };

  const enviarInvitacion = async () => {
    if (!nuevoEstudianteCodigo.trim()) {
      setError("Debes ingresar el código del estudiante");
      return;
    }
    try {
      setEnviando(true);
      setError(null);
      await api.post("/estudiante-proyectos/invitacion", {
        codigoEstudiante: nuevoEstudianteCodigo.trim(),
        idProyecto: proyecto.idProyecto,
      });
      setNuevoEstudianteCodigo("");
      setShowInviteModal(false);
      await cargarInvitaciones();
    } catch (err: any) {
      console.error("Error al enviar invitación:", err);
      setError(err.response?.data?.message || "Error al enviar invitación");
    } finally {
      setEnviando(false);
    }
  };

  const renderEstado = (estado: boolean | null) => {
    if (estado === null) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
          Pendiente
        </span>
      );
    }
    if (estado) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
          Aceptada
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
        Rechazada
      </span>
    );
  };

  const esLiderActual = integrantes.some(
    (i) => i.esLider && i.idUsuario && user && i.idUsuario === user.idUsuario
  );

  // Bloquear invitaciones si el proyecto es final
  const invitacionesBloqueadasPorEsFinal = proyecto.esFinal === true;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="mb-5 flex items-center justify-between lg:mb-7">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Integrantes</h3>
        {esLiderActual && !invitacionesBloqueadasPorEsFinal && (
          <Button size="sm" variant="primary" onClick={() => setShowInviteModal(true)}>
            Enviar invitación
          </Button>
        )}
      </div>

      {invitacionesBloqueadasPorEsFinal && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          El proyecto ha sido marcado como final. No se pueden enviar más invitaciones.
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600 dark:border-gray-700 dark:border-t-primary-500"></div>
        </div>
      ) : integrantes.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No hay integrantes registrados</p>
      ) : (
        <div className="space-y-3">
          {integrantes.map((integrante) => (
            <div
              key={integrante.idEstudianteProyecto}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                  <svg
                    className="h-5 w-5 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{integrante.nombreCompleto}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{integrante.codigo}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {integrante.esLider && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                    <svg className="h-4 w-4 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Líder</span>
                  </div>
                )}
                {integrante.idEstudiante && (
                  <button
                    onClick={() => navigate(`/estudiantes/${integrante.idEstudiante}/perfil`)}
                    className="px-3 py-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors duration-200"
                  >
                    Ver Perfil
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de invitación */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Enviar invitación</h4>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                onClick={() => {
                  setShowInviteModal(false);
                  setError(null);
                }}
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Código del estudiante
                  <input
                    type="text"
                    value={nuevoEstudianteCodigo}
                    onChange={(e) => setNuevoEstudianteCodigo(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-primary-400"
                    placeholder="Ingresa el código del estudiante"
                  />
                </label>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowInviteModal(false)} disabled={enviando}>
                    Cancelar
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => void enviarInvitacion()} disabled={enviando}>
                    {enviando ? "Enviando..." : "Enviar"}
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                <h5 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Invitaciones</h5>
                {loadingInvitaciones ? (
                  <div className="text-sm text-gray-500 dark:text-gray-400">Cargando invitaciones...</div>
                ) : invitaciones.length === 0 ? (
                  <div className="text-sm text-gray-500 dark:text-gray-400 italic">No hay invitaciones registradas.</div>
                ) : (
                  <div className="space-y-2">
                    {invitaciones.map((inv) => (
                      <div
                        key={inv.idEstudianteProyecto}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-900/50"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{inv.nombreCompleto || "Sin nombre"}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{inv.codigo}</p>
                        </div>
                        {renderEstado(inv.invitacion)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
