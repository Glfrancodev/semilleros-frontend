import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DocumentEditor } from "../../../components/components/Editor";
import { obtenerContenidoEditor } from "../../../services/proyectoService";

export default function DocumentoEditorPage() {
  const { idProyecto } = useParams<{ idProyecto: string }>();
  const navigate = useNavigate();
  const [contenido, setContenido] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idProyecto) {
      navigate("/estudiante/proyectos/mis-proyectos");
      return;
    }

    const cargarProyecto = async () => {
      try {
        setIsLoading(true);
        const data = await obtenerContenidoEditor(idProyecto);

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

    cargarProyecto();
  }, [idProyecto, navigate]);

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => navigate("/estudiante/proyectos/mis-proyectos")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver a mis proyectos
          </button>
        </div>
      </div>
    );
  }

  return <DocumentEditor idProyecto={idProyecto!} initialContent={contenido} />;
}
