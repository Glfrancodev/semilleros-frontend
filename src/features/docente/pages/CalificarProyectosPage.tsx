import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import CalificarProyectosTableWithFilters from "../../../components/tables/CalificarProyectosTableWithFilters";

export default function CalificarProyectosPage() {
  return (
    <>
      <PageMeta
        title="Calificar Proyectos | Semilleros"
        description="Calificación de proyectos como jurado"
      />
      <PageBreadcrumb pageTitle="Calificar Proyectos" />
      
      <div className="space-y-4">
        <CalificarProyectosTableWithFilters />
      </div>
    </> 
  );
}
