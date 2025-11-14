import { Evento } from "../../../services/eventoService";
import Button from "../../../components/ui/button/Button";

interface EventoCardProps {
  evento: Evento;
}

export default function EventoCard({ evento }: EventoCardProps) {
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      {/* Título */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {evento.nombre}
      </h3>

      {/* Fecha */}
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded">
          📅 {formatearFecha(evento.fechaProgramada)}
        </span>
      </div>

      {/* Descripción */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {evento.descripcion || "Sin descripción disponible"}
      </p>

      {/* Botón */}
      <Button 
        variant="primary" 
        size="sm" 
        className="w-full"
      >
        Inscribir
      </Button>
    </div>
  );
}
