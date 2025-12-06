import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import EventosTableWithFilters from "../../../components/tables/EventosTableWithFilters";

export default function EventosPage() {
  return (
    <>
      <PageMeta
        title="Eventos | Semilleros"
        description="Gestión de eventos del sistema"
      />
      <PageBreadcrumb pageTitle="Eventos" />
      
      <div className="space-y-4">
        <EventosTableWithFilters />
      </div>
    </> 
  );
}
