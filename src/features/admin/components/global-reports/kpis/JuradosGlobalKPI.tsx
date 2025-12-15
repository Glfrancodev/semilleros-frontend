import { useEffect, useState } from 'react';
import GlobalKPICard from './GlobalKPICard';
import { reportsService } from '../../../../../services/reportsService';
import { UserIcon } from '../../../../../assets/icons';

interface JuradosGlobalKPIProps {
    filtros?: any;
}

export default function JuradosGlobalKPI({ filtros }: JuradosGlobalKPIProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getJuradosPorFeriaGlobal(filtros);
                setData(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching jurados globales:', err);
                setError('Error al cargar datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filtros]);

    return (
        <GlobalKPICard
            title="Jurados por Feria"
            data={data}
            loading={loading}
            error={error}
            valueKey="juradosUnicos"
            icon={<UserIcon />}
            colorClass="text-purple-500 dark:text-purple-400"
        />
    );
}
