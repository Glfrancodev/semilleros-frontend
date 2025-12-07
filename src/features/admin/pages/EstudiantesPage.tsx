import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import EstudiantesTableWithFilters from "../../../components/tables/EstudiantesTableWithFilters";

export default function EstudiantesPage() {
  return (
    <>
      <PageMeta
        title="Estudiantes | Semilleros"
        description="Gestión de estudiantes"
      />
      <PageBreadcrumb pageTitle="Estudiantes" />
      
      <div className="space-y-4">
        <EstudiantesTableWithFilters />
      </div>
    </> 
  );
}
