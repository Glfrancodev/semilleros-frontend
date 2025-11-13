import api from "./api";

export interface Estudiante {
  idEstudiante: string;
  codigoEstudiante: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  idUsuario: string;
}

interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Crear un nuevo estudiante
export const crearEstudiante = async (data: { codigoEstudiante: string; idUsuario: string }): Promise<Estudiante> => {
  const response = await api.post<ApiSuccessResponse<Estudiante>>("/estudiantes", data);
  return response.data.data;
};

// Actualizar un estudiante
export const actualizarEstudiante = async (id: string, data: { codigoEstudiante: string }): Promise<Estudiante> => {
  const response = await api.put<ApiSuccessResponse<Estudiante>>(`/estudiantes/${id}`, data);
  return response.data.data;
};

// Obtener estudiante por ID
export const obtenerEstudiantePorId = async (id: string): Promise<Estudiante> => {
  const response = await api.get<ApiSuccessResponse<Estudiante>>(`/estudiantes/${id}`);
  return response.data.data;
};
