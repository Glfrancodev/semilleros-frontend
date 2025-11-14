import { useState, useRef } from "react";
import { useParams } from "react-router-dom";

export default function DocumentoEditorPage() {
  const { idProyecto } = useParams<{ idProyecto: string }>();
  const [numeroPaginas, setNumeroPaginas] = useState(1);
  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tamaño carta: 8.5 x 11 pulgadas = 816 x 1056 px a 96 DPI
  // Márgenes APA 7: 1 pulgada en todos los lados = 96px
  const MARGEN = 96; // 1 pulgada
  const ANCHO_PAGINA = 816; // 8.5 pulgadas
  const ALTO_PAGINA = 1056; // 11 pulgadas
  const ALTO_CONTENIDO = ALTO_PAGINA - MARGEN * 2; // 864px
  const INTERLINEADO = 2; // Doble espacio APA 7

  const handleInput = () => {
    if (!editorRef.current) return;
    
    // Calcular cuántas páginas necesitamos
    const alturaTotal = editorRef.current.scrollHeight;
    const paginasNecesarias = Math.max(1, Math.ceil(alturaTotal / ALTO_CONTENIDO));
    
    if (paginasNecesarias !== numeroPaginas) {
      setNumeroPaginas(paginasNecesarias);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      {/* Contenedor de páginas */}
      <div 
        className="mx-auto relative" 
        style={{ width: `${ANCHO_PAGINA}px` }}
        ref={containerRef}
      >
        {/* Renderizar páginas de fondo */}
        {Array.from({ length: numeroPaginas }).map((_, index) => (
          <div
            key={index}
            className="bg-white shadow-lg mb-8"
            style={{
              width: `${ANCHO_PAGINA}px`,
              height: `${ALTO_PAGINA}px`,
            }}
          />
        ))}

        {/* Editor absoluto sobre las páginas */}
        <div
          className="absolute top-0 left-0"
          style={{
            width: `${ANCHO_PAGINA}px`,
          }}
        >
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="outline-none focus:outline-none"
            style={{
              margin: `${MARGEN}px`,
              width: `${ANCHO_PAGINA - MARGEN * 2}px`,
              lineHeight: INTERLINEADO,
              fontFamily: "Times New Roman, serif",
              fontSize: "12pt",
              color: "#000",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              minHeight: `${ALTO_CONTENIDO}px`,
            }}
            suppressContentEditableWarning
          />
        </div>
      </div>
    </div>
  );
}
