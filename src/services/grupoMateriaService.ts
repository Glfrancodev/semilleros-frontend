import api from "./api";

export interface Grupo {
  idGrupoMateria: string;
  idGrupo: string;
  sigla: string;
}

export interface MateriaDocente {
  idMateria: string;
  nombre: string;
  sigla: string;
  area: string;
  categoria: string;
  grupos: Grupo[];
  cantidadGrupos: number;
}

export const obtenerMisMaterias = async (): Promise<MateriaDocente[]> => {
  const response = await api.get("/grupo-materias/mis-materias");
  return response.data.data;
};
