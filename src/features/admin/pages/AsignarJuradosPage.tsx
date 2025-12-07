import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ProyectosJuradosTableWithFilters from "../../../components/tables/ProyectosJuradosTableWithFilters";

export default function AsignarJuradosPage() {
  return (
    <>
      <PageMeta
        title="Asignar Jurados | Semilleros"
        description="Asignar jurados a proyectos aprobados para feria"
      />
      <PageBreadcrumb pageTitle="Asignar Jurados" />
      
      <div className="space-y-4">
        <ProyectosJuradosTableWithFilters />
      </div>
    </> 
  );
}

