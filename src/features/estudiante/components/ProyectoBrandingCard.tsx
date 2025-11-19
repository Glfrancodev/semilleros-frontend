import { useEffect, useState, useCallback } from "react";
import { ProyectoDetalle } from "../../../services/proyectoService";
import api from "../../../services/api";
import Button from "../../../components/ui/button/Button";
import ImagenNoEncontrada from "../../../assets/ImagenNoEncontrada.png";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const ALLOWED_PDF_TYPES = ["application/pdf"];

interface ProyectoBrandingCardProps {
  proyecto: ProyectoDetalle;
  onUpdate: () => void;
}

interface Integrante {
  idEstudianteProyecto: string;
  idUsuario?: string;
  esLider: boolean;
}

interface TareaEnProceso {
  idTarea: string;
  enRevision?: boolean;
}

export default function ProyectoBrandingCard({ proyecto}: ProyectoBrandingCardProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState<string | null>(null);
  const [urls, setUrls] = useState({
    logo: proyecto.urlLogo,
    banner: proyecto.urlBanner,
    triptico: proyecto.urlTriptico,
  });
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [brandingBloqueado, setBrandingBloqueado] = useState(false);

  useEffect(() => {
    const cargarIntegrantes = async () => {
      try {
        const response = await api.get(`/proyectos/${proyecto.idProyecto}/integrantes`);
        const items = response.data?.data?.items || [];
        const mapped: Integrante[] = items.map((item: any) => ({
          idEstudianteProyecto: item.idEstudianteProyecto,
          idUsuario: item.idUsuario,
          esLider: item.esLider,
        }));
        setIntegrantes(mapped);
      } catch (error) {
        console.error("Error al cargar integrantes del proyecto:", error);
        setIntegrantes([]);
      }
    };

    void cargarIntegrantes();
  }, [proyecto.idProyecto]);

  const verificarRevisionActiva = useCallback(async () => {
    try {
      const response = await api.get(`/proyectos/${proyecto.idProyecto}/tareas-organizadas`);
      const enProceso: TareaEnProceso[] = response.data?.data?.enProceso || [];
      const hayRevision = enProceso.some((tarea) => tarea.enRevision);
      setBrandingBloqueado(hayRevision);
    } catch (error) {
      console.error("Error al verificar tareas en revisión:", error);
      setBrandingBloqueado(false);
    }
  }, [proyecto.idProyecto]);

  useEffect(() => {
    void verificarRevisionActiva();
  }, [verificarRevisionActiva]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ idProyecto?: string }>).detail;
      if (detail?.idProyecto && detail.idProyecto !== proyecto.idProyecto) {
        return;
      }
      void verificarRevisionActiva();
    };
    window.addEventListener("revision-status-changed", handler as EventListener);
    return () => {
      window.removeEventListener("revision-status-changed", handler as EventListener);
    };
  }, [proyecto.idProyecto, verificarRevisionActiva]);

  const puedeGestionarBranding = integrantes.some(
    (integrante) => integrante.idUsuario && user?.idUsuario && integrante.idUsuario === user.idUsuario
  );

  const handleFileUpload = async (file: File, tipo: "logo" | "banner" | "triptico") => {
    try {
      // Validar tipo de archivo
      if (tipo === "triptico") {
        if (!ALLOWED_PDF_TYPES.includes(file.type)) {
          toast.error("El tríptico debe ser un archivo PDF");
          return;
        }
      } else {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          toast.error("Solo se permiten imágenes PNG, JPG o WEBP");
          return;
        }
      }

      setUploading(tipo);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("idProyecto", proyecto.idProyecto);
      formData.append("tipo", tipo);

      const response = await api.post("/archivos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Actualizar solo la URL del archivo subido
      const archivoSubido = response.data.data;
      setUrls(prev => ({
        ...prev,
        [tipo]: archivoSubido.urlFirmada || archivoSubido.url,
      }));

      toast.success(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} subido exitosamente`);
    } catch (error: any) {
      console.error(`Error al subir ${tipo}:`, error);
      toast.error(error.response?.data?.message || `Error al subir ${tipo}`);
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        Branding
      </h3>
      {puedeGestionarBranding && brandingBloqueado && (
        <p className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm text-yellow-800 dark:border-yellow-900/40 dark:bg-yellow-900/20 dark:text-yellow-200">
          Hay una tarea en revisión, por lo que la actualización de branding está temporalmente
          deshabilitada.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Logo */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Logo</h4>
          <div 
            className="w-full h-40 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => urls.logo && window.open(urls.logo, '_blank')}
          >
            {urls.logo ? (
              <img
                src={urls.logo}
                alt="Logo del proyecto"
                className="object-cover w-full h-full"
              />
            ) : (
              <img
                src={ImagenNoEncontrada}
                alt="Sin logo"
                className="object-cover w-full h-full opacity-50"
              />
            )}
          </div>
          {puedeGestionarBranding && (
            <label className="block">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "logo");
                }}
                disabled={uploading === "logo" || brandingBloqueado}
              />
              <Button
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                }}
                disabled={uploading === "logo" || brandingBloqueado}
              >
                {uploading === "logo" ? "Subiendo..." : "Subir Logo"}
              </Button>
            </label>
          )}
        </div>

        {/* Banner */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Banner</h4>
          <div 
            className="w-full h-40 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => urls.banner && window.open(urls.banner, '_blank')}
          >
            {urls.banner ? (
              <img
                src={urls.banner}
                alt="Banner del proyecto"
                className="object-cover w-full h-full"
              />
            ) : (
              <img
                src={ImagenNoEncontrada}
                alt="Sin banner"
                className="object-cover w-full h-full opacity-50"
              />
            )}
          </div>
          {puedeGestionarBranding && (
            <label className="block">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "banner");
                }}
                disabled={uploading === "banner" || brandingBloqueado}
              />
              <Button
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                }}
                disabled={uploading === "banner" || brandingBloqueado}
              >
                {uploading === "banner" ? "Subiendo..." : "Subir Banner"}
              </Button>
            </label>
          )}
        </div>

        {/* Tríptico */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Tríptico (PDF)</h4>
          <div 
            className="w-full h-40 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => urls.triptico && window.open(urls.triptico, '_blank')}
          >
            {urls.triptico ? (
              <div className="flex flex-col items-center justify-center gap-2 p-4">
                <svg className="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                  Click para ver/descargar
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-gray-500 dark:text-gray-400">Sin tríptico</span>
              </div>
            )}
          </div>
          {puedeGestionarBranding && (
            <label className="block">
              <input
                type="file"
                className="hidden"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "triptico");
                }}
                disabled={uploading === "triptico" || brandingBloqueado}
              />
              <Button
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                }}
                disabled={uploading === "triptico" || brandingBloqueado}
              >
                {uploading === "triptico" ? "Subiendo..." : "Subir Tríptico (PDF)"}
              </Button>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
