import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { ControlNotasData } from '../types/reportes';

/**
 * Exporta el reporte de Control de Notas a CSV
 */
export const exportToCSV = (data: ControlNotasData) => {
    if (!data || data.matriz.length === 0) {
        throw new Error('No hay datos para exportar');
    }

    // Construir encabezados
    const headers = ['Proyecto', 'Área', 'Categoría'];
    data.tareas.forEach(tarea => {
        headers.push(`${tarea.nombre} (Orden ${tarea.orden})`);
    });

    // Construir filas
    const rows = data.matriz.map(fila => {
        const row = [
            fila.proyecto.nombre,
            fila.proyecto.area || '-',
            fila.proyecto.categoria || '-',
        ];

        // Agregar calificaciones/estados de cada tarea
        fila.tareas.forEach(tarea => {
            if (tarea.estado === 'revisado') {
                row.push(tarea.calificacion?.toString() || '-');
            } else if (tarea.estado === 'pendiente_revision') {
                row.push('Pendiente');
            } else {
                row.push('No enviado');
            }
        });

        return row;
    });

    // Combinar encabezados y filas
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `control-notas-${data.feria.nombre}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Exporta el reporte de Control de Notas a Excel
 */
export const exportToExcel = (data: ControlNotasData) => {
    if (!data || data.matriz.length === 0) {
        throw new Error('No hay datos para exportar');
    }

    // Crear workbook
    const wb = XLSX.utils.book_new();

    // Construir datos para la hoja
    const headers = ['Proyecto', 'Área', 'Categoría'];
    data.tareas.forEach(tarea => {
        headers.push(`${tarea.nombre} (Orden ${tarea.orden})`);
    });

    const rows = data.matriz.map(fila => {
        const row: any = {
            'Proyecto': fila.proyecto.nombre,
            'Área': fila.proyecto.area || '-',
            'Categoría': fila.proyecto.categoria || '-',
        };

        // Agregar calificaciones/estados de cada tarea
        fila.tareas.forEach(tarea => {
            const columnName = `${tarea.nombreTarea} (Orden ${tarea.ordenTarea})`;
            if (tarea.estado === 'revisado') {
                row[columnName] = tarea.calificacion || '-';
            } else if (tarea.estado === 'pendiente_revision') {
                row[columnName] = 'Pendiente';
            } else {
                row[columnName] = 'No enviado';
            }
        });

        return row;
    });

    // Crear hoja de cálculo
    const ws = XLSX.utils.json_to_sheet(rows);

    // Ajustar ancho de columnas
    const colWidths = headers.map(header => ({
        wch: Math.max(header.length, 15)
    }));
    ws['!cols'] = colWidths;

    // Agregar hoja al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Control de Notas');

    // Agregar hoja de estadísticas
    const statsData = [
        { Métrica: 'Total Proyectos', Valor: data.estadisticas.totalProyectos },
        { Métrica: 'Total Tareas', Valor: data.estadisticas.totalTareas },
        { Métrica: 'Tareas Revisadas', Valor: data.estadisticas.tareasRevisadas },
        { Métrica: 'Tareas Pendientes', Valor: data.estadisticas.tareasPendientes },
        { Métrica: 'Tareas No Enviadas', Valor: data.estadisticas.tareasNoEnviadas },
    ];
    const wsStats = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, wsStats, 'Estadísticas');

    // Descargar archivo
    XLSX.writeFile(wb, `control-notas-${data.feria.nombre}-${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Exporta el reporte de Control de Notas a PDF capturando la previsualización visual
 */
/**
 * Exporta el reporte de Control de Notas a PDF capturando la visualización real
 * Usa un wrapper temporal para evitar problemas con oklch
 */
export const exportToPDF = async (elementId: string, data: ControlNotasData) => {
    if (!data || data.matriz.length === 0) {
        throw new Error('No hay datos para exportar');
    }

    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error('Elemento no encontrado para exportar');
    }

    // Crear un wrapper con fondo blanco sólido
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    wrapper.style.background = '#ffffff';
    wrapper.style.padding = '20px';

    // Clonar el elemento
    const clone = element.cloneNode(true) as HTMLElement;
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // Forzar un reflow para que los estilos se apliquen
    wrapper.offsetHeight;

    try {
        // Usar html2canvas con configuración especial
        const canvas = await html2canvas(wrapper, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            // TRUCO CLAVE: Ignorar estilos que causen problemas
            ignoreElements: () => {
                // No ignorar elementos por ahora
                return false;
            },
            onclone: (clonedDoc) => {
                // Inyectar CSS override para convertir todos los colores a RGB
                const style = clonedDoc.createElement('style');
                style.innerHTML = `
                    * {
                        color: inherit !important;
                        background-color: inherit !important;
                        border-color: inherit !important;
                    }
                `;
                clonedDoc.head.appendChild(style);
            }
        });

        const imgData = canvas.toDataURL('image/png');

        // Crear PDF en orientación horizontal
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Espacio para título y footer
        const titleHeight = 25;
        const footerHeight = 10;
        const availableHeight = pageHeight - titleHeight - footerHeight;

        // Calcular dimensiones de la imagen para que quepa en una sola página
        let imgWidth = pageWidth - 20;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Si la imagen es muy alta, ajustar para que quepa en una página
        if (imgHeight > availableHeight) {
            imgHeight = availableHeight;
            imgWidth = (canvas.width * imgHeight) / canvas.height;
        }

        // Centrar horizontalmente si la imagen es más pequeña que el ancho
        const xPosition = (pageWidth - imgWidth) / 2;
        let position = titleHeight;

        // Agregar título
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Control de Notas - ${data.feria.nombre}`, pageWidth / 2, 15, { align: 'center' });

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generado: ${new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`, pageWidth / 2, 21, { align: 'center' });

        // Agregar la imagen de la previsualización (TODO en una sola página)
        pdf.addImage(imgData, 'PNG', xPosition, position, imgWidth, imgHeight);

        // Agregar página de estadísticas
        pdf.addPage();

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Estadísticas del Reporte', pageWidth / 2, 20, { align: 'center' });

        // Tabla de estadísticas usando autoTable
        const statsData = [
            ['Total Proyectos', data.estadisticas.totalProyectos.toString()],
            ['Total Tareas', data.estadisticas.totalTareas.toString()],
            ['Tareas Revisadas', data.estadisticas.tareasRevisadas.toString()],
            ['Tareas Pendientes', data.estadisticas.tareasPendientes.toString()],
            ['Tareas No Enviadas', data.estadisticas.tareasNoEnviadas.toString()],
        ];

        autoTable(pdf, {
            head: [['Métrica', 'Valor']],
            body: statsData,
            startY: 30,
            theme: 'striped',
            styles: {
                fontSize: 11,
                cellPadding: 5,
            },
            headStyles: {
                fillColor: [52, 152, 219],
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center',
            },
            columnStyles: {
                0: { halign: 'left', cellWidth: 100 },
                1: { halign: 'center', cellWidth: 50 },
            },
            margin: { left: (pageWidth - 150) / 2 },
        });

        // Descargar PDF
        pdf.save(`control-notas-${data.feria.nombre}-${new Date().toISOString().split('T')[0]}.pdf`);

        // Limpiar el wrapper del DOM
        document.body.removeChild(wrapper);
    } catch (error) {
        // Limpiar incluso si hay error
        if (wrapper && wrapper.parentNode) {
            document.body.removeChild(wrapper);
        }
        console.error('Error generating PDF:', error);
        throw new Error('Error al generar el PDF. Intenta usar la exportación a Excel o CSV.');
    }
};