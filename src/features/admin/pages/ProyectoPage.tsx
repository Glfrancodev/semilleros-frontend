import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ProyectosTableWithFilters from "../../../components/tables/ProyectosTableWithFilters";

export default function ProyectoPage() {
  return (
    <>
      <PageMeta
        title="Proyectos | Semilleros"
        description="Resumen de tareas de la feria activa"
      />
      <PageBreadcrumb pageTitle="Proyectos" />

      <div className="space-y-4">
        <ProyectosTableWithFilters />
      </div>
    </>
  );
}
