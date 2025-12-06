import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import MateriasTableWithFilters from "../../../components/tables/MateriasTableWithFilters";

export default function MateriasPage() {
  return (
    <>
      <PageMeta
        title="Materias | Semilleros"
        description="Gestión de materias del sistema"
      />
      <PageBreadcrumb pageTitle="Materias" />
      
      <div className="space-y-4">
        <MateriasTableWithFilters />
      </div>
    </> 
  );
}
