import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import MisMateriasTableWithFilters from "../../../components/tables/MisMateriasTableWithFilters";

export default function MisMateriasPage() {
  return (
    <>
      <PageMeta
        title="Mis Materias | Semilleros"
        description="Materias asignadas al docente"
      />
      <PageBreadcrumb pageTitle="Mis Materias" />
      
      <div className="space-y-4">
        <MisMateriasTableWithFilters />
      </div>
    </> 
  );
}
