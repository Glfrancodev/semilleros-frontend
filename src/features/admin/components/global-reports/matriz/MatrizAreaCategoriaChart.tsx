import { useEffect, useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { reportsService } from '../../../../../services/reportsService';

interface MatrizAreaCategoriaChartProps {
    filtros?: any;
}

export default function MatrizAreaCategoriaChart({ filtros }: MatrizAreaCategoriaChartProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [metrica, setMetrica] = useState<'cantidad' | 'promedio'>('cantidad');
    const [isDark, setIsDark] = useState(false);

    // Detectar Dark Mode
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };

        checkDarkMode();

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getMatrizAreaCategoriaGlobal(filtros);
                setData(response.data);
            } catch (err) {
                console.error('Error fetching matriz:', err);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filtros]);

    // Preparar datos para el heatmap
    const { areas, categorias, series } = useMemo(() => {
        if (!data || !Array.isArray(data.matriz) || !Array.isArray(data.totalesPorCategoria)) {
            return { areas: [], categorias: [], series: [] };
        }

        const areas = data.matriz.map((item: any) => item.area.nombre);
        const categorias = data.totalesPorCategoria.map((cat: any) => cat.categoria);

        const series = categorias.map((categoria: string) => {
            const dataPoints = data.matriz.map((areaItem: any) => {
                const catData = areaItem.categorias?.find((c: any) => c.categoria.nombre === categoria);
                if (!catData) return 0;

                if (metrica === 'cantidad') {
                    return catData.metricas.totalProyectos;
                } else {
                    return catData.metricas.promedioCalificacion || 0;
                }
            });

            return {
                name: categoria,
                data: dataPoints,
            };
        });

        return { areas, categorias, series };
    }, [data, metrica]);

    // Opciones del heatmap
    const heatmapOptions = useMemo<ApexOptions>(() => ({
        chart: {
            type: 'heatmap',
            fontFamily: 'Outfit, sans-serif',
            toolbar: { show: false },
            background: 'transparent',
            animations: { enabled: false }
        },
        theme: {
            mode: isDark ? 'dark' : 'light',
        },
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,
                radius: 4,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: metrica === 'cantidad'
                        ? [
                            { from: 0, to: 0, color: isDark ? '#1e293b' : '#e2e8f0', name: '0' },
                            { from: 1, to: 2, color: isDark ? '#7c3aed' : '#a78bfa', name: '1-2' },
                            { from: 3, to: 5, color: isDark ? '#8b5cf6' : '#8b5cf6', name: '3-5' },
                            { from: 6, to: 10, color: isDark ? '#a78bfa' : '#7c3aed', name: '6-10' },
                            { from: 11, to: 999, color: isDark ? '#c4b5fd' : '#6d28d9', name: '11+' },
                        ]
                        : [
                            { from: 0, to: 0, color: isDark ? '#1e293b' : '#e2e8f0', name: 'Sin datos' },
                            { from: 1, to: 60, color: isDark ? '#dc2626' : '#f87171', name: '0-60' },
                            { from: 61, to: 80, color: isDark ? '#f59e0b' : '#fbbf24', name: '61-80' },
                            { from: 81, to: 100, color: isDark ? '#10b981' : '#34d399', name: '81-100' },
                        ],
                },
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '12px',
                fontWeight: 600,
                colors: [isDark ? '#f1f5f9' : '#0f172a'],
            },
            formatter: (val: number) => {
                if (val === 0) return '-';
                return metrica === 'cantidad' ? val.toString() : val.toFixed(1);
            },
        },
        xaxis: {
            categories: areas,
            labels: {
                style: {
                    fontSize: '11px',
                    colors: isDark ? '#94a3b8' : '#64748b',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '11px',
                    colors: isDark ? '#94a3b8' : '#64748b',
                },
            },
        },
        tooltip: {
            theme: isDark ? 'dark' : 'light',
            y: {
                formatter: (val: number, opts: any) => {
                    if (val === 0) return 'Sin datos';
                    const categoria = categorias[opts.seriesIndex];
                    const area = areas[opts.dataPointIndex];

                    const areaData = data.matriz.find((a: any) => a.area.nombre === area);
                    const catData = areaData?.categorias?.find((c: any) => c.categoria.nombre === categoria);

                    if (!catData) return 'Sin datos';

                    if (metrica === 'cantidad') {
                        return `${val} proyectos (${catData.metricas.porcentajeDelArea.toFixed(1)}% del área)`;
                    } else {
                        return `Promedio: ${val.toFixed(2)} pts`;
                    }
                },
            },
        },
        legend: {
            show: true,
            position: 'bottom',
            labels: {
                colors: isDark ? '#cbd5e1' : '#475569',
            },
        },
    }), [isDark, metrica, areas, categorias, data]);

    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        );
    }

    if (!data || !data.matriz || data.matriz.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="h-1.5 w-full bg-rose-500 dark:bg-rose-400 opacity-80"></div>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Matriz Área vs Categoría
                    </h3>
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                        <p>No hay datos disponibles</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!Array.isArray(data.matriz) || !Array.isArray(data.totalesPorCategoria)) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="h-1.5 w-full bg-rose-500 dark:bg-rose-400 opacity-80"></div>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Matriz Área vs Categoría
                    </h3>
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                        <p>Error: Datos inválidos</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="h-1.5 w-full bg-rose-500 dark:bg-rose-400 opacity-80"></div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Matriz Área vs Categoría
                    </h3>

                    <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={() => setMetrica('cantidad')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${metrica === 'cantidad'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            Cantidad
                        </button>
                        <button
                            onClick={() => setMetrica('promedio')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${metrica === 'promedio'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            Promedio
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Total Proyectos</p>
                        <p className="text-lg font-bold text-rose-600 dark:text-rose-400">
                            {data.estadisticasGenerales.totalProyectos}
                        </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Áreas</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {data.estadisticasGenerales.totalAreas}
                        </p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Categorías</p>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {data.estadisticasGenerales.totalCategorias}
                        </p>
                    </div>
                </div>

                <div className="w-full" style={{ minHeight: '350px' }}>
                    {series.length > 0 && (
                        <Chart
                            options={heatmapOptions}
                            series={series}
                            type="heatmap"
                            height={350}
                        />
                    )}
                </div>

                <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Totales por Categoría
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {data.totalesPorCategoria.map((cat: any) => (
                            <div key={cat.categoria} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                    {cat.categoria}
                                </p>
                                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                                    <span>{cat.totalProyectos} proyectos</span>
                                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                        ⌀ {cat.promedioCalificacion !== null ? cat.promedioCalificacion.toFixed(1) : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}