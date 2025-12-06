import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import VideoCallRoom from '../components/video-call/VideoCallRoom';

export default function ReunionPage() {
  const { proyectoId } = useParams<{ proyectoId: string }>();
  const [searchParams] = useSearchParams();
  const [isReady, setIsReady] = useState(false);

  const userName = searchParams.get('userName') || 'Usuario';
  const proyectoNombre = searchParams.get('proyecto') || 'Proyecto';

  useEffect(() => {
    // Pequeño delay para asegurar que todo esté cargado
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    window.close();
  };

  if (!proyectoId || !isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-lg">Cargando sala de reunión...</div>
      </div>
    );
  }

  return (
    <VideoCallRoom
      proyectoId={proyectoId}
      userName={userName}
      proyectoNombre={proyectoNombre}
      onClose={handleClose}
    />
  );
}
