import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, Link } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AdminSidebar from "./sidebars/AdminSidebar";
import EstudianteSidebar from "./sidebars/EstudianteSidebar";
import DocenteSidebar from "./sidebars/DocenteSidebar";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/roles";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import Button from "../components/ui/button/Button";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  // Renderizar el sidebar según el rol del usuario
  const renderSidebar = () => {
    if (!user) {
      return <AdminSidebar />; // Fallback
    }

    switch (user.rol) {
      case ROLES.ADMIN:
        return <AdminSidebar />;
      case ROLES.DOCENTE:
        return <DocenteSidebar />;
      case ROLES.ESTUDIANTE:
        return <EstudianteSidebar />;
      default:
        return <AdminSidebar />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="sticky z-999 top-0 flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <Link to="/" className="text-lg font-semibold text-gray-900 dark:text-white">
            Sistema de Semilleros
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggleButton />
            <Button variant="primary" size="sm" className="rounded-lg">
              <Link to="/login">Iniciar sesión</Link>
            </Button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen xl:flex">
      <div>
        {renderSidebar()}
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
