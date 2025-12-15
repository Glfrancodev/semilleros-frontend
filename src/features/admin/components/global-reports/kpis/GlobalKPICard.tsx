import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FeriaData {
    feria: {
        idFeria: string;
        nombre: string;
        semestre: number;
        año: number;
    };
    value: number;
    crecimiento: number | null;
}

interface GlobalKPICardProps {
    title: string;
    data: {
        series: FeriaData[];
        estadisticas: any;
    } | null;
    loading: boolean;
    error: string | null;
    valueKey: string;
    icon: React.ReactNode;
    colorClass: string;
    formatValue?: (value: number) => string;
}

export default function GlobalKPICard({
    title,
    data,
    loading,
    error,
    valueKey,
    icon,
    colorClass,
    formatValue = (v) => v.toString()
}: GlobalKPICardProps) {
    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`${colorClass}`}>{icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                </div>
                <p className="text-red-500 dark:text-red-400">{error}</p>
            </div>
        );
    }

    if (!data || !data.series || data.series.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`${colorClass}`}>{icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
            </div>
        );
    }

    // Preparar datos para el chart
    const chartData = data.series.map((item) => ({
        name: `${item.feria.semestre}-${item.feria.año}`,
        value: item[valueKey as keyof FeriaData] as number,
        fullName: item.feria.nombre
    }));

    // Calcular tendencia reciente (últimas 2 ferias)
    let tendencia: 'up' | 'down' | 'stable' = 'stable';

    if (data.series.length >= 2) {
        const lastValue = data.series[data.series.length - 1]?.[valueKey as keyof FeriaData] as number;
        const previousValue = data.series[data.series.length - 2]?.[valueKey as keyof FeriaData] as number;

        if (lastValue > previousValue) {
            tendencia = 'up';
        } else if (lastValue < previousValue) {
            tendencia = 'down';
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`${colorClass}`}>{icon}</div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
                </div>
                {tendencia === 'up' && (
                    <div className="flex items-center gap-1 text-green-500">
                        <span className="text-xl font-bold">↑</span>
                        <span className="text-xs font-medium">Creciente</span>
                    </div>
                )}
                {tendencia === 'down' && (
                    <div className="flex items-center gap-1 text-red-500">
                        <span className="text-xl font-bold">↓</span>
                        <span className="text-xs font-medium">Decreciente</span>
                    </div>
                )}
                {tendencia === 'stable' && (
                    <div className="flex items-center gap-1 text-gray-500">
                        <span className="text-xl font-bold">→</span>
                        <span className="text-xs font-medium">Estable</span>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Promedio</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatValue(data.estadisticas[`promedio${valueKey.charAt(0).toUpperCase() + valueKey.slice(1)}PorFeria`] || 0)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Ferias</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {data.estadisticas.totalFerias}
                    </p>
                </div>
            </div>

            {/* Line Chart - Reduced height */}
            <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis
                            dataKey="name"
                            stroke="#6B7280"
                            style={{ fontSize: '10px' }}
                        />
                        <YAxis
                            stroke="#6B7280"
                            style={{ fontSize: '10px' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '12px'
                            }}
                            formatter={(value: any) => [formatValue(value), title]}
                            labelFormatter={(label, payload) => payload[0]?.payload?.fullName || label}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={colorClass.includes('blue') ? '#3B82F6' :
                                colorClass.includes('green') ? '#10B981' :
                                    colorClass.includes('purple') ? '#8B5CF6' :
                                        colorClass.includes('orange') ? '#F97316' : '#3B82F6'}
                            strokeWidth={2}
                            dot={{ fill: '#fff', strokeWidth: 2, r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
