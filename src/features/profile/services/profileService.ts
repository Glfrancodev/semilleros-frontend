import api from '../../../services/api';

export interface UserProfile {
  idUsuario: string; // UUID en el backend
  ci: string;
  nombre: string;
  apellido: string;
  correo: string;
  estaActivo: boolean;
  idRol: number;
  // Foto de perfil
  fotoPerfil?: {
    idArchivo: string;
    url: string;
    formato: string;
  } | null;
  // Redes sociales (opcionales)
  instagram?: string | null;
  linkedin?: string | null;
  github?: string | null;
  bio?: string | null;
  // Timestamps
  fechaCreacion?: string;
  fechaActualizacion?: string;
  Rol?: {
    idRol: number;
    nombre: string;
    descripcion: string;
  };
  Estudiante?: {
    idEstudiante: string;
    codigoEstudiante: string;
    fechaCreacion?: string;
    fechaActualizacion?: string;
  };
  Docente?: {
    idDocente: string;
    codigoDocente: string;
    fechaCreacion?: string;
    fechaActualizacion?: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

/**
 * Obtiene el perfil del usuario autenticado
 */
export async function getProfile(): Promise<UserProfile> {
  const { data } = await api.get<ProfileResponse>('/usuarios/perfil');
  return data.data;
}

/**
 * Obtiene el perfil público de un estudiante (sin autenticación requerida)
 */
export async function getPublicProfile(idEstudiante: string): Promise<UserProfile> {
  const { data } = await api.get<ProfileResponse>(`/estudiantes/${idEstudiante}/perfil-publico`);
  return data.data;
}

/**
 * Actualiza el perfil del usuario
 */
export async function updateProfile(idUsuario: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const { data } = await api.put<ProfileResponse>(`/usuarios/${idUsuario}`, updates);
  return data.data;
}

/**
 * Sube una foto de perfil y devuelve el nuevo token con la URL actualizada
 */
export async function uploadProfilePhoto(file: File): Promise<{ token: string; fotoPerfil: any }> {
  const formData = new FormData();
  formData.append('foto', file);
  
  const { data } = await api.post('/usuarios/perfil/foto', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return data.data; // { token, fotoPerfil }
}
