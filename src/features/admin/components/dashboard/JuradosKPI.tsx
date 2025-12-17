import { useEffect, useState } from "react";
import KPICard from "./KPICard";
import { reportsService } from "../../../../services/reportsService";
import { UserIcon } from "../../../../assets/icons";

interface JuradosKPIProps {
    filtros?: any;
}

export default function JuradosKPI({ filtros }: JuradosKPIProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getJurados(filtros);
                setData((response as any).data);
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
                value={0}
                subtitle="No hay feria activa"
                icon={<UserIcon />}
                colorClass="text-orange-500 dark:text-orange-400"
            />
        );
    }

    return (
        <KPICard
            title="Jurados"
            value={data?.totalUnicos ?? 0}
            subtitle="Docentes jurados asignados"
            icon={<UserIcon />}
            loading={loading}
            colorClass="text-orange-500 dark:text-orange-400"
        />
    );
}
