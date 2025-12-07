import { useParams } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ProyectosMateriTableWithFilters from "../components/tables/ProyectosMateriTableWithFilters";

export default function MateriaProyectos() {
  const { idMateria } = useParams<{ idMateria: string }>();

  if (!idMateria) {
    return (
      <>
        <PageMeta
          title="Error | Semilleros"
          description="ID de materia no encontrado"
        />
        <div className="text-center text-red-600 p-8">
          ID de materia no encontrado
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Proyectos de Materia | Semilleros"
        description="Proyectos de la materia"
      />
      <PageBreadcrumb pageTitle="Proyectos de la Materia" />

      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gestiona y revisa los proyectos de esta materia
          </p>
        </div>

        <ProyectosMateriTableWithFilters />
      </div>
    </>
  );
}
