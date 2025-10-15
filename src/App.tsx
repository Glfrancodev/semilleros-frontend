

import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import NotFound from "./legacy/pages/OtherPage/NotFound";
import UserProfiles from "./legacy/pages/UserProfiles";
import Calendar from "./legacy/pages/Calendar";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./legacy/pages/Dashboard/Home";
import SignInPage from "./features/auth/pages/SignInPage";
import { AuthProvider, useAuth } from "./context/AuthContext";


// Ruta privada: solo permite acceso si hay token
function PrivateRoute() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

// Ruta pública: si ya está autenticado, redirige al dashboard
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return token ? <Navigate to="/" replace /> : <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <SignInPage />
              </PublicRoute>
            }
          />

          {/* Rutas privadas */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
