import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { reportsService } from "../../../../services/reportsService";
import MultiViewChart from "./MultiViewChart";

interface EventoData {
    evento: {
        idEvento: string;
        nombre: string;
        descripcion: string;
        fechaProgramada: string;
        capacidadMaxima: number;
        estaActivo: boolean;
    };
    participacion: {
        totalInscritos: number;
        porcentajeCapacidad: number;
    };
}

interface ParticipacionEventosChartProps {
    filtros?: any;
}

export default function ParticipacionEventosChart({ filtros }: ParticipacionEventosChartProps) {
    const [data, setData] = useState<EventoData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getParticipacionEventos(filtros);
                setData((response as any).data.eventos);
            } catch (err) {
                console.error('Error fetching participacion eventos:', err);
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
                <div className="h-1.5 w-full bg-cyan-500 dark:bg-cyan-400 opacity-80"></div>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Participación en Eventos
                    </h3>
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                        <p>No hay datos de eventos disponibles</p>
                    </div>
                </div>
            </div>
        );
    }

    const renderChart = (chartType: "pie" | "bar" | "line") => {
        // Preparar datos
        const eventoNames = data.map(e => e.evento.nombre);
        const inscritos = data.map(e => e.participacion.totalInscritos);
        const porcentajes = data.map(e => e.participacion.porcentajeCapacidad);

        // Colores
        const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

        if (chartType === "pie") {
            // Mostrar distribución de participantes por evento
            const pieOptions: ApexOptions = {
                chart: {
                    type: 'donut',
                    fontFamily: 'Outfit, sans-serif',
                },
                colors: colors,
                labels: eventoNames,
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
                                    formatter: () => `${inscritos.reduce((a, b) => a + b, 0)}`,
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
                        formatter: (val: number) => `${val} participantes`,
                    },
                },
            };

            return <Chart key="pie-chart" options={pieOptions} series={inscritos} type="donut" height={350} />;
        }

        if (chartType === "bar") {
            // Mostrar porcentaje de capacidad ocupada
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
                        dataLabels: {
                            position: 'top',
                        },
                    },
                },
                dataLabels: {
                    enabled: true,
                    formatter: (val: number) => `${val.toFixed(0)}%`,
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ['#374151'],
                    },
                },
                xaxis: {
                    categories: eventoNames,
                    labels: {
                        rotate: -45,
                        rotateAlways: true,
                    },
                },
                yaxis: {
                    title: {
                        text: 'Porcentaje de Capacidad (%)',
                    },
                    max: 100,
                },
                legend: {
                    show: false,
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => `${val.toFixed(1)}% de capacidad`,
                    },
                },
            };

            return <Chart key="bar-chart" options={barOptions} series={[{ name: 'Capacidad', data: porcentajes }]} type="bar" height={350} />;
        }

        // Line chart - mostrar inscritos y porcentaje juntos
        const lineOptions: ApexOptions = {
            chart: {
                type: 'line',
                fontFamily: 'Outfit, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            colors: ['#06b6d4', '#8b5cf6'],
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
                categories: eventoNames,
                labels: {
                    rotate: -45,
                    rotateAlways: true,
                },
            },
            yaxis: [
                {
                    title: {
                        text: 'Participantes Inscritos',
                    },
                },
                {
                    opposite: true,
                    title: {
                        text: 'Porcentaje Capacidad (%)',
                    },
                    max: 100,
                },
            ],
            legend: {
                position: 'top',
            },
            tooltip: {
                shared: true,
                intersect: false,
            },
        };

        const lineSeries = [
            {
                name: 'Inscritos',
                data: inscritos,
            },
            {
                name: 'Porcentaje Capacidad',
                data: porcentajes,
                yAxisIndex: 1,
            },
        ];

        return <Chart key="line-chart" options={lineOptions} series={lineSeries} type="line" height={350} />;
    };

    return (
        <MultiViewChart
            title="Participación en Eventos"
            colorClass="bg-cyan-500 dark:bg-cyan-400"
        >
            {(chartType) => renderChart(chartType)}
        </MultiViewChart>
    );
}
