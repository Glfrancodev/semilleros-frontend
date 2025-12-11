import api from "./api";

export interface Administrativo {
    idAdministrativo: string;
    codigoAdministrativo: string;
    fechaCreacion: string;
    fechaActualizacion: string;
    idUsuario: string;
    usuario?: {
        idUsuario: string;
        nombre: string;
        apellido: string;
        correo: string;
    };
}

interface ApiSuccessResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface ApiListResponse<T> {
    success: boolean;
    message: string;
    data: {
        count: number;
        items: T[];
    };
}

// Obtener todos los administrativos
export const obtenerAdministrativos = async (): Promise<Administrativo[]> => {
    const response = await api.get<ApiListResponse<Administrativo>>("/administrativos");
    return response.data.data.items;
};

// Crear un nuevo administrativo
export const crearAdministrativo = async (data: { codigoAdministrativo: string; idUsuario: string }): Promise<Administrativo> => {
    const response = await api.post<ApiSuccessResponse<Administrativo>>("/administrativos", data);
    return response.data.data;
};

// Actualizar un administrativo
export const actualizarAdministrativo = async (id: string, data: { codigoAdministrativo: string }): Promise<Administrativo> => {
    const response = await api.put<ApiSuccessResponse<Administrativo>>(`/administrativos/${id}`, data);
    return response.data.data;
};

// Obtener administrativo por ID
export const obtenerAdministrativoPorId = async (id: string): Promise<Administrativo> => {
    const response = await api.get<ApiSuccessResponse<Administrativo>>(`/administrativos/${id}`);
    return response.data.data;
};
