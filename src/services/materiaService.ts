import api from "./api";

export interface Materia {
  idMateria: string;
  sigla: string;
  nombre: string;
  idAreaCategoria: string;
  idSemestre: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  areaCategoria?: {
    idAreaCategoria: string;
    idArea: string;
    idCategoria: string;
    area?: {
      nombre: string;
    };
    categoria?: {
      nombre: string;
    };
  };
  grupoMaterias?: Array<{
    idGrupoMateria: string;
    grupo: {
      idGrupo: string;
      sigla: string;
    };
    docente: {
      idDocente: string;
      codigoDocente: string;
      usuario: {
        nombre: string;
        correo: string;
      };
    };
  }>;
}

export interface Grupo {
  idGrupoMateria: string;
  idGrupo: string;
  sigla: string;
}

export interface GrupoMateria {
  idGrupoMateria: string;
  idGrupo: string;
  idMateria: string;
  grupo: {
    idGrupo: string;
    sigla: string;
  };
  materia: {
    idMateria: string;
    nombre: string;
    codigo: string;
  };
  fechaCreacion: string;
  fechaActualizacion: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: {
    count: number;
    items: T[];
  };
}

export interface MateriasResponse {
  items: Materia[];
  count: number;
}

export interface MateriaCreacion {
  sigla: string;
  nombre: string;
  idAreaCategoria: string;
  idSemestre: string;
  grupos?: Array<{
    sigla: string;
    idDocente: string;
  }>;
}

export interface MateriaActualizacion {
  sigla?: string;
  nombre?: string;
  idAreaCategoria?: string;
  grupos?: Array<{
    sigla: string;
    idDocente: string;
  }>;
}

interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Obtener todas las materias con paginación y búsqueda
export const obtenerMaterias = async (
  page: number = 1,
  limit: number = 10,
  searchTerm: string = "",
  idSemestre?: string
): Promise<MateriasResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(searchTerm && { search: searchTerm }),
    ...(idSemestre && { idSemestre }),
  });

  const response = await api.get<ApiResponse<Materia>>(`/materias?${params.toString()}`);
  return {
    items: response.data?.data?.items || [],
    count: response.data?.data?.count || 0
  };
};

// Obtener una materia por ID
export const obtenerMateriaPorId = async (id: string): Promise<Materia> => {
  const response = await api.get<{ success: boolean; data: Materia }>(`/materias/${id}`);
  return response.data.data;
};

// Crear una nueva materia
export const crearMateria = async (data: MateriaCreacion): Promise<Materia> => {
  const response = await api.post<ApiSuccessResponse<Materia>>("/materias", data);
  return response.data.data;
};

// Actualizar una materia
export const actualizarMateria = async (id: string, data: MateriaActualizacion): Promise<Materia> => {
  const response = await api.put<ApiSuccessResponse<Materia>>(`/materias/${id}`, data);
  return response.data.data;
};

// Eliminar una materia
export const eliminarMateria = async (id: string): Promise<void> => {
  await api.delete(`/materias/${id}`);
};

// Obtener materias por área-categoría
export const obtenerMateriasPorAreaCategoria = async (
  idAreaCategoria: string
): Promise<Materia[]> => {
  const response = await api.get(
    `area-categorias/${idAreaCategoria}/materias`
  );
  return response.data.data.items;
};

// Obtener grupos por materia
export const obtenerGruposPorMateria = async (
  idMateria: string
): Promise<Grupo[]> => {
  const response = await api.get(`materias/${idMateria}/grupos`);
  return response.data.data.items;
};

// Buscar GrupoMateria por idGrupo e idMateria
export const buscarGrupoMateria = async (
  idGrupo: string,
  idMateria: string
): Promise<GrupoMateria> => {
  const response = await api.get(
    `grupo-materias/buscar?idGrupo=${idGrupo}&idMateria=${idMateria}`
  );
  return response.data.data;
};
