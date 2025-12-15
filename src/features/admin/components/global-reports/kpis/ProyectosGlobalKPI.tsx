import { useEffect, useState } from 'react';
import GlobalKPICard from './GlobalKPICard';
import { reportsService } from '../../../../../services/reportsService';
import { FolderIcon } from '../../../../../assets/icons';

interface ProyectosGlobalKPIProps {
    filtros?: any;
}

export default function ProyectosGlobalKPI({ filtros }: ProyectosGlobalKPIProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getProyectosPorFeriaGlobal(filtros);
                setData(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching proyectos globales:', err);
                setError('Error al cargar datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filtros]);

    return (
        <GlobalKPICard
            title="Proyectos por Feria"
            data={data}
            loading={loading}
            error={error}
            valueKey="totalProyectos"
            icon={<FolderIcon />}
            colorClass="text-blue-500 dark:text-blue-400"
        />
    );
}
