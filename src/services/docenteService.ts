import api from "./api";

export interface Docente {
  idDocente: string;
  codigoDocente: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  idUsuario: string;
}

interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Crear un nuevo docente
export const crearDocente = async (data: { codigoDocente: string; idUsuario: string }): Promise<Docente> => {
  const response = await api.post<ApiSuccessResponse<Docente>>("/docentes", data);
  return response.data.data;
};

// Actualizar un docente
export const actualizarDocente = async (id: string, data: { codigoDocente: string }): Promise<Docente> => {
  const response = await api.put<ApiSuccessResponse<Docente>>(`/docentes/${id}`, data);
  return response.data.data;
};

// Obtener docente por ID
export const obtenerDocentePorId = async (id: string): Promise<Docente> => {
  const response = await api.get<ApiSuccessResponse<Docente>>(`/docentes/${id}`);
  return response.data.data;
};
