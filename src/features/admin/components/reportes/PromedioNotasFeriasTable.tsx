import { PromedioNotasFeriasData } from "../../../../types/reportes";

interface Props {
    data: PromedioNotasFeriasData | null;
    loading: boolean;
    reporteGenerado: boolean;
    visibleColumns?: string[];
}

export default function PromedioNotasFeriasTable({ data, loading, reporteGenerado, visibleColumns = [] }: Props) {
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

    if (!data || !data.series || data.series.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    Reporte Generado:
                </h3>
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>No hay datos de ferias disponibles</p>
                    <p className="text-sm mt-2">
                        No se encontraron ferias con calificaciones
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
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Ferias</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {data.series.length}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Promedio Histórico</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {data.tendenciaGeneral.promedioHistorico.toFixed(2)}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Tendencia</p>
                        <p className={`text-2xl font-bold ${data.tendenciaGeneral.direccion === 'creciente' ? 'text-green-600 dark:text-green-400' :
                            data.tendenciaGeneral.direccion === 'decreciente' ? 'text-red-600 dark:text-red-400' :
                                'text-gray-600 dark:text-gray-400'
                            }`}>
                            {data.tendenciaGeneral.direccion === 'creciente' ? '↗ Creciente' :
                                data.tendenciaGeneral.direccion === 'decreciente' ? '↘ Decreciente' :
                                    '→ Estable'}
                        </p>
                    </div>
                </div>

                {/* Tabla */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {isColumnVisible("nombreFeria") && (
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Nombre Feria
                                        </th>
                                    )}
                                    {isColumnVisible("semestre") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Semestre
                                        </th>
                                    )}
                                    {isColumnVisible("año") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Año
                                        </th>
                                    )}
                                    {isColumnVisible("promedioGeneral") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Promedio General
                                        </th>
                                    )}
                                    {isColumnVisible("mediana") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Mediana
                                        </th>
                                    )}
                                    {isColumnVisible("desviacionEstandar") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Desv. Estándar
                                        </th>
                                    )}
                                    {isColumnVisible("calificacionMaxima") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Cal. Máxima
                                        </th>
                                    )}
                                    {isColumnVisible("calificacionMinima") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Cal. Mínima
                                        </th>
                                    )}
                                    {isColumnVisible("totalProyectos") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Total Proyectos
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {data.series.map((serie, index) => (
                                    <tr
                                        key={serie.feria.idFeria}
                                        className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"}
                                    >
                                        {isColumnVisible("nombreFeria") && (
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {serie.feria.nombre}
                                                </div>
                                            </td>
                                        )}
                                        {isColumnVisible("semestre") && (
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {serie.feria.semestre}
                                                </span>
                                            </td>
                                        )}
                                        {isColumnVisible("año") && (
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {serie.feria.año}
                                                </span>
                                            </td>
                                        )}
                                        {isColumnVisible("promedioGeneral") && (
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                    {serie.estadisticas.promedioGeneral.toFixed(2)}
                                                </span>
                                            </td>
                                        )}
                                        {isColumnVisible("mediana") && (
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {serie.estadisticas.mediana.toFixed(2)}
                                                </span>
                                            </td>
                                        )}
                                        {isColumnVisible("desviacionEstandar") && (
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {serie.estadisticas.desviacionEstandar.toFixed(2)}
                                                </span>
                                            </td>
                                        )}
                                        {isColumnVisible("calificacionMaxima") && (
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                    {serie.estadisticas.calificacionMaxima.toFixed(2)}
                                                </span>
                                            </td>
                                        )}
                                        {isColumnVisible("calificacionMinima") && (
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                                                    {serie.estadisticas.calificacionMinima.toFixed(2)}
                                                </span>
                                            </td>
                                        )}
                                        {isColumnVisible("totalProyectos") && (
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {serie.estadisticas.totalProyectosCalificados}
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
