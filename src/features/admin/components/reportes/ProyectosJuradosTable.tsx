import { ProyectosJuradosData } from "../../../../types/reportes";

interface Props {
    data: ProyectosJuradosData | null;
    loading: boolean;
    reporteGenerado: boolean;
    visibleColumns?: string[];
}

export default function ProyectosJuradosTable({ data, loading, reporteGenerado, visibleColumns = [] }: Props) {
    const isColumnVisible = (columnId: string) => {
        if (visibleColumns.length === 0) return true;
        return visibleColumns.includes(columnId);
    };

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    👨‍⚖️ Previsualización
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
                    <p className="text-xs mt-2 text-gray-400">
                        Asegúrate de tener proyectos aprobados para exposición en la feria actual
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            {/* Título */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                Reporte Generado:
            </h3>

            <div className="space-y-6">
                {/* Estadísticas */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Proyectos</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {data.estadisticas.totalProyectos}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Con Jurados</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {data.estadisticas.proyectosConJurados}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sin Jurados</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {data.estadisticas.proyectosSinJurados}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">1 Jurado</p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {data.estadisticas.proyectosCon1Jurado}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">2 Jurados</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {data.estadisticas.proyectosCon2Jurados}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">3 Jurados</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {data.estadisticas.proyectosCon3Jurados}
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
                                    {isColumnVisible("jurado1") && (
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Jurado 1
                                        </th>
                                    )}
                                    {isColumnVisible("jurado2") && (
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Jurado 2
                                        </th>
                                    )}
                                    {isColumnVisible("jurado3") && (
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Jurado 3
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
                                        {isColumnVisible("jurado1") && (
                                            <td className="px-4 py-3">
                                                {proyecto.jurado1 ? (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {proyecto.jurado1.nombre}
                                                        </div>
                                                        {isColumnVisible("email1") && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {proyecto.jurado1.correo}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                                                )}
                                            </td>
                                        )}
                                        {isColumnVisible("jurado2") && (
                                            <td className="px-4 py-3">
                                                {proyecto.jurado2 ? (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {proyecto.jurado2.nombre}
                                                        </div>
                                                        {isColumnVisible("email2") && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {proyecto.jurado2.correo}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                                                )}
                                            </td>
                                        )}
                                        {isColumnVisible("jurado3") && (
                                            <td className="px-4 py-3">
                                                {proyecto.jurado3 ? (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {proyecto.jurado3.nombre}
                                                        </div>
                                                        {isColumnVisible("email3") && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {proyecto.jurado3.correo}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                                                )}
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
