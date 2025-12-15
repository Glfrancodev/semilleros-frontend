import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { reportsService } from '../../../../../services/reportsService';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function ComparacionFeriasChart() {
    const [ferias, setFerias] = useState<any[]>([]);
    const [feriaBase, setFeriaBase] = useState<string>('');
    const [feriaComparacion, setFeriaComparacion] = useState<string>('');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [loadingFerias, setLoadingFerias] = useState(true);

    // Fetch ferias list
    useEffect(() => {
        const fetchFerias = async () => {
            try {
                setLoadingFerias(true);
                const response = await axios.get(`${API_URL}/ferias`);

                // Handle different response structures
                let feriasData = [];
                if (response.data.data && Array.isArray(response.data.data.items)) {
                    // Structure: { data: { items: [...] } }
                    feriasData = response.data.data.items;
                } else if (Array.isArray(response.data.data)) {
                    // Structure: { data: [...] }
                    feriasData = response.data.data;
                } else if (Array.isArray(response.data)) {
                    // Structure: [...]
                    feriasData = response.data;
                } else if (response.data.ferias && Array.isArray(response.data.ferias)) {
                    // Structure: { ferias: [...] }
                    feriasData = response.data.ferias;
                }

                setFerias(feriasData);

                // Auto-select last 2 ferias if available
                if (feriasData.length >= 2) {
                    setFeriaBase(feriasData[feriasData.length - 2].idFeria);
                    setFeriaComparacion(feriasData[feriasData.length - 1].idFeria);
                }
            } catch (err) {
                console.error('Error fetching ferias:', err);
                setFerias([]); // Set empty array on error
            } finally {
                setLoadingFerias(false);
            }
        };

        fetchFerias();
    }, []);

    // Fetch comparison data when ferias are selected
    useEffect(() => {
        const fetchComparison = async () => {
            if (!feriaBase || !feriaComparacion) return;

            try {
                setLoading(true);
                const response = await reportsService.getComparacionFeriasGlobal({
                    feriaBase,
                    feriaComparacion
                });
                setData(response.data);
            } catch (err) {
                console.error('Error fetching comparison:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchComparison();
    }, [feriaBase, feriaComparacion]);

    if (loadingFerias) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        );
    }

    const renderChart = () => {
        if (!data || !data.comparacionPorArea || data.comparacionPorArea.length === 0) {
            return (
                <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <p>No hay datos para comparar</p>
                </div>
            );
        }

        const areas = data.comparacionPorArea.map((item: any) => item.area.nombre);
        const valoresBase = data.comparacionPorArea.map((item: any) => item.feriaBase.cantidad);
        const valoresComparacion = data.comparacionPorArea.map((item: any) => item.feriaComparacion.cantidad);

        const chartOptions: ApexOptions = {
            chart: {
                type: 'bar',
                fontFamily: 'Outfit, sans-serif',
                toolbar: { show: false },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '70%',
                    borderRadius: 4,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            xaxis: {
                categories: areas,
                labels: {
                    style: {
                        fontSize: '11px',
                    },
                },
            },
            yaxis: {
                title: {
                    text: 'Proyectos',
                },
            },
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: (val: number) => `${val} proyectos`,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'center',
            },
            colors: ['#3b82f6', '#10b981'],
        };

        const series = [
            {
                name: data.feriaBase.nombre,
                data: valoresBase,
            },
            {
                name: data.feriaComparacion.nombre,
                data: valoresComparacion,
            },
        ];

        return <Chart key="comparison-bar" options={chartOptions} series={series} type="bar" height={300} />;
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="h-1.5 w-full bg-emerald-500 dark:bg-emerald-400 opacity-80"></div>
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Comparación de Ferias
                </h3>

                {/* Feria Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Feria Base
                        </label>
                        <select
                            value={feriaBase}
                            onChange={(e) => setFeriaBase(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccionar feria</option>
                            {Array.isArray(ferias) && ferias.map((feria) => (
                                <option key={feria.idFeria} value={feria.idFeria}>
                                    {feria.nombre} ({feria.semestre}-{feria.año})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Feria a Comparar
                        </label>
                        <select
                            value={feriaComparacion}
                            onChange={(e) => setFeriaComparacion(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Seleccionar feria</option>
                            {Array.isArray(ferias) && ferias.map((feria) => (
                                <option key={feria.idFeria} value={feria.idFeria}>
                                    {feria.nombre} ({feria.semestre}-{feria.año})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    </div>
                )}

                {/* Chart */}
                {!loading && feriaBase && feriaComparacion && (
                    <>
                        {renderChart()}

                        {/* Comparison Table */}
                        {data && data.comparacionPorArea && data.comparacionPorArea.length > 0 && (
                            <div className="mt-6 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Área
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                {data.feriaBase.nombre}
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                {data.feriaComparacion.nombre}
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Variación
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                        {data.comparacionPorArea.map((item: any, index: number) => (
                                            <tr key={index}>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                    {item.area.nombre}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-center text-gray-700 dark:text-gray-300">
                                                    {item.feriaBase.cantidad}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-center text-gray-700 dark:text-gray-300">
                                                    {item.feriaComparacion.cantidad}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        {item.variacion.tipo === 'incremento' ? (
                                                            <span className="text-green-600 dark:text-green-400 font-semibold">
                                                                ↑ +{item.variacion.absoluta}
                                                            </span>
                                                        ) : item.variacion.tipo === 'decremento' ? (
                                                            <span className="text-red-600 dark:text-red-400 font-semibold">
                                                                ↓ {item.variacion.absoluta}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-500 dark:text-gray-400">
                                                                → 0
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* No selection message */}
                {!loading && (!feriaBase || !feriaComparacion) && (
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                        <p>Selecciona dos ferias para comparar</p>
                    </div>
                )}
            </div>
        </div>
    );
}
