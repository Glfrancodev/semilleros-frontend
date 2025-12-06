import api from "./api";

// Interfaces basadas en la respuesta del backend
export interface Categoria {
  idCategoria: string;
  nombre: string;
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

export interface CategoriasResponse {
  categorias: Categoria[];
  count: number;
}

// Obtener todas las categorías
export const obtenerCategorias = async (): Promise<CategoriasResponse> => {
  const response = await api.get<ApiResponse<Categoria>>('/categorias');
  return {
    categorias: response.data?.data?.items || [],
    count: response.data?.data?.count || 0
  };
};

// Obtener una categoría por ID
export const obtenerCategoriaPorId = async (id: string): Promise<Categoria> => {
  const response = await api.get<Categoria>(`/categorias/${id}`);
  return response.data;
};

export interface CategoriaCreacion {
  nombre: string;
}

export interface CategoriaActualizacion {
  nombre?: string;
}

interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Crear una nueva categoría
export const crearCategoria = async (data: CategoriaCreacion): Promise<Categoria> => {
  const response = await api.post<ApiSuccessResponse<Categoria>>("/categorias", data);
  return response.data.data;
};

// Actualizar una categoría
export const actualizarCategoria = async (id: string, data: CategoriaActualizacion): Promise<Categoria> => {
  const response = await api.put<ApiSuccessResponse<Categoria>>(`/categorias/${id}`, data);
  return response.data.data;
};

// Eliminar una categoría
export const eliminarCategoria = async (id: string): Promise<void> => {
  await api.delete(`/categorias/${id}`);
};
