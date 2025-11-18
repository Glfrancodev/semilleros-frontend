import { useEffect, useRef, useState, useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TextAlign from "@tiptap/extension-text-align";
import ResizeImage from "tiptap-extension-resize-image";
import type { JSONContent } from "@tiptap/core";
import clsx from "clsx";
import { io, type Socket } from "socket.io-client";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { ThemeToggleButton } from "../../common/ThemeToggleButton";
import {
  actualizarContenidoProyecto,
  obtenerImagenesContenido,
  subirImagenEditor,
  eliminarImagen,
} from "../../../services/proyectoService";
import ImagePickerModal from "./ImagePickerModal";
import "./editor.css";

type DocumentEditorProps = {
  idProyecto: string;
  initialContent?: JSONContent | null;
  className?: string;
};

const DEFAULT_CONTENT: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Comienza a escribir tu proyecto aquí...",
        },
      ],
    },
  ],
};

const HIGHLIGHT_COLORS = [
  { label: "Verde", value: "#bbf7d0" },
  { label: "Azul", value: "#bfdbfe" },
  { label: "Rosa", value: "#fecdd3" },
  { label: "Lila", value: "#e9d5ff" },
  { label: "Amarillo", value: "#fef08a" },
];

const TaskIcon = () => (
  <span className="doc-editor__icon-task">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="16" rx="3" ry="3" />
      <path d="M9 12.5l2.5 2.5 4.5-4.5" />
    </svg>
  </span>
);
const HighlightIcon = ({ color }: { color?: string | null }) => (
  <span
    className="doc-editor__icon-highlight"
    style={{
      backgroundColor: color || "transparent",
      color: color ? "#0f172a" : "currentColor",
    }}
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21h6" />
      <path d="M3 17l9.5-9.5c.3-.3.7-.3 1 0l2 2c.3.3.3.7 0 1L6 20H3v-3z" />
      <path d="M14 7l3-3 2 2-3 3" />
    </svg>
  </span>
);

