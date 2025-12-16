import { CalificacionesFinalesData } from "../../../../types/reportes";

interface Props {
    data: CalificacionesFinalesData | null;
    loading: boolean;
    reporteGenerado: boolean;
    visibleColumns?: string[];
}

export default function CalificacionesFinalesTable({ data, loading, reporteGenerado, visibleColumns = [] }: Props) {
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

    // Si no se ha generado el reporte aún
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

    // Si se generó el reporte pero no hay datos
    if (!data || !data.proyectos || data.proyectos.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    Reporte Generado:
                </h3>
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>No hay proyectos aprobados para exposición</p>
                    <p className="text-sm mt-2">
                        No se encontraron proyectos con <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">esFinal = true</code>
                    </p>
                </div>
            </div>
        );
    }

    const renderCalificacion = (calificacion: number | 'Pendiente') => {
        if (calificacion === 'Pendiente') {
            return (
                <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                    Pendiente
                </span>
            );
        }

        return (
            <span className="text-gray-900 dark:text-white font-semibold">
                {calificacion}
            </span>
        );
    };

    const renderNotaFinal = (notaFinal: number | 'Pendiente') => {
        if (notaFinal === 'Pendiente') {
            return (
                <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                    Pendiente
                </span>
            );
        }

        // Colorear según la nota
        let colorClass = 'text-gray-900 dark:text-white';
        if (notaFinal >= 90) {
            colorClass = 'text-green-600 dark:text-green-400';
        } else if (notaFinal >= 80) {
            colorClass = 'text-blue-600 dark:text-blue-400';
        } else if (notaFinal >= 70) {
            colorClass = 'text-amber-600 dark:text-amber-400';
        } else {
            colorClass = 'text-red-600 dark:text-red-400';
        }

        return (
            <span className={`font-bold text-lg ${colorClass}`}>
                {notaFinal}
            </span>
        );
    };

    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            {/* Título */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                Reporte Generado:
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
                        <p className="text-sm text-gray-600 dark:text-gray-400">Calificados</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {data.estadisticas.proyectosCalificados}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {data.estadisticas.proyectosPendientes}
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
                                    {isColumnVisible("calificacion1") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Cal. 1
                                        </th>
                                    )}
                                    {isColumnVisible("calificacion2") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Cal. 2
                                        </th>
                                    )}
                                    {isColumnVisible("calificacion3") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Cal. 3
                                        </th>
                                    )}
                                    {isColumnVisible("notaFinal") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Nota Final
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {data.proyectos.map((proyecto, index) => (
                                    <tr
                                        key={proyecto.idProyecto}
                                        className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"}
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
                                        {isColumnVisible("calificacion1") && (
                                            <td className="px-4 py-3 text-center">
                                                {renderCalificacion(proyecto.calificacion1)}
                                            </td>
                                        )}
                                        {isColumnVisible("calificacion2") && (
                                            <td className="px-4 py-3 text-center">
                                                {renderCalificacion(proyecto.calificacion2)}
                                            </td>
                                        )}
                                        {isColumnVisible("calificacion3") && (
                                            <td className="px-4 py-3 text-center">
                                                {renderCalificacion(proyecto.calificacion3)}
                                            </td>
                                        )}
                                        {isColumnVisible("notaFinal") && (
                                            <td className="px-4 py-3 text-center">
                                                {renderNotaFinal(proyecto.notaFinal)}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Leyenda */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <span className="text-green-600 dark:text-green-400 font-bold">90+</span>
                        <span>Excelente</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">80-89</span>
                        <span>Muy Bueno</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-amber-600 dark:text-amber-400 font-bold">70-79</span>
                        <span>Bueno</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-red-600 dark:text-red-400 font-bold">&lt;70</span>
                        <span>Regular</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
