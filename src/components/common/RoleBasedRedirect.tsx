import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";

/**
 * Componente que redirige a la página de inicio según el rol del usuario
 */
export default function RoleBasedRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirigir según el rol
  switch (user.rol) {
    case ROLES.ADMIN:
      return <Navigate to="/" replace />;
    case ROLES.DOCENTE:
      return <Navigate to="/docente/dashboard" replace />;
    case ROLES.ESTUDIANTE:
      return <Navigate to="/estudiante/estadisticas" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}
