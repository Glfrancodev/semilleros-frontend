import { useEffect, useState } from "react";
import KPICard from "./KPICard";
import { reportsService, KPIResponse } from "../../../../services/reportsService";
import { UserIcon } from "../../../../assets/icons";

interface JuradosKPIProps {
    filtros?: any;
}

export default function JuradosKPI({ filtros }: JuradosKPIProps) {
    const [data, setData] = useState<KPIResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getJurados(filtros);
                setData(response);
                setError(null);
            } catch (err) {
                console.error('Error fetching jurados:', err);
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
                title="Jurados"
                value="Error"
                subtitle={error}
                icon={<UserIcon />}
                colorClass="text-red-500 dark:text-red-400"
            />
        );
    }

    return (
        <KPICard
            title="Jurados"
            value={data?.valor ?? 0}
            subtitle="Docentes jurados asignados"
            icon={<UserIcon />}
            loading={loading}
            colorClass="text-orange-500 dark:text-orange-400"
        />
    );
}
