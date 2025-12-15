import { useEffect, useState } from "react";
import KPICard from "./KPICard";
import { reportsService, KPIResponse } from "../../../../services/reportsService";
import { UserIcon } from "../../../../assets/icons";

interface EstudiantesKPIProps {
    filtros?: any;
}

export default function EstudiantesKPI({ filtros }: EstudiantesKPIProps) {
    const [data, setData] = useState<KPIResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getEstudiantesParticipantes(filtros);
                setData(response);
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
                value="Error"
                subtitle={error}
                icon={<UserIcon />}
                colorClass="text-red-500 dark:text-red-400"
            />
        );
    }

    return (
        <KPICard
            title="Estudiantes Participantes"
            value={data?.valor ?? 0}
            subtitle="Total de estudiantes activos"
            icon={<UserIcon />}
            loading={loading}
            colorClass="text-green-500 dark:text-green-400"
        />
    );
}
