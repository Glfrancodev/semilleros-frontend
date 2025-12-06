import { useRef } from 'react';

interface SalaReunionModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  userName: string;
  proyectoNombre: string;
}

export default function SalaReunionModal({
  isOpen,
  onClose,
  roomName,
  userName,
  proyectoNombre,
}: SalaReunionModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Usar Jitsi Meet con configuración que permite entrada sin login
  // Se agrega el nombre del usuario en el hash para autocompletar
  const meetingUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${encodeURIComponent(userName)}"&config.prejoinPageEnabled=false`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal */}
      <div className="relative w-full h-full max-w-7xl max-h-[95vh] m-4 bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reunión - {proyectoNombre}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sala privada del proyecto
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Cerrar reunión"
          >
            <svg 
              className="w-5 h-5 text-gray-500 dark:text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenedor de Jitsi Meet */}
        <div className="flex-1 relative bg-gray-900">
          <iframe
            ref={iframeRef}
            src={meetingUrl}
            allow="camera; microphone; fullscreen; speaker; display-capture"
            className="absolute inset-0 w-full h-full border-0"
            title={`Reunión ${proyectoNombre}`}
          />
        </div>

        {/* Footer con información */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            💡 Esta sala es exclusiva para los integrantes del proyecto • Sin límite de participantes
          </p>
        </div>
      </div>
    </div>
  );
}
