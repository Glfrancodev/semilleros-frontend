import api from "./api";

// Interfaces
export interface Integrante {
  idEstudianteProyecto: string;
  codigo: string;
  nombreCompleto: string;
  esLider: boolean;
  fotoPerfil: string | null;
}

export interface Jurado {
  idDocenteProyecto: string;
  idDocente: string;
  nombreCompleto: string;
  esTutor: boolean;
}

export interface ProyectoAprobadoFeria {
  idProyecto: string;
  nombre: string;
  descripcion: string;
  integrantes: Integrante[];
  jurados: Jurado[];
  cantidadJurados: number;
}

export interface Docente {
  idDocente: string;
  codigo: string;
  nombreCompleto: string;
}

interface ProyectosAprobadosResponse {
  success: boolean;
  message: string;
  data: ProyectoAprobadoFeria[];
}

interface DocentesResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    items: Docente[];
  };
}

interface DocenteProyectoResponse {
  success: boolean;
  message: string;
  data: any;
}

// Obtener proyectos aprobados para feria
export const obtenerProyectosAprobadosFeria = async (): Promise<ProyectoAprobadoFeria[]> => {
  const response = await api.get<ProyectosAprobadosResponse>('/proyectos/aprobados-feria');
  return response.data.data;
};

// Obtener todos los docentes
export const obtenerDocentes = async (): Promise<Docente[]> => {
  const response = await api.get<DocentesResponse>('/docentes');
  const docentes = response.data.data.items;
  
  // Formatear datos
  return docentes.map((d: any) => ({
    idDocente: d.idDocente,
    codigo: d.codigo || 'Sin código',
    nombreCompleto: d.usuario 
      ? `${d.usuario.nombre} ${d.usuario.apellido}`
      : 'Sin nombre',
  }));
};

// Asignar jurado a proyecto
export const asignarJurado = async (idProyecto: string, idDocente: string): Promise<any> => {
  const response = await api.post<DocenteProyectoResponse>('/docente-proyectos', {
    idProyecto,
    idDocente,
    esTutor: false,
  });
  return response.data.data;
};

// Eliminar jurado de proyecto
export const eliminarJurado = async (idDocenteProyecto: string): Promise<void> => {
  await api.delete(`/docente-proyectos/${idDocenteProyecto}`);
};

// Obtener jurados de un proyecto
export const obtenerJuradosPorProyecto = async (idProyecto: string): Promise<Jurado[]> => {
  const response = await api.get(`/docente-proyectos/proyecto/${idProyecto}`);
  const docentesProyecto = response.data.data.items || [];
  
  return docentesProyecto.map((dp: any) => ({
    idDocenteProyecto: dp.idDocenteProyecto,
    idDocente: dp.idDocente,
    nombreCompleto: dp.docente?.usuario
      ? `${dp.docente.usuario.nombre} ${dp.docente.usuario.apellido}`
      : 'Sin nombre',
    esTutor: dp.esTutor,
  }));
};

// Interfaces para proyectos como jurado
export interface ProyectoJurado {
  idProyecto: string;
  nombre: string;
  descripcion: string;
}

interface MisProyectosJuradoResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    items: ProyectoJurado[];
  };
}

// Obtener proyectos donde soy jurado de la feria activa
export const obtenerMisProyectosComoJurado = async (): Promise<ProyectoJurado[]> => {
  const response = await api.get<MisProyectosJuradoResponse>('/docente-proyectos/mis-proyectos-jurado');
  return response.data.data.items;
};
