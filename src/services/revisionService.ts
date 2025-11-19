import api from "./api";

// Interfaces para las revisiones
export interface Revision {
  idRevision: string;
  puntaje: number | null;
  comentario: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  idProyecto: string;
  idTarea: string;
  revisado?: boolean;
}

interface RevisionesResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    items: Revision[];
  };
}

interface RevisionResponse {
  success: boolean;
  message: string;
  data: Revision;
}

// Crear una nueva revisión
export const crearRevision = async (data: {
  idProyecto: string;
  idTarea: string;
  puntaje?: number;
  comentario?: string;
}): Promise<Revision> => {
  const response = await api.post<RevisionResponse>('/revisiones', data);
  return response.data.data;
};

// Obtener todas las revisiones
export const obtenerRevisiones = async (): Promise<Revision[]> => {
  const response = await api.get<RevisionesResponse>('/revisiones');
  return response.data.data.items;
};

// Obtener una revisión por ID
export const obtenerRevisionPorId = async (id: string): Promise<Revision> => {
  const response = await api.get<RevisionResponse>(`/revisiones/${id}`);
  return response.data.data;
};

// Obtener revisiones por proyecto
export const obtenerRevisionesPorProyecto = async (idProyecto: string): Promise<Revision[]> => {
  const response = await api.get<RevisionesResponse>(`/revisiones/proyecto/${idProyecto}`);
  return response.data.data.items;
};

// Actualizar una revisión
export const actualizarRevision = async (id: string, data: Partial<Revision>): Promise<Revision> => {
  const response = await api.put<RevisionResponse>(`/revisiones/${id}`, data);
  return response.data.data;
};

// Eliminar una revisión
export const eliminarRevision = async (id: string): Promise<void> => {
  await api.delete(`/revisiones/${id}`);
};
