import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/Dashboard";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Redirigir /admin → /admin/dashboard */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        {/* Más rutas se irán agregando aquí luego */}
      </Route>
    </Routes>
  );
}
