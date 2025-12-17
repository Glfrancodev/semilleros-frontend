import { useEffect, useState } from "react";
import KPICard from "./KPICard";
import { reportsService } from "../../../../services/reportsService";
import { FolderIcon } from "../../../../assets/icons";

interface ProyectosKPIProps {
    filtros?: any;
}

export default function ProyectosKPI({ filtros }: ProyectosKPIProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reportsService.getProyectosInscritos(filtros);
                setData((response as any).data);
                setError(null);
            } catch (err) {
                console.error('Error fetching proyectos:', err);
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
                title="Proyectos Inscritos"
                value={0}
                subtitle="No hay feria activa"
                icon={<FolderIcon />}
                colorClass="text-blue-500 dark:text-blue-400"
            />
        );
    }

    return (
        <KPICard
            title="Proyectos Inscritos"
            value={data?.total ?? 0}
            subtitle="Total de proyectos registrados"
            icon={<FolderIcon />}
            loading={loading}
            colorClass="text-blue-500 dark:text-blue-400"
        />
    );
}
