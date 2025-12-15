
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NotFound from "./legacy/pages/OtherPage/NotFound";
import Calendar from "./legacy/pages/Calendar";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Dashboard from "./features/admin/pages/Dashboard";
import SignInPage from "./features/auth/pages/SignInPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import PublicProfilePage from "./features/profile/pages/PublicProfilePage";
import UsuariosPage from "./features/admin/pages/UsuariosPage";
import AdministrativosPage from "./features/admin/pages/AdministrativosPage";
import EstudiantesPage from "./features/admin/pages/EstudiantesPage";
import DocentesPage from "./features/admin/pages/DocentesPage";
import ProyectoPage from "./features/admin/pages/ProyectoPage";
import TareasDetallePage from "./features/admin/pages/TareasDetallePage";
import AsignarJuradosPage from "./features/admin/pages/AsignarJuradosPage";
import CategoriasPage from "./features/admin/pages/CategoriasPage";
import AreasPage from "./features/admin/pages/AreasPage";
import EventosPage from "./features/admin/pages/EventosPage";
import FeriasPage from "./features/admin/pages/FeriasPage";
import FeriaDetallePage from "./features/admin/pages/FeriaDetallePage";
import GanadoresPage from "./features/admin/pages/GanadoresPage";
import SemestresPage from "./features/admin/pages/SemestresPage";
import MateriasPage from "./features/admin/pages/MateriasPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ROLES } from "./constants/roles";

// Páginas de Estudiante
import GuiasDescubrirPage from "./features/estudiante/pages/GuiasDescubrirPage";
import MisProyectosPage from "./features/estudiante/pages/MisProyectosPage";
import ConvocatoriasPage from "./features/estudiante/pages/ConvocatoriasPage";
import ProyectoDetallePage from "./features/estudiante/pages/ProyectoDetallePage";
import DocumentoEditorPage from "./features/estudiante/pages/DocumentoEditorPage";

// Páginas de Docente
import CalificarProyectosPage from "./features/docente/pages/CalificarProyectosPage";
import ProyectoCalificacionPage from "./features/docente/pages/ProyectoCalificacionPage";
import MisMateriasPage from "./features/docente/pages/MisMateriasPage";
import MateriaProyectos from "./pages/MateriaProyectos";
import ProyectoRevisionPage from "./features/docente/pages/ProyectoRevisionPage";

import NewLandingPage from "./NewLandingPage";
import ReunionPage from "./pages/ReunionPage";


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
        return <Navigate to="/mis-materias" replace />;
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
                <NewLandingPage />
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
          <Route path="/reunion/:proyectoId" element={<ReunionPage />} />
          <Route path="/estudiante/proyectos/:idProyecto/documento" element={<DocumentoEditorPage />} />

          {/* Rutas públicas con layout (ferias y proyectos) */}
          <Route element={<AppLayout />}>
            <Route path="/estudiante/proyectos/:idProyecto" element={<ProyectoDetallePage />} />
            <Route path="/ferias/:idFeria" element={<FeriaDetallePage />} />
            <Route path="/ferias/:idFeria/ganadores" element={<GanadoresPage />} />
            <Route path="/estudiantes/:idEstudiante/perfil" element={<PublicProfilePage />} />
          </Route>

          {/* Rutas privadas */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/calendar" element={<Calendar />} />

              {/* Rutas de Admin */}
              <Route path="/usuarios" element={<UsuariosPage />} />
              <Route path="/administrativos" element={<AdministrativosPage />} />
              <Route path="/estudiantes" element={<EstudiantesPage />} />
              <Route path="/docentes" element={<DocentesPage />} />
              <Route path="/tareas-revisiones" element={<ProyectoPage />} />
              <Route path="/admin/proyectos/:idProyecto" element={<ProyectoDetallePage />} />
              <Route path="/proyectos/tareas/:idTarea" element={<TareasDetallePage />} />
              <Route path="/asignar-jurados" element={<AsignarJuradosPage />} />
              <Route path="/categorias" element={<CategoriasPage />} />
              <Route path="/areas" element={<AreasPage />} />
              <Route path="/eventos" element={<EventosPage />} />
              <Route path="/ferias" element={<FeriasPage />} />
              <Route path="/semestres" element={<SemestresPage />} />
              <Route path="/materias/:idSemestre" element={<MateriasPage />} />

              {/* Rutas de Estudiante */}
              <Route path="/estudiante/convocatorias" element={<ConvocatoriasPage />} />
              <Route path="/estudiante/proyectos/guias" element={<GuiasDescubrirPage />} />
              <Route path="/estudiante/proyectos/mis-proyectos" element={<MisProyectosPage />} />

              {/* Rutas de Docente */}
              <Route path="/mis-materias" element={<MisMateriasPage />} />
              <Route path="/mis-materias/:idMateria/proyectos" element={<MateriaProyectos />} />
              <Route path="/docente/proyecto/:idProyecto" element={<ProyectoRevisionPage />} />
              <Route path="/calificar-proyectos" element={<CalificarProyectosPage />} />
              <Route path="/calificar-proyecto/:idProyecto" element={<ProyectoCalificacionPage />} />
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
