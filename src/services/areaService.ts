import api from "./api";

export interface Area {
  idArea: string;
  nombre: string;
}

export interface Categoria {
  idAreaCategoria: string;
  idCategoria: string;
  nombre: string;
}

export interface AreaCategoria {
  idAreaCategoria: string;
  idArea: string;
  idCategoria: string;
  area: {
    idArea: string;
    nombre: string;
  };
  categoria: {
    idCategoria: string;
    nombre: string;
  };
  fechaCreacion: string;
  fechaActualizacion: string;
}

// Obtener todas las áreas
export const obtenerAreas = async (): Promise<Area[]> => {
  const response = await api.get("/areas");
  return response.data.data.items;
};

// Obtener categorías de un área
export const obtenerCategoriasPorArea = async (
  idArea: string
): Promise<Categoria[]> => {
  const response = await api.get(`/areas/${idArea}/categorias`);
  return response.data.data.items;
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
