import { useState } from "react";
import AdvancedTableOne from "./AdvancedTableOne";
import { mockUsersData } from "./mockData";
import CustomSelect from "../../common/CustomSelect";
import Button from "../../ui/button/Button";

export default function AdvancedTableOneWithFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Nota: Esta es solo la fachada/ejemplo. La lógica de filtrado real se implementará después
  // Por ahora solo mostramos todos los datos sin filtrar
  const filteredData = mockUsersData;

  const statusOptions = [
    { value: "all", label: "Todos los estados" },
    { value: "active", label: "Activo" },
    { value: "inactive", label: "Inactivo" },
  ];

  const roleOptions = [
    { value: "all", label: "Todos los roles" },
    { value: "administrator", label: "Administrator" },
    { value: "moderator", label: "Moderator" },
    { value: "viewer", label: "Viewer" },
  ];

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03] sm:flex-row sm:items-center">
        {/* Buscador */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
          />
        </div>

        {/* Filtro de Estado */}
        <CustomSelect
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-full sm:w-48"
        />

        {/* Filtro de Rol */}
        <CustomSelect
          options={roleOptions}
          value={roleFilter}
          onChange={setRoleFilter}
          className="w-full sm:w-48"
        />

        {/* Botón de búsqueda (opcional, decorativo por ahora) */}
        <Button 
          variant="primary" 
          size="xs"
          startIcon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        >
          Buscar
        </Button>
      </div>

      {/* Tabla */}
      <AdvancedTableOne 
        data={filteredData}
        totalUsers={1356546}
        totalProjects={884}
      />
    </div>
  );
}
