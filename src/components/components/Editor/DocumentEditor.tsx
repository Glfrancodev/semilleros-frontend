import { useEffect, useRef, useState } from "react";
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
import { useTheme } from "../../../context/ThemeContext";
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
  const [projectImages, setProjectImages] = useState<
    Array<{ idArchivo: string; url?: string; urlFirmada?: string; nombre?: string }>
  >([]);
  const [isImagesLoading, setIsImagesLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
          <div className="doc-editor__theme-toggle-wrapper">
            <ThemeToggleButton />
          </div>
        </div>
      </div>

      <div className="doc-editor__surface">
        <div className="doc-editor__page">
          <EditorContent editor={editor} />
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



