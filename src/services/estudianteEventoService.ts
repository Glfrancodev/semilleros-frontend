import api from "./api";

export interface EstudianteEvento {
  idEstudianteEvento: string;
  idEstudiante: string;
  idEvento: string;
  fechaInscripcion: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Inscribir un estudiante a un evento
export const inscribirEstudianteEvento = async (
  idEstudiante: string,
  idEvento: string
): Promise<EstudianteEvento> => {
  const response = await api.post<ApiResponse<EstudianteEvento>>(
    "/estudiante-eventos",
    {
      idEstudiante,
      idEvento,
    }
  );
  return response.data.data;
};

// Verificar si un estudiante está inscrito en un evento
export const verificarInscripcion = async (
  idEstudiante: string,
  idEvento: string
): Promise<boolean> => {
  try {
    const response = await api.get<ApiResponse<{ count: number; items: EstudianteEvento[] }>>(
      "/estudiante-eventos"
    );
    const inscripciones = response.data.data.items || [];
    return inscripciones.some(
      (inscripcion) =>
        inscripcion.idEstudiante === idEstudiante &&
        inscripcion.idEvento === idEvento
    );
  } catch (error) {
    console.error("Error al verificar inscripción:", error);
    return false;
  }
};

// Desinscribir un estudiante de un evento
export const desinscribirEstudianteEvento = async (
  idEstudianteEvento: string
): Promise<void> => {
  await api.delete(`/estudiante-eventos/${idEstudianteEvento}`);
};

// Obtener inscripciones de un estudiante
export const obtenerInscripcionesEstudiante = async (
  idEstudiante: string
): Promise<EstudianteEvento[]> => {
  const response = await api.get<ApiResponse<{ count: number; items: EstudianteEvento[] }>>(
    "/estudiante-eventos"
  );
  const inscripciones = response.data.data.items || [];
  return inscripciones.filter(
    (inscripcion) => inscripcion.idEstudiante === idEstudiante
  );
};
