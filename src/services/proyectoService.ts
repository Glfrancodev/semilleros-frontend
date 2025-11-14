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

export interface CrearProyectoData {
  nombre: string;
  descripcion: string;
  idGrupoMateria: string;
  idConvocatoria: string;
}

interface MisProyectosResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    items: Proyecto[];
  };
}

// Obtener los proyectos del estudiante actual
export const obtenerMisProyectos = async (): Promise<Proyecto[]> => {
  const response = await api.get<MisProyectosResponse>('/proyectos/mis-proyectos');
  return response.data.data.items;
};

// Crear un nuevo proyecto
export const crearProyecto = async (
  data: CrearProyectoData
): Promise<any> => {
  const payload = {
    nombre: data.nombre,
    descripcion: data.descripcion,
    contenido: data.descripcion, // Usar la descripción como contenido inicial
    estaAprobado: false,
    esFinal: false,
    idGrupoMateria: data.idGrupoMateria,
    idConvocatoria: data.idConvocatoria,
  };
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
