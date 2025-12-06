
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NotFound from "./legacy/pages/OtherPage/NotFound";
import Calendar from "./legacy/pages/Calendar";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./legacy/pages/Dashboard/Home";
import SignInPage from "./features/auth/pages/SignInPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import UsuariosPage from "./features/admin/pages/UsuariosPage";
import ProyectoPage from "./features/admin/pages/ProyectoPage";
import TareasDetallePage from "./features/admin/pages/TareasDetallePage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ROLES } from "./constants/roles";

// Páginas de Estudiante
import EstadisticasPage from "./features/estudiante/pages/EstadisticasPage";
import CalendarioPage from "./features/estudiante/pages/CalendarioPage";
import GuiasDescubrirPage from "./features/estudiante/pages/GuiasDescubrirPage";
import MisProyectosPage from "./features/estudiante/pages/MisProyectosPage";
import ConvocatoriasPage from "./features/estudiante/pages/ConvocatoriasPage";
import ProyectoDetallePage from "./features/estudiante/pages/ProyectoDetallePage";
import DocumentoEditorPage from "./features/estudiante/pages/DocumentoEditorPage";
import LandingPage from "./LandingPage";


// Ruta privada: solo permite acceso si hay token
function PrivateRoute() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

// Ruta pública: si ya está autenticado, redirige según el rol
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth();
  
  if (!token) {
    return <>{children}</>;
  }

  // Redirigir según el rol del usuario
  if (user) {
    switch (user.rol) {
      case ROLES.ADMIN:
        return <Navigate to="/dashboard" replace />;
      case ROLES.DOCENTE:
        return <Navigate to="/docente/dashboard" replace />;
      case ROLES.ESTUDIANTE:
        return <Navigate to="/estudiante/convocatorias" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <SignInPage />
              </PublicRoute>
            }
          />

          {/* Rutas públicas adicionales */}
          <Route path="/estudiante/proyectos/:idProyecto/documento" element={<DocumentoEditorPage />} />
          <Route element={<AppLayout />}>
            <Route path="/estudiante/proyectos/:idProyecto" element={<ProyectoDetallePage />} />
          </Route>

          {/* Rutas privadas */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/calendar" element={<Calendar />} />
              
              {/* Rutas de Admin */}
              <Route path="/usuarios" element={<UsuariosPage />} />
              <Route path="/proyectos" element={<ProyectoPage />} />
              <Route path="/admin/proyectos/:idProyecto" element={<ProyectoDetallePage />} />
              <Route path="/proyectos/tareas/:idTarea" element={<TareasDetallePage />} />
              
              {/* Rutas de Estudiante */}
              <Route path="/estudiante/convocatorias" element={<ConvocatoriasPage />} />
              <Route path="/estudiante/estadisticas" element={<EstadisticasPage />} />
              <Route path="/estudiante/calendario" element={<CalendarioPage />} />
              <Route path="/estudiante/proyectos/guias" element={<GuiasDescubrirPage />} />
              <Route path="/estudiante/proyectos/mis-proyectos" element={<MisProyectosPage />} />
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          top: 80,
          zIndex: 999999999,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
            padding: '16px',
            zIndex: 999999999,
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}
