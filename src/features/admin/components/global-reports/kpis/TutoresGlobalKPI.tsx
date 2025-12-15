import { useEffect, useState } from 'react';
import GlobalKPICard from './GlobalKPICard';
import { reportsService } from '../../../../../services/reportsService';
import { UserIcon } from '../../../../../assets/icons';

interface TutoresGlobalKPIProps {
    filtros?: any;
}

export default function TutoresGlobalKPI({ filtros }: TutoresGlobalKPIProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getTutoresPorFeriaGlobal(filtros);
                setData(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching tutores globales:', err);
                setError('Error al cargar datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filtros]);

    return (
        <GlobalKPICard
            title="Tutores por Feria"
            data={data}
            loading={loading}
            error={error}
            valueKey="tutoresUnicos"
            icon={<UserIcon />}
            colorClass="text-orange-500 dark:text-orange-400"
        />
    );
}
