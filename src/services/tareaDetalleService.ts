import api from "./api";

export interface ProyectoTareaDetalle {
  idProyecto: string;
  nombre: string;
  descripcion: string;
  fechaEnvio: string;
  revisado: boolean;
}

export interface TareaDetalle {
  idTarea: string;
  orden: number;
  nombre: string;
  descripcion: string;
  fechaLimite: string;
  idFeria: string;
  revisionesEnviadas: number;
  revisionesPendientes: number;
  proyectos: ProyectoTareaDetalle[];
}

export const obtenerTareaDetalle = async (idTarea: string): Promise<TareaDetalle> => {
  const response = await api.get(`/tareas/${idTarea}/detalle`);
  return response.data.message;
};
