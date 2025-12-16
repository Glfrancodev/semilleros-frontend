import { ProyectosIntegrantesData } from "../../../../types/reportes";

interface Props {
    data: ProyectosIntegrantesData | null;
    loading: boolean;
    reporteGenerado: boolean;
    visibleColumns?: string[];
}

export default function ProyectosIntegrantesTable({ data, loading, reporteGenerado, visibleColumns = [] }: Props) {
    // Si no se especifican columnas visibles, mostrar todas
    const isColumnVisible = (columnId: string) => {
        if (visibleColumns.length === 0) return true;
        return visibleColumns.includes(columnId);
    };

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    📊 Previsualización
                </h3>
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    if (!reporteGenerado) {
        return (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    📊 Previsualización
                </h3>
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>Selecciona un reporte y haz clic en Generar Reporte</p>
                    <p className="text-sm mt-2">
                        Los resultados aparecerán aquí
                    </p>
                </div>
            </div>
        );
    }

    if (!data || !data.proyectos || data.proyectos.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    📊 Previsualización
                </h3>
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>No hay proyectos registrados en la feria actual</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                📊 Previsualización
            </h3>

            <div className="space-y-6">
                {/* Estadísticas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Proyectos</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {data.estadisticas.totalProyectos}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Estudiantes</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {data.estadisticas.totalEstudiantes}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Promedio por Proyecto</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {data.estadisticas.promedioIntegrantesPorProyecto}
                        </p>
                    </div>
                </div>

                {/* Tabla */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {isColumnVisible("proyecto") && (
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Proyecto
                                        </th>
                                    )}
                                    {isColumnVisible("area") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Área
                                        </th>
                                    )}
                                    {isColumnVisible("categoria") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Categoría
                                        </th>
                                    )}
                                    {isColumnVisible("lider") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Líder
                                        </th>
                                    )}
                                    {isColumnVisible("integrantes") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Integrantes
                                        </th>
                                    )}
                                    {isColumnVisible("total") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Total
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {data.proyectos.map((proyecto, index) => (
                                    <tr
                                        key={proyecto.idProyecto}
                                        className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-750"}
                                    >
                                        {isColumnVisible("proyecto") && (
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {proyecto.nombre}
                                                </div>
                                            </td>
                                        )}
                                        {isColumnVisible("area") && (
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {proyecto.area}
                                                </span>
                                            </td>
                                        )}
                                        {isColumnVisible("categoria") && (
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {proyecto.categoria}
                                                </span>
                                            </td>
                                        )}
                                        {isColumnVisible("lider") && (
                                            <td className="px-4 py-3 text-center">
                                                {proyecto.lider ? (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {proyecto.lider.nombre}
                                                        </div>
                                                        {isColumnVisible("codigoLider") && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                {proyecto.lider.codigo}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 dark:text-gray-500">
                                                        Sin líder
                                                    </span>
                                                )}
                                            </td>
                                        )}
                                        {isColumnVisible("integrantes") && (
                                            <td className="px-4 py-3">
                                                {proyecto.integrantes.length > 0 ? (
                                                    <div className="space-y-1">
                                                        {proyecto.integrantes.map((integrante, idx) => (
                                                            <div key={idx} className="text-sm">
                                                                <span className="text-gray-900 dark:text-white">
                                                                    {integrante.nombre}
                                                                </span>
                                                                {isColumnVisible("codigosIntegrantes") && (
                                                                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                                                                        ({integrante.codigo})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-sm text-gray-400 dark:text-gray-500">
                                                        Sin integrantes
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                        {isColumnVisible("total") && (
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold text-sm">
                                                    {proyecto.totalIntegrantes}
                                                </span>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
