import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { reportsService } from '../../../../../services/reportsService';

interface CategoriasDistribucionChartProps {
    filtros?: any;
}

const COLORS = {
    'Básico': '#3b82f6',      // blue-500
    'Intermedio': '#8b5cf6',  // purple-500
    'Avanzado': '#ec4899'     // pink-500
};

export default function CategoriasDistribucionChart({ filtros }: CategoriasDistribucionChartProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getCategoriasFrecuentesGlobal(filtros);
                setData(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching categorias frecuentes:', err);
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
                    Distribución por Categoría
                </h3>
                <p className="text-red-500 dark:text-red-400">{error}</p>
            </div>
        );
    }

    if (!data || !data.ranking || data.ranking.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                    Distribución por Categoría
                </h3>
                <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
            </div>
        );
    }

    // Preparar datos para el chart
    const chartData = data.ranking.map((item: any) => ({
        name: item.categoria.nombre,
        value: item.totalProyectos,
        porcentaje: item.porcentajeTotal
    }));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Distribución por Categoría
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {data.estadisticas.totalProyectos} proyectos
                </span>
            </div>

            {/* Donut Chart */}
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ percent }: any) => `${(percent * 100).toFixed(1)}%`}
                            labelLine={false}
                        >
                            {chartData.map((entry: any, index: number) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[entry.name as keyof typeof COLORS] || '#6b7280'}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '12px'
                            }}
                            formatter={(value: any, name?: string) => [value + ' proyectos', name || '']}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Stats List */}
            <div className="space-y-2 mt-2">
                {chartData.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] || '#6b7280' }}
                            ></div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                {item.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">
                                {item.value} proyectos
                            </span>
                            <span className="text-gray-500 dark:text-gray-500">
                                ({item.porcentaje.toFixed(1)}%)
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
