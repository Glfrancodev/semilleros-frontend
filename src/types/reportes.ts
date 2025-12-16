// Tipos para la funcionalidad de reportes

export interface ReporteConfig {
    id: string;
    nombre: string;
    descripcion: string;
    filtrosDisponibles: FiltroDisponible[];
}

export type FiltroDisponible =
    | 'areaId'
    | 'categoriaId'
    | 'semestreId'
    | 'materiaId'
    | 'grupoMateriaId';

export interface FiltrosControlNotas {
    areaId?: string;
    categoriaId?: string;
    semestreId?: string;
    materiaId?: string;
    grupoMateriaId?: string;
}

export interface ControlNotasData {
    feria: {
        idFeria: string;
        nombre: string;
        estado: string;
    };
    tareas: Tarea[];
    matriz: ProyectoMatriz[];
    estadisticas: Estadisticas;
    filtros: FiltrosControlNotas;
    timestamp: string;
}

export interface Tarea {
    idTarea: string;
    orden: number;
    nombre: string;
    descripcion: string;
    fechaCreacion: string;
    fechaActualizacion: string;
}

export interface ProyectoMatriz {
    proyecto: {
        idProyecto: string;
        nombre: string;
        descripcion: string;
        fechaCreacion: string;
        estaAprobado: boolean | null;
        estaAprobadoTutor: boolean | null;
        esFinal: boolean | null;
        area: string | null;
        categoria: string | null;
    };
    tareas: TareaEstado[];
}

export interface TareaEstado {
    idTarea: string;
    ordenTarea: number;
    nombreTarea: string;
    estado: 'revisado' | 'pendiente_revision' | 'no_enviado';
    calificacion: number | null;
    comentario: string | null;
    fechaEnvio: string | null;
    fechaRevision: string | null;
}

export interface Estadisticas {
    totalProyectos: number;
    totalTareas: number;
    tareasRevisadas: number;
    tareasPendientes: number;
    tareasNoEnviadas: number;
}

// ============================================
// Tipos para Proyectos con Jurados
// ============================================

export interface ProyectosJuradosData {
    proyectos: ProyectoConJurados[];
    estadisticas: EstadisticasJurados;
    feriaActual: {
        idFeria: string;
        nombre: string;
        semestre: number;
        año: number;
    };
    timestamp: string;
}

export interface ProyectoConJurados {
    idProyecto: string;
    nombre: string;
    area: string;
    categoria: string;
    jurado1: Jurado | null;
    jurado2: Jurado | null;
    jurado3: Jurado | null;
}

export interface Jurado {
    idDocente: string;
    codigoDocente: string;
    nombre: string;
    correo: string;
}

export interface EstadisticasJurados {
    totalProyectos: number;
    proyectosConJurados: number;
    proyectosSinJurados: number;
    proyectosCon1Jurado: number;
    proyectosCon2Jurados: number;
    proyectosCon3Jurados: number;
}

// ============================================
// Tipos para Calificaciones Finales
// ============================================

export interface CalificacionesFinalesData {
    proyectos: ProyectoConCalificaciones[];
    estadisticas: EstadisticasCalificaciones;
    feriaActual: {
        idFeria: string;
        nombre: string;
        semestre: number;
        año: number;
    };
    timestamp: string;
}

export interface ProyectoConCalificaciones {
    idProyecto: string;
    nombre: string;
    area: string;
    categoria: string;
    calificacion1: number | 'Pendiente';
    calificacion2: number | 'Pendiente';
    calificacion3: number | 'Pendiente';
    notaFinal: number | 'Pendiente';
}

export interface EstadisticasCalificaciones {
    totalProyectos: number;
    proyectosCalificados: number;
    proyectosPendientes: number;
}

// ============================================
// Tipos para Proyectos con Integrantes
// ============================================

export interface ProyectosIntegrantesData {
    proyectos: ProyectoConIntegrantes[];
    estadisticas: EstadisticasIntegrantes;
    feriaActual: {
        idFeria: string;
        nombre: string;
        semestre: number;
        año: number;
    };
    timestamp: string;
}

export interface ProyectoConIntegrantes {
    idProyecto: string;
    nombre: string;
    area: string;
    categoria: string;
    lider: {
        nombre: string;
        codigo: string;
    } | null;
    integrantes: Integrante[];
    totalIntegrantes: number;
}

export interface Integrante {
    nombre: string;
    codigo: string;
}

export interface EstadisticasIntegrantes {
    totalProyectos: number;
    totalEstudiantes: number;
    promedioIntegrantesPorProyecto: number;
}

// ============================================
// Tipos para Promedio de Notas de Ferias (Global)
// ============================================

export interface PromedioNotasFeriasData {
    series: FeriaEstadistica[];
    tendenciaGeneral: {
        direccion: 'creciente' | 'decreciente' | 'estable';
        tasaCrecimientoPromedio: number;
        promedioHistorico: number;
    };
    filtros: {
        fechaInicio: string | null;
        fechaFin: string | null;
        ferias: string[];
        areaId: string | null;
        categoriaId: string | null;
    };
    timestamp: string;
}

export interface FeriaEstadistica {
    feria: {
        idFeria: string;
        nombre: string;
        semestre: number;
        año: number;
    };
    estadisticas: {
        promedioGeneral: number;
        mediana: number;
        desviacionEstandar: number;
        calificacionMaxima: number;
        calificacionMinima: number;
        totalProyectosCalificados: number;
    };
    distribucionPorRango: DistribucionRango[];
    variacion: number | null;
}

export interface DistribucionRango {
    rango: string;
    cantidad: number;
    porcentaje: number;
}
