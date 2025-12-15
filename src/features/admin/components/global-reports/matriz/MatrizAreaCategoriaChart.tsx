import { useEffect, useState } from 'react';
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


    // Preparar datos para el heatmap
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

    // Detectar Dark Mode
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Verificar estado inicial
        if (document.documentElement.classList.contains('dark')) {
            setIsDark(true);
        }

        // Observer para cambios en la clase 'dark' del html
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsDark(document.documentElement.classList.contains('dark'));
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });

        return () => observer.disconnect();
    }, []);

    const heatmapOptions: ApexOptions = {
        chart: {
            type: 'heatmap',
            fontFamily: 'Outfit, sans-serif',
            toolbar: { show: false },
            background: 'transparent',
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
                            { from: 0, to: 0, color: isDark ? '#1e293b' : '#f1f5f9', name: '0' }, // Slate 800 (Dark) / Slate 100 (Light)
                            { from: 1, to: 2, color: isDark ? '#3730a3' : '#c7d2fe', name: '1-2' }, // Indigo 900 / Indigo 200
                            { from: 3, to: 5, color: isDark ? '#4f46e5' : '#818cf8', name: '3-5' }, // Indigo 600 / Indigo 400
                            { from: 6, to: 10, color: isDark ? '#6366f1' : '#6366f1', name: '6-10' }, // Indigo 500 (Both)
                            { from: 11, to: 999, color: isDark ? '#818cf8' : '#4f46e5', name: '11+' }, // Indigo 400 / Indigo 600
                        ]
                        : [
                            { from: 0, to: 0, color: isDark ? '#1e293b' : '#f1f5f9', name: 'Sin datos' },
                            { from: 1, to: 60, color: '#ef4444', name: '0-60' }, // Red 500
                            { from: 61, to: 80, color: '#f59e0b', name: '61-80' }, // Amber 500
                            { from: 81, to: 100, color: '#10b981', name: '81-100' }, // Emerald 500
                        ],
                },
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '12px',
                fontWeight: 600,
                colors: [isDark ? '#e2e8f0' : '#1e293b'],
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
            y: {
                formatter: (val: number, opts: any) => {
                    if (val === 0) return 'Sin datos';
                    const categoria = categorias[opts.seriesIndex];
                    const area = areas[opts.dataPointIndex];

                    const areaData = data.matriz.find((a: any) => a.area.nombre === area);
                    const catData = areaData?.categorias.find((c: any) => c.categoria.nombre === categoria);

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
        },
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="h-1.5 w-full bg-rose-500 dark:bg-rose-400 opacity-80"></div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Matriz Área vs Categoría
                    </h3>

                    {/* Metric Toggle */}
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

                {/* Stats Cards */}
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

                {/* Heatmap */}
                <Chart key={metrica} options={heatmapOptions} series={series} type="heatmap" height={350} />

                {/* Totales por Categoría */}
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
