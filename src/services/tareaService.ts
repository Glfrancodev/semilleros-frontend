import api from "./api";

export interface FeriaTarea {
  idFeria: string;
  nombre: string;
  semestre: number;
  ["a\u00f1o"]: number;
}

export interface Tarea {
  idTarea: string;
  orden: number;
  nombre: string;
  descripcion: string;
  fechaLimite: string;
  idFeria: string;
  esFinal?: boolean;
  feria?: FeriaTarea;
}

export interface ProyectoRevision {
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
  proyectos: ProyectoRevision[];
}

export interface CrearTareaPayload {
  nombre: string;
  descripcion: string;
  fechaLimite: string;
  orden: number;
  idFeria: string;
}

interface TareasInscripcionResponse {
  success: boolean;
  message: string;
  data: {
    items: Tarea[];
  };
}

interface TareaDetalleResponse {
  success: boolean;
  message: TareaDetalle;
  data: string;
}

export const obtenerTareasInscripcion = async (): Promise<Tarea[]> => {
  const response = await api.get<TareasInscripcionResponse>("/tareas/inscripcion");
  return response.data.data.items;
};

export const obtenerDetalleTarea = async (idTarea: string): Promise<TareaDetalle> => {
  const response = await api.get<TareaDetalleResponse>(`/tareas/${idTarea}/detalle`);
  return response.data.message;
};

export const crearTarea = async (payload: CrearTareaPayload): Promise<void> => {
  await api.post("/tareas", payload);
};
