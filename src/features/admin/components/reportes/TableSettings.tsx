import { useState } from "react";

interface Column {
    id: string;
    label: string;
}

interface Props {
    columns: Column[];
    visibleColumns: string[];
    onColumnsChange: (visibleColumns: string[]) => void;
}

export default function TableSettings({ columns, visibleColumns, onColumnsChange }: Props) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggleColumn = (columnId: string) => {
        if (visibleColumns.includes(columnId)) {
            onColumnsChange(visibleColumns.filter(id => id !== columnId));
        } else {
            onColumnsChange([...visibleColumns, columnId]);
        }
    };

    const handleSelectAll = () => {
        onColumnsChange(columns.map(col => col.id));
    };

    const handleDeselectAll = () => {
        onColumnsChange([]);
    };

    if (columns.length === 0) return null;

    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                    </svg>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Configuración de Columnas
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({visibleColumns.length}/{columns.length} visibles)
                    </span>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                    {isExpanded ? "Ocultar" : "Mostrar"}
                </button>
            </div>

            {isExpanded && (
                <div className="mt-4 space-y-3">
                    {/* Botones de acción */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleSelectAll}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        >
                            Seleccionar todas
                        </button>
                        <button
                            onClick={handleDeselectAll}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            Deseleccionar todas
                        </button>
                    </div>

                    {/* Grid de checkboxes */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {columns.map((column) => (
                            <label
                                key={column.id}
                                className="flex items-center gap-2 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={visibleColumns.includes(column.id)}
                                    onChange={() => handleToggleColumn(column.id)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                                    {column.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
