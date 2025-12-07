import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DocumentEditor } from "../../../components/components/Editor";
import { obtenerContenidoEditor, obtenerProyectoPorId, ProyectoDetalle } from "../../../services/proyectoService";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../constants/roles";
import api from "../../../services/api";

export default function DocumentoEditorPage() {
  const { idProyecto } = useParams<{ idProyecto: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contenido, setContenido] = useState<any>(null);
  const [imagenes, setImagenes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forceReadOnly, setForceReadOnly] = useState(true);
  const [puedeVer, setPuedeVer] = useState(false);

  useEffect(() => {
    if (!idProyecto) {
      setError("Proyecto no encontrado");
      setIsLoading(false);
      return;
    }

    const cargarProyecto = async () => {
      setIsLoading(true);
      setError(null);
      setPuedeVer(false);

      try {
        const detalle = await obtenerProyectoPorId(idProyecto);

        const accesoPermitido = await determinarAcceso(detalle);
        if (!accesoPermitido) {
          setContenido(null);
          setImagenes([]);
          return;
        }

        const data = await obtenerContenidoEditor(idProyecto);
        setImagenes(data.imagenes || []);

        if (data.contenido) {
          try {
            const contenidoJSON = JSON.parse(data.contenido);
            setContenido(contenidoJSON);
          } catch (parseError) {
            console.error("Error al parsear contenido:", parseError);
            setContenido(null);
          }
        } else {
          setContenido(null);
        }
      } catch (err) {
        console.error("Error al cargar proyecto:", err);
        setError("Error al cargar el proyecto");
      } finally {
        setIsLoading(false);
      }
    };

    const determinarAcceso = async (detalle: ProyectoDetalle): Promise<boolean> => {
      if (!idProyecto) return false;

      if (user?.rol === ROLES.ADMIN) {
        setForceReadOnly(true);
        setPuedeVer(true);
        return true;
      }

      if (user?.idUsuario) {
        const esIntegrante = await esUsuarioIntegrante();
        if (esIntegrante) {
          // Si el proyecto es final, forzar modo solo lectura
          setForceReadOnly(detalle.esFinal === true);
          setPuedeVer(true);
          return true;
        }

        if (detalle.esPublico) {
          setForceReadOnly(true);
          setPuedeVer(true);
          return true;
        }

        setError("Este proyecto es privado. Solo sus integrantes pueden ver el documento.");
        return false;
      }

      if (detalle.esPublico) {
        setForceReadOnly(true);
        setPuedeVer(true);
        return true;
      }

      setError("Este proyecto es privado. Debes iniciar sesiÃ³n y formar parte del proyecto para verlo.");
      return false;
    };

    const esUsuarioIntegrante = async (): Promise<boolean> => {
      if (!user?.idUsuario) return false;
      try {
        const response = await api.get(`/proyectos/${idProyecto}/integrantes`);
        const items = response.data?.data?.items || [];
        return items.some(
          (integrante: any) => integrante.idUsuario && integrante.idUsuario === user.idUsuario
        );
      } catch (err) {
        console.error("Error al verificar integrantes:", err);
        return false;
      }
    };

    void cargarProyecto();
  }, [idProyecto, user?.idUsuario, user?.rol]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando editor...</p>
        </div>
      </div>
    );
  }

  if (error || !puedeVer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md space-y-4">
          <p className="text-red-600 dark:text-red-400">
            {error || "No tienes permiso para ver este documento."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <DocumentEditor
      idProyecto={idProyecto!}
      initialContent={contenido}
      initialImages={imagenes}
      forceReadOnly={forceReadOnly}
    />
  );
}
