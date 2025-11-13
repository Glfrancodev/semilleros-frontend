import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import UsuariosTableWithFilters from "../../../components/tables/UsuariosTableWithFilters";

export default function UsuariosPage() {
  return (
    <>
      <PageMeta
        title="Usuarios | Semilleros"
        description="Gestión de usuarios del sistema"
      />
      <PageBreadcrumb pageTitle="Usuarios" />
      
      <div className="space-y-4">
        <UsuariosTableWithFilters />
      </div>
    </> 
  );
}
