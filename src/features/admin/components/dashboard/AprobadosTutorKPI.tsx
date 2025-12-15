import { useEffect, useState } from "react";
import KPICard from "./KPICard";
import { reportsService, KPIResponse } from "../../../../services/reportsService";
import { TaskIcon } from "../../../../assets/icons";

interface AprobadosTutorKPIProps {
    filtros?: any;
}

export default function AprobadosTutorKPI({ filtros }: AprobadosTutorKPIProps) {
    const [data, setData] = useState<KPIResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getPorcentajeAprobadosTutor(filtros);
                setData(response);
                setError(null);
            } catch (err) {
                console.error('Error fetching aprobados tutor:', err);
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
                title="Aprobados por Tutor"
                value="Error"
                subtitle={error}
                icon={<TaskIcon />}
                colorClass="text-red-500 dark:text-red-400"
            />
        );
    }

    return (
        <KPICard
            title="Aprobados por Tutor"
            value={`${data?.valor ?? 0}%`}
            subtitle="Proyectos con aprobación del tutor"
            icon={<TaskIcon />}
            loading={loading}
            colorClass="text-teal-500 dark:text-teal-400"
        />
    );
}
