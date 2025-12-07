import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import AdministrativosTableWithFilters from "../../../components/tables/AdministrativosTableWithFilters";

export default function AdministrativosPage() {
  return (
    <>
      <PageMeta
        title="Administrativos | Semilleros"
        description="Gestión de usuarios administrativos"
      />
      <PageBreadcrumb pageTitle="Administrativos" />
      
      <div className="space-y-4">
        <AdministrativosTableWithFilters />
      </div>
    </> 
  );
}
