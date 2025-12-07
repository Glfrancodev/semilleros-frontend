import api from "./api";

export interface SubCalificacion {
  idSubCalificacion: string;
  nombre: string;
  maximoPuntaje: number;
}

export interface Calificacion {
  idCalificacion: string;
  puntajeObtenido: number;
  calificado: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  subCalificacion: SubCalificacion;
}

export interface CalificacionInput {
  idCalificacion: string;
  puntajeObtenido: number;
}

/**
 * Obtener todas las calificaciones de un proyecto para un docente
 */
export const obtenerCalificacionesProyecto = async (
  idDocenteProyecto: string
): Promise<Calificacion[]> => {
  const response = await api.get(
    `/calificaciones/proyecto/${idDocenteProyecto}`
  );
  return response.data.data;
};

/**
 * Calificar un proyecto (actualizar múltiples calificaciones)
 */
export const calificarProyecto = async (
  idDocenteProyecto: string,
  calificaciones: CalificacionInput[]
): Promise<Calificacion[]> => {
  const response = await api.post(
    `/calificaciones/calificar/${idDocenteProyecto}`,
    { calificaciones }
  );
  return response.data.data;
};
