import api from "./api";

// Interfaces para los proyectos
export interface Proyecto {
  idProyecto: string;
  nombre: string;
  descripcion: string;
  materia?: string;
  grupo?: string;
  nombreDocente?: string;
  urlLogo?: string | null;
  estaAprobado?: boolean;
  estaAprobadoTutor?: boolean | null;
  esFinal?: boolean | null;
  esPublico?: boolean;
  fechaCreacion: string;
  grupoSigla?: string;
  idGrupoMateria?: string;
}

export interface InvitacionProyecto {
  idEstudianteProyecto: string;
  invitacion: boolean | null;
  fechaCreacion: string;
  proyecto: {
    idProyecto: string;
    nombre: string;
    descripcion?: string;
    materia?: string;
    grupo?: string;
    nombreDocente?: string;
    lider?: string;
  };
}

export interface ProyectoDetalle {
  idProyecto: string;
  nombre: string;
  descripcion: string;
  contenido?: string | null;
  estaAprobado: boolean | null;
  estaAprobadoTutor: boolean | null;
  esFinal: boolean | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  nombreDocente: string;
  nombreMateria: string;
  grupo: string;
  urlLogo: string | null;
  urlTriptico: string | null;
  urlBanner: string | null;
  esPublico: boolean;
}

export interface CrearProyectoData {
  nombre: string;
  descripcion: string;
  idGrupoMateria: string;
  idConvocatoria?: string; // Ahora es opcional porque ya no se relaciona directamente
  esPublico?: boolean;
}

interface MisProyectosResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    items: Proyecto[];
  };
}

interface ProyectoDetalleResponse {
  success: boolean;
  message: string;
  data: ProyectoDetalle;
}

// Obtener los proyectos del estudiante actual
export const obtenerMisProyectos = async (): Promise<Proyecto[]> => {
  const response = await api.get<MisProyectosResponse>('/proyectos/mis-proyectos');
  return response.data.data.items;
};

// Obtener los proyectos donde soy invitado (invitación aceptada)
export const obtenerMisProyectosInvitado = async (): Promise<Proyecto[]> => {
  const response = await api.get<MisProyectosResponse>('/proyectos/mis-proyectos-invitados');
  return response.data.data.items;
};

// Obtener invitaciones pendientes/registradas del estudiante autenticado
export const obtenerMisInvitaciones = async (): Promise<{
  count: number;
  items: InvitacionProyecto[];
}> => {
  const response = await api.get('/estudiante-proyectos/mis-invitaciones');
  const body = response.data ?? {};
  const payload = (body.message as any) ?? body.data ?? {};
  return {
    count: payload.count ?? 0,
    items: payload.items ?? [],
  };
};

// Aceptar/Rechazar invitación
export const responderInvitacion = async (
  idEstudianteProyecto: string,
  aceptar: boolean
): Promise<void> => {
  await api.put(`/estudiante-proyectos/${idEstudianteProyecto}`, {
    invitacion: aceptar,
  });
};

// Obtener un proyecto por ID con todos sus detalles
export const obtenerProyectoPorId = async (idProyecto: string): Promise<ProyectoDetalle> => {
  const response = await api.get<ProyectoDetalleResponse>(`/proyectos/${idProyecto}`);
  return response.data.data;
};

// Crear un nuevo proyecto
export const crearProyecto = async (
  data: CrearProyectoData
): Promise<any> => {
  const payload: any = {
    nombre: data.nombre,
    descripcion: data.descripcion,
    estaAprobado: null, // null = En revisión
    esFinal: null, // null hasta que se defina si es final
    idGrupoMateria: data.idGrupoMateria,
    esPublico: data.esPublico ?? false,
  };
  
  // Solo incluir idConvocatoria si existe (para compatibilidad con código antiguo)
  if (data.idConvocatoria) {
    payload.idConvocatoria = data.idConvocatoria;
  }
  
  const response = await api.post("proyectos", payload);
  return response.data.data;
};

