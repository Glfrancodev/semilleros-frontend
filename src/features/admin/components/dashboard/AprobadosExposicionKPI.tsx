import { useEffect, useState } from "react";
import KPICard from "./KPICard";
import { reportsService, KPIResponse } from "../../../../services/reportsService";
import { BoltIcon } from "../../../../assets/icons";

interface AprobadosExposicionKPIProps {
    filtros?: any;
}

export default function AprobadosExposicionKPI({ filtros }: AprobadosExposicionKPIProps) {
    const [data, setData] = useState<KPIResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getPorcentajeAprobadosExposicion(filtros);
                setData(response);
                setError(null);
            } catch (err) {
                console.error('Error fetching aprobados exposicion:', err);
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
                title="Aprobados para Exposición"
                value="Error"
                subtitle={error}
                icon={<BoltIcon />}
                colorClass="text-red-500 dark:text-red-400"
            />
        );
    }

    return (
        <KPICard
            title="Aprobados para Exposición"
            value={`${data?.valor ?? 0}%`}
            subtitle="Proyectos listos para exponer en feria"
            icon={<BoltIcon />}
            loading={loading}
            colorClass="text-yellow-500 dark:text-yellow-400"
        />
    );
}
