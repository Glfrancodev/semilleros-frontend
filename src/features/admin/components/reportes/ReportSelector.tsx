import { ReporteConfig } from "../../../../types/reportes";

interface Props {
    reportes: ReporteConfig[];
    selectedReporte: string | null;
    onReporteChange: (reporteId: string) => void;
}

export default function ReportSelector({ reportes, selectedReporte, onReporteChange }: Props) {
    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📊 Configuración de Reporte
            </h3>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Reporte
                </label>
                <select
                    value={selectedReporte || ""}
                    onChange={(e) => onReporteChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                    <option value="">Seleccionar reporte...</option>
                    {reportes.map((reporte) => (
                        <option key={reporte.id} value={reporte.id}>
                            {reporte.nombre}
                        </option>
                    ))}
                </select>

                {selectedReporte && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {reportes.find(r => r.id === selectedReporte)?.descripcion}
                    </p>
                )}
            </div>
        </div>
    );
}
