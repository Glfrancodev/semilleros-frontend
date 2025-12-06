import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

interface VideoCallRoomProps {
  proyectoId: string;
  userName: string;
  proyectoNombre: string;
  onClose: () => void;
}

interface Participant {
  id: string;
  name: string;
  stream?: MediaStream;
}

export default function VideoCallRoom({ proyectoId, userName, proyectoNombre, onClose }: VideoCallRoomProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const remoteVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Configuración de servidores STUN/TURN (usando servidores públicos gratuitos)
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  useEffect(() => {
    initializeCall();
    return () => cleanup();
  }, []);

  const initializeCall = async () => {
    try {
      // Obtener medios locales (cámara y micrófono)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Conectar al servidor de señalización
      const token = localStorage.getItem('token');
      // Socket.io se conecta a la raíz del servidor, no a /api
      let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      // Remover /api si existe en la URL
      apiUrl = apiUrl.replace('/api', '');
      
      console.log('🔌 Conectando a Socket.io:', apiUrl);
      console.log('🔑 Token disponible:', !!token);
      
      const newSocket = io(apiUrl, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
      });

      setSocket(newSocket);

      // Eventos de conexión
      newSocket.on('connect', () => {
        console.log('✅ Socket conectado:', newSocket.id);
        toast.success('Conectado al servidor');
      });

      newSocket.on('disconnect', (reason) => {
        console.log('❌ Socket desconectado:', reason);
        toast.error('Desconectado del servidor');
      });

      // Manejo de errores de conexión
      newSocket.on('connect_error', (error) => {
        console.error('❌ Error de conexión Socket.io:', error);
        toast.error('Error al conectar con el servidor');
      });

      newSocket.on('error', (error) => {
        console.error('❌ Error Socket.io:', error);
        toast.error(error.message || 'Error en la conexión');
      });

      // Eventos de socket
      newSocket.on('user-joined-video', handleUserJoined);
      newSocket.on('user-left-video', handleUserLeft);
      newSocket.on('video-offer', handleOffer);
      newSocket.on('video-answer', handleAnswer);
      newSocket.on('video-ice-candidate', handleIceCandidate);
      newSocket.on('video-participants-list', handleParticipantsList);

      // Unirse a la sala
      console.log('📹 Uniéndose a sala:', proyectoId, userName);
      newSocket.emit('join-video-room', { proyectoId, userName });
    } catch (error) {
      console.error('❌ Error al inicializar la llamada:', error);
      toast.error('Error al acceder a cámara/micrófono');
    }
  };

  const handleUserJoined = async ({ userId, userName }: { userId: string; userName: string }) => {
    console.log('Usuario se unió:', userName);
    setParticipants((prev) => [...prev, { id: userId, name: userName }]);
    
    // Crear conexión peer-to-peer con el nuevo usuario
    await createPeerConnection(userId, true);
  };

  const handleUserLeft = ({ userId }: { userId: string }) => {
    console.log('Usuario salió:', userId);
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
    
    // Cerrar conexión con ese usuario
    const peerConnection = peerConnectionsRef.current.get(userId);
    if (peerConnection) {
      peerConnection.close();
      peerConnectionsRef.current.delete(userId);
    }
    
    remoteVideosRef.current.delete(userId);
  };

  const handleParticipantsList = (participantsList: Participant[]) => {
    setParticipants(participantsList.filter((p) => p.id !== socket?.id));
    
    // Crear conexiones con usuarios existentes
    participantsList.forEach((participant) => {
      if (participant.id !== socket?.id) {
        createPeerConnection(participant.id, false);
      }
    });
  };

  const createPeerConnection = async (userId: string, shouldCreateOffer: boolean) => {
    try {
      const peerConnection = new RTCPeerConnection(iceServers);
      peerConnectionsRef.current.set(userId, peerConnection);

      // Agregar stream local a la conexión
      localStreamRef.current?.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStreamRef.current!);
      });

      // Manejar stream remoto
      peerConnection.ontrack = (event) => {
        const remoteStream = event.streams[0];
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === userId ? { ...p, stream: remoteStream } : p
          )
        );
      };

      // Manejar candidatos ICE
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('video-ice-candidate', {
            candidate: event.candidate,
            to: userId,
          });
        }
      };

      // Si somos el iniciador, crear oferta
      if (shouldCreateOffer) {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        socket?.emit('video-offer', {
          offer,
          to: userId,
        });
      }
    } catch (error) {
      console.error('Error al crear peer connection:', error);
    }
  };

  const handleOffer = async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
    try {
      let peerConnection = peerConnectionsRef.current.get(from);
      
      if (!peerConnection) {
        await createPeerConnection(from, false);
        peerConnection = peerConnectionsRef.current.get(from);
      }

      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        socket?.emit('video-answer', {
          answer,
          to: from,
        });
      }
    } catch (error) {
      console.error('Error al manejar oferta:', error);
    }
  };

  const handleAnswer = async ({ answer, from }: { answer: RTCSessionDescriptionInit; from: string }) => {
    try {
      const peerConnection = peerConnectionsRef.current.get(from);
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    } catch (error) {
      console.error('Error al manejar respuesta:', error);
    }
  };

  const handleIceCandidate = async ({ candidate, from }: { candidate: RTCIceCandidateInit; from: string }) => {
    try {
      const peerConnection = peerConnectionsRef.current.get(from);
      if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.error('Error al agregar candidato ICE:', error);
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const cleanup = () => {
    // Detener todos los tracks locales
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    
    // Cerrar todas las conexiones peer
    peerConnectionsRef.current.forEach((pc) => pc.close());
    peerConnectionsRef.current.clear();
    
    // Desconectar socket
    socket?.emit('leave-video-room', { proyectoId });
    socket?.disconnect();
  };

  const handleLeave = () => {
    cleanup();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-lg">{proyectoNombre}</h2>
          <p className="text-gray-400 text-sm">{participants.length + 1} participante{participants.length !== 0 ? 's' : ''}</p>
        </div>
        <button
          onClick={handleLeave}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Salir
        </button>
      </div>

      {/* Videos Grid */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
        {/* Video local */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover mirror"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
            {userName} (Tú)
          </div>
        </div>

        {/* Videos remotos */}
        {participants.map((participant) => (
          <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
            <video
              ref={(el) => {
                if (el && participant.stream) {
                  el.srcObject = participant.stream;
                  remoteVideosRef.current.set(participant.id, el);
                }
              }}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
              {participant.name}
            </div>
          </div>
        ))}
      </div>

      {/* Controles */}
      <div className="bg-gray-800 p-4 flex items-center justify-center gap-4">
        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full transition-colors ${
            isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
          }`}
          title={isAudioEnabled ? 'Silenciar' : 'Activar audio'}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isAudioEnabled ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            )}
          </svg>
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-colors ${
            isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
          }`}
          title={isVideoEnabled ? 'Desactivar cámara' : 'Activar cámara'}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isVideoEnabled ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            )}
          </svg>
        </button>
      </div>

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}
