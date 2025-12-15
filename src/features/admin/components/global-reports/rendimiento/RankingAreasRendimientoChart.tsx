import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { reportsService } from '../../../../../services/reportsService';

interface RankingAreasRendimientoChartProps {
    filtros?: any;
}

export default function RankingAreasRendimientoChart({ filtros }: RankingAreasRendimientoChartProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getRankingAreasRendimientoGlobal(filtros);
                setData(response.data);
            } catch (err) {
                console.error('Error fetching ranking areas:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filtros]);

    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        );
    }

    if (!data || !data.ranking || data.ranking.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="h-1.5 w-full bg-amber-500 dark:bg-amber-400 opacity-80"></div>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Ranking de Áreas por Rendimiento
                    </h3>
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                        <p>No hay datos disponibles</p>
                    </div>
                </div>
            </div>
        );
    }

    const renderSparkline = (evolucion: any[]) => {
        const values = evolucion.map((e: any) => parseFloat(e.promedio));

        const sparklineOptions: ApexOptions = {
            chart: {
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#6366f1'],
            tooltip: {
                fixed: {
                    enabled: false,
                },
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => '',
                    },
                },
            },
        };

        return (
            <Chart
                options={sparklineOptions}
                series={[{ data: values }]}
                type="line"
                height={40}
                width={100}
            />
        );
    };

    const getTendenciaIcon = (direccion: string) => {
        switch (direccion) {
            case 'creciente':
                return <span className="text-green-600 dark:text-green-400 font-bold">↑</span>;
            case 'decreciente':
                return <span className="text-red-600 dark:text-red-400 font-bold">↓</span>;
            default:
                return <span className="text-gray-500 dark:text-gray-400">→</span>;
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="h-1.5 w-full bg-amber-500 dark:bg-amber-400 opacity-80"></div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Ranking de Áreas por Rendimiento
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {data.estadisticasGenerales.totalAreas} áreas
                    </span>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Promedio General</p>
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                            {data.estadisticasGenerales.promedioGeneral.toFixed(2)}
                        </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Mejor Rendimiento</p>
                        <p className="text-sm font-bold text-green-600 dark:text-green-400">
                            {data.estadisticasGenerales.areaMejorRendimiento.nombre}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {parseFloat(data.estadisticasGenerales.areaMejorRendimiento.promedio).toFixed(2)} pts
                        </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Más Consistente</p>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {data.estadisticasGenerales.areaMasConsistente.nombre}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            σ = {parseFloat(data.estadisticasGenerales.areaMasConsistente.desviacionEstandar).toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Ranking Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-12">
                                    #
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                    Área
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-20">
                                    Prom.
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-16">
                                    Proy.
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-16">
                                    σ
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-24">
                                    Evolución
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-12">
                                    ↕
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {data.ranking.map((item: any) => (
                                <tr key={item.area.idArea} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-2 py-3 text-sm font-bold text-gray-900 dark:text-white">
                                        {item.posicion === 1 && <span className="text-yellow-500">🥇</span>}
                                        {item.posicion === 2 && <span className="text-gray-400">🥈</span>}
                                        {item.posicion === 3 && <span className="text-amber-600">🥉</span>}
                                        {item.posicion > 3 && item.posicion}
                                    </td>
                                    <td className="px-3 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                        {item.area.nombre}
                                    </td>
                                    <td className="px-2 py-3 text-sm text-center font-bold text-indigo-600 dark:text-indigo-400">
                                        {parseFloat(item.estadisticas.promedioHistorico).toFixed(1)}
                                    </td>
                                    <td className="px-2 py-3 text-sm text-center text-gray-700 dark:text-gray-300">
                                        {item.estadisticas.totalProyectos}
                                    </td>
                                    <td className="px-2 py-3 text-sm text-center text-gray-700 dark:text-gray-300">
                                        {parseFloat(item.estadisticas.desviacionEstandar).toFixed(1)}
                                    </td>
                                    <td className="px-2 py-3 text-center">
                                        {item.evolucion.length > 1 ? (
                                            renderSparkline(item.evolucion)
                                        ) : (
                                            <span className="text-xs text-gray-400">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-2 py-3 text-center text-lg">
                                        {getTendenciaIcon(item.tendencia.direccion)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
