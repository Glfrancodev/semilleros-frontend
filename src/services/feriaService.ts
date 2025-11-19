import api from "./api";

export interface TareaResumenFeria {
  idTarea: string;
  orden: number;
  nombre: string;
  descripcion: string;
  fechaLimite: string;
  enviadosRevision: number;
  pendientesRevision: number;
}

export interface ResumenFeriaActiva {
  nombreFeria: string;
  semestre: number;
  anio: number;
  cantidadProyectosInscritos: number;
  cantidadProyectosPendientesAprobacion: number;
  cantidadProyectosAprobados: number;
  cantidadProyectosFinales: number;
  tareas: TareaResumenFeria[];
}

type ResumenFeriaActivaApi = Omit<ResumenFeriaActiva, "anio"> & {
  ["a\u00f1o"]: number;
};

interface ResumenFeriaResponse {
  success: boolean;
  message: string;
  data: ResumenFeriaActivaApi;
}

export const obtenerResumenFeriaActiva = async (): Promise<ResumenFeriaActiva> => {
  const response = await api.get<ResumenFeriaResponse>("/ferias/resumen-activa");
  const { ["a\u00f1o"]: rawYear, ...rest } = response.data.data;
  return {
    ...rest,
    anio: rawYear,
  };
};