// Crear la relación EstudianteProyecto
export const crearEstudianteProyecto = async (
  idProyecto: string,
  idEstudiante: string,
  esLider?: boolean,
  invitacion?: boolean
): Promise<any> => {
  const response = await api.post("estudiante-proyectos", {
    idProyecto,
    idEstudiante,
    ...(esLider !== undefined && { esLider }),
    ...(invitacion !== undefined && { invitacion }),
  });
  return response.data.data;
};

// Actualizar el contenido del proyecto
export const actualizarContenidoProyecto = async (
  idProyecto: string,
  contenido: any
): Promise<ProyectoDetalle> => {
  const response = await api.put<ProyectoDetalleResponse>(
    `/proyectos/${idProyecto}`,
    { contenido: JSON.stringify(contenido) }
  );
  return response.data.data;
};

export const actualizarVisibilidadProyecto = async (
  idProyecto: string,
  esPublico: boolean
): Promise<ProyectoDetalle> => {
  const response = await api.put<ProyectoDetalleResponse>(
    `/proyectos/${idProyecto}`,
    { esPublico }
  );
  return response.data.data;
};

// Actualizar el campo esFinal del proyecto
export const actualizarProyectoEsFinal = async (
  idProyecto: string,
  esFinal: boolean
): Promise<ProyectoDetalle> => {
  const response = await api.put<ProyectoDetalleResponse>(
    `/proyectos/${idProyecto}`,
    { esFinal }
  );
  return response.data.data;
};

// Subir imagen del editor al S3
export const subirImagenEditor = async (
  idProyecto: string,
  file: File
): Promise<{ url: string; idArchivo: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('idProyecto', idProyecto);
  formData.append('tipo', 'contenido');

  const response = await api.post('/archivos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return {
    url: response.data.data.urlFirmada,
    idArchivo: response.data.data.idArchivo,
  };
};

// Obtener imágenes de contenido del proyecto
export const obtenerImagenesContenido = async (
  idProyecto: string
): Promise<any[]> => {
  const response = await api.get(`/archivos/proyecto/${idProyecto}`);
  // Filtrar solo las imágenes de tipo "contenido"
  return response.data.data.items.filter((archivo: any) => archivo.tipo === 'contenido');
};

// Eliminar imagen del S3
export const eliminarImagen = async (idArchivo: string): Promise<void> => {
  await api.delete(`/archivos/${idArchivo}`);
};

// Verificar si existe una tarea en revisión activa
export const tieneRevisionActiva = async (idProyecto: string): Promise<boolean> => {
  const response = await api.get(`/proyectos/${idProyecto}/tareas-organizadas`);
  const enProceso = response.data?.data?.enProceso ?? [];
  return enProceso.some((tarea: any) => Boolean(tarea?.enRevision));
};

// Obtener contenido del editor con imágenes
export const obtenerContenidoEditor = async (
  idProyecto: string
): Promise<{ contenido: string | null; imagenes: any[] }> => {
  const response = await api.get(`/proyectos/${idProyecto}/contenido-editor`);
  return {
    contenido: response.data.data.contenido,
    imagenes: response.data.data.imagenes,
  };
};

// Obtener proyectos de una materia específica
export const obtenerProyectosPorMateria = async (idMateria: string): Promise<Proyecto[]> => {
  const response = await api.get(`/proyectos/materia/${idMateria}`);
  return response.data.data.items;
};

// Actualizar estado de aprobación del tutor
export const actualizarProyectoAprobadoTutor = async (
  idProyecto: string,
  estaAprobado: boolean
): Promise<void> => {
  await api.put(`/proyectos/${idProyecto}/aprobar-tutor`, { estaAprobado });
};

// Obtener nota promedio del proyecto
export const obtenerNotaPromedioProyecto = async (
  idProyecto: string
): Promise<{ notaPromedio: number | null; feriaFinalizada: boolean }> => {
  const response = await api.get(`/proyectos/${idProyecto}/nota-promedio`);
  return response.data.data;
};
