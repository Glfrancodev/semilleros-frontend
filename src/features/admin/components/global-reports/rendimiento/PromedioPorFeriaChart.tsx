import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { reportsService } from '../../../../../services/reportsService';
import MultiViewChart from '../../dashboard/MultiViewChart';

interface PromedioPorFeriaChartProps {
    filtros?: any;
}

export default function PromedioPorFeriaChart({ filtros }: PromedioPorFeriaChartProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getPromediosPorFeriaGlobal(filtros);
                setData(response.data);
            } catch (err) {
                console.error('Error fetching promedio por feria:', err);
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

    if (!data || !data.series || data.series.length === 0) {
        return (
            <MultiViewChart title="Promedio por Feria" colorClass="bg-indigo-500 dark:border-indigo-400">
                {() => (
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                        <p>No hay datos disponibles</p>
                    </div>
                )}
            </MultiViewChart>
        );
    }

    const renderChart = (chartType: "pie" | "bar" | "line") => {
        const ferias = data.series.map((item: any) => item.feria.nombre);
        const promedios = data.series.map((item: any) => item.estadisticas.promedioGeneral);

        if (chartType === "line") {
            const lineOptions: ApexOptions = {
                chart: {
                    type: 'line',
                    fontFamily: 'Outfit, sans-serif',
                    toolbar: { show: false },
                },
                colors: ['#6366f1'],
                stroke: {
                    curve: 'smooth',
                    width: 3,
                },
                markers: {
                    size: 6,
                },
                xaxis: {
                    categories: ferias,
                },
                yaxis: {
                    title: {
                        text: 'Promedio',
                    },
                    min: 0,
                    max: 100,
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => `${val.toFixed(2)} pts`,
                    },
                },
                dataLabels: {
                    enabled: true,
                    formatter: (val: number) => val.toFixed(1),
                },
            };

            return <Chart key="line-promedio" options={lineOptions} series={[{ name: 'Promedio', data: promedios }]} type="line" height={300} />;
        }

        if (chartType === "bar") {
            // Mostrar distribución por rangos de la última feria
            const ultimaFeria = data.series[data.series.length - 1];
            const distribucion = ultimaFeria.distribucionPorRango;

            const barOptions: ApexOptions = {
                chart: {
                    type: 'bar',
                    fontFamily: 'Outfit, sans-serif',
                    toolbar: { show: false },
                },
                colors: ['#ef4444', '#f59e0b', '#10b981'],
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '60%',
                        borderRadius: 4,
                        distributed: true,
                    },
                },
                dataLabels: {
                    enabled: true,
                    formatter: (val: number) => `${val}`,
                },
                xaxis: {
                    categories: distribucion.map((d: any) => d.rango),
                },
                yaxis: {
                    title: {
                        text: 'Cantidad de Proyectos',
                    },
                },
                legend: {
                    show: false,
                },
                tooltip: {
                    y: {
                        formatter: (val: number, opts: any) => {
                            const porcentaje = distribucion[opts.dataPointIndex].porcentaje;
                            return `${val} proyectos (${porcentaje}%)`;
                        },
                    },
                },
            };

            return <Chart key="bar-distribucion" options={barOptions} series={[{ name: 'Proyectos', data: distribucion.map((d: any) => d.cantidad) }]} type="bar" height={300} />;
        }

        // Pie chart - distribución por rangos
        const ultimaFeria = data.series[data.series.length - 1];
        const distribucion = ultimaFeria.distribucionPorRango;

        const pieOptions: ApexOptions = {
            chart: {
                type: 'donut',
                fontFamily: 'Outfit, sans-serif',
            },
            colors: ['#ef4444', '#f59e0b', '#10b981'],
            labels: distribucion.map((d: any) => d.rango),
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
                                formatter: () => `${ultimaFeria.estadisticas.totalProyectosCalificados}`,
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

        return <Chart key="pie-distribucion" options={pieOptions} series={distribucion.map((d: any) => d.cantidad)} type="donut" height={300} />;
    };

    return (
        <MultiViewChart title="Promedio por Feria" colorClass="bg-indigo-500 dark:border-indigo-400">
            {(chartType) => (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Promedio Histórico</p>
                            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                {data.tendenciaGeneral.promedioHistorico.toFixed(2)}
                            </p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Tendencia</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400 capitalize">
                                {data.tendenciaGeneral.direccion}
                            </p>
                        </div>
                        {data.series.length > 0 && (
                            <>
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Mediana</p>
                                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                        {data.series[data.series.length - 1].estadisticas.mediana.toFixed(2)}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Desv. Estándar</p>
                                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                        {data.series[data.series.length - 1].estadisticas.desviacionEstandar.toFixed(2)}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Chart */}
                    {renderChart(chartType)}
                </>
            )}
        </MultiViewChart>
    );
}
