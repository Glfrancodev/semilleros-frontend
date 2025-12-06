import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import SemestresTableWithFilters from "../../../components/tables/SemestresTableWithFilters";

export default function SemestresPage() {
  return (
    <>
      <PageMeta
        title="Semestres | Semilleros"
        description="Gestión de semestres del sistema"
      />
      <PageBreadcrumb pageTitle="Semestres" />
      
      <div className="space-y-4">
        <SemestresTableWithFilters />
      </div>
    </> 
  );
}
