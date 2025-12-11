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
  try {
    const response = await api.get<ResumenFeriaResponse>("/ferias/resumen-activa");
    const { ["año"]: rawYear, ...rest } = response.data.data;
    return {
      ...rest,
      anio: rawYear,
    };
  } catch (error: any) {
    // Si es un error 404, lanzar un error específico
    if (error.response?.status === 404) {
      throw new Error("No hay feria activa");
    }
    throw error;
  }
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

export interface AdministrativoFeria {
  idAdministrativo: string;
  codigoAdministrativo: string;
  usuario?: {
    nombre: string;
    apellido: string;
    correo: string;
  };
}

export interface Feria {
  idFeria: string;
  nombre: string;
  semestre: number;
  año: number;
  estado: 'Borrador' | 'Activo' | 'Finalizado';
  ganadores?: any;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor?: string;
  actualizadoPor?: string;
  creador?: AdministrativoFeria;
  actualizador?: AdministrativoFeria;
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
  estado?: 'Borrador' | 'Activo' | 'Finalizado';
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
  estado?: 'Borrador' | 'Activo' | 'Finalizado';
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
  estado: 'Borrador' | 'Activo' | 'Finalizado';
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

// Finalizar feria y calcular ganadores
export const finalizarFeria = async (idFeria: string): Promise<{ message: string; ganadores: any[] }> => {
  const response = await api.post<ApiSuccessResponse<{ message: string; ganadores: any[] }>>(`/ferias/${idFeria}/finalizar`);
  return response.data.data;
};

// Interfaces para proyectos finales
export interface IntegranteProyectoFinal {
  idEstudiante: string;
  nombreCompleto: string;
}

export interface ProyectoFinal {
  idProyecto: string;
  nombre: string;
  descripcion: string;
  notaPromedio: number;
  integrantes: IntegranteProyectoFinal[];
}

export interface ProyectosFinalesResponse {
  count: number;
  proyectos: ProyectoFinal[];
}

// Obtener proyectos finales y calificados de una feria
export const obtenerProyectosFinalesFeria = async (idFeria: string): Promise<ProyectosFinalesResponse> => {
  const response = await api.get<ApiSuccessResponse<ProyectosFinalesResponse>>(`/ferias/${idFeria}/proyectos-finales`);
  return response.data.data;
};

