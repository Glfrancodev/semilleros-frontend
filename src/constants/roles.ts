/**
 * UUIDs de los roles del sistema
 * Estos IDs deben coincidir con los UUIDs en la base de datos
 */
export const ROLES = {
  ADMIN: "2ec03aae-a825-4a02-bae1-cd8de7ed4890",
  DOCENTE: "3b76fc70-b5bc-47db-ad91-62da6a1c2ebe",
  ESTUDIANTE: "bd4eff72-d3bb-44dc-8ab0-6d90d0ec0d00",
} as const;

/**
 * Nombres legibles de los roles
 */
export const ROL_NOMBRES = {
  [ROLES.ADMIN]: "Administrador",
  [ROLES.DOCENTE]: "Docente",
  [ROLES.ESTUDIANTE]: "Estudiante",
} as const;

/**
 * Helper para verificar si un rol es Admin
 */
export const isAdmin = (rolId: string): boolean => rolId === ROLES.ADMIN;

/**
 * Helper para verificar si un rol es Docente
 */
export const isDocente = (rolId: string): boolean => rolId === ROLES.DOCENTE;

/**
 * Helper para verificar si un rol es Estudiante
 */
export const isEstudiante = (rolId: string): boolean => rolId === ROLES.ESTUDIANTE;
