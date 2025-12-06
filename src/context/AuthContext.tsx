import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // instancia axios centralizada
import { jwtDecode } from "jwt-decode";
import { ROLES } from "../constants/roles";

interface DecodedToken {
  idUsuario: string;
  correo: string;
  nombre: string;
  apellido?: string;
  iniciales: string;
  fotoPerfil: string | null;
  rol: string;
}

interface AuthContextType {
  user: DecodedToken | null;
  token: string | null;
  loading: boolean;
  login: (correo: string, contrasena: string) => Promise<void>;
  signup: (data: {
    ci: string;
    nombre: string;
    apellido: string;
    correo: string;
    contrasena: string;
    idRol: string;
  }) => Promise<void>;
  logout: () => void;
  updateToken: (newToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState<boolean>(false);

  // Configura automáticamente el token en el header
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Decodifica el token y extrae la información del usuario
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser({
          idUsuario: decoded.idUsuario,
          correo: decoded.correo,
          nombre: decoded.nombre,
          iniciales: decoded.iniciales,
          fotoPerfil: decoded.fotoPerfil,
          rol: decoded.rol,
        });
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setUser(null);
      }
    } else {
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    }
  }, [token]);

  // 🔹 LOGIN
  const login = async (correo: string, contrasena: string) => {
    try {
      setLoading(true);
      const res = await api.post("/usuarios/login", { correo, contrasena });
      // El backend devuelve: { success: true, message: "...", data: { token, user } }
      const { token } = res.data.data;
      localStorage.setItem("token", token);
      setToken(token);
      
      // Decodificar el token para obtener el rol y redirigir según corresponda
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        
        // Redirigir según el rol del usuario
        switch (decoded.rol) {
          case ROLES.ADMIN:
            navigate("/dashboard");
            break;
          case ROLES.DOCENTE:
            navigate("/docente/dashboard");
            break;
          case ROLES.ESTUDIANTE:
            navigate("/estudiante/convocatorias");
            break;
          default:
            navigate("/dashboard");
        }
      } catch (decodeError) {
        console.error("Error al decodificar el token:", decodeError);
        navigate("/");
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 SIGN UP
  const signup = async (data: {
    ci: string;
    nombre: string;
    apellido: string;
    correo: string;
    contrasena: string;
    idRol: string;
  }) => {
    try {
      setLoading(true);
      await api.post("/usuarios", data);
      // El backend devuelve: { success: true, message: "...", data: { usuario } }
      // El signup no devuelve token, tendrías que hacer login después
      // Por ahora redirigimos al login
      navigate("/login");
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
    // Dar tiempo para que el estado se actualice antes de navegar
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 0);
  };

  // 🔹 UPDATE TOKEN (útil al actualizar foto de perfil)
  const updateToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
