import api from "./api";

export interface AdministrativoAudit {
  idAdministrativo: string;
  codigoAdministrativo: string;
  usuario?: {
    nombre: string;
    apellido: string;
    correo: string;
  };
}

// Interfaces basadas en la respuesta del backend
export interface Evento {
  idEvento: string;
  nombre: string;
  descripcion: string;
  fechaProgramada: string;
  capacidadMaxima: number | null;
  cantidadInscritos?: number;
  totalEstudiantes?: number;
  estaActivo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor?: string;
  actualizadoPor?: string;
  creador?: AdministrativoAudit;
  actualizador?: AdministrativoAudit;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: {
    count: number;
    items: T[];
  };
}

export interface EventosResponse {
  eventos: Evento[];
  count: number;
}

// Obtener todos los eventos
export const obtenerEventos = async (): Promise<EventosResponse> => {
  const response = await api.get<ApiResponse<Evento>>('/eventos');
  return {
    eventos: response.data?.data?.items || [],
    count: response.data?.data?.count || 0
  };
};

// Obtener un evento por ID
export const obtenerEventoPorId = async (id: string): Promise<Evento> => {
  const response = await api.get<Evento>(`/eventos/${id}`);
  return response.data;
};

export interface EventoCreacion {
  nombre: string;
  descripcion?: string;
  fechaProgramada: string;
  capacidadMaxima?: number | null;
  estaActivo?: boolean;
}

export interface EventoActualizacion {
  nombre?: string;
  descripcion?: string;
  fechaProgramada?: string;
  capacidadMaxima?: number | null;
  estaActivo?: boolean;
}

interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Crear un nuevo evento
export const crearEvento = async (data: EventoCreacion): Promise<Evento> => {
  const response = await api.post<ApiSuccessResponse<Evento>>("/eventos", data);
  return response.data.data;
};

// Actualizar un evento
export const actualizarEvento = async (id: string, data: EventoActualizacion): Promise<Evento> => {
  const response = await api.put<ApiSuccessResponse<Evento>>(`/eventos/${id}`, data);
  return response.data.data;
};

// Eliminar un evento
export const eliminarEvento = async (id: string): Promise<void> => {
  await api.delete(`/eventos/${id}`);
};
