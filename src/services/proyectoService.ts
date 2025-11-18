import api from "./api";

// Interfaces para los proyectos
export interface Proyecto {
  idProyecto: string;
  nombre: string;
  descripcion: string;
  materia: string;
  grupo: string;
  nombreDocente: string;
  urlLogo: string | null;
  estaAprobado: boolean;
  esFinal: boolean;
  fechaCreacion: string;
}

export interface ProyectoDetalle {
  idProyecto: string;
  nombre: string;
  descripcion: string;
  contenido?: string | null;
  estaAprobado: boolean | null;
  esFinal: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  nombreDocente: string;
  nombreMateria: string;
  grupo: string;
  urlLogo: string | null;
  urlTriptico: string | null;
  urlBanner: string | null;
}

export interface CrearProyectoData {
  nombre: string;
  descripcion: string;
  idGrupoMateria: string;
  idConvocatoria?: string; // Ahora es opcional porque ya no se relaciona directamente
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
    esFinal: false,
    idGrupoMateria: data.idGrupoMateria,
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
  idEstudiante: string
): Promise<any> => {
  const response = await api.post("estudiante-proyectos", {
    idProyecto,
    idEstudiante,
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
