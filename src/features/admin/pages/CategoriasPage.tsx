import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import CategoriasTableWithFilters from "../../../components/tables/CategoriasTableWithFilters";

export default function CategoriasPage() {
  return (
    <>
      <PageMeta
        title="Categorías | Semilleros"
        description="Gestión de categorías del sistema"
      />
      <PageBreadcrumb pageTitle="Categorías" />
      
      <div className="space-y-4">
        <CategoriasTableWithFilters />
      </div>
    </> 
  );
}
