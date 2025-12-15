import { useEffect, useState } from 'react';
import GlobalKPICard from './GlobalKPICard';
import { reportsService } from '../../../../../services/reportsService';
import { GroupIcon } from '../../../../../assets/icons';

interface EstudiantesGlobalKPIProps {
    filtros?: any;
}

export default function EstudiantesGlobalKPI({ filtros }: EstudiantesGlobalKPIProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getEstudiantesPorFeriaGlobal(filtros);
                setData(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching estudiantes globales:', err);
                setError('Error al cargar datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filtros]);

    return (
        <GlobalKPICard
            title="Estudiantes por Feria"
            data={data}
            loading={loading}
            error={error}
            valueKey="estudiantesUnicos"
            icon={<GroupIcon />}
            colorClass="text-green-500 dark:text-green-400"
        />
    );
}
