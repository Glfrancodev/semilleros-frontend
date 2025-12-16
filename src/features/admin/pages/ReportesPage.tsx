import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ReportSelector from "../components/reportes/ReportSelector";
import ControlNotasTable from "../components/reportes/ControlNotasTable";
import ProyectosJuradosTable from "../components/reportes/ProyectosJuradosTable";
import CalificacionesFinalesTable from "../components/reportes/CalificacionesFinalesTable";
import ProyectosIntegrantesTable from "../components/reportes/ProyectosIntegrantesTable";
import PromedioNotasFeriasTable from "../components/reportes/PromedioNotasFeriasTable";
import TableSettings from "../components/reportes/TableSettings";
import { reportsService } from "../../../services/reportsService";
import { ReporteConfig, ControlNotasData, ProyectosJuradosData, CalificacionesFinalesData, ProyectosIntegrantesData, PromedioNotasFeriasData } from "../../../types/reportes";
import {
    exportToCSV,
    exportToExcel,
    exportToPDF,
    exportProyectosJuradosToCSV,
    exportProyectosJuradosToExcel,
    exportProyectosJuradosToPDF,
    exportCalificacionesFinalesToCSV,
    exportCalificacionesFinalesToExcel,
    exportCalificacionesFinalesToPDF,
    exportProyectosIntegrantesToCSV,
    exportProyectosIntegrantesToExcel,
    exportProyectosIntegrantesToPDF,
    exportPromedioNotasFeriasToCSV,
    exportPromedioNotasFeriasToExcel,
    exportPromedioNotasFeriasToPDF
} from "../../../utils/reportExports";
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
    {
        id: "proyectos-jurados",
        nombre: "Proyectos con Jurados",
        descripcion: "Lista de proyectos aprobados para exposición con sus jurados asignados",
        filtrosDisponibles: [],
    },
    {
        id: "calificaciones-finales",
        nombre: "Calificaciones Finales",
        descripcion: "Calificaciones de jurados y promedio final de proyectos aprobados",
        filtrosDisponibles: [],
    },
    {
        id: "proyectos-integrantes",
        nombre: "Proyectos con Integrantes",
        descripcion: "Lista de proyectos con líder e integrantes del equipo",
        filtrosDisponibles: [],
    },
];

const REPORTES_GLOBALES: ReporteConfig[] = [
    {
        id: "promedio-notas-ferias",
        nombre: "Promedio de Notas de Ferias",
        descripcion: "Estadísticas de promedio de calificaciones por feria a lo largo del tiempo",
        filtrosDisponibles: [],
    },
];

