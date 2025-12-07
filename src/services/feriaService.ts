import api from "./api";

export interface TareaResumenFeria {
  idTarea: string;
  orden: number;
  nombre: string;
  descripcion: string;
  fechaLimite: string;
  enviadosRevision: number;
  pendientesRevision: number;
}

export interface ResumenFeriaActiva {
  nombreFeria: string;
  semestre: number;
  anio: number;
  cantidadProyectosInscritos: number;
  cantidadProyectosPendientesAprobacion: number;
  cantidadProyectosAprobados: number;
  cantidadProyectosFinales: number;
  tareas: TareaResumenFeria[];
}

type ResumenFeriaActivaApi = Omit<ResumenFeriaActiva, "anio"> & {
  ["a\u00f1o"]: number;
};

interface ResumenFeriaResponse {
  success: boolean;
  message: string;
  data: ResumenFeriaActivaApi;
}

export const obtenerResumenFeriaActiva = async (): Promise<ResumenFeriaActiva> => {
  const response = await api.get<ResumenFeriaResponse>("/ferias/resumen-activa");
  const { ["año"]: rawYear, ...rest } = response.data.data;
  return {
    ...rest,
    anio: rawYear,
  };
};

// Interfaces para las tareas y ferias CRUD
export interface SubCalificacion {
  idSubCalificacion?: string;
  nombre: string;
  maximoPuntaje: number;
}

export interface TipoCalificacion {
  idTipoCalificacion?: string;
  nombre: string;
  subCalificaciones: SubCalificacion[];
}

export interface Tarea {
  idTarea?: string;
  nombre: string;
  descripcion?: string;
  fechaLimite: string;
  orden: number;
  esFinal?: boolean;
  idFeria?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface Feria {
  idFeria: string;
  nombre: string;
  semestre: number;
  año: number;
  estaActivo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  tipoCalificacion?: TipoCalificacion;
  tareas?: Tarea[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: {
    count: number;
    items: T[];
  };
}

export interface FeriasResponse {
  items: Feria[];
  count: number;
}

export interface FeriaCreacion {
  nombre: string;
  semestre: number;
  año: number;
  estaActivo?: boolean;
  tipoCalificacion: {
    nombre: string;
    subCalificaciones: SubCalificacion[];
  };
  tareas?: Omit<Tarea, 'idTarea' | 'idFeria' | 'fechaCreacion' | 'fechaActualizacion'>[];
}

export interface FeriaActualizacion {
  nombre?: string;
  semestre?: number;
  año?: number;
  estaActivo?: boolean;
  tipoCalificacion?: {
    nombre: string;
    subCalificaciones: SubCalificacion[];
  };
  tareas?: Omit<Tarea, 'idFeria' | 'fechaCreacion' | 'fechaActualizacion'>[];
}

interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Obtener todas las ferias
export const obtenerFerias = async (): Promise<FeriasResponse> => {
  const response = await api.get<ApiResponse<Feria>>('/ferias');
  return {
    items: response.data?.data?.items || [],
    count: response.data?.data?.count || 0
  };
};

// Obtener una feria por ID
export const obtenerFeriaPorId = async (id: string): Promise<Feria> => {
  const response = await api.get<{ success: boolean; data: Feria }>(`/ferias/${id}`);
  return response.data.data;
};

// Crear una nueva feria con sus tareas
export const crearFeria = async (data: FeriaCreacion): Promise<Feria> => {
  const response = await api.post<ApiSuccessResponse<Feria>>("/ferias", data);
  return response.data.data;
};

// Actualizar una feria
export const actualizarFeria = async (id: string, data: FeriaActualizacion): Promise<Feria> => {
  const response = await api.put<ApiSuccessResponse<Feria>>(`/ferias/${id}`, data);
  return response.data.data;
};

// Eliminar una feria
export const eliminarFeria = async (id: string): Promise<void> => {
  await api.delete(`/ferias/${id}`);
};

// Obtener la feria activa con toda su información
export interface FeriaActiva {
  idFeria: string;
  nombre: string;
  semestre: number;
  año: number;
  estaActivo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  cantidadProyectosInscritos: number;
  cantidadProyectosPendientesAprobacion: number;
  cantidadProyectosAprobados: number;
  cantidadProyectosFinales: number;
}

export const obtenerFeriaActiva = async (): Promise<FeriaActiva | null> => {
  try {
    const response = await api.get<ApiSuccessResponse<FeriaActiva>>('/ferias/activa');
    return response.data.data;
  } catch (error) {
    return null;
  }
};

// Obtener ferias pasadas (no activas)
export const obtenerFeriasPasadas = async (): Promise<Feria[]> => {
  const response = await api.get<ApiResponse<Feria>>('/ferias/pasadas');
  return response.data?.data?.items || [];
};

