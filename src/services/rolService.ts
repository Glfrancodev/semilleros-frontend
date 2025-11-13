import api from "./api";

export interface Rol {
  idRol: string;
  nombre: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateRolDto {
  nombre: string;
}

export interface UpdateRolDto {
  nombre?: string;
}

// Interface para la respuesta del backend
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: {
    count: number;
    items: T[];
  };
}

// Obtener todos los roles
export const obtenerRoles = async (): Promise<Rol[]> => {
  const response = await api.get<ApiResponse<Rol>>('/roles');
  // Extraer los items del objeto data
  return response.data?.data?.items || [];
};

// Obtener un rol por ID
export const obtenerRolPorId = async (id: string): Promise<Rol> => {
  const response = await api.get<Rol>(`/roles/${id}`);
  return response.data;
};

// Crear un nuevo rol
export const crearRol = async (data: CreateRolDto): Promise<Rol> => {
  const response = await api.post<Rol>("/roles", data);
  return response.data;
};

// Actualizar un rol
export const actualizarRol = async (id: string, data: UpdateRolDto): Promise<Rol> => {
  const response = await api.put<Rol>(`/roles/${id}`, data);
  return response.data;
};

// Eliminar un rol
export const eliminarRol = async (id: string): Promise<void> => {
  await api.delete(`/roles/${id}`);
};
        