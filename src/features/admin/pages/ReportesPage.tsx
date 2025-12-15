import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ReportSelector from "../components/reportes/ReportSelector";
import ControlNotasTable from "../components/reportes/ControlNotasTable";
import { reportsService } from "../../../services/reportsService";
import { ReporteConfig, ControlNotasData } from "../../../types/reportes";
import { exportToCSV, exportToExcel, exportToPDF } from "../../../utils/reportExports";
import toast from "react-hot-toast";

type TabType = "feriaActual" | "global";

// Configuración de reportes disponibles
const REPORTES_DISPONIBLES: ReporteConfig[] = [
    {
        id: "control-notas",
        nombre: "Control de Notas",
        descripcion: "Matriz de proyectos vs tareas con calificaciones y estados de revisión de la feria actual",
        filtrosDisponibles: [],
    },
];

export default function ReportesPage() {
    const [activeTab, setActiveTab] = useState<TabType>("feriaActual");
    const [selectedReporte, setSelectedReporte] = useState<string | null>(null);
    const [reporteData, setReporteData] = useState<ControlNotasData | null>(null);
    const [loading, setLoading] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const handleGenerarReporte = async () => {
        if (!selectedReporte) {
            toast.error("Selecciona un tipo de reporte");
            return;
        }

        setLoading(true);
        try {
            if (selectedReporte === "control-notas") {
                const data = await reportsService.getControlNotas();
                setReporteData(data);
                toast.success("Reporte generado exitosamente");
            }
        } catch (error: any) {
            console.error("Error loading report:", error);
            toast.error(error.response?.data?.message || "Error al generar el reporte");
            setReporteData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
        if (!reporteData) {
            toast.error("Genera el reporte primero");
            return;
        }

        try {
            setShowExportMenu(false);

            switch (format) {
                case 'csv':
                    exportToCSV(reporteData);
                    toast.success("Reporte exportado a CSV");
                    break;
                case 'excel':
                    exportToExcel(reporteData);
                    toast.success("Reporte exportado a Excel");
                    break;
                case 'pdf':
                    await exportToPDF('control-notas-table', reporteData);
                    toast.success("Reporte exportado a PDF");
                    break;
            }
        } catch (error: any) {
            console.error("Error exporting report:", error);
            toast.error(error.message || "Error al exportar el reporte");
        }
    };

    return (
        <>
            <PageMeta
                title="Reportes | Semilleros"
                description="Genera y descarga reportes personalizados"
            />
            <PageBreadcrumb pageTitle="Reportes" />

            <div className="space-y-6">
                {/* Tabs Navigation */}
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-full">
                    <button
                        onClick={() => setActiveTab("feriaActual")}
                        className={`flex-1 py-3 px-6 text-center font-semibold text-sm rounded-lg transition-colors duration-150 ${activeTab === "feriaActual"
                            ? "bg-brand-500 text-white shadow-md dark:bg-transparent dark:border-2 dark:border-brand-400 dark:text-brand-400"
                            : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                    >
                        Feria Actual
                    </button>

                    <button
                        onClick={() => setActiveTab("global")}
                        className={`flex-1 py-3 px-6 text-center font-semibold text-sm rounded-lg transition-colors duration-150 ${activeTab === "global"
                            ? "bg-brand-500 text-white shadow-md dark:bg-transparent dark:border-2 dark:border-brand-400 dark:text-brand-400"
                            : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                    >
                        Global
                    </button>
                </div>

                {/* Tab Content - Feria Actual */}
                {activeTab === "feriaActual" && (
                    <div className="space-y-6">
                        {/* Selector de Reporte */}
                        <ReportSelector
                            reportes={REPORTES_DISPONIBLES}
                            selectedReporte={selectedReporte}
                            onReporteChange={setSelectedReporte}
                        />

                        {/* Botones de Acción */}
                        {selectedReporte && (
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleGenerarReporte}
                                    disabled={loading}
                                    className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Generando...
                                        </>
                                    ) : (
                                        <>
                                            🔍 Generar Reporte
                                        </>
                                    )}
                                </button>

                                {/* Dropdown de Exportación */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowExportMenu(!showExportMenu)}
                                        disabled={!reporteData}
                                        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        📥 Exportar
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Menu Dropdown */}
                                    {showExportMenu && reporteData && (
                                        <div className="absolute right-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                            <button
                                                onClick={() => handleExport('csv')}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 rounded-t-lg"
                                            >
                                                <span>📄</span>
                                                <span>Exportar como CSV</span>
                                            </button>
                                            <button
                                                onClick={() => handleExport('excel')}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                                            >
                                                <span>📊</span>
                                                <span>Exportar como Excel</span>
                                            </button>
                                            <button
                                                onClick={() => handleExport('pdf')}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 rounded-b-lg"
                                            >
                                                <span>📕</span>
                                                <span>Exportar como PDF</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tabla de Reporte */}
                        {selectedReporte === "control-notas" && (
                            <div id="control-notas-table">
                                <ControlNotasTable data={reporteData} loading={loading} />
                            </div>
                        )}
                    </div>
                )}

                {/* Tab Content - Global */}
                {activeTab === "global" && (
                    <div className="space-y-6">
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
                            <div className="text-center">
                                <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4">
                                    🌐
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Reportes Globales
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Aquí podrás generar reportes históricos de todas las ferias
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Click outside to close dropdown */}
            {showExportMenu && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowExportMenu(false)}
                />
            )}
        </>
    );
}
