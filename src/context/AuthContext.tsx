import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // instancia axios centralizada
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: any;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
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
        const decoded: any = jwtDecode(token);
        setUser({ nombre: decoded.nombre, correo: decoded.correo });
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
      const { token } = res.data; // ajustá si tu backend devuelve otro campo
      localStorage.setItem("token", token);
      setToken(token);
      navigate("/");
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
      const res = await api.post("/usuarios", data);
      const { token } = res.data; // si tu backend no devuelve token, lo podemos omitir
      if (token) {
        localStorage.setItem("token", token);
        setToken(token);
      }
      navigate("/");
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    navigate("/signin");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
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
