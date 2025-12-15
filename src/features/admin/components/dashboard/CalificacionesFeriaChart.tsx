import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { reportsService } from "../../../../services/reportsService";
import MultiViewChart from "./MultiViewChart";

interface CalificacionesData {
    distribucion: {
        rangos: Array<{
            rango: string;
            cantidad: number;
            porcentaje: number;
        }>;
        totalProyectosCalificados: number;
    };
    porCriterio: Array<{
        criterio: {
            idSubCalificacion: string;
            nombre: string;
            maximoPuntaje: number;
        };
        promedio: number;
        porcentajePromedio: number;
    }>;
}

interface CalificacionesFeriaChartProps {
    filtros?: any;
}

export default function CalificacionesFeriaChart({ filtros }: CalificacionesFeriaChartProps) {
    const [data, setData] = useState<CalificacionesData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getCalificacionesFeria(filtros);
                setData((response as any).data);
            } catch (err) {
                console.error('Error fetching calificaciones feria:', err);
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

    if (!data || !data.distribucion || data.distribucion.rangos.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="h-1.5 w-full bg-amber-500 dark:bg-amber-400 opacity-80"></div>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Calificaciones de la Feria
                    </h3>
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                        <p>No hay datos de calificaciones disponibles</p>
                    </div>
                </div>
            </div>
        );
    }

    const renderChart = (chartType: "pie" | "bar" | "line") => {
        // Datos de distribución por rangos
        const rangos = data.distribucion.rangos.map(r => r.rango);
        const cantidades = data.distribucion.rangos.map(r => r.cantidad);

        // Datos por criterio
        const criterios = data.porCriterio.map(c => c.criterio.nombre);
        const promedios = data.porCriterio.map(c => c.porcentajePromedio);

        // Colores
        const rangoColors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981'];
        const criterioColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

        if (chartType === "pie") {
            // Mostrar distribución por rangos
            const pieOptions: ApexOptions = {
                chart: {
                    type: 'donut',
                    fontFamily: 'Outfit, sans-serif',
                },
                colors: rangoColors,
                labels: rangos,
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
                                    formatter: () => `${data.distribucion.totalProyectosCalificados}`,
                                },
                            },
                        },
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => `${val} proyectos`,
                    },
                },
            };

            return <Chart key="pie-chart" options={pieOptions} series={cantidades} type="donut" height={350} />;
        }

        if (chartType === "bar") {
            // Mostrar promedio por criterio
            const barOptions: ApexOptions = {
                chart: {
                    type: 'bar',
                    fontFamily: 'Outfit, sans-serif',
                    toolbar: {
                        show: false,
                    },
                },
                colors: criterioColors,
                plotOptions: {
                    bar: {
                        borderRadius: 8,
                        horizontal: false,
                        distributed: true,
                        dataLabels: {
                            position: 'top',
                        },
                    },
                },
                dataLabels: {
                    enabled: true,
                    formatter: (val: number) => `${val.toFixed(1)}%`,
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ['#374151'],
                    },
                },
                xaxis: {
                    categories: criterios,
                },
                yaxis: {
                    title: {
                        text: 'Porcentaje Promedio (%)',
                    },
                    max: 100,
                },
                legend: {
                    show: false,
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => `${val.toFixed(1)}%`,
                    },
                },
            };

            return <Chart key="bar-chart" options={barOptions} series={[{ name: 'Promedio', data: promedios }]} type="bar" height={350} />;
        }

        // Line chart - mostrar tendencia de rangos
        const lineOptions: ApexOptions = {
            chart: {
                type: 'line',
                fontFamily: 'Outfit, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            colors: ['#6366f1'],
            stroke: {
                curve: 'smooth',
                width: 3,
            },
            markers: {
                size: 6,
                colors: rangoColors,
                strokeColors: '#fff',
                strokeWidth: 2,
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                categories: rangos,
            },
            yaxis: {
                title: {
                    text: 'Cantidad de Proyectos',
                },
            },
            tooltip: {
                y: {
                    formatter: (val: number) => `${val} proyectos`,
                },
            },
        };

        return <Chart key="line-chart" options={lineOptions} series={[{ name: 'Proyectos', data: cantidades }]} type="line" height={350} />;
    };

    return (
        <MultiViewChart
            title="Calificaciones de la Feria"
            colorClass="bg-amber-500 dark:bg-amber-400"
        >
            {(chartType) => renderChart(chartType)}
        </MultiViewChart>
    );
}
