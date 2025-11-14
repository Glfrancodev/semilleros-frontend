import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProyectoDetalle } from "../../../services/proyectoService";
import api from "../../../services/api";
import Button from "../../../components/ui/button/Button";

interface ProyectoInfoCardProps {
  proyecto: ProyectoDetalle;
}

interface DatosProgreso {
  totalRevisiones: number;
  totalTareas: number;
  progreso: number;
}

export default function ProyectoInfoCard({ proyecto }: ProyectoInfoCardProps) {
  const navigate = useNavigate();
  const [datosProgreso, setDatosProgreso] = useState<DatosProgreso>({
    totalRevisiones: 0,
    totalTareas: 0,
    progreso: 0,
  });

  useEffect(() => {
    cargarDatosProgreso();
  }, [proyecto.idProyecto]);

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
    } catch (error) {
      console.error("Error al cargar datos de progreso:", error);
    }
  };

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
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap self-start ${estadoColor}`}>
          {estado}
        </span>
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
    </div>
  );
}
