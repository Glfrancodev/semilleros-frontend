import React, { useRef, useState } from "react";

type ImageItem = {
  idArchivo?: string;
  url?: string;
  urlFirmada?: string;
  nombre?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  images: ImageItem[];
  loading: boolean;
  uploading: boolean;
  onRefresh: () => void;
  onUpload: (file: File) => Promise<void> | void;
  onSelect: (url: string) => void;
};

const ImagePickerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  images,
  loading,
  uploading,
  onRefresh,
  onUpload,
  onSelect,
}) => {
  const [activeTab, setActiveTab] = useState<"existing" | "upload">("existing");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void onUpload(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="doc-image-modal">
      <div className="doc-image-modal__backdrop" onClick={onClose} />
      <div className="doc-image-modal__content">
        <div className="doc-image-modal__header">
          <h3>Seleccionar Imagen</h3>
          <button className="doc-image-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="doc-image-modal__tabs">
          <button
            className={activeTab === "existing" ? "is-active" : ""}
            onClick={() => setActiveTab("existing")}
          >
            Imágenes del Proyecto ({images.length})
          </button>
          <button
            className={activeTab === "upload" ? "is-active" : ""}
            onClick={() => setActiveTab("upload")}
          >
            Subir Nueva
          </button>
        </div>

        <div className="doc-image-modal__body">
          {activeTab === "existing" && (
            <>
              <div className="doc-image-modal__actions">
                <button onClick={onRefresh} className="doc-editor__btn ghost">
                  Recargar
                </button>
              </div>
              {loading ? (
                <div className="doc-image-modal__empty">Cargando imágenes...</div>
              ) : images.length === 0 ? (
                <div className="doc-image-modal__empty">
                  No hay imágenes en este proyecto.
                </div>
              ) : (
                <div className="doc-image-modal__grid">
                  {images.map((img) => {
                    const src = img.urlFirmada || img.url;
                    return (
                      <button
                        key={img.idArchivo || src}
                        className="doc-image-modal__thumb"
                        onClick={() => src && onSelect(src)}
                        title={img.nombre || ""}
                      >
                        {src ? (
                          <img src={src} alt={img.nombre || "imagen"} />
                        ) : (
                          <span>Sin URL</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === "upload" && (
            <div className="doc-image-modal__upload">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />
              <button
                className="doc-image-modal__upload-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Subiendo..." : "Elegir archivo"}
              </button>
              <p className="doc-image-modal__hint">Máximo 10MB. Formatos de imagen.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePickerModal;
