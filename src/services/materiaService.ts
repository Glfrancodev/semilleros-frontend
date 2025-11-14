import api from "./api";

export interface Materia {
  idMateria: string;
  nombre: string;
  sigla: string;
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
