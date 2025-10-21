import api from '../../../services/api';

export interface LoginPayload {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: any; // Ajusta según la estructura del usuario en el backend
  };
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post('/usuarios/login', payload);
  return data;
}
