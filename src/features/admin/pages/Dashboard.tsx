import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

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
                    <div className="space-y-4">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Feria Actual
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Estadísticas y métricas de la feria en curso
                            </p>
                        </div>

                        {/* Aquí irán los gráficos y KPIs de la feria actual */}
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                            <p className="text-gray-500 dark:text-gray-400 text-center">
                                Los gráficos y estadísticas se agregarán próximamente
                            </p>
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

                        {/* Aquí irán los gráficos y KPIs globales */}
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                            <p className="text-gray-500 dark:text-gray-400 text-center">
                                Los gráficos y estadísticas se agregarán próximamente
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