export const DocumentEditor = ({
  idProyecto,
  initialContent,
  className,
}: DocumentEditorProps) => {
  const { theme } = useTheme();
  const { token } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasPendingChangesRef = useRef(false);
  const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false });
  const [isHeadingOpen, setIsHeadingOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isHighlightOpen, setIsHighlightOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const ignoreRemoteRef = useRef(false);
  const [projectImages, setProjectImages] = useState<
    Array<{ idArchivo: string; url?: string; urlFirmada?: string; nombre?: string }>
  >([]);
  const [isImagesLoading, setIsImagesLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeUsers, setActiveUsers] = useState<
    Array<{ id: string; email: string; nombre: string; iniciales: string; foto: string | null }>
  >([]);
  const [remoteCursors, setRemoteCursors] = useState<
    Map<string, { 
      userId: string; 
      nombre: string; 
      iniciales: string; 
      x: number; 
      y: number;
      height?: number;
      selection?: { x: number; y: number; width: number; height: number } | 
                   { fromX: number; fromY: number; toX: number; toY: number };
    }>
  >(new Map());
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const [containerReady, setContainerReady] = useState(false);

  // Marcar cuando el contenedor está listo
  useEffect(() => {
    if (editorContainerRef.current) {
      setContainerReady(true);
    }
  }, [editorContainerRef.current]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Superscript,
      Subscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      ResizeImage.configure({
        allowBase64: false,
        inline: false,
        HTMLAttributes: {
          class: "doc-editor__image",
        },
      }),
    ],
    content: initialContent ?? DEFAULT_CONTENT,
    editorProps: {
      attributes: {
        class: "doc-editor__prose",
        spellcheck: "true",
        "aria-label": "Editor de documento",
      },
    },
  });

  // Auto-guardado
  useEffect(() => {
    if (!editor) return;
    const saveNow = async () => {
      if (!hasPendingChangesRef.current) return;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      try {
        setIsSaving(true);
        const contenido = editor.getJSON();
        await actualizarContenidoProyecto(idProyecto, contenido);
        setLastSaved(new Date());
        hasPendingChangesRef.current = false;
      } catch (error) {
        console.error("Error al guardar contenido:", error);
      } finally {
        setIsSaving(false);
      }
    };

    const handleChange = () => {
      hasPendingChangesRef.current = true;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => void saveNow(), 5000);

      // Propagar cambios a colaboradores si no provienen de una actualización remota
      if (!ignoreRemoteRef.current && socketRef.current) {
        socketRef.current.emit("content-change", {
          documentId: idProyecto,
          documentType: "proyecto",
          content: editor.getJSON(),
        });
      }

      // Limpiar la bandera tras manejar la actualización remota
      if (ignoreRemoteRef.current) {
        ignoreRemoteRef.current = false;
      }
    };

    const handlePageHide = () => void saveNow();

    editor.on("transaction", handleChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);

    return () => {
      editor.off("transaction", handleChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      void saveNow();
    };
  }, [editor, idProyecto]);

  // Undo/redo state
  useEffect(() => {
    if (!editor) return;
    const updateHistoryState = () => {
      setHistoryState({
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
      });
    };
    updateHistoryState();
    editor.on("transaction", updateHistoryState);
    editor.on("selectionUpdate", updateHistoryState);
    return () => {
      editor.off("transaction", updateHistoryState);
      editor.off("selectionUpdate", updateHistoryState);
    };
  }, [editor]);

  // Función para navegar al cursor de un usuario
  const scrollToUser = useCallback((userId: string) => {
    const cursorData = remoteCursors.get(userId);
    
    if (!cursorData) {
      return;
    }
    
    if (!editorContainerRef.current) {
      return;
    }

    // Hacer scroll basado en las coordenadas almacenadas del cursor remoto
    const container = editorContainerRef.current;
    const targetY = cursorData.y; // Esta es la posición relativa al contenedor visible
    const currentScrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    
    // El targetY ya es relativo a la vista actual del contenedor
    // Necesitamos calcular la posición absoluta dentro del documento
    const absoluteY = targetY + currentScrollTop;
    
    // Calcular el scroll para centrar el cursor en la vista
    const newScrollTop = absoluteY - containerHeight / 2;
    
    container.scrollTo({
      top: Math.max(0, newScrollTop),
      behavior: 'smooth',
    });
  }, [editor, remoteCursors]);

  // Enviar posición del cursor
  useEffect(() => {
    if (!editor || !socketRef.current) {
      return;
    }
    let lastSentTime = 0;
    const THROTTLE_MS = 50; // Enviar más frecuentemente

    const handleSelectionUpdate = () => {
      const now = Date.now();
      if (now - lastSentTime < THROTTLE_MS) return;
      lastSentTime = now;

      const container = editorContainerRef.current;
      if (!container) {
        return;
      }

      const { state } = editor;
      const { selection } = state;
      const { from } = selection;

      try {
        // Obtener la posición DOM del cursor
        const coords = editor.view.coordsAtPos(from);

        // Calcular posición relativa al contenedor del documento
        const containerRect = container.getBoundingClientRect();
        const relativeX = coords.left - containerRect.left;
        const relativeY = coords.top - containerRect.top;
        const cursorHeight = coords.bottom - coords.top;

        // Preparar datos de posición
        const positionData: any = { 
          x: relativeX, 
          y: relativeY,
          height: cursorHeight 
        };

        // Si hay selección (no es solo cursor), agregar información de selección
        if (selection.from !== selection.to) {
          const fromCoords = editor.view.coordsAtPos(selection.from);
          const toCoords = editor.view.coordsAtPos(selection.to);
          
          // Calcular el rectángulo de selección usando el DOM
          const range = document.createRange();
          const domSelection = editor.view.domAtPos(selection.from);
          const domEnd = editor.view.domAtPos(selection.to);
          
          try {
            range.setStart(domSelection.node, domSelection.offset);
            range.setEnd(domEnd.node, domEnd.offset);
            const rects = range.getBoundingClientRect();
            
            positionData.selection = {
              x: rects.left - containerRect.left,
              y: rects.top - containerRect.top,
              width: rects.width,
              height: rects.height,
            };
          } catch (e) {
            // Fallback a cálculo por coordenadas
            positionData.selection = {
              fromX: fromCoords.left - containerRect.left,
              fromY: fromCoords.top - containerRect.top,
              toX: toCoords.left - containerRect.left,
              toY: toCoords.bottom - containerRect.top,
            };
          }
        }

        // Enviar posición
        socketRef.current?.emit("cursor-position", {
          documentId: idProyecto,
          documentType: "proyecto",
          position: positionData,
        });
      } catch (error) {
        // Ignorar errores de coordenadas
      }
    };

    // Escuchar múltiples eventos para capturar todos los movimientos
    editor.on("selectionUpdate", handleSelectionUpdate);
    editor.on("transaction", handleSelectionUpdate);
    editor.on("focus", handleSelectionUpdate);
    editor.on("update", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
      editor.off("transaction", handleSelectionUpdate);
      editor.off("focus", handleSelectionUpdate);
      editor.off("update", handleSelectionUpdate);
    };
  }, [editor, idProyecto, containerReady]);

  // Conexión de colaboración en tiempo real
  useEffect(() => {
    if (!editor || !token) {
      return;
    }

    // Obtener la URL base del backend sin /api
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const socketUrl = apiUrl.replace(/\/api\/?$/, "");

    const socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-document", { documentId: idProyecto, documentType: "proyecto" });
    });

    socket.on("connect_error", () => {
      // Error de conexión silenciado
    });

    socket.on("content-update", ({ content }) => {
      if (!content) return;
      ignoreRemoteRef.current = true;
      editor.commands.setContent(content, { emitUpdate: false });
    });

    socket.on("active-users", (users) => {
      setActiveUsers(users || []);
      
      // Limpiar cursores de usuarios que ya no están activos
      setRemoteCursors((prev) => {
        const updated = new Map(prev);
        const activeUserIds = new Set(users.map((u: any) => u.id));
        
        // Eliminar cursores de usuarios que ya no están en la lista
        for (const userId of updated.keys()) {
          if (!activeUserIds.has(userId)) {
            updated.delete(userId);
          }
        }
        
        return updated;
      });
    });

    socket.on("cursor-update", ({ userId, userNombre, userIniciales, position }) => {
      if (!position) {
        return;
      }
      
      setRemoteCursors((prev) => {
        const updated = new Map(prev);
        updated.set(userId, {
          userId,
          nombre: userNombre,
          iniciales: userIniciales,
          x: position.x,
          y: position.y,
          height: position.height,
          selection: position.selection,
        });
        return updated;
      });
    });

    socket.on("disconnect", () => {
      // Limpiar todos los cursores cuando se desconecta
      setRemoteCursors(new Map());
    });

    return () => {
      socket.emit("leave-document", { documentId: idProyecto, documentType: "proyecto" });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [editor, idProyecto, token]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headingRef.current && !headingRef.current.contains(event.target as Node)) {
        setIsHeadingOpen(false);
      }
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setIsListOpen(false);
      }
      if (highlightRef.current && !highlightRef.current.contains(event.target as Node)) {
        setIsHighlightOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isImageModalOpen) {
      void fetchProjectImages();
    }
  }, [isImageModalOpen]);

  const headingLevels: Array<{ level: 1 | 2 | 3 | 4 | 5; label: string }> = [
    { level: 1, label: "H1" },
    { level: 2, label: "H2" },
    { level: 3, label: "H3" },
    { level: 4, label: "H4" },
    { level: 5, label: "H5" },
  ];

  const activeHeading =
    headingLevels.find(({ level }) => editor?.isActive("heading", { level }))?.label || "P";

  const isCodeActive = editor?.isActive("code") || editor?.isActive("codeBlock");
  const currentHighlight = editor?.getAttributes("highlight")?.color || null;

  const listOptions = [
    {
      key: "none",
      label: "Lista",
      display: "–",
      action: () => editor?.chain().focus().setParagraph().run(),
    },
    {
      key: "bullet",
      label: "Lista",
      display: "•",
      action: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      key: "ordered",
      label: "Lista",
      display: "1.",
      action: () => editor?.chain().focus().toggleOrderedList().run(),
    },
    {
      key: "task",
      label: "Lista",
      display: <TaskIcon />,
      action: () => editor?.chain().focus().toggleTaskList().run(),
    },
  ] as const;

  const activeListOption =
    editor?.isActive("taskList")
      ? listOptions[3]
      : editor?.isActive("orderedList")
      ? listOptions[2]
      : editor?.isActive("bulletList")
      ? listOptions[1]
      : listOptions[0];

  const fetchProjectImages = async () => {
    try {
      setIsImagesLoading(true);
      const imgs = await obtenerImagenesContenido(idProyecto);
      setProjectImages(imgs || []);
    } catch (error) {
      console.error("Error al obtener imágenes:", error);
    } finally {
      setIsImagesLoading(false);
    }
  };

  const handleInsertImage = (src: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src }).run();
  };

  const handleUploadImage = async (file: File) => {
    try {
      setIsUploadingImage(true);
      const { url } = await subirImagenEditor(idProyecto, file);
      await fetchProjectImages();
      handleInsertImage(url);
      setIsImageModalOpen(false);
    } catch (error) {
      console.error("Error al subir imagen:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteImage = async (idArchivo: string) => {
    try {
      setIsImagesLoading(true);
      await eliminarImagen(idArchivo);
      await fetchProjectImages();
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
    } finally {
      setIsImagesLoading(false);
    }
  };

  // Generar color único basado en userId
  const getUserColor = (userId: string) => {
    const colors = [
      { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", light: "#667eea" },
      { bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", light: "#f093fb" },
      { bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", light: "#4facfe" },
      { bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", light: "#43e97b" },
      { bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", light: "#fa709a" },
      { bg: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)", light: "#30cfd0" },
      { bg: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", light: "#a8edea" },
      { bg: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", light: "#ff9a9e" },
    ];
    
    // Hash simple del userId para obtener un índice consistente
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash = hash & hash;
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  if (!editor) {
    return (
      <div className="doc-editor__wrapper">
        <div className="doc-editor__surface">
          <div className="doc-editor__page">
            <p className="doc-editor__loading">Cargando editor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("doc-editor__wrapper", theme === "dark" && "is-dark", className)}>
      <div className="doc-editor__toolbar">
        <div className="doc-editor__toolbar-inner">
          <button
            type="button"
            className="doc-editor__btn"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!historyState.canUndo}
            aria-label="Deshacer"
            title="Deshacer"
          >
            ↺
          </button>
          <button
            type="button"
            className="doc-editor__btn"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!historyState.canRedo}
            aria-label="Rehacer"
            title="Rehacer"
          >
            ↻
          </button>
          <div className="doc-editor__toolbar-divider" />

          <div className="doc-editor__dropdown" ref={headingRef}>
            <button
              type="button"
              className="doc-editor__btn"
              onClick={() => setIsHeadingOpen((prev) => !prev)}
              aria-label="Seleccionar encabezado"
              title="Seleccionar encabezado"
            >
              {activeHeading}
            </button>
            {isHeadingOpen && (
              <div className="doc-editor__dropdown-menu">
                {headingLevels.map(({ level, label }) => {
                  const isActive = editor.isActive("heading", { level });
                  return (
                    <button
                      key={level}
                      type="button"
                      className={clsx("doc-editor__dropdown-item", isActive && "is-active")}
                      onClick={() => {
                        editor.chain().focus().toggleHeading({ level }).run();
                        setIsHeadingOpen(false);
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="doc-editor__toolbar-divider" />

          <div className="doc-editor__dropdown" ref={listRef}>
            <button
              type="button"
              className="doc-editor__btn"
              onClick={() => setIsListOpen((prev) => !prev)}
              aria-label="Seleccionar tipo de lista"
              title="Seleccionar tipo de lista"
            >
              <span className="doc-editor__list-icon">{activeListOption.display}</span>
              <span className="doc-editor__list-text">Lista</span>
            </button>
            {isListOpen && (
              <div className="doc-editor__dropdown-menu">
                {listOptions.map((opt) => {
                  const isActive =
                    (opt.key === "bullet" && editor.isActive("bulletList")) ||
                    (opt.key === "ordered" && editor.isActive("orderedList")) ||
                    (opt.key === "task" && editor.isActive("taskList")) ||
                    (opt.key === "none" &&
                      !editor.isActive("bulletList") &&
                      !editor.isActive("orderedList") &&
                      !editor.isActive("taskList"));
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      className={clsx("doc-editor__dropdown-item", isActive && "is-active")}
                      onClick={() => {
                        opt.action();
                        setIsListOpen(false);
                      }}
                      aria-label={opt.label}
                      title={opt.label}
                    >
                      <span className="doc-editor__list-icon">{opt.display}</span>
                      <span className="doc-editor__list-text">Lista</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="doc-editor__toolbar-divider" />

          <button
            type="button"
            className={clsx("doc-editor__btn", editor.isActive("blockquote") && "is-active")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            aria-label="Cita"
            title="Cita"
          >
            “”
          </button>

          <div className="doc-editor__toolbar-divider" />
          <button
            type="button"
            className={clsx("doc-editor__btn", editor.isActive("bold") && "is-active")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!!isCodeActive}
            aria-label="Negrita"
            title="Negrita"
          >
            <span className="doc-editor__icon-bold">B</span>
          </button>
          <button
            type="button"
            className={clsx("doc-editor__btn", editor.isActive("italic") && "is-active")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!!isCodeActive}
            aria-label="Cursiva"
            title="Cursiva"
          >
            <span className="doc-editor__icon-italic">I</span>
          </button>
          <button
            type="button"
            className={clsx("doc-editor__btn", editor.isActive("strike") && "is-active")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!!isCodeActive}
            aria-label="Tachado"
            title="Tachado"
          >
            <span className="doc-editor__icon-strike">S</span>
          </button>
          <button
            type="button"
            className={clsx("doc-editor__btn", editor.isActive("underline") && "is-active")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!!isCodeActive}
            aria-label="Subrayado"
            title="Subrayado"
          >
            <span className="doc-editor__icon-underline">U</span>
          </button>

          <div className="doc-editor__dropdown" ref={highlightRef}>
          <button
            type="button"
            className={clsx("doc-editor__btn", editor.isActive("highlight") && "is-active")}
            onClick={() => setIsHighlightOpen((prev) => !prev)}
            disabled={!!isCodeActive}
            aria-label="Resaltar"
            title="Resaltar"
          >
            <HighlightIcon color={currentHighlight} />
          </button>
          {isHighlightOpen && (
            <div className="doc-editor__dropdown-menu doc-editor__highlight-menu">
              {HIGHLIGHT_COLORS.map((opt) => {
                const isActive = currentHighlight === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={clsx("doc-editor__color-dot", isActive && "is-active")}
                      style={{ backgroundColor: opt.value }}
                      onClick={() => {
                        editor.chain().focus().setHighlight({ color: opt.value }).run();
                        setIsHighlightOpen(false);
                      }}
                      aria-label={opt.label}
                      title={opt.label}
                    />
                  );
                })}
                <span className="doc-editor__highlight-separator" />
                <button
                  type="button"
                  className="doc-editor__color-dot doc-editor__color-reset"
                  onClick={() => {
                    editor.chain().focus().unsetHighlight().run();
                    setIsHighlightOpen(false);
                  }}
                  aria-label="Sin resaltado"
                  title="Sin resaltado"
                >
                  ⌀
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className={clsx("doc-editor__btn", editor.isActive("codeBlock") && "is-active")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            aria-label="Bloque de código"
            title="Bloque de código"
          >
            <span className="doc-editor__icon-code">{`</>`}</span>
          </button>
          <button
            type="button"
            className={clsx("doc-editor__btn", editor.isActive("superscript") && "is-active")}
            onClick={() => {
              editor.commands.unsetSubscript();
              editor.chain().focus().toggleSuperscript().run();
            }}
            disabled={!!isCodeActive}
            aria-label="Superíndice"
            title="Superíndice"
          >
            x<sup>2</sup>
          </button>
          <button
            type="button"
            className={clsx("doc-editor__btn", editor.isActive("subscript") && "is-active")}
            onClick={() => {
              editor.commands.unsetSuperscript();
              editor.chain().focus().toggleSubscript().run();
            }}
            disabled={!!isCodeActive}
            aria-label="Subíndice"
            title="Subíndice"
          >
            x<sub>2</sub>
          </button>
          <div className="doc-editor__toolbar-divider" />
          <button
            type="button"
            className="doc-editor__btn"
            onClick={() => {
              setIsImageModalOpen(true);
              if (!projectImages.length) {
                void fetchProjectImages();
              }
            }}
            aria-label="Añadir imagen"
            title="Añadir imagen"
          >
            <span className="doc-editor__icon-image" />
          </button>
          <div className="doc-editor__toolbar-divider" />
          <button
            type="button"
            className={clsx(
              "doc-editor__btn",
              editor.isActive({ textAlign: "left" }) && "is-active"
            )}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            aria-label="Alinear a la izquierda"
            title="Alinear a la izquierda"
          >
            <span className="doc-editor__icon-align doc-editor__icon-align-left" />
          </button>
          <button
            type="button"
            className={clsx(
              "doc-editor__btn",
              editor.isActive({ textAlign: "center" }) && "is-active"
            )}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            aria-label="Centrar"
            title="Centrar"
          >
            <span className="doc-editor__icon-align doc-editor__icon-align-center" />
          </button>
          <button
            type="button"
            className={clsx(
              "doc-editor__btn",
              editor.isActive({ textAlign: "right" }) && "is-active"
            )}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            aria-label="Alinear a la derecha"
            title="Alinear a la derecha"
          >
            <span className="doc-editor__icon-align doc-editor__icon-align-right" />
          </button>
          <button
            type="button"
            className={clsx(
              "doc-editor__btn",
              editor.isActive({ textAlign: "justify" }) && "is-active"
            )}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            aria-label="Justificar"
            title="Justificar"
          >
            <span className="doc-editor__icon-align doc-editor__icon-align-justify" />
          </button>
          <div className="doc-editor__toolbar-divider" />
          {activeUsers.length > 0 && (
            <>
              <div className="doc-editor__active-users">
                {activeUsers.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="doc-editor__user-avatar"
                    title={`${user.nombre} - ${user.email}`}
                    onClick={() => scrollToUser(user.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {user.foto ? (
                      <img src={user.foto} alt={user.nombre} className="doc-editor__user-photo" />
                    ) : (
                      <span className="doc-editor__user-initials">{user.iniciales}</span>
                    )}
                  </div>
                ))}
                {activeUsers.length > 5 && (
                  <div className="doc-editor__user-avatar" title={`+${activeUsers.length - 5} más`}>
                    <span className="doc-editor__user-initials">+{activeUsers.length - 5}</span>
                  </div>
                )}
              </div>
              <div className="doc-editor__toolbar-divider" />
            </>
          )}
          <div className="doc-editor__theme-toggle-wrapper">
            <ThemeToggleButton />
          </div>
        </div>
      </div>

      <div className="doc-editor__surface" ref={editorContainerRef}>
        <div className="doc-editor__page">
          <EditorContent editor={editor} />
          
          {/* Cursores remotos */}
          {Array.from(remoteCursors.values()).map((cursor) => {
            const color = getUserColor(cursor.userId);
            const rectSelection = cursor.selection && 'width' in cursor.selection ? cursor.selection : null;
            const coordSelection = cursor.selection && 'fromX' in cursor.selection ? cursor.selection : null;
            
            return (
              <div key={cursor.userId}>
                {/* Selección de texto - formato bounding box */}
                {rectSelection && (
                  <div
                    className="doc-editor__remote-selection"
                    style={{
                      position: 'absolute',
                      left: `${rectSelection.x}px`,
                      top: `${rectSelection.y}px`,
                      width: `${rectSelection.width}px`,
                      height: `${rectSelection.height}px`,
                      background: color.light,
                      opacity: 0.3,
                      pointerEvents: 'none',
                      zIndex: 9998,
                      borderRadius: '2px',
                    }}
                  />
                )}
                
                {/* Selección de texto - formato coordenadas (fallback) */}
                {coordSelection && (
                  <div
                    className="doc-editor__remote-selection"
                    style={{
                      position: 'absolute',
                      left: `${Math.min(coordSelection.fromX, coordSelection.toX)}px`,
                      top: `${Math.min(coordSelection.fromY, coordSelection.toY)}px`,
                      width: `${Math.abs(coordSelection.toX - coordSelection.fromX)}px`,
                      height: `${Math.abs(coordSelection.toY - coordSelection.fromY)}px`,
                      background: color.light,
                      opacity: 0.3,
                      pointerEvents: 'none',
                      zIndex: 9998,
                      borderRadius: '2px',
                    }}
                  />
                )}
                
                {/* Cursor */}
                <div
                  className="doc-editor__remote-cursor"
                  style={{
                    left: `${cursor.x}px`,
                    top: `${cursor.y}px`,
                    position: 'absolute',
                    zIndex: 9999,
                    pointerEvents: 'none',
                  }}
                >
                  <div 
                    className="doc-editor__cursor-line"
                    style={{ 
                      background: color.bg,
                      width: '2px',
                      height: cursor.height ? `${cursor.height}px` : '1.4em',
                      borderRadius: '1px',
                    }}
                  />
                  <div 
                    className="doc-editor__cursor-label"
                    style={{ 
                      background: color.bg,
                      color: '#fff',
                      padding: '2px 6px',
                      fontSize: '10px',
                      position: 'absolute',
                      top: '-22px',
                      left: '0',
                      whiteSpace: 'nowrap',
                      borderRadius: '3px',
                      fontWeight: 600,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {cursor.iniciales}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="doc-editor__status">
        {isSaving
          ? "Guardando..."
          : lastSaved
          ? `Guardado: ${lastSaved.toLocaleTimeString()}`
          : "Sin cambios guardados aún"}
      </div>

      <ImagePickerModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={projectImages}
        loading={isImagesLoading}
        uploading={isUploadingImage}
        onRefresh={() => void fetchProjectImages()}
        onUpload={handleUploadImage}
        onDelete={handleDeleteImage}
        onSelect={(url) => {
          handleInsertImage(url);
          setIsImageModalOpen(false);
        }}
      />
    </div>
  );
};

export default DocumentEditor;



