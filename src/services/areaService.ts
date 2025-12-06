import api from "./api";

export interface AreaCategoria {
  idAreaCategoria: string;
  idArea: string;
  idCategoria: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  Categoria?: {
    idCategoria: string;
    nombre: string;
  };
  area?: {
    idArea: string;
    nombre: string;
  };
  categoria?: {
    idCategoria: string;
    nombre: string;
  };
}

export interface Area {
  idArea: string;
  nombre: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  areaCategorias?: AreaCategoria[];
}

export interface Categoria {
  idAreaCategoria: string;
  idCategoria: string;
  nombre: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: {
    count: number;
    items: T[];
  };
}

export interface AreasResponse {
  areas: Area[];
  count: number;
}

interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AreaCreacion {
  nombre: string;
}

export interface AreaActualizacion {
  nombre?: string;
}

// Obtener todas las áreas
export const obtenerAreas = async (): Promise<AreasResponse> => {
  const response = await api.get<ApiResponse<Area>>('/areas');
  return {
    areas: response.data?.data?.items || [],
    count: response.data?.data?.count || 0
  };
};

// Obtener un área por ID
export const obtenerAreaPorId = async (id: string): Promise<Area> => {
  const response = await api.get<ApiSuccessResponse<Area>>(`/areas/${id}`);
  return response.data.data;
};

// Obtener categorías de un área
export const obtenerCategoriasPorArea = async (
  idArea: string
): Promise<Categoria[]> => {
  const response = await api.get(`/areas/${idArea}/categorias`);
  return response.data.data.items;
};

// Crear una nueva área
export const crearArea = async (data: AreaCreacion): Promise<Area> => {
  const response = await api.post<ApiSuccessResponse<Area>>("/areas", data);
  return response.data.data;
};

// Actualizar un área
export const actualizarArea = async (id: string, data: AreaActualizacion): Promise<Area> => {
  const response = await api.put<ApiSuccessResponse<Area>>(`/areas/${id}`, data);
  return response.data.data;
};

// Eliminar un área
export const eliminarArea = async (id: string): Promise<void> => {
  await api.delete(`/areas/${id}`);
};

// Crear relación área-categoría
export const crearAreaCategoria = async (idArea: string, idCategoria: string): Promise<AreaCategoria> => {
  const response = await api.post<ApiSuccessResponse<AreaCategoria>>("/area-categorias", {
    idArea,
    idCategoria
  });
  return response.data.data;
};

// Eliminar relación área-categoría
export const eliminarAreaCategoria = async (idAreaCategoria: string): Promise<void> => {
  await api.delete(`/area-categorias/${idAreaCategoria}`);
};

// Obtener todas las áreas-categorías
export const obtenerAreasCategorias = async (): Promise<AreaCategoria[]> => {
  const response = await api.get<ApiResponse<AreaCategoria>>('/area-categorias');
  return response.data?.data?.items || [];
};

// Buscar AreaCategoria por idArea e idCategoria
export const buscarAreaCategoria = async (
  idArea: string,
  idCategoria: string
): Promise<AreaCategoria> => {
  const response = await api.get(
    `/area-categorias/buscar?idArea=${idArea}&idCategoria=${idCategoria}`
  );
  return response.data.data;
};

