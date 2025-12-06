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
  const response = await api.get<ApiSuccessResponse<Estudiante>>(`estudiantes/${id}`);
  return response.data.data;
};

// Obtener el estudiante actual basado en el usuario autenticado
export const obtenerEstudianteActual = async (): Promise<Estudiante> => {
  const response = await api.get<ApiSuccessResponse<Estudiante>>("estudiantes/me");
  return response.data.data;
};

// Interfaz para el perfil destacado del leaderboard
export interface PerfilDestacado {
  idEstudiante: string;
  codigoEstudiante: string;
  nombreCompleto: string;
  email: string;
  redesSociales: {
    instagram: string | null;
    linkedin: string | null;
    github: string | null;
  };
  totalProyectos: number;
  promedioNotas: number;
  proyectosGanadores: number;
  posicion: number;
}

interface ApiResponseLeaderboard {
  success: boolean;
  message: string;
  data: {
    items: PerfilDestacado[];
    count: number;
  };
}

// Obtener el top de estudiantes destacados
export const obtenerPerfilesDestacados = async (limite: number = 10): Promise<PerfilDestacado[]> => {
  const response = await api.get<ApiResponseLeaderboard>(`/estudiantes/leaderboard?limite=${limite}`);
  const items = response.data?.data?.items || [];
  
  // Convertir promedioNotas de string a number si viene como string
  return items.map(item => ({
    ...item,
    promedioNotas: typeof item.promedioNotas === 'string' ? parseFloat(item.promedioNotas) : item.promedioNotas
  }));
};

