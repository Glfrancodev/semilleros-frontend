import { useState, useEffect } from "react";
import { Evento } from "../../../services/eventoService";
import Button from "../../../components/ui/button/Button";
import { useAuth } from "../../../context/AuthContext";
import { 
  inscribirEstudianteEvento, 
  verificarInscripcion 
} from "../../../services/estudianteEventoService";
import { obtenerEstudianteActual } from "../../../services/estudianteService";
import toast from "react-hot-toast";

interface EventoCardProps {
  evento: Evento;
}

export default function EventoCard({ evento }: EventoCardProps) {
  const { user } = useAuth();
  const [estaInscrito, setEstaInscrito] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [idEstudiante, setIdEstudiante] = useState<string | null>(null);

  // Obtener el idEstudiante del usuario autenticado
  useEffect(() => {
    cargarEstudiante();
  }, [user]);

  // Verificar si el estudiante ya está inscrito
  useEffect(() => {
    if (idEstudiante) {
      verificarInscripcionEstudiante();
    }
  }, [evento.idEvento, idEstudiante]);

  const cargarEstudiante = async () => {
    if (!user?.idUsuario) {
      setVerificando(false);
      return;
    }

    try {
      const estudiante = await obtenerEstudianteActual();
      setIdEstudiante(estudiante.idEstudiante);
    } catch (error) {
      console.error("Error al obtener estudiante:", error);
      setVerificando(false);
    }
  };

  const verificarInscripcionEstudiante = async () => {
    if (!idEstudiante) {
      setVerificando(false);
      return;
    }

    try {
      setVerificando(true);
      const inscrito = await verificarInscripcion(idEstudiante, evento.idEvento);
      setEstaInscrito(inscrito);
    } catch (error) {
      console.error("Error al verificar inscripción:", error);
    } finally {
      setVerificando(false);
    }
  };

  const handleInscribir = async () => {
    if (!idEstudiante) {
      toast.error("Debes iniciar sesión como estudiante para inscribirte");
      return;
    }

    if (estaInscrito) {
      toast.success("Ya estás inscrito en este evento");
      return;
    }

    try {
      setCargando(true);
      await inscribirEstudianteEvento(idEstudiante, evento.idEvento);
      setEstaInscrito(true);
      toast.success("Te has inscrito exitosamente al evento");
    } catch (error: any) {
      console.error("Error al inscribir:", error);
      toast.error(
        error.response?.data?.message || "Error al inscribirse al evento"
      );
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      {/* Título */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {evento.nombre}
      </h3>

      {/* Fecha */}
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded">
          📅 {formatearFecha(evento.fechaProgramada)}
        </span>
      </div>

      {/* Descripción */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {evento.descripcion || "Sin descripción disponible"}
      </p>

      {/* Botón */}
      <Button 
        variant={estaInscrito ? "outline" : "primary"}
        size="sm" 
        className="w-full"
        onClick={handleInscribir}
        disabled={cargando || verificando || estaInscrito}
      >
        {verificando ? "Verificando..." : estaInscrito ? "✓ Inscrito" : cargando ? "Inscribiendo..." : "Inscribir"}
      </Button>
    </div>
  );
}
