import api from "./api";

// Interfaces para las convocatorias
export interface Convocatoria {
  idConvocatoria: string;
  nombre: string;
  descripcion: string | null;
  semestre: number;
  año: number;
  estaActivo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

interface ConvocatoriasResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    items: Convocatoria[];
  };
}

// Obtener todas las convocatorias
export const obtenerConvocatorias = async (): Promise<Convocatoria[]> => {
  const response = await api.get<ConvocatoriasResponse>('/convocatorias');
  return response.data.data.items;
};

// Obtener una convocatoria por ID
export const obtenerConvocatoriaPorId = async (id: string): Promise<Convocatoria> => {
  const response = await api.get<{ success: boolean; data: Convocatoria }>(`/convocatorias/${id}`);
  return response.data.data;
};
