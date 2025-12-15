import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { reportsService } from "../../../../services/reportsService";
import { TaskIcon } from "../../../../assets/icons";

interface AprobacionData {
    totalProyectos: number;
    aprobadosPorTutor: number;
    rechazadosPorTutor: number;
    pendientesTutor: number;
    porcentajeAprobados: number;
    porcentajeRechazados: number;
    porcentajePendientes: number;
}

interface AprobadosTutorChartProps {
    filtros?: any;
}

export default function AprobadosTutorChart({ filtros }: AprobadosTutorChartProps) {
    const [data, setData] = useState<AprobacionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getPorcentajeAprobadosTutor(filtros);
                // Los datos vienen en response.data
                setData((response as any).data);
            } catch (err) {
                console.error('Error fetching aprobados tutor chart:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filtros]);

    const options: ApexOptions = {
        chart: {
            type: 'donut',
            fontFamily: 'Outfit, sans-serif',
            toolbar: {
                show: false,
            },
        },
        colors: ['#10b981', '#ef4444', '#f59e0b'],
        labels: ['Aprobados', 'Rechazados', 'Pendientes'],
        legend: {
            show: true,
            position: 'bottom',
            fontFamily: 'Outfit',
            fontSize: '14px',
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '14px',
                            fontWeight: 600,
                        },
                        value: {
                            show: true,
                            fontSize: '24px',
                            fontWeight: 700,
                            formatter: (val: string) => `${val}`,
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '14px',
                            fontWeight: 600,
                            formatter: () => `${data?.totalProyectos || 0}`,
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

    const series = [
        data?.aprobadosPorTutor || 0,
        data?.rechazadosPorTutor || 0,
        data?.pendientesTutor || 0,
    ];

    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-xl transition-shadow duration-300">
            {/* Color Bar */}
            <div className="h-1.5 w-full bg-teal-500 dark:bg-teal-400 opacity-80"></div>

            <div className="p-6">
                {/* Title with Icon */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex-shrink-0 w-5 h-5 text-teal-500 dark:text-teal-400">
                        <TaskIcon />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Aprobación por Tutor
                    </h3>
                </div>

                {/* Chart */}
                <Chart options={options} series={series} type="donut" height={300} />

                {/* Stats Grid */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Aprobados</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            {data?.porcentajeAprobados}%
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rechazados</p>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">
                            {data?.porcentajeRechazados}%
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pendientes</p>
                        <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                            {data?.porcentajePendientes}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
