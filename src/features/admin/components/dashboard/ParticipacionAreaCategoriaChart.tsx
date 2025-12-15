import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { reportsService } from "../../../../services/reportsService";
import MultiViewChart from "./MultiViewChart";

interface ParticipacionData {
    area: {
        idArea: string;
        nombre: string;
    };
    categoria: {
        idCategoria: string;
        nombre: string;
    };
    totalProyectos: number;
    totalEstudiantes: number;
    porcentajeProyectos: number;
    porcentajeEstudiantes: number;
}

interface ParticipacionAreaCategoriaChartProps {
    filtros?: any;
}

export default function ParticipacionAreaCategoriaChart({ filtros }: ParticipacionAreaCategoriaChartProps) {
    const [data, setData] = useState<ParticipacionData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getParticipacionAreaCategoria(filtros);
                setData((response as any).data.participacion);
            } catch (err) {
                console.error('Error fetching participacion area categoria:', err);
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

    if (!data || data.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="h-1.5 w-full bg-emerald-500 dark:bg-emerald-400 opacity-80"></div>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Participación por Área y Categoría
                    </h3>
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                        <p>No hay datos de participación disponibles</p>
                    </div>
                </div>
            </div>
        );
    }

    const renderChart = (chartType: "pie" | "bar" | "line") => {
        // Variables compartidas
        const categorias = [...new Set(data.map(d => d.categoria.nombre))];
        const areas = [...new Set(data.map(d => d.area.nombre))];
        const areaColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

        // Agrupar por área para pie chart
        const areaGroups = data.reduce((acc, item) => {
            const areaName = item.area.nombre;
            if (!acc[areaName]) {
                acc[areaName] = 0;
            }
            acc[areaName] += item.totalProyectos;
            return acc;
        }, {} as Record<string, number>);

        const areaLabels = Object.keys(areaGroups);
        const areaValues = Object.values(areaGroups);

        if (chartType === "pie") {
            const pieOptions: ApexOptions = {
                chart: {
                    type: 'donut',
                    fontFamily: 'Outfit, sans-serif',
                },
                colors: areaColors,
                labels: areaLabels,
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
                                    formatter: () => `${areaValues.reduce((a, b) => a + b, 0)}`,
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

            return <Chart key="pie-chart" options={pieOptions} series={areaValues} type="donut" height={350} />;
        }

        if (chartType === "bar") {
            const series = areas.map((area: string, index: number) => ({
                name: area,
                data: categorias.map((categoria: string) => {
                    const item = data.find(d => d.area.nombre === area && d.categoria.nombre === categoria);
                    return item ? item.totalProyectos : 0;
                }),
                color: areaColors[index % areaColors.length],
            }));

            const barOptions: ApexOptions = {
                chart: {
                    type: 'bar',
                    fontFamily: 'Outfit, sans-serif',
                    toolbar: {
                        show: false,
                    },
                },
                plotOptions: {
                    bar: {
                        borderRadius: 8,
                        horizontal: false,
                        columnWidth: '70%',
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                xaxis: {
                    categories: categorias,
                },
                yaxis: {
                    title: {
                        text: 'Cantidad de Proyectos',
                    },
                },
                legend: {
                    position: 'top',
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => `${val} proyectos`,
                    },
                },
            };

            return <Chart key="bar-chart" options={barOptions} series={series} type="bar" height={350} />;
        }

        // Line chart
        const series = areas.map((area: string, index: number) => ({
            name: area,
            data: categorias.map((categoria: string) => {
                const item = data.find(d => d.area.nombre === area && d.categoria.nombre === categoria);
                return item ? item.totalProyectos : 0;
            }),
            color: areaColors[index % areaColors.length],
        }));

        const lineOptions: ApexOptions = {
            chart: {
                type: 'line',
                fontFamily: 'Outfit, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 3,
            },
            markers: {
                size: 6,
                strokeColors: '#fff',
                strokeWidth: 2,
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                categories: categorias,
            },
            yaxis: {
                title: {
                    text: 'Cantidad de Proyectos',
                },
            },
            legend: {
                position: 'top',
            },
            tooltip: {
                y: {
                    formatter: (val: number) => `${val} proyectos`,
                },
            },
        };

        return <Chart key="line-chart" options={lineOptions} series={series} type="line" height={350} />;
    };

    return (
        <MultiViewChart
            title="Participación por Área y Categoría"
            colorClass="bg-emerald-500 dark:bg-emerald-400"
        >
            {(chartType) => renderChart(chartType)}
        </MultiViewChart>
    );
}
