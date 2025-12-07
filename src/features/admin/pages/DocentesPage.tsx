import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DocentesTableWithFilters from "../../../components/tables/DocentesTableWithFilters";

export default function DocentesPage() {
  return (
    <>
      <PageMeta
        title="Docentes | Semilleros"
        description="Gestión de docentes"
      />
      <PageBreadcrumb pageTitle="Docentes" />
      
      <div className="space-y-4">
        <DocentesTableWithFilters />
      </div>
    </> 
  );
}
