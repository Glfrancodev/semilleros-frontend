import api from '../../../services/api';

export interface LoginPayload {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  usuario: any; // Ajusta según la respuesta real del backend
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post('/usuarios/login', payload);
  return data;
}
