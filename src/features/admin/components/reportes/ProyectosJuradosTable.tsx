import { ProyectosJuradosData, Jurado } from "../../../../types/reportes";

interface Props {
    data: ProyectosJuradosData | null;
    loading: boolean;
    reporteGenerado: boolean;
}

export default function ProyectosJuradosTable({ data, loading, reporteGenerado }: Props) {
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
                    👨‍⚖️ Previsualización
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
                    👨‍⚖️ Previsualización
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

    const renderJurado = (jurado: Jurado | null) => {
        if (!jurado) {
            return (
                <span className="text-gray-400 dark:text-gray-600 text-center block">-</span>
            );
        }

        return (
            <div className="text-sm">
                <div className="font-medium text-gray-900 dark:text-white">
                    {jurado.nombre}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {jurado.correo}
                </div>
            </div>
        );
    };

    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            {/* Título */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                👨‍⚖️ Previsualización
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
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Proyecto
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Área
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Jurado 1
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Jurado 2
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Jurado 3
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {data.proyectos.map((proyecto, index) => (
                                    <tr
                                        key={proyecto.idProyecto}
                                        className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-750"}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {proyecto.nombre}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {proyecto.area}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {proyecto.categoria}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {renderJurado(proyecto.jurado1)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {renderJurado(proyecto.jurado2)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {renderJurado(proyecto.jurado3)}
                                        </td>
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
