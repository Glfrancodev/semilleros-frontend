interface KPICardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    icon?: React.ReactNode;
    loading?: boolean;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    colorClass?: string;
}

export default function KPICard({
    title,
    value,
    subtitle,
    icon,
    loading,
    trend,
    colorClass = "text-brand-500 dark:text-brand-400"
}: KPICardProps) {
    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    {subtitle && <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300">
            {/* Color Bar - Full width at top */}
            <div className={`h-1.5 w-full ${colorClass} bg-current opacity-80`}></div>

            {/* Content */}
            <div className="p-6 space-y-3">
                {/* Title with Icon */}
                <div className="flex items-center gap-2">
                    {icon && (
                        <div className={`flex-shrink-0 w-5 h-5 ${colorClass}`}>
                            {icon}
                        </div>
                    )}
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {title}
                    </p>
                </div>

                {/* Value */}
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {value}
                </h3>

                {/* Subtitle */}
                {subtitle && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subtitle}
                    </p>
                )}

                {/* Trend */}
                {trend && (
                    <div className={`flex items-center gap-1.5 text-sm font-semibold ${trend.isPositive
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                        <span className="text-lg">{trend.isPositive ? '↑' : '↓'}</span>
                        <span>{Math.abs(trend.value)}%</span>
                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">vs anterior</span>
                    </div>
                )}
            </div>
        </div>
    );
}
