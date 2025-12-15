import { useState, ReactNode } from "react";

type ChartType = "pie" | "bar" | "line";

interface MultiViewChartProps {
    title: string;
    colorClass?: string;
    children: (chartType: ChartType) => ReactNode;
}

export default function MultiViewChart({
    title,
    colorClass = "bg-brand-500 dark:border-brand-400",
    children
}: MultiViewChartProps) {
    const [chartType, setChartType] = useState<ChartType>("pie");

    return (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-xl transition-shadow duration-300">
            {/* Color Bar */}
            <div className={`h-1.5 w-full ${colorClass} opacity-80`}></div>

            <div className="p-6">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    {title}
                </h3>

                {/* Chart Type Tabs */}
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-full mb-6">
                    <button
                        onClick={() => setChartType("pie")}
                        className={`flex-1 py-2 px-4 text-center font-semibold text-sm rounded-lg transition-colors duration-150 ${chartType === "pie"
                                ? "bg-brand-500 text-white shadow-md dark:bg-transparent dark:border-2 dark:border-brand-400 dark:text-brand-400"
                                : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                    >
                        Torta
                    </button>

                    <button
                        onClick={() => setChartType("bar")}
                        className={`flex-1 py-2 px-4 text-center font-semibold text-sm rounded-lg transition-colors duration-150 ${chartType === "bar"
                                ? "bg-brand-500 text-white shadow-md dark:bg-transparent dark:border-2 dark:border-brand-400 dark:text-brand-400"
                                : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                    >
                        Barras
                    </button>

                    <button
                        onClick={() => setChartType("line")}
                        className={`flex-1 py-2 px-4 text-center font-semibold text-sm rounded-lg transition-colors duration-150 ${chartType === "line"
                                ? "bg-brand-500 text-white shadow-md dark:bg-transparent dark:border-2 dark:border-brand-400 dark:text-brand-400"
                                : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                    >
                        Líneas
                    </button>
                </div>

                {/* Chart Content */}
                <div className="mt-4">
                    {children(chartType)}
                </div>
            </div>
        </div>
    );
}
