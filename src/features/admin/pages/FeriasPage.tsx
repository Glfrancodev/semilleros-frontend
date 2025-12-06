import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import FeriasTableWithFilters from "../../../components/tables/FeriasTableWithFilters";

export default function FeriasPage() {
  return (
    <>
      <PageMeta
        title="Ferias | Semilleros"
        description="Gestión de ferias del sistema"
      />
      <PageBreadcrumb pageTitle="Ferias" />
      
      <div className="space-y-4">
        <FeriasTableWithFilters />
      </div>
    </> 
  );
}
