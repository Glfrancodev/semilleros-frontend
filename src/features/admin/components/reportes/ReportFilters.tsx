import { useState, useEffect } from "react";
import { obtenerAreas, type Area } from "../../../../services/areaService";
import { obtenerCategorias, type Categoria } from "../../../../services/categoriaService";

interface Props {
    filtrosDisponibles: string[];
    onFilterChange: (filtros: any) => void;
}

export default function ReportFilters({ filtrosDisponibles, onFilterChange }: Props) {
    const [areas, setAreas] = useState<Area[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    const [selectedArea, setSelectedArea] = useState<string>("");
    const [selectedCategoria, setSelectedCategoria] = useState<string>("");

    // Cargar áreas y categorías
    useEffect(() => {
        const loadData = async () => {
            try {
                const [areasData, categoriasData] = await Promise.all([
                    obtenerAreas(),
                    obtenerCategorias(),
                ]);
                setAreas(areasData.areas || []);
                setCategorias(categoriasData.categorias || []);
            } catch (error) {
                console.error("Error loading filter data:", error);
            }
        };
        loadData();
    }, []);

    // Notificar cambios de filtros
    useEffect(() => {
        const filtros: any = {};
        if (selectedArea) filtros.areaId = selectedArea;
        if (selectedCategoria) filtros.categoriaId = selectedCategoria;
        onFilterChange(filtros);
    }, [selectedArea, selectedCategoria, onFilterChange]);

    const isFilterEnabled = (filterName: string) => {
        return filtrosDisponibles.includes(filterName);
    };

    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🔍 Filtros
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Área */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Área
                    </label>
                    <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        disabled={!isFilterEnabled("areaId")}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    >
                        <option value="">Todas las áreas</option>
                        {areas.map((area) => (
                            <option key={area.idArea} value={area.idArea}>
                                {area.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Categoría */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Categoría
                    </label>
                    <select
                        value={selectedCategoria}
                        onChange={(e) => setSelectedCategoria(e.target.value)}
                        disabled={!isFilterEnabled("categoriaId")}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.idCategoria} value={categoria.idCategoria}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Semestre - Deshabilitado por ahora */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Semestre
                    </label>
                    <select
                        disabled={!isFilterEnabled("semestreId")}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Todos los semestres</option>
                    </select>
                </div>

                {/* Materia - Deshabilitado por ahora */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Materia
                    </label>
                    <select
                        disabled={!isFilterEnabled("materiaId")}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Todas las materias</option>
                    </select>
                </div>

                {/* Grupo Materia - Deshabilitado por ahora */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Grupo Materia
                    </label>
                    <select
                        disabled={!isFilterEnabled("grupoMateriaId")}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Todos los grupos</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
