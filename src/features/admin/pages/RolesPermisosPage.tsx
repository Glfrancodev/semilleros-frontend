import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import AdvancedTableOneWithFilters from "../../../components/tables/CustomTables/AdvancedTableOneWithFilters";

export default function RolesPermisosPage() {
  return (
    <>
      <PageMeta
        title="Roles y Permisos | Semilleros"
        description="Gestión de roles y permisos del sistema"
      />
      <PageBreadcrumb pageTitle="Roles y Permisos" />
      
      <div className="space-y-6">
        <AdvancedTableOneWithFilters />
      </div>
    </>
  );
}
