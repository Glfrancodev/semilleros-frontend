import api from "./api";

// Interfaces para las tareas
export interface Tarea {
  idTarea: string;
  nombre: string;
  descripcion: string | null;
  fechaLimite: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  orden: number;
  idFeria: string;
  feria?: {
    idFeria: string;
    nombre: string;
    descripcion: string | null;
    semestre: number;
    año: number;
    estaActivo: boolean;
  };
}

interface TareasOrdenCeroResponse {
  success: boolean;
  message: {
    tareas: Tarea[];
    count: number;
  };
  data: string;
}

interface TareasResponse {
  success: boolean;
  message: string;
  data: {
    tareas: Tarea[];
    count: number;
  };
}

interface TareaResponse {
  success: boolean;
  message: string;
  data: {
    tarea: Tarea;
  };
}

// Obtener todas las tareas
export const obtenerTareas = async (): Promise<Tarea[]> => {
  const response = await api.get<TareasResponse>('/tareas');
  return response.data.data.tareas;
};

// Obtener tareas de orden 0 (inscripciones)
export const obtenerTareasInscripcion = async (): Promise<Tarea[]> => {
  const response = await api.get<TareasOrdenCeroResponse>('/tareas/orden/cero');
  return response.data.message.tareas;
};

// Obtener una tarea por ID
export const obtenerTareaPorId = async (id: string): Promise<Tarea> => {
  const response = await api.get<TareaResponse>(`/tareas/${id}`);
  return response.data.data.tarea;
};

// Crear una nueva tarea
export const crearTarea = async (data: Partial<Tarea>): Promise<Tarea> => {
  const response = await api.post<TareaResponse>('/tareas', data);
  return response.data.data.tarea;
};

// Actualizar una tarea
export const actualizarTarea = async (id: string, data: Partial<Tarea>): Promise<Tarea> => {
  const response = await api.put<TareaResponse>(`/tareas/${id}`, data);
  return response.data.data.tarea;
};

// Eliminar una tarea
export const eliminarTarea = async (id: string): Promise<void> => {
  await api.delete(`/tareas/${id}`);
};
