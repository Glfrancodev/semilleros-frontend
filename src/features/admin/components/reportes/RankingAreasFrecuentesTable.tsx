import { RankingAreasFrecuentesData } from "../../../../types/reportes";

interface Props {
    data: RankingAreasFrecuentesData | null;
    loading: boolean;
    reporteGenerado: boolean;
    visibleColumns?: string[];
}

export default function RankingAreasFrecuentesTable({ data, loading, reporteGenerado, visibleColumns = [] }: Props) {
    const isColumnVisible = (columnId: string) => {
        if (visibleColumns.length === 0) return true;
        return visibleColumns.includes(columnId);
    };

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    Reporte Generado:
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
                    Reporte Generado:
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

    if (!data || !data.ranking || data.ranking.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    Reporte Generado:
                </h3>
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>No hay datos de áreas disponibles</p>
                    <p className="text-sm mt-2">
                        No se encontraron áreas con proyectos
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                Reporte Generado:
            </h3>

            <div className="space-y-6">
                {/* Estadísticas Generales */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Áreas</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {data.estadisticas.totalAreas}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Proyectos</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {data.estadisticas.totalProyectos}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Área Dominante</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400 truncate" title={data.estadisticas.areaDominante.nombre}>
                            {data.estadisticas.areaDominante.nombre}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {data.estadisticas.areaDominante.porcentaje.toFixed(1)}%
                        </p>
                    </div>
                </div>

                {/* Tabla */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {isColumnVisible("ranking") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Ranking
                                        </th>
                                    )}
                                    {isColumnVisible("nombreArea") && (
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Nombre Área
                                        </th>
                                    )}
                                    {isColumnVisible("totalProyectos") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Total Proyectos
                                        </th>
                                    )}
                                    {isColumnVisible("porcentajeTotal") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Porcentaje Total
                                        </th>
                                    )}
                                    {isColumnVisible("tendencia") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Tendencia
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {data.ranking.map((item, index) => (
                                    <tr
                                        key={item.area.idArea}
                                        className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"}
                                    >
                                        {isColumnVisible("ranking") && (
                                            <td className="px-4 py-3 text-center">
                                                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                                    index === 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' :
                                                        index === 2 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                                                            'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                        )}
                                        {isColumnVisible("nombreArea") && (
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {item.area.nombre}
                                                </div>
                                            </td>
                                        )}
                                        {isColumnVisible("totalProyectos") && (
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                    {item.totalProyectos}
                                                </span>
                                            </td>
                                        )}
                                        {isColumnVisible("porcentajeTotal") && (
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {item.porcentajeTotal.toFixed(1)}%
                                                </span>
                                            </td>
                                        )}
                                        {isColumnVisible("tendencia") && (
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${item.tendencia.direccion === 'creciente' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                                    item.tendencia.direccion === 'decreciente' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                                        'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                    }`}>
                                                    {item.tendencia.direccion === 'creciente' ? '↗' :
                                                        item.tendencia.direccion === 'decreciente' ? '↘' :
                                                            '→'}
                                                    <span className="capitalize">{item.tendencia.direccion}</span>
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
