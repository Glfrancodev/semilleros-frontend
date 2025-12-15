import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { reportsService } from '../../../../../services/reportsService';
import MultiViewChart from '../../dashboard/MultiViewChart';

interface AreasFrequentesChartProps {
    filtros?: any;
}

export default function AreasFrequentesChart({ filtros }: AreasFrequentesChartProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getAreasFrecuentesGlobal(filtros);
                setData(response.data);
            } catch (err) {
                console.error('Error fetching areas frecuentes:', err);
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
            <MultiViewChart title="Áreas Más Frecuentes" colorClass="bg-blue-500 dark:border-blue-400">
                {() => (
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                        <p>No hay datos disponibles</p>
                    </div>
                )}
            </MultiViewChart>
        );
    }

    const renderChart = (chartType: "pie" | "bar" | "line") => {
        const labels = data.ranking.map((item: any) => item.area.nombre);
        const values = data.ranking.map((item: any) => item.totalProyectos);

        // Colores por tendencia
        const colors = data.ranking.map((item: any) => {
            switch (item.tendencia.direccion) {
                case 'creciente': return '#10b981'; // green-500
                case 'decreciente': return '#ef4444'; // red-500
                default: return '#6b7280'; // gray-500
            }
        });

        if (chartType === "pie") {
            const pieOptions: ApexOptions = {
                chart: {
                    type: 'donut',
                    fontFamily: 'Outfit, sans-serif',
                },
                colors: colors,
                labels: labels,
                legend: {
                    position: 'bottom',
                    fontSize: '14px',
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '70%',
                            labels: {
                                show: true,
                                total: {
                                    show: true,
                                    label: 'Total',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    formatter: () => `${data.estadisticas.totalProyectos}`,
                                },
                            },
                        },
                    },
                },
                dataLabels: {
                    enabled: true,
                    formatter: (val: number) => `${val.toFixed(1)}%`,
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => `${val} proyectos`,
                    },
                },
            };

            return <Chart key="pie-areas" options={pieOptions} series={values} type="donut" height={300} />;
        }

        if (chartType === "bar") {
            const barOptions: ApexOptions = {
                chart: {
                    type: 'bar',
                    fontFamily: 'Outfit, sans-serif',
                    toolbar: { show: false },
                },
                colors: colors,
                plotOptions: {
                    bar: {
                        horizontal: true,
                        borderRadius: 4,
                        distributed: true,
                    },
                },
                dataLabels: {
                    enabled: true,
                    formatter: (val: number) => `${val}`,
                },
                xaxis: {
                    categories: labels,
                },
                yaxis: {
                    labels: {
                        style: {
                            fontSize: '12px',
                        },
                    },
                },
                legend: {
                    show: false,
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => `${val} proyectos`,
                    },
                },
            };

            return <Chart key="bar-areas" options={barOptions} series={[{ name: 'Proyectos', data: values }]} type="bar" height={300} />;
        }

        // Line chart
        const lineOptions: ApexOptions = {
            chart: {
                type: 'line',
                fontFamily: 'Outfit, sans-serif',
                toolbar: { show: false },
            },
            colors: ['#3b82f6'],
            stroke: {
                curve: 'smooth',
                width: 3,
            },
            markers: {
                size: 5,
            },
            xaxis: {
                categories: labels,
            },
            yaxis: {
                title: {
                    text: 'Proyectos',
                },
            },
            tooltip: {
                y: {
                    formatter: (val: number) => `${val} proyectos`,
                },
            },
        };

        return <Chart key="line-areas" options={lineOptions} series={[{ name: 'Proyectos', data: values }]} type="line" height={300} />;
    };

    return (
        <MultiViewChart title="Áreas Más Frecuentes" colorClass="bg-blue-500 dark:border-blue-400">
            {(chartType) => (
                <>
                    {/* Stats */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Total: {data.estadisticas.totalProyectos} proyectos
                            </span>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Área dominante: <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    {data.estadisticas.areaDominante.nombre}
                                </span> ({data.estadisticas.areaDominante.porcentaje.toFixed(1)}%)
                            </p>
                        </div>
                    </div>

                    {/* Chart */}
                    {renderChart(chartType)}

                    {/* Leyenda de tendencias */}
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs">
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
                </>
            )}
        </MultiViewChart>
    );
}
