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
