import { useEffect, useState } from "react";
import KPICard from "./KPICard";
import { reportsService } from "../../../../services/reportsService";
import { UserIcon } from "../../../../assets/icons";

interface EstudiantesKPIProps {
    filtros?: any;
}

export default function EstudiantesKPI({ filtros }: EstudiantesKPIProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getEstudiantesParticipantes(filtros);
                setData((response as any).data);
                setError(null);
            } catch (err) {
                console.error('Error fetching estudiantes:', err);
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
                title="Estudiantes Participantes"
                value={0}
                subtitle="No hay feria activa"
                icon={<UserIcon />}
                colorClass="text-green-500 dark:text-green-400"
            />
        );
    }

    return (
        <KPICard
            title="Estudiantes Participantes"
            value={data?.totalUnicos ?? 0}
            subtitle="Total de estudiantes activos"
            icon={<UserIcon />}
            loading={loading}
            colorClass="text-green-500 dark:text-green-400"
        />
    );
}
