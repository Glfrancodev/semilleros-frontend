import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { reportsService } from "../../../../services/reportsService";
import MultiViewChart from "./MultiViewChart";

interface JuradoData {
    docente: {
        idDocente: string;
        codigoDocente: string;
        usuario: {
            idUsuario: string;
            nombre: string;
            apellido: string;
            correo: string;
        };
    };
    carga: {
        proyectosAsignados: number;
        proyectosCalificados: number;
        proyectosPendientes: number;
        porcentajeCompletado: number;
    };
    desempeno: {
        promedioCalificacionOtorgada: number;
        tiempoPromedioCalificacion: number;
        calificacionesRealizadas: number;
    };
}

interface CargaJuradosChartProps {
    filtros?: any;
}

export default function CargaJuradosChart({ filtros }: CargaJuradosChartProps) {
    const [data, setData] = useState<JuradoData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getCargaJurados(filtros);
                setData((response as any).data.jurados);
            } catch (err) {
                console.error('Error fetching carga jurados:', err);
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
                <div className="h-1.5 w-full bg-rose-500 dark:bg-rose-400 opacity-80"></div>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Carga y Desempeño de Jurados
                    </h3>
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                        <p>No hay datos de jurados disponibles</p>
                    </div>
                </div>
            </div>
        );
    }

    const renderChart = (chartType: "pie" | "bar" | "line") => {
        // Preparar datos
        const juradoNames = data.map(j => `${j.docente.usuario.nombre} ${j.docente.usuario.apellido}`);
        const proyectosAsignados = data.map(j => j.carga.proyectosAsignados);
        const promediosCalificacion = data.map(j => j.desempeno.promedioCalificacionOtorgada);

        // Colores
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

        if (chartType === "pie") {
            // Mostrar distribución de carga (proyectos asignados)
            const pieOptions: ApexOptions = {
                chart: {
                    type: 'donut',
                    fontFamily: 'Outfit, sans-serif',
                },
                colors: colors,
                labels: juradoNames,
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
                                    formatter: () => `${proyectosAsignados.reduce((a, b) => a + b, 0)}`,
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

            return <Chart key="pie-chart" options={pieOptions} series={proyectosAsignados} type="donut" height={350} />;
        }

        if (chartType === "bar") {
            // Mostrar comparación de desempeño (promedio de calificaciones)
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
                    formatter: (val: number) => `${val.toFixed(1)}`,
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ['#374151'],
                    },
                },
                xaxis: {
                    categories: juradoNames,
                    labels: {
                        rotate: -45,
                        rotateAlways: true,
                    },
                },
                yaxis: {
                    title: {
                        text: 'Promedio de Calificación Otorgada',
                    },
                    max: 100,
                },
                legend: {
                    show: false,
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => `${val.toFixed(1)} puntos`,
                    },
                },
            };

            return <Chart key="bar-chart" options={barOptions} series={[{ name: 'Promedio', data: promediosCalificacion }]} type="bar" height={350} />;
        }

        // Line chart - mostrar carga y desempeño juntos
        const lineOptions: ApexOptions = {
            chart: {
                type: 'line',
                fontFamily: 'Outfit, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            colors: ['#3b82f6', '#10b981'],
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
                categories: juradoNames,
                labels: {
                    rotate: -45,
                    rotateAlways: true,
                },
            },
            yaxis: [
                {
                    title: {
                        text: 'Proyectos Asignados',
                    },
                },
                {
                    opposite: true,
                    title: {
                        text: 'Promedio Calificación',
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
                name: 'Proyectos Asignados',
                data: proyectosAsignados,
            },
            {
                name: 'Promedio Calificación',
                data: promediosCalificacion,
                yAxisIndex: 1,
            },
        ];

        return <Chart key="line-chart" options={lineOptions} series={lineSeries} type="line" height={350} />;
    };

    return (
        <MultiViewChart
            title="Carga y Desempeño de Jurados"
            colorClass="bg-rose-500 dark:bg-rose-400"
        >
            {(chartType) => renderChart(chartType)}
        </MultiViewChart>
    );
}
