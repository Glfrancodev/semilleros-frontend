import api from "./api";

// Interfaces basadas en la respuesta del backend
export interface Rol {
  idRol: string;
  nombre: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface Estudiante {
  idEstudiante: string;
  codigoEstudiante: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  idUsuario: string;
}

export interface Docente {
  idDocente: string;
  codigoDocente: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  idUsuario: string;
}

export interface Administrativo {
  idAdministrativo: string;
  codigoAdministrativo: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  idUsuario: string;
}

export interface FotoPerfil {
  idArchivo: string;
  url: string;
  formato: string;
}

export interface Usuario {
  idUsuario: string;
  ci: string;
  nombre: string;
  apellido: string;
  correo: string;
  instagram: string | null;
  linkedin: string | null;
  github: string | null;
  bio: string | null;
  estaActivo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  idRol: string;
  Rol: Rol;
  Estudiante: Estudiante | null;
  Docente: Docente | null;
  Administrativo: Administrativo | null;
  fotoPerfil: FotoPerfil | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: {
    count: number;
    items: T[];
  };
}

export interface UsuariosResponse {
  usuarios: Usuario[];
  count: number;
}

// Obtener todos los usuarios
export const obtenerUsuarios = async (): Promise<UsuariosResponse> => {
  const response = await api.get<ApiResponse<Usuario>>('/usuarios');
  return {
    usuarios: response.data?.data?.items || [],
    count: response.data?.data?.count || 0
  };
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = async (id: string): Promise<Usuario> => {
  const response = await api.get<Usuario>(`/usuarios/${id}`);
  return response.data;
};

export interface UsuarioCreacion {
  ci: string;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  idRol: string;
}

export interface UsuarioActualizacion {
  ci?: string;
  nombre?: string;
  apellido?: string;
  correo?: string;
  idRol?: string;
}

interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Crear un nuevo usuario
export const crearUsuario = async (data: UsuarioCreacion): Promise<Usuario> => {
  const response = await api.post<ApiSuccessResponse<Usuario>>("/usuarios", data);
  return response.data.data;
};

// Actualizar un usuario
export const actualizarUsuario = async (id: string, data: UsuarioActualizacion): Promise<Usuario> => {
  const response = await api.put<ApiSuccessResponse<Usuario>>(`/usuarios/${id}`, data);
  return response.data.data;
};

// Cambiar estado del usuario (soft delete)
export const toggleEstadoUsuario = async (id: string): Promise<void> => {
  await api.patch(`/usuarios/${id}/estado`);
};
