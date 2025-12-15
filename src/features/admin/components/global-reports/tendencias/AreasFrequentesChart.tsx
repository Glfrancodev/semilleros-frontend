import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { reportsService } from '../../../../../services/reportsService';

interface AreasFrequentesChartProps {
    filtros?: any;
}

export default function AreasFrequentesChart({ filtros }: AreasFrequentesChartProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getAreasFrecuentesGlobal(filtros);
                setData(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching areas frecuentes:', err);
                setError('Error al cargar datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filtros]);

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                    Áreas Más Frecuentes
                </h3>
                <p className="text-red-500 dark:text-red-400">{error}</p>
            </div>
        );
    }

    if (!data || !data.ranking || data.ranking.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                    Áreas Más Frecuentes
                </h3>
                <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
            </div>
        );
    }

    // Preparar datos para el chart
    const chartData = data.ranking.map((item: any) => ({
        nombre: item.area.nombre,
        total: item.totalProyectos,
        porcentaje: item.porcentajeTotal,
        tendencia: item.tendencia.direccion
    }));

    // Colores por tendencia
    const getColor = (tendencia: string) => {
        switch (tendencia) {
            case 'creciente': return '#10b981'; // green-500
            case 'decreciente': return '#ef4444'; // red-500
            default: return '#6b7280'; // gray-500
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Áreas Más Frecuentes
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {data.estadisticas.totalProyectos} proyectos
                </span>
            </div>

            {/* Stats */}
            <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    Área dominante: <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {data.estadisticas.areaDominante.nombre}
                    </span> ({data.estadisticas.areaDominante.porcentaje.toFixed(1)}%)
                </p>
            </div>

            {/* Bar Chart */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis
                            type="number"
                            stroke="#6B7280"
                            style={{ fontSize: '10px' }}
                        />
                        <YAxis
                            type="category"
                            dataKey="nombre"
                            stroke="#6B7280"
                            style={{ fontSize: '10px' }}
                            width={90}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '12px'
                            }}
                            formatter={(value: any, name?: string) => {
                                if (name === 'total') return [value + ' proyectos', 'Total'];
                                return [value, name || ''];
                            }}
                        />
                        <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                            {chartData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={getColor(entry.tendencia)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Creciente</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-red-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Decreciente</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gray-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Estable</span>
                </div>
            </div>
        </div>
    );
}
