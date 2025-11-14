import api from "./api";

// Interfaces para los eventos
export interface Evento {
  idEvento: string;
  nombre: string;
  descripcion: string | null;
  fechaProgramada: string;
  estaActivo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

interface EventosResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    items: Evento[];
  };
}

// Obtener todos los eventos
export const obtenerEventos = async (): Promise<Evento[]> => {
  const response = await api.get<EventosResponse>('/eventos');
  return response.data.data.items;
};

// Obtener un evento por ID
export const obtenerEventoPorId = async (id: string): Promise<Evento> => {
  const response = await api.get<{ success: boolean; data: Evento }>(`/eventos/${id}`);
  return response.data.data;
};
