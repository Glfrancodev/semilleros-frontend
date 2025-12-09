import api from "./api";

export interface Docente {
  idDocente: string;
  codigoDocente: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  idUsuario: string;
  usuario?: {
    idUsuario: string;
    nombre: string;
    apellido: string;
    correo: string;
  };
}

interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ApiListResponse<T> {
  success: boolean;
  message: string;
  data: {
    count: number;
    items: T[];
  };
}

// Obtener todos los docentes
export const obtenerDocentes = async (): Promise<Docente[]> => {
  const response = await api.get<ApiListResponse<Docente>>("/docentes");
  return response.data.data.items;
};

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
