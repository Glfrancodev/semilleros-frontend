import api from "./api";

export interface Semestre {
  idSemestre: string;
  numero: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: {
    count: number;
    items: T[];
  };
}

export interface SemestresResponse {
  items: Semestre[];
  count: number;
}

// Obtener todos los semestres con paginación y búsqueda
export const obtenerSemestres = async (
  page: number = 1,
  limit: number = 10,
  searchTerm: string = ""
): Promise<SemestresResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(searchTerm && { search: searchTerm }),
  });

  const response = await api.get<ApiResponse<Semestre>>(`/semestres?${params.toString()}`);
  return {
    items: response.data?.data?.items || [],
    count: response.data?.data?.count || 0
  };
};

// Obtener un semestre por ID
export const obtenerSemestrePorId = async (id: string): Promise<Semestre> => {
  const response = await api.get<{ success: boolean; data: Semestre }>(`/semestres/${id}`);
  return response.data.data;
};
