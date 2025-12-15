import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { reportsService } from "../../../../services/reportsService";
import { BoltIcon } from "../../../../assets/icons";

interface AprobacionData {
    totalProyectos: number;
    aprobadosExposicion: number;
    noAprobadosExposicion: number;
    pendientesExposicion: number;
    porcentajeAprobados: number;
    porcentajeNoAprobados: number;
    porcentajePendientes: number;
}

interface AprobadosExposicionChartProps {
    filtros?: any;
}

export default function AprobadosExposicionChart({ filtros }: AprobadosExposicionChartProps) {
    const [data, setData] = useState<AprobacionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getPorcentajeAprobadosExposicion(filtros);
                setData((response as any).data);
            } catch (err) {
                console.error('Error fetching aprobados exposicion chart:', err);
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
        colors: ['#10b981', '#f59e0b', '#6b7280'],
        labels: ['Listos para Exponer', 'Pendientes', 'No Listos'],
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
        data?.aprobadosExposicion || 0,
        data?.pendientesExposicion || 0,
        data?.noAprobadosExposicion || 0,
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
            <div className="h-1.5 w-full bg-yellow-500/80 dark:bg-transparent dark:border-t-2 dark:border-yellow-400"></div>

            <div className="p-6">
                {/* Title with Icon */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex-shrink-0 w-5 h-5 text-yellow-500 dark:text-yellow-400">
                        <BoltIcon />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Aprobados para Exposición
                    </h3>
                </div>

                {/* Chart */}
                <Chart options={options} series={series} type="donut" height={300} />

                {/* Stats Grid */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Listos</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            {data?.porcentajeAprobados}%
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pendientes</p>
                        <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                            {data?.porcentajePendientes}%
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">No Listos</p>
                        <p className="text-lg font-bold text-gray-600 dark:text-gray-400">
                            {data?.porcentajeNoAprobados}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
