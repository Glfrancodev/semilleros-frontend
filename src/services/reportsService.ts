import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Tipos para las respuestas
export interface KPIResponse {
    valor: number;
    mensaje?: string;
}

export interface FeriaInfo {
    idFeria: number;
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    estado: string;
}

export interface ProyectosPorEstado {
    estado: string;
    cantidad: number;
}

export interface FiltrosReportes {
    areaId?: number;
    categoriaId?: number;
    materiaId?: number;
    grupoMateriaId?: number;
}

// Servicio de Reports
export const reportsService = {
    // ========== KPIs Feria Actual ==========

    getProyectosInscritos: async (filtros?: FiltrosReportes): Promise<KPIResponse> => {
        const response = await axios.get(`${API_URL}/reports/feria-actual/kpi/proyectos-inscritos`, {
            params: filtros
        });
        return response.data;
    },

    getEstudiantesParticipantes: async (filtros?: FiltrosReportes): Promise<KPIResponse> => {
        const response = await axios.get(`${API_URL}/reports/feria-actual/kpi/estudiantes-participantes`, {
            params: filtros
        });
        return response.data;
    },

    getTutores: async (filtros?: FiltrosReportes): Promise<KPIResponse> => {
        const response = await axios.get(`${API_URL}/reports/feria-actual/kpi/tutores`, {
            params: filtros
        });
        return response.data;
    },

    getJurados: async (filtros?: FiltrosReportes): Promise<KPIResponse> => {
        const response = await axios.get(`${API_URL}/reports/feria-actual/kpi/jurados`, {
            params: filtros
        });
        return response.data;
    },

    getPorcentajeAprobadosTutor: async (filtros?: FiltrosReportes): Promise<KPIResponse> => {
        const response = await axios.get(`${API_URL}/reports/feria-actual/kpi/porcentaje-aprobados-tutor`, {
            params: filtros
        });
        return response.data;
    },

    getPorcentajeAprobadosAdmin: async (filtros?: FiltrosReportes): Promise<KPIResponse> => {
        const response = await axios.get(`${API_URL}/reports/feria-actual/kpi/porcentaje-aprobados-admin`, {
            params: filtros
        });
        return response.data;
    },

    getPorcentajeAprobadosExposicion: async (filtros?: FiltrosReportes): Promise<KPIResponse> => {
        const response = await axios.get(`${API_URL}/reports/feria-actual/kpi/porcentaje-aprobados-exposicion`, {
            params: filtros
        });
        return response.data;
    },

    getFeriaActualInfo: async (): Promise<FeriaInfo> => {
        const response = await axios.get(`${API_URL}/reports/feria-actual/info`);
        return response.data;
    },

    // ========== Gráficos Feria Actual ==========

    getProyectosPorEstado: async (filtros?: FiltrosReportes): Promise<ProyectosPorEstado[]> => {
        const response = await axios.get(`${API_URL}/reports/feria-actual/graficos/proyectos-por-estado`, {
            params: filtros
        });
        return response.data;
    },

    getParticipacionAreaCategoria: async (filtros?: FiltrosReportes): Promise<any> => {
        const response = await axios.get(`${API_URL}/reports/feria-actual/graficos/participacion-area-categoria`, {
            params: filtros
        });
        return response.data;
    },

    getCalificacionesFeria: async (filtros?: FiltrosReportes): Promise<any> => {
        const response = await axios.get(`${API_URL}/reports/feria-actual/graficos/calificaciones-feria`, {
            params: filtros
        });
        return response.data;
    },

    getCargaJurados: async (filtros?: FiltrosReportes): Promise<any> => {
        const response = await axios.get(`${API_URL}/reports/feria-actual/graficos/carga-desempeno-jurados`, {
            params: filtros
        });
        return response.data;
    },

    getParticipacionEventos: async (filtros?: any): Promise<any> => {
        const response = await axios.get(`${API_URL}/reports/feria-actual/graficos/participacion-eventos`, {
            params: filtros
        });
        return response.data;
    },

    // ========== Reportes Globales ==========

    // KPIs Globales
    getProyectosPorFeriaGlobal: async (filtros?: any): Promise<any> => {
        const response = await axios.get(`${API_URL}/reports/global/kpi/proyectos-por-feria`, {
            params: filtros
        });
        return response.data;
    },

    getEstudiantesPorFeriaGlobal: async (filtros?: any): Promise<any> => {
        const response = await axios.get(`${API_URL}/reports/global/kpi/estudiantes-por-feria`, {
            params: filtros
        });
        return response.data;
    },

    getJuradosPorFeriaGlobal: async (filtros?: any): Promise<any> => {
        const response = await axios.get(`${API_URL}/reports/global/kpi/jurados-por-feria`, {
            params: filtros
        });
        return response.data;
    },

    getTutoresPorFeriaGlobal: async (filtros?: any): Promise<any> => {
        const response = await axios.get(`${API_URL}/reports/global/kpi/tutores-por-feria`, {
            params: filtros
        });
        return response.data;
    },

    // Tendencias Globales
    getAreasFrecuentesGlobal: async (filtros?: any): Promise<any> => {
        const response = await axios.get(`${API_URL}/reports/global/tendencias/areas-frecuentes`, {
            params: filtros
        });
        return response.data;
    },

    getCategoriasFrecuentesGlobal: async (filtros?: any): Promise<any> => {
        const response = await axios.get(`${API_URL}/reports/global/tendencias/categorias-frecuentes`, {
            params: filtros
        });
        return response.data;
    },

    getComparacionFeriasGlobal: async (filtros?: any): Promise<any> => {
        const response = await axios.get(`${API_URL}/reports/global/tendencias/comparacion-ferias`, {
            params: filtros
        });
        return response.data;
    },

    // Rendimiento Académico Globales
    getPromediosPorFeriaGlobal: async (filtros?: any): Promise<any> => {
        const response = await axios.get(`${API_URL}/reports/global/rendimiento/promedio-por-feria`, {
            params: filtros
        });
        return response.data;
    },

    getRankingAreasRendimientoGlobal: async (filtros?: any): Promise<any> => {
        const response = await axios.get(`${API_URL}/reports/global/rendimiento/ranking-areas`, {
            params: filtros
        });
        return response.data;
    },
};
