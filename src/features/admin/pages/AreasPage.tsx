import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import AreasTableWithFilters from "../../../components/tables/AreasTableWithFilters";

export default function AreasPage() {
  return (
    <>
      <PageMeta
        title="Áreas | Semilleros"
        description="Gestión de áreas del sistema"
      />
      <PageBreadcrumb pageTitle="Áreas" />
      
      <div className="space-y-4">
        <AreasTableWithFilters />
      </div>
    </> 
  );
}