export default function ReportesPage() {
    const [activeTab, setActiveTab] = useState<TabType>("feriaActual");
    const [selectedReporte, setSelectedReporte] = useState<string | null>(null);
    const [reporteData, setReporteData] = useState<ControlNotasData | ProyectosJuradosData | CalificacionesFinalesData | ProyectosIntegrantesData | PromedioNotasFeriasData | null>(null);
    const [loading, setLoading] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [reporteGenerado, setReporteGenerado] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

    // Definir columnas disponibles por tipo de reporte
    const getAvailableColumns = (reporteId: string | null) => {
        if (!reporteId) return [];

        switch (reporteId) {
            case "control-notas":
                const columns = [
                    { id: "proyecto", label: "Proyecto" },
                    { id: "area", label: "Área" },
                    { id: "categoria", label: "Categoría" },
                ];

                // Add dynamic task columns if data is available
                if (reporteData && 'tareas' in reporteData) {
                    const controlData = reporteData as ControlNotasData;
                    controlData.tareas.forEach((tarea) => {
                        columns.push({
                            id: `tarea-${tarea.idTarea}`,
                            label: tarea.nombre
                        });
                    });
                }

                return columns;
            case "proyectos-jurados":
                return [
                    { id: "proyecto", label: "Proyecto" },
                    { id: "area", label: "Área" },
                    { id: "categoria", label: "Categoría" },
                    { id: "jurado1", label: "Jurado 1" },
                    { id: "email1", label: "Email 1" },
                    { id: "jurado2", label: "Jurado 2" },
                    { id: "email2", label: "Email 2" },
                    { id: "jurado3", label: "Jurado 3" },
                    { id: "email3", label: "Email 3" },
                ];
            case "calificaciones-finales":
                return [
                    { id: "proyecto", label: "Proyecto" },
                    { id: "area", label: "Área" },
                    { id: "categoria", label: "Categoría" },
                    { id: "calificacion1", label: "Calificación 1" },
                    { id: "calificacion2", label: "Calificación 2" },
                    { id: "calificacion3", label: "Calificación 3" },
                    { id: "notaFinal", label: "Nota Final" },
                ];
            case "proyectos-integrantes":
                return [
                    { id: "proyecto", label: "Proyecto" },
                    { id: "area", label: "Área" },
                    { id: "categoria", label: "Categoría" },
                    { id: "lider", label: "Líder" },
                    { id: "codigoLider", label: "Código Líder" },
                    { id: "integrantes", label: "Integrantes" },
                    { id: "codigosIntegrantes", label: "Códigos Integrantes" },
                    { id: "total", label: "Total" },
                ];
            case "promedio-notas-ferias":
                return [
                    { id: "nombreFeria", label: "Nombre Feria" },
                    { id: "semestre", label: "Semestre" },
                    { id: "año", label: "Año" },
                    { id: "promedioGeneral", label: "Promedio General" },
                    { id: "mediana", label: "Mediana" },
                    { id: "desviacionEstandar", label: "Desviación Estándar" },
                    { id: "calificacionMaxima", label: "Calificación Máxima" },
                    { id: "calificacionMinima", label: "Calificación Mínima" },
                    { id: "totalProyectos", label: "Total Proyectos Calificados" },
                ];
            default:
                return [];
        }
    };

    // Limpiar datos cuando cambia el tipo de reporte
    const handleReporteChange = (reporteId: string) => {
        setSelectedReporte(reporteId);
        setReporteData(null);
        setReporteGenerado(false);
        // Inicializar todas las columnas como visibles
        const columns = getAvailableColumns(reporteId);
        setVisibleColumns(columns.map(col => col.id));
    };

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
                setReporteGenerado(true);

                // Initialize all columns as visible including dynamic tasks
                const allColumnIds = ['proyecto', 'area', 'categoria'];
                data.tareas.forEach((tarea: { idTarea: string }) => {
                    allColumnIds.push(`tarea-${tarea.idTarea}`);
                });
                setVisibleColumns(allColumnIds);

                toast.success("Reporte generado exitosamente");
            } else if (selectedReporte === "proyectos-jurados") {
                const data = await reportsService.getProyectosJurados();
                setReporteData(data);
                setReporteGenerado(true);
                toast.success("Reporte generado exitosamente");
            } else if (selectedReporte === "calificaciones-finales") {
                const data = await reportsService.getCalificacionesFinales();
                setReporteData(data);
                setReporteGenerado(true);
                toast.success("Reporte generado exitosamente");
            } else if (selectedReporte === "proyectos-integrantes") {
                const data = await reportsService.getProyectosIntegrantes();
                setReporteData(data);
                setReporteGenerado(true);
                toast.success("Reporte generado exitosamente");
            } else if (selectedReporte === "promedio-notas-ferias") {
                const data = await reportsService.getPromedioNotasFerias();
                setReporteData(data);
                setReporteGenerado(true);
                toast.success("Reporte generado exitosamente");
            }
        } catch (error: any) {
            console.error("Error loading report:", error);
            toast.error(error.response?.data?.message || "Error al generar el reporte");
            setReporteData(null);
            setReporteGenerado(false);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
        if (!reporteData || !selectedReporte) {
            toast.error("Genera el reporte primero");
            return;
        }

        try {
            setShowExportMenu(false);

            if (selectedReporte === "control-notas") {
                const data = reporteData as ControlNotasData;
                switch (format) {
                    case 'csv':
                        exportToCSV(data, visibleColumns);
                        toast.success("Reporte exportado a CSV");
                        break;
                    case 'excel':
                        exportToExcel(data, visibleColumns);
                        toast.success("Reporte exportado a Excel");
                        break;
                    case 'pdf':
                        await exportToPDF('control-notas-table', data);
                        toast.success("Reporte exportado a PDF");
                        break;
                }
            } else if (selectedReporte === "proyectos-jurados") {
                const data = reporteData as ProyectosJuradosData;
                switch (format) {
                    case 'csv':
                        exportProyectosJuradosToCSV(data, visibleColumns);
                        toast.success("Reporte exportado a CSV");
                        break;
                    case 'excel':
                        exportProyectosJuradosToExcel(data, visibleColumns);
                        toast.success("Reporte exportado a Excel");
                        break;
                    case 'pdf':
                        await exportProyectosJuradosToPDF('proyectos-jurados-table', data);
                        toast.success("Reporte exportado a PDF");
                        break;
                }
            } else if (selectedReporte === "calificaciones-finales") {
                const data = reporteData as CalificacionesFinalesData;
                switch (format) {
                    case 'csv':
                        exportCalificacionesFinalesToCSV(data, visibleColumns);
                        toast.success("Reporte exportado a CSV");
                        break;
                    case 'excel':
                        exportCalificacionesFinalesToExcel(data, visibleColumns);
                        toast.success("Reporte exportado a Excel");
                        break;
                    case 'pdf':
                        await exportCalificacionesFinalesToPDF('calificaciones-finales-table', data);
                        toast.success("Reporte exportado a PDF");
                        break;
                }
            } else if (selectedReporte === "proyectos-integrantes") {
                const data = reporteData as ProyectosIntegrantesData;
                switch (format) {
                    case 'csv':
                        exportProyectosIntegrantesToCSV(data, visibleColumns);
                        toast.success("Reporte exportado a CSV");
                        break;
                    case 'excel':
                        exportProyectosIntegrantesToExcel(data, visibleColumns);
                        toast.success("Reporte exportado a Excel");
                        break;
                    case 'pdf':
                        await exportProyectosIntegrantesToPDF('proyectos-integrantes-table', data);
                        toast.success("Reporte exportado a PDF");
                        break;
                }
            } else if (selectedReporte === "promedio-notas-ferias") {
                const data = reporteData as PromedioNotasFeriasData;
                switch (format) {
                    case 'csv':
                        exportPromedioNotasFeriasToCSV(data, visibleColumns);
                        toast.success("Reporte exportado a CSV");
                        break;
                    case 'excel':
                        exportPromedioNotasFeriasToExcel(data, visibleColumns);
                        toast.success("Reporte exportado a Excel");
                        break;
                    case 'pdf':
                        await exportPromedioNotasFeriasToPDF('promedio-notas-ferias-table', data);
                        toast.success("Reporte exportado a PDF");
                        break;
                }
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
                            onReporteChange={handleReporteChange}
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

                        {/* Table Settings - Solo mostrar cuando hay reporte generado */}
                        {reporteGenerado && selectedReporte && (
                            <TableSettings
                                columns={getAvailableColumns(selectedReporte)}
                                visibleColumns={visibleColumns}
                                onColumnsChange={setVisibleColumns}
                            />
                        )}

                        {/* Tabla de Reporte */}
                        {selectedReporte === "control-notas" && (
                            <div id="control-notas-table">
                                <ControlNotasTable
                                    data={reporteData as ControlNotasData}
                                    loading={loading}
                                    visibleColumns={visibleColumns}
                                />
                            </div>
                        )}

                        {selectedReporte === "proyectos-jurados" && (
                            <div id="proyectos-jurados-table">
                                <ProyectosJuradosTable
                                    data={reporteData as ProyectosJuradosData}
                                    loading={loading}
                                    reporteGenerado={reporteGenerado}
                                    visibleColumns={visibleColumns}
                                />
                            </div>
                        )}

                        {selectedReporte === "calificaciones-finales" && (
                            <div id="calificaciones-finales-table">
                                <CalificacionesFinalesTable
                                    data={reporteData as CalificacionesFinalesData}
                                    loading={loading}
                                    reporteGenerado={reporteGenerado}
                                    visibleColumns={visibleColumns}
                                />
                            </div>
                        )}

                        {selectedReporte === "proyectos-integrantes" && (
                            <div id="proyectos-integrantes-table">
                                <ProyectosIntegrantesTable
                                    data={reporteData as ProyectosIntegrantesData}
                                    loading={loading}
                                    reporteGenerado={reporteGenerado}
                                    visibleColumns={visibleColumns}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Tab Content - Global */}
                {activeTab === "global" && (
                    <div className="space-y-6">
                        {/* Selector de Reporte */}
                        <ReportSelector
                            reportes={REPORTES_GLOBALES}
                            selectedReporte={selectedReporte}
                            onReporteChange={handleReporteChange}
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
                                        disabled={!reporteGenerado || !reporteData}
                                        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        📥 Exportar
                                    </button>

                                    {showExportMenu && reporteGenerado && reporteData && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                                            <button
                                                onClick={() => { handleExport('csv'); setShowExportMenu(false); }}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-3"
                                            >
                                                <span className="text-lg">📄</span>
                                                <span className="font-medium">Exportar a CSV</span>
                                            </button>
                                            <button
                                                onClick={() => { handleExport('excel'); setShowExportMenu(false); }}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-3"
                                            >
                                                <span className="text-lg">📊</span>
                                                <span className="font-medium">Exportar a Excel</span>
                                            </button>
                                            <button
                                                onClick={() => { handleExport('pdf'); setShowExportMenu(false); }}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-3"
                                            >
                                                <span className="text-lg">📑</span>
                                                <span className="font-medium">Exportar a PDF</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tabla de Reporte */}
                        {selectedReporte === "promedio-notas-ferias" && (
                            <div id="promedio-notas-ferias-table">
                                <PromedioNotasFeriasTable
                                    data={reporteData as PromedioNotasFeriasData}
                                    loading={loading}
                                    reporteGenerado={reporteGenerado}
                                    visibleColumns={visibleColumns}
                                />
                            </div>
                        )}
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
