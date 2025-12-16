import { ControlNotasData, TareaEstado } from "../../../../types/reportes";

interface Props {
    data: ControlNotasData | null;
    loading: boolean;
    visibleColumns?: string[];
}

export default function ControlNotasTable({ data, loading, visibleColumns = [] }: Props) {
    const isColumnVisible = (columnId: string) => {
        if (visibleColumns.length === 0) return true;
        return visibleColumns.includes(columnId);
    };

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    📋 Previsualización
                </h3>
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    if (!data || data.matriz.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    📋 Previsualización
                </h3>
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>No hay datos para mostrar</p>
                    <p className="text-sm mt-2">Selecciona filtros y haz clic en Previsualizar</p>
                </div>
            </div>
        );
    }

    const renderEstadoCelda = (tarea: TareaEstado) => {
        if (tarea.estado === "revisado") {
            return (
                <div className="flex items-center justify-center gap-2">
                    <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {tarea.calificacion}
                    </span>
                </div>
            );
        }

        if (tarea.estado === "pendiente_revision") {
            return (
                <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                    <span className="text-lg">⏳</span>
                    <span className="text-sm font-medium">Pendiente</span>
                </div>
            );
        }

        return (
            <span className="text-gray-400 dark:text-gray-600 text-center block">-</span>
        );
    };

    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            {/* Título */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                📋 Previsualización
            </h3>

            <div className="space-y-6">
                {/* Estadísticas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Proyectos</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {data.estadisticas.totalProyectos}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Revisadas</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {data.estadisticas.tareasRevisadas}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {data.estadisticas.tareasPendientes}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">No Enviadas</p>
                        <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                            {data.estadisticas.tareasNoEnviadas}
                        </p>
                    </div>
                </div>

                {/* Tabla */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {isColumnVisible("proyecto") && (
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                                            Proyecto
                                        </th>
                                    )}
                                    {isColumnVisible("area") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                                            Área
                                        </th>
                                    )}
                                    {isColumnVisible("categoria") && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                                            Categoría
                                        </th>
                                    )}
                                    {data.tareas.map((tarea) => {
                                        const tareaId = `tarea-${tarea.idTarea}`;
                                        if (!isColumnVisible(tareaId)) return null;
                                        return (
                                            <th
                                                key={tarea.idTarea}
                                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[120px]"
                                            >
                                                <div>{tarea.nombre}</div>
                                                <div className="text-xs font-normal text-gray-400 dark:text-gray-500 mt-1">
                                                    (Orden {tarea.orden})
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {data.matriz.map((fila, index) => (
                                    <tr
                                        key={fila.proyecto.idProyecto}
                                        className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-750"}
                                    >
                                        {isColumnVisible("proyecto") && (
                                            <td className="px-4 py-3 border-r border-gray-200 dark:border-gray-600">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {fila.proyecto.nombre}
                                                </div>
                                            </td>
                                        )}
                                        {isColumnVisible("area") && (
                                            <td className="px-4 py-3 text-center border-r border-gray-200 dark:border-gray-600">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {fila.proyecto.area}
                                                </span>
                                            </td>
                                        )}
                                        {isColumnVisible("categoria") && (
                                            <td className="px-4 py-3 text-center border-r border-gray-200 dark:border-gray-600">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {fila.proyecto.categoria}
                                                </span>
                                            </td>
                                        )}
                                        {fila.tareas.map((tarea) => {
                                            const tareaId = `tarea-${tarea.idTarea}`;
                                            if (!isColumnVisible(tareaId)) return null;
                                            return (
                                                <td
                                                    key={tarea.idTarea}
                                                    className="px-6 py-4 whitespace-nowrap text-center"
                                                >
                                                    {renderEstadoCelda(tarea)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Leyenda */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <span>Revisado con calificación</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-amber-600 dark:text-amber-400">⏳</span>
                        <span>Pendiente de revisión</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 dark:text-gray-600">-</span>
                        <span>No enviado</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
