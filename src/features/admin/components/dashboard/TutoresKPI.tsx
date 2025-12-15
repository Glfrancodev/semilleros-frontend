import { useEffect, useState } from "react";
import KPICard from "./KPICard";
import { reportsService, KPIResponse } from "../../../../services/reportsService";
import { UserCircleIcon } from "../../../../assets/icons";

interface TutoresKPIProps {
    filtros?: any;
}

export default function TutoresKPI({ filtros }: TutoresKPIProps) {
    const [data, setData] = useState<KPIResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getTutores(filtros);
                setData(response);
                setError(null);
            } catch (err) {
                console.error('Error fetching tutores:', err);
                setError('Error al cargar datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filtros]);

    if (error) {
        return (
            <KPICard
                title="Tutores"
                value="Error"
                subtitle={error}
                icon={<UserCircleIcon />}
                colorClass="text-red-500 dark:text-red-400"
            />
        );
    }

    return (
        <KPICard
            title="Tutores"
            value={data?.valor ?? 0}
            subtitle="Docentes tutores activos"
            icon={<UserCircleIcon />}
            loading={loading}
            colorClass="text-purple-500 dark:text-purple-400"
        />
    );
}
