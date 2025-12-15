import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

// KPI Components
import ProyectosKPI from "../components/dashboard/ProyectosKPI";
import EstudiantesKPI from "../components/dashboard/EstudiantesKPI";
import TutoresKPI from "../components/dashboard/TutoresKPI";
import JuradosKPI from "../components/dashboard/JuradosKPI";

// Chart Components
import AprobadosTutorChart from "../components/dashboard/AprobadosTutorChart";
import AprobadosAdminChart from "../components/dashboard/AprobadosAdminChart";
import AprobadosExposicionChart from "../components/dashboard/AprobadosExposicionChart";
import ProyectosPorEstadoChart from "../components/dashboard/ProyectosPorEstadoChart";
import ParticipacionAreaCategoriaChart from "../components/dashboard/ParticipacionAreaCategoriaChart";
import CalificacionesFeriaChart from "../components/dashboard/CalificacionesFeriaChart";
import CargaJuradosChart from "../components/dashboard/CargaJuradosChart";
import ParticipacionEventosChart from "../components/dashboard/ParticipacionEventosChart";

// Global KPI Components
import ProyectosGlobalKPI from "../components/global-reports/kpis/ProyectosGlobalKPI";
import EstudiantesGlobalKPI from "../components/global-reports/kpis/EstudiantesGlobalKPI";
import JuradosGlobalKPI from "../components/global-reports/kpis/JuradosGlobalKPI";
import TutoresGlobalKPI from "../components/global-reports/kpis/TutoresGlobalKPI";

// Global Tendencias Components
import AreasFrequentesChart from "../components/global-reports/tendencias/AreasFrequentesChart";
import CategoriasDistribucionChart from "../components/global-reports/tendencias/CategoriasDistribucionChart";

type TabType = "feriaActual" | "global";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<TabType>("feriaActual");

    return (
        <>
            <PageMeta
                title="Dashboard | Semilleros"
                description="Panel de control del administrador"
            />
            <PageBreadcrumb pageTitle="Dashboard" />

            <div className="space-y-6">
                {/* Tabs Navigation - Pill Style with Background */}
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

                {/* Tab Content */}
                {activeTab === "feriaActual" && (
                    <div className="space-y-6">
                        {/* KPIs Grid - 4 columns on large screens */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <ProyectosKPI />
                            <EstudiantesKPI />
                            <TutoresKPI />
                            <JuradosKPI />
                        </div>

                        {/* Percentage KPIs - 3 columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <AprobadosTutorChart />
                            <AprobadosAdminChart />
                            <AprobadosExposicionChart />
                        </div>

                        {/* Charts Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                Gráficos y Análisis
                            </h3>

                            <ProyectosPorEstadoChart />
                            <ParticipacionAreaCategoriaChart />
                            <CalificacionesFeriaChart />
                            <CargaJuradosChart />
                            <ParticipacionEventosChart />
                        </div>
                    </div>
                )}

                {activeTab === "global" && (
                    <div className="space-y-4">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Global
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Estadísticas generales del sistema
                            </p>
                        </div>

                        {/* KPIs Grid - 2 per row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <ProyectosGlobalKPI />
                            <EstudiantesGlobalKPI />
                            <JuradosGlobalKPI />
                            <TutoresGlobalKPI />
                        </div>

                        {/* Tendencias Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Tendencias
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <AreasFrequentesChart />
                                <CategoriasDistribucionChart />
                            </div>
                        </div>

                        {/* Placeholder for future phases */}
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                            <p className="text-gray-500 dark:text-gray-400 text-center">
                                Más gráficos próximamente (Rendimiento, Matriz)
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
