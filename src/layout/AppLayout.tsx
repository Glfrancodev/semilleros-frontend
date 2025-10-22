import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AdminSidebar from "./sidebars/AdminSidebar";
import EstudianteSidebar from "./sidebars/EstudianteSidebar";
import DocenteSidebar from "./sidebars/DocenteSidebar";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/roles";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user } = useAuth();

  // Renderizar el sidebar según el rol del usuario
  const renderSidebar = () => {
    if (!user) return <AdminSidebar />; // Fallback

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
