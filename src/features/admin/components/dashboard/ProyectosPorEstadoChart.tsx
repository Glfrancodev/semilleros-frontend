import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { reportsService } from "../../../../services/reportsService";
import MultiViewChart from "./MultiViewChart";

interface EstadoData {
    estado: string;
    descripcion: string;
    cantidad: number;
    porcentaje: number;
}

interface ProyectosPorEstadoChartProps {
    filtros?: any;
}

export default function ProyectosPorEstadoChart({ filtros }: ProyectosPorEstadoChartProps) {
    const [data, setData] = useState<EstadoData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getProyectosPorEstado(filtros);
                setData((response as any).data.estados);
            } catch (err) {
                console.error('Error fetching proyectos por estado:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filtros]);

    const estadoLabels = {
        borrador: "Borrador",
        aprobado: "Aprobado",
        rechazado: "Rechazado",
        con_jurados: "Con Jurados",
        calificado: "Calificado"
    };

    const estadoColors = {
        borrador: "#9ca3af",
        aprobado: "#10b981",
        rechazado: "#ef4444",
        con_jurados: "#f59e0b",
        calificado: "#3b82f6"
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="h-1.5 w-full bg-purple-500 dark:bg-purple-400 opacity-80"></div>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Proyectos por Estado
                    </h3>
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                        <p>No hay datos de proyectos disponibles</p>
                    </div>
                </div>
            </div>
        );
    }

    const renderChart = (chartType: "pie" | "bar" | "line") => {
        const labels = data.map(d => estadoLabels[d.estado as keyof typeof estadoLabels] || d.estado);
        const values = data.map(d => d.cantidad);
        const colors = data.map(d => estadoColors[d.estado as keyof typeof estadoColors] || "#6b7280");

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
                                    formatter: () => `${values.reduce((a, b) => a + b, 0)}`,
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

            return <Chart key="pie-chart" options={pieOptions} series={values} type="donut" height={350} />;
        }

        if (chartType === "bar") {
            const barOptions: ApexOptions = {
                chart: {
                    type: 'bar',
                    fontFamily: 'Outfit, sans-serif',
                    toolbar: {
                        show: false,
                    },
                },
                colors: colors,
                plotOptions: {
                    bar: {
                        borderRadius: 8,
                        horizontal: false,
                        distributed: true,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                xaxis: {
                    categories: labels,
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
                        formatter: (val: number) => `${val} proyectos`,
                    },
                },
            };

            return <Chart key="bar-chart" options={barOptions} series={[{ name: 'Proyectos', data: values }]} type="bar" height={350} />;
        }

        // Line chart
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
                colors: colors,
                strokeColors: '#fff',
                strokeWidth: 2,
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                categories: labels,
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

        return <Chart key="line-chart" options={lineOptions} series={[{ name: 'Proyectos', data: values }]} type="line" height={350} />;
    };

    return (
        <MultiViewChart
            title="Proyectos por Estado"
            colorClass="bg-purple-500 dark:bg-purple-400"
        >
            {(chartType) => renderChart(chartType)}
        </MultiViewChart>
    );
}
