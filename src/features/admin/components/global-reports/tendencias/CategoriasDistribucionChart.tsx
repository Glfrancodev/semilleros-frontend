import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { reportsService } from '../../../../../services/reportsService';
import MultiViewChart from '../../dashboard/MultiViewChart';

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getCategoriasFrecuentesGlobal(filtros);
                setData(response.data);
            } catch (err) {
                console.error('Error fetching categorias frecuentes:', err);
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
            <MultiViewChart title="Distribución por Categoría" colorClass="bg-purple-500 dark:border-purple-400">
                {() => (
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                        <p>No hay datos disponibles</p>
                    </div>
                )}
            </MultiViewChart>
        );
    }

    const renderChart = (chartType: "pie" | "bar" | "line") => {
        const labels = data.ranking.map((item: any) => item.categoria.nombre);
        const values = data.ranking.map((item: any) => item.totalProyectos);
        const colors = data.ranking.map((item: any) =>
            COLORS[item.categoria.nombre as keyof typeof COLORS] || '#6b7280'
        );

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

            return <Chart key="pie-categorias" options={pieOptions} series={values} type="donut" height={300} />;
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
                        horizontal: false,
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
                legend: {
                    show: false,
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => `${val} proyectos`,
                    },
                },
            };

            return <Chart key="bar-categorias" options={barOptions} series={[{ name: 'Proyectos', data: values }]} type="bar" height={300} />;
        }

        // Line chart
        const lineOptions: ApexOptions = {
            chart: {
                type: 'line',
                fontFamily: 'Outfit, sans-serif',
                toolbar: { show: false },
            },
            colors: ['#8b5cf6'],
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

        return <Chart key="line-categorias" options={lineOptions} series={[{ name: 'Proyectos', data: values }]} type="line" height={300} />;
    };

    return (
        <MultiViewChart title="Distribución por Categoría" colorClass="bg-purple-500 dark:border-purple-400">
            {(chartType) => (
                <>
                    {/* Stats */}
                    <div className="mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Total: {data.estadisticas.totalProyectos} proyectos
                        </span>
                    </div>

                    {/* Chart */}
                    {renderChart(chartType)}
                </>
            )}
        </MultiViewChart>
    );
}
