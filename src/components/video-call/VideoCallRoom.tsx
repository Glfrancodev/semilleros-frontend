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
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map()); // Streams remotos persistentes
  const isInitializedRef = useRef(false); // Bandera para evitar doble inicialización

  // Configuración de servidores STUN/TURN
  const iceServers = {
    iceServers: [
      // Servidores STUN de Google
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      // Servidor TURN público (para atravesar firewalls/NAT)
      {
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
      {
        urls: 'turn:openrelay.metered.ca:443',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
      {
        urls: 'turn:openrelay.metered.ca:443?transport=tcp',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
    ],
    iceCandidatePoolSize: 10,
  };

  useEffect(() => {
    let isActive = true;
    
    const setup = async () => {
      // Evitar doble inicialización en desarrollo (StrictMode)
      if (isInitializedRef.current) {
        console.log('⚠️ Componente ya inicializado, evitando duplicado');
        return;
      }
      
      if (isActive) {
        isInitializedRef.current = true;
        await initializeCall();
      }
    };
    
    setup();
    
    return () => {
      isActive = false;
      isInitializedRef.current = false;
      cleanup();
    };
  }, [proyectoId]); // Agregar proyectoId como dependencia

  const initializeCall = async () => {
    try {
      // Verificar HTTPS en producción
      if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        console.error('❌ WebRTC requiere HTTPS en producción');
        toast.error('Esta página debe servirse con HTTPS para usar la videollamada. Contacta al administrador.');
        onClose();
        return;
      }

      // Evitar inicialización duplicada
      if (socket?.connected) {
        console.log('⚠️ Ya hay una conexión activa, evitando duplicado');
        return;
      }

      // Obtener medios locales (cámara y micrófono)
      console.log('🎥 Solicitando permisos de cámara y micrófono...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
      });
      console.log('✅ Permisos otorgados. Tracks obtenidos:', stream.getTracks().map(t => `${t.kind}: ${t.label}`));

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
    } catch (error: any) {
      console.error('❌ Error al inicializar la llamada:', error);
      
      // Manejar errores específicos de permisos
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        toast.error('Permisos de cámara/micrófono denegados. Por favor, habilítalos en la configuración de tu navegador.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        toast.error('No se encontró cámara o micrófono. Verifica que estén conectados.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        toast.error('No se puede acceder a la cámara/micrófono. Puede estar en uso por otra aplicación.');
      } else if (error.name === 'OverconstrainedError') {
        toast.error('La configuración solicitada no es compatible con tus dispositivos.');
      } else {
        toast.error(`Error al inicializar videollamada: ${error.message || 'Error desconocido'}`);
      }
      
      // Cerrar y volver
      onClose();
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
    
    // Limpiar stream remoto
    const stream = remoteStreamsRef.current.get(userId);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      remoteStreamsRef.current.delete(userId);
    }
    
    // Cerrar conexión con ese usuario
    const peerConnection = peerConnectionsRef.current.get(userId);
    if (peerConnection) {
      peerConnection.close();
      peerConnectionsRef.current.delete(userId);
    }
    
    remoteVideosRef.current.delete(userId);
  };

  const handleParticipantsList = (participantsList: Participant[]) => {
    console.log(`📋 Lista de participantes recibida:`, participantsList.length, participantsList.map(p => p.name));
    setParticipants(participantsList);
    
    // Crear conexiones con usuarios existentes - ELLOS esperan nuestra oferta
    participantsList.forEach((participant) => {
      console.log(`🤝 Creando conexión y enviando oferta a participante existente:`, participant.name);
      createPeerConnection(participant.id, true); // Nosotros iniciamos (somos los que llegamos)
    });
  };

  const createPeerConnection = async (userId: string, shouldCreateOffer: boolean) => {
    try {
      console.log(`🔗 Creando peer connection con ${userId}, shouldCreateOffer:`, shouldCreateOffer);
      
      // Verificar que tengamos stream local antes de crear la conexión
      if (!localStreamRef.current) {
        console.error('❌ No hay stream local disponible para crear peer connection');
        return;
      }

      const peerConnection = new RTCPeerConnection(iceServers);
      peerConnectionsRef.current.set(userId, peerConnection);

      // Agregar stream local a la conexión
      const tracks = localStreamRef.current.getTracks();
      console.log(`🎥 Agregando ${tracks.length} tracks locales:`, tracks.map(t => `${t.kind} (${t.label}) - enabled: ${t.enabled}`));
      
      tracks.forEach((track) => {
        try {
          peerConnection.addTrack(track, localStreamRef.current!);
          console.log(`✅ Track ${track.kind} agregado correctamente:`, {
            label: track.label,
            enabled: track.enabled,
            readyState: track.readyState,
            muted: track.muted
          });
        } catch (err) {
          console.error(`❌ Error al agregar track ${track.kind}:`, err);
        }
      });

      // CRÍTICO: Manejar tracks remotos - USAR event.streams directamente (documentación oficial WebRTC)
      peerConnection.ontrack = (event) => {
        console.log(`📥 ¡¡¡ONTRACK DISPARADO!!! de ${userId}:`, {
          kind: event.track.kind,
          streams: event.streams.length,
          trackId: event.track.id,
          enabled: event.track.enabled
        });
        
        // SEGÚN LA DOCUMENTACIÓN OFICIAL: usar event.streams[0] directamente
        if (event.streams && event.streams[0]) {
          const remoteStream = event.streams[0];
          console.log(`🎬 Stream remoto recibido de ${userId}:`, {
            streamId: remoteStream.id,
            tracks: remoteStream.getTracks().length,
            trackTypes: remoteStream.getTracks().map(t => t.kind)
          });
          
          // Guardar referencia al stream
          remoteStreamsRef.current.set(userId, remoteStream);
          
          // Actualizar estado con el stream completo
          setParticipants((prev) => {
            const updated = prev.map((p) =>
              p.id === userId ? { ...p, stream: remoteStream } : p
            );
            console.log(`✅ Participante ${userId} actualizado con stream`);
            return updated;
          });
        } else {
          console.warn(`⚠️ No hay streams en el evento ontrack de ${userId}`);
        }
      };

      // Manejar estado de conexión
      peerConnection.onconnectionstatechange = () => {
        console.log(`🔌 Estado de conexión con ${userId}:`, peerConnection.connectionState);
        if (peerConnection.connectionState === 'failed') {
          console.error('❌ Conexión fallida con', userId);
          toast.error(`Conexión perdida con ${userId}`);
        } else if (peerConnection.connectionState === 'connected') {
          console.log('✅ ¡¡¡CONEXIÓN ESTABLECIDA CON!!!', userId);
          console.log('📊 Estado actual de la peer connection:', {
            connectionState: peerConnection.connectionState,
            iceConnectionState: peerConnection.iceConnectionState,
            signalingState: peerConnection.signalingState,
            localTracks: peerConnection.getSenders().map(s => s.track ? `${s.track.kind} (enabled: ${s.track.enabled})` : 'no track'),
            remoteTracks: peerConnection.getReceivers().map(r => r.track ? `${r.track.kind} (enabled: ${r.track.enabled})` : 'no track')
          });
          toast.success(`Conectado con ${userId}`);
        }
      };

      // Manejar estado de ICE
      peerConnection.oniceconnectionstatechange = () => {
        console.log(`🧊 Estado ICE con ${userId}:`, peerConnection.iceConnectionState);
      };

      // Manejar errores de negociación
      peerConnection.onnegotiationneeded = async () => {
        console.log('🔄 Negociación necesaria con', userId);
      };

      // Manejar candidatos ICE
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(`🧊 ICE Candidate generado para ${userId}:`, {
            type: event.candidate.type,
            protocol: event.candidate.protocol,
            address: event.candidate.address,
            relatedAddress: event.candidate.relatedAddress
          });
          if (socket) {
            socket.emit('video-ice-candidate', {
              candidate: event.candidate,
              to: userId,
            });
          }
        } else {
          console.log(`🧊 Todos los ICE candidates enviados para ${userId}`);
          // Cuando terminan los candidates, verificar receivers
          setTimeout(() => {
            const receivers = peerConnection.getReceivers();
            console.log(`📊 Verificación post-ICE para ${userId}:`, {
              receivers: receivers.length,
              tracks: receivers.map(r => r.track ? `${r.track.kind} (id: ${r.track.id})` : 'null')
            });
          }, 1000);
        }
      };

      // Si somos el iniciador, crear oferta
      if (shouldCreateOffer) {
        console.log(`📤 Creando oferta para ${userId}...`);
        console.log(`📊 Tracks agregados antes de crear oferta:`, peerConnection.getSenders().map(s => s.track ? `${s.track.kind}` : 'null'));
        
        const offer = await peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        });
        console.log(`📝 Oferta creada:`, {
          type: offer.type,
          sdpHasAudio: offer.sdp?.includes('m=audio'),
          sdpHasVideo: offer.sdp?.includes('m=video')
        });
        
        await peerConnection.setLocalDescription(offer);
        console.log(`✅ Local description establecida, enviando oferta a ${userId}`);
        
        socket?.emit('video-offer', {
          offer,
          to: userId,
        });
        console.log(`📨 Oferta enviada exitosamente a ${userId}`);
      } else {
        console.log(`⏸️ No creando oferta para ${userId} (shouldCreateOffer: false) - esperando oferta remota`);
      }
    } catch (error) {
      console.error('❌ Error al crear peer connection:', error);
    }
  };

  const handleOffer = async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
    try {
      console.log(`📨 ===== OFERTA RECIBIDA DE ${from} =====`, {
        type: offer.type,
        hasAudio: offer.sdp?.includes('m=audio'),
        hasVideo: offer.sdp?.includes('m=video')
      });
      
      let peerConnection = peerConnectionsRef.current.get(from);
      
      // CRÍTICO: Si no existe la conexión, crearla COMPLETAMENTE (con todos los handlers) ANTES de setRemoteDescription
      if (!peerConnection) {
        console.log(`🔨 Peer connection NO existe para ${from} - creando AHORA con todos los handlers`);
        await createPeerConnection(from, false); // Esto configura ontrack ANTES de setRemoteDescription
        peerConnection = peerConnectionsRef.current.get(from);
        
        if (!peerConnection) {
          console.error(`❌ FATAL: No se pudo crear peer connection para ${from}`);
          return;
        }
        console.log(`✅ Peer connection creada exitosamente para ${from} con ontrack ya configurado`);
      }

      console.log(`📝 Estableciendo remote description (offer) para ${from}...`);
      console.log(`🎯 ontrack handler existe:`, !!peerConnection.ontrack);
      
      // AHORA sí, con ontrack ya configurado, establecer remote description
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      console.log(`✅ Remote description establecida - ontrack debería dispararse si hay tracks`);
      
      console.log(`💬 Creando answer para ${from}...`);
      console.log(`📊 Tracks locales en peer:`, peerConnection.getSenders().map(s => s.track ? `${s.track.kind}` : 'null'));
      
      const answer = await peerConnection.createAnswer();
      console.log(`📝 Answer creada:`, {
        type: answer.type,
        hasAudio: answer.sdp?.includes('m=audio'),
        hasVideo: answer.sdp?.includes('m=video')
      });
      
      await peerConnection.setLocalDescription(answer);
      console.log(`✅ Local description (answer) establecida`);
      
      console.log(`📤 Enviando answer a ${from}`);
      socket?.emit('video-answer', {
        answer,
        to: from,
      });
      console.log(`📨 ===== ANSWER ENVIADA A ${from} =====`);
    } catch (error) {
      console.error('❌ Error al manejar oferta:', error);
    }
  };

  const handleAnswer = async ({ answer, from }: { answer: RTCSessionDescriptionInit; from: string }) => {
    try {
      console.log(`📨 Answer recibida de ${from}`, {
        type: answer.type,
        hasAudio: answer.sdp?.includes('m=audio'),
        hasVideo: answer.sdp?.includes('m=video')
      });
      
      const peerConnection = peerConnectionsRef.current.get(from);
      if (peerConnection) {
        if (peerConnection.signalingState === 'have-local-offer') {
          console.log(`📝 Estableciendo remote description (answer) para ${from}`);
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          console.log(`✅ Answer procesada correctamente para ${from}`);
          
          // Verificar receivers después de establecer remote description
          setTimeout(() => {
            const receivers = peerConnection.getReceivers();
            console.log(`📊 Receivers después de answer de ${from}:`, {
              count: receivers.length,
              tracks: receivers.map(r => ({
                kind: r.track?.kind,
                id: r.track?.id,
                enabled: r.track?.enabled,
                readyState: r.track?.readyState
              }))
            });
            
            // Si hay receivers pero no se disparó ontrack, forzar manualmente
            if (receivers.length > 0 && receivers.some(r => r.track)) {
              console.warn(`⚠️ Forzando procesamiento manual de tracks para ${from}`);
              const remoteStream = new MediaStream();
              receivers.forEach(receiver => {
                if (receiver.track) {
                  remoteStream.addTrack(receiver.track);
                  console.log(`➕ Track agregado manualmente: ${receiver.track.kind}`);
                }
              });
              
              if (remoteStream.getTracks().length > 0) {
                console.log(`🎬 Stream creado manualmente para ${from}:`, {
                  tracks: remoteStream.getTracks().length,
                  active: remoteStream.active
                });
                setParticipants((prev) => {
                  const updated = prev.map((p) =>
                    p.id === from ? { ...p, stream: remoteStream } : p
                  );
                  console.log(`🔄 Participantes actualizados MANUALMENTE:`, updated.map(p => ({ id: p.id, hasStream: !!p.stream })));
                  return updated;
                });
              }
            }
          }, 500);
        } else {
          console.warn(`⚠️ Estado de señalización incorrecto para ${from}:`, peerConnection.signalingState);
        }
      } else {
        console.error(`❌ No se encontró peer connection para ${from}`);
      }
    } catch (error) {
      console.error('❌ Error al manejar respuesta:', error);
    }
  };

  const handleIceCandidate = async ({ candidate, from }: { candidate: RTCIceCandidateInit; from: string }) => {
    try {
      console.log(`🧊 ICE Candidate recibido de ${from}:`, candidate.candidate?.substring(0, 50) + '...');
      const peerConnection = peerConnectionsRef.current.get(from);
      if (peerConnection) {
        if (peerConnection.remoteDescription) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          console.log(`✅ ICE Candidate agregado para ${from}`);
        } else {
          console.warn(`⚠️ Esperando remote description para agregar ICE candidate de ${from}`);
        }
      } else {
        console.error(`❌ No se encontró peer connection para agregar ICE candidate de ${from}`);
      }
    } catch (error) {
      console.error('❌ Error al agregar candidato ICE:', error);
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
    console.log('🧹 Limpiando recursos de videollamada...');
    
    // Detener todos los tracks locales
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log('⏹️ Track detenido:', track.kind);
      });
      localStreamRef.current = null;
    }
    
    // Limpiar streams remotos
    remoteStreamsRef.current.forEach((stream, userId) => {
      stream.getTracks().forEach(track => track.stop());
      console.log('⏹️ Stream remoto detenido:', userId);
    });
    remoteStreamsRef.current.clear();
    
    // Cerrar todas las conexiones peer
    peerConnectionsRef.current.forEach((pc, userId) => {
      console.log('🔌 Cerrando conexión peer con:', userId);
      pc.close();
    });
    peerConnectionsRef.current.clear();
    
    // Desconectar socket
    if (socket) {
      console.log('👋 Saliendo de la sala:', proyectoId);
      socket.emit('leave-video-room', { proyectoId });
      socket.off(); // Remover todos los listeners
      socket.disconnect();
      setSocket(null);
    }
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
                  el.play().catch(err => {
                    console.error(`❌ Error al reproducir video de ${participant.name}:`, err);
                  });
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
            {!participant.stream && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="text-center px-4">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-700 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="text-white text-sm font-medium mb-1">{participant.name}</div>
                  <div className="text-gray-400 text-xs animate-pulse">Conectando...</div>
                </div>
              </div>
            )}
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
