/**
 * Nombres de los roles del sistema
 * Estos nombres deben coincidir exactamente con los nombres en la base de datos
 */
export const ROLES = {
  ADMIN: "Administrador",
  DOCENTE: "Docente",
  ESTUDIANTE: "Estudiante",
} as const;

/**
 * Helper para verificar si un rol es Admin
 */
export const isAdmin = (rol: string): boolean => rol === ROLES.ADMIN;

/**
 * Helper para verificar si un rol es Docente
 */
export const isDocente = (rol: string): boolean => rol === ROLES.DOCENTE;

/**
 * Helper para verificar si un rol es Estudiante
 */
export const isEstudiante = (rol: string): boolean => rol === ROLES.ESTUDIANTE;
