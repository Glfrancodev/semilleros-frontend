import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProyectoDetalle, actualizarVisibilidadProyecto, actualizarProyectoEsFinal } from "../../../services/proyectoService";
import api from "../../../services/api";
import Button from "../../../components/ui/button/Button";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../constants/roles";

interface ProyectoInfoCardProps {
  proyecto: ProyectoDetalle;
  onUpdate?: () => void;
}

interface DatosProgreso {
  totalRevisiones: number;
  totalTareas: number;
  progreso: number;
}

export default function ProyectoInfoCard({ proyecto, onUpdate }: ProyectoInfoCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [datosProgreso, setDatosProgreso] = useState<DatosProgreso>({
    totalRevisiones: 0,
    totalTareas: 0,
    progreso: 0,
  });
  const [isPublico, setIsPublico] = useState<boolean>(proyecto.esPublico ?? false);
  const [esLiderActual, setEsLiderActual] = useState(false);
  const [esIntegrante, setEsIntegrante] = useState(false);
  const [cambiandoVisibilidad, setCambiandoVisibilidad] = useState(false);
  const [tareaFinalCalificada, setTareaFinalCalificada] = useState(false);
  const [procesandoFeria, setProcesandoFeria] = useState(false);

  useEffect(() => {
    cargarDatosProgreso();
  }, [proyecto.idProyecto]);

  useEffect(() => {
    setIsPublico(proyecto.esPublico ?? false);
  }, [proyecto.esPublico]);

  const cargarDatosProgreso = async () => {
    try {
      // Obtener tareas organizadas del proyecto
      const resTareasOrg = await api.get(`/proyectos/${proyecto.idProyecto}/tareas-organizadas`);
      const tareasData = resTareasOrg.data.data;
      
      const tareasCompletadas = tareasData.completado?.length || 0;
      const totalTareas = (tareasData.enProceso?.length || 0) + (tareasData.completado?.length || 0) + (tareasData.pendiente?.length || 0);
      
      const progreso = totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0;

      setDatosProgreso({
        totalRevisiones: tareasCompletadas,
        totalTareas,
        progreso,
      });

      // Verificar si la tarea final fue calificada
      const todasLasTareas = [...(tareasData.completado || []), ...(tareasData.enProceso || []), ...(tareasData.pendiente || [])];
      const tareaFinal = todasLasTareas.find((t: any) => t.esFinal === true);
      
      if (tareaFinal) {
        // Verificar si esta tarea final está en completado
        const estaCalificada = tareasData.completado?.some((t: any) => t.idTarea === tareaFinal.idTarea);
        setTareaFinalCalificada(estaCalificada || false);
      } else {
        setTareaFinalCalificada(false);
      }
    } catch (error) {
      console.error("Error al cargar datos de progreso:", error);
    }
  };

  useEffect(() => {
    const verificarLiderazgo = async () => {
      try {
        const response = await api.get(`/proyectos/${proyecto.idProyecto}/integrantes`);
        const items = response.data?.data?.items || [];
        const esLider = items.some(
          (integrante: any) =>
            integrante.esLider && integrante.idUsuario && integrante.idUsuario === user?.idUsuario
        );
        // Verificar si el usuario es integrante del proyecto
        const esIntegranteProyecto = items.some(
          (integrante: any) => integrante.idUsuario === user?.idUsuario
        );
        setEsLiderActual(esLider);
        setEsIntegrante(esIntegranteProyecto);
      } catch (error) {
        console.error("Error al obtener integrantes para verificar liderazgo:", error);
        setEsLiderActual(false);
        setEsIntegrante(false);
      }
    };

    if (user?.idUsuario) {
      void verificarLiderazgo();
    } else {
      setEsLiderActual(false);
      setEsIntegrante(false);
    }
  }, [proyecto.idProyecto, user?.idUsuario]);

  // Determinar el estado del proyecto (null = En revisión, true = Aprobado, false = Denegado)
  const estado = proyecto.estaAprobado === null 
    ? "En revisión" 
    : proyecto.estaAprobado 
      ? "Aprobado" 
      : "Denegado";
  
  const estadoColor = proyecto.estaAprobado === null
    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
    : proyecto.estaAprobado 
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" 
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
  const visibilidadColor = isPublico
    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
    : "bg-gray-200 text-gray-700 dark:bg-gray-800/50 dark:text-gray-200";
  const estadoFeriaLabel =
    proyecto.esFinal === null
      ? "En proceso para exposición en feria"
      : proyecto.esFinal
      ? "Aprobado para exposición en feria"
      : "Denegado para exposición en feria";
  const estadoFeriaColor =
    proyecto.esFinal === null
      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200"
      : proyecto.esFinal
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
      : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300";

  const handleToggleVisibilidad = async () => {
    try {
      setCambiandoVisibilidad(true);
      const nuevoEstado = !isPublico;
      await actualizarVisibilidadProyecto(proyecto.idProyecto, nuevoEstado);
      setIsPublico(nuevoEstado);
      onUpdate?.();
      toast.success(`El proyecto ahora es ${nuevoEstado ? "público" : "privado"}.`);
    } catch (error: any) {
      console.error("Error al cambiar visibilidad del proyecto:", error);
      toast.error(error?.response?.data?.message || "No se pudo cambiar la visibilidad.");
    } finally {
      setCambiandoVisibilidad(false);
    }
  };

  const handleAprobarParaFeria = async () => {
    try {
      setProcesandoFeria(true);
      await actualizarProyectoEsFinal(proyecto.idProyecto, true);
      toast.success("Proyecto aprobado para exponer en la feria");
      onUpdate?.();
    } catch (error: any) {
      console.error("Error al aprobar proyecto para feria:", error);
      toast.error(error?.response?.data?.message || "No se pudo aprobar el proyecto para la feria");
    } finally {
      setProcesandoFeria(false);
    }
  };

  const handleRechazarParaFeria = async () => {
    try {
      setProcesandoFeria(true);
      await actualizarProyectoEsFinal(proyecto.idProyecto, false);
      toast.success("Proyecto rechazado para exposición en feria");
      onUpdate?.();
    } catch (error: any) {
      console.error("Error al rechazar proyecto para feria:", error);
      toast.error(error?.response?.data?.message || "No se pudo rechazar el proyecto para la feria");
    } finally {
      setProcesandoFeria(false);
    }
  };

  const handleUnirseReunion = () => {
    // Verificar que el usuario sea integrante del proyecto
    if (!esIntegrante) {
      toast.error('Solo los integrantes del proyecto pueden acceder a la reunión');
      return;
    }
    
    // Abrir sala de videollamada en nueva pestaña
    const userName = user?.nombre ? `${user.nombre} ${user.apellido || ''}`.trim() : 'Usuario';
    const url = `/reunion/${proyecto.idProyecto}?userName=${encodeURIComponent(userName)}&proyecto=${encodeURIComponent(proyecto.nombre)}`;
    window.open(url, '_blank');
    toast.success('Abriendo sala de reunión...');
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        Información del Proyecto
      </h3>
      
      {/* Título y estado */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {proyecto.nombre}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {proyecto.descripcion}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-start">
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap self-start ${estadoColor}`}>
              {estado}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap self-start ${visibilidadColor}`}>
              {isPublico ? "Público" : "Privado"}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap self-start ${estadoFeriaColor}`}>
              {estadoFeriaLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Materia:</span>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {proyecto.nombreMateria || "Sin materia"}
          </p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Grupo:</span>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {proyecto.grupo || "Sin grupo"}
          </p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Docente:</span>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {proyecto.nombreDocente || "Sin docente"}
          </p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de creación:</span>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(proyecto.fechaCreacion).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progreso del proyecto</span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{datosProgreso.progreso}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${datosProgreso.progreso}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {datosProgreso.totalRevisiones} de {datosProgreso.totalTareas} tareas completadas
        </p>
      </div>

      {/* Botón Ir al documento */}
      <Button
        onClick={() => navigate(`/estudiante/proyectos/${proyecto.idProyecto}/documento`)}
        className="w-full"
      >
        Ir al documento
      </Button>

      {/* Botones de Aprobación/Rechazo para Feria - Solo para admin cuando tarea final está calificada */}
      {user?.rol === ROLES.ADMIN && tareaFinalCalificada && proyecto.esFinal === null && (
        <div className="mt-3 flex gap-2">
          <Button
            onClick={handleAprobarParaFeria}
            disabled={procesandoFeria}
            className="flex-1"
          >
            {procesandoFeria ? "Procesando..." : "Aprobar para exponer en feria"}
          </Button>
          <Button
            onClick={handleRechazarParaFeria}
            disabled={procesandoFeria}
            className="flex-1"
          >
            {procesandoFeria ? "Procesando..." : "Rechazar para exponer en feria"}
          </Button>
        </div>
      )}
      
      {/* Botón Unirse a la reunión - solo para integrantes */}
      {esIntegrante && (
        <Button
          onClick={handleUnirseReunion}
          className="w-full mt-3"
        >
          📹 Unirse a la reunión
        </Button>
      )}

      {esLiderActual && (
        <Button
          size="sm"
          className="w-full mt-3"
          onClick={() => void handleToggleVisibilidad()}
          disabled={cambiandoVisibilidad}
        >
          {cambiandoVisibilidad
            ? "Actualizando..."
            : isPublico
            ? "Hacer privado 🔒"
            : "Hacer público 🔓"}
        </Button>
      )}
    </div>
  );
}
