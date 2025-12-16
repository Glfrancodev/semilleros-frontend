import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { ControlNotasData, ProyectosJuradosData, CalificacionesFinalesData } from '../types/reportes';

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

// ============================================
// EXPORTACIONES PARA PROYECTOS CON JURADOS
// ============================================

/**
 * Exporta el reporte de Proyectos con Jurados a CSV
 */
export const exportProyectosJuradosToCSV = (data: ProyectosJuradosData) => {
    if (!data || data.proyectos.length === 0) {
        throw new Error('No hay datos para exportar');
    }

    // Construir encabezados
    const headers = ['Proyecto', 'Área', 'Categoría', 'Jurado 1', 'Jurado 2', 'Jurado 3'];

    // Construir filas
    const rows = data.proyectos.map(proyecto => {
        return [
            proyecto.nombre,
            proyecto.area,
            proyecto.categoria,
            proyecto.jurado1 ? `${proyecto.jurado1.nombre} (${proyecto.jurado1.correo})` : '-',
            proyecto.jurado2 ? `${proyecto.jurado2.nombre} (${proyecto.jurado2.correo})` : '-',
            proyecto.jurado3 ? `${proyecto.jurado3.nombre} (${proyecto.jurado3.correo})` : '-',
        ];
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
    link.setAttribute('download', `proyectos-jurados-${data.feriaActual.nombre}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Exporta el reporte de Proyectos con Jurados a Excel
 */
export const exportProyectosJuradosToExcel = (data: ProyectosJuradosData) => {
    if (!data || data.proyectos.length === 0) {
        throw new Error('No hay datos para exportar');
    }

    // Crear workbook
    const wb = XLSX.utils.book_new();

    // Construir datos para la hoja
    const rows = data.proyectos.map(proyecto => ({
        'Proyecto': proyecto.nombre,
        'Área': proyecto.area,
        'Categoría': proyecto.categoria,
        'Jurado 1 - Nombre': proyecto.jurado1?.nombre || '-',
        'Jurado 1 - Correo': proyecto.jurado1?.correo || '-',
        'Jurado 2 - Nombre': proyecto.jurado2?.nombre || '-',
        'Jurado 2 - Correo': proyecto.jurado2?.correo || '-',
        'Jurado 3 - Nombre': proyecto.jurado3?.nombre || '-',
        'Jurado 3 - Correo': proyecto.jurado3?.correo || '-',
    }));

    // Crear hoja de cálculo
    const ws = XLSX.utils.json_to_sheet(rows);

    // Ajustar ancho de columnas
    const colWidths = [
        { wch: 30 }, // Proyecto
        { wch: 20 }, // Área
        { wch: 20 }, // Categoría
        { wch: 25 }, // Jurado 1 - Nombre
        { wch: 30 }, // Jurado 1 - Correo
        { wch: 25 }, // Jurado 2 - Nombre
        { wch: 30 }, // Jurado 2 - Correo
        { wch: 25 }, // Jurado 3 - Nombre
        { wch: 30 }, // Jurado 3 - Correo
    ];
    ws['!cols'] = colWidths;

    // Agregar hoja al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Proyectos con Jurados');

    // Agregar hoja de estadísticas
    const statsData = [
        { Métrica: 'Total Proyectos', Valor: data.estadisticas.totalProyectos },
        { Métrica: 'Proyectos con Jurados', Valor: data.estadisticas.proyectosConJurados },
        { Métrica: 'Proyectos sin Jurados', Valor: data.estadisticas.proyectosSinJurados },
        { Métrica: 'Proyectos con 1 Jurado', Valor: data.estadisticas.proyectosCon1Jurado },
        { Métrica: 'Proyectos con 2 Jurados', Valor: data.estadisticas.proyectosCon2Jurados },
        { Métrica: 'Proyectos con 3 Jurados', Valor: data.estadisticas.proyectosCon3Jurados },
    ];
    const wsStats = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, wsStats, 'Estadísticas');

    // Descargar archivo
    XLSX.writeFile(wb, `proyectos-jurados-${data.feriaActual.nombre}-${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Exporta el reporte de Proyectos con Jurados a PDF capturando la visualización real
 */
export const exportProyectosJuradosToPDF = async (elementId: string, data: ProyectosJuradosData) => {
    if (!data || data.proyectos.length === 0) {
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
    wrapper.style.backgroundColor = '#ffffff';
    wrapper.style.padding = '20px';
    wrapper.style.width = element.offsetWidth + 'px';

    // Clonar el elemento
    const clone = element.cloneNode(true) as HTMLElement;
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // Suprimir errores de oklch temporalmente
    const originalErrorHandler = window.onerror;
    window.onerror = (message) => {
        if (typeof message === 'string' && message.includes('oklch')) {
            return true; // Suprimir error
        }
        return false;
    };

    try {
        // Capturar el elemento como imagen usando html2canvas
        const canvas = await html2canvas(wrapper, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            ignoreElements: () => {
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

        // Restaurar el manejador de errores original
        window.onerror = originalErrorHandler;

        // Crear PDF en orientación landscape para tablas anchas
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Calcular dimensiones para que quepa en una página
        const imgWidth = pageWidth - 20; // Margen de 10mm a cada lado
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Si la imagen es muy alta, ajustar para que quepa
        let finalWidth = imgWidth;
        let finalHeight = imgHeight;

        if (imgHeight > pageHeight - 40) {
            // Si es muy alta, ajustar proporcionalmente
            finalHeight = pageHeight - 40;
            finalWidth = (canvas.width * finalHeight) / canvas.height;
        }

        // Centrar la imagen
        const xPosition = (pageWidth - finalWidth) / 2;

        // Agregar título
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Proyectos con Jurados - ${data.feriaActual.nombre}`, pageWidth / 2, 15, { align: 'center' });

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generado: ${new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`, pageWidth / 2, 21, { align: 'center' });

        // Agregar la imagen de la previsualización
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', xPosition, 25, finalWidth, finalHeight);

        // Agregar página de estadísticas
        pdf.addPage();

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Estadísticas del Reporte', pageWidth / 2, 20, { align: 'center' });

        // Tabla de estadísticas usando autoTable
        const statsData = [
            ['Total Proyectos', data.estadisticas.totalProyectos.toString()],
            ['Proyectos con Jurados', data.estadisticas.proyectosConJurados.toString()],
            ['Proyectos sin Jurados', data.estadisticas.proyectosSinJurados.toString()],
            ['Proyectos con 1 Jurado', data.estadisticas.proyectosCon1Jurado.toString()],
            ['Proyectos con 2 Jurados', data.estadisticas.proyectosCon2Jurados.toString()],
            ['Proyectos con 3 Jurados', data.estadisticas.proyectosCon3Jurados.toString()],
        ];

        autoTable(pdf, {
            startY: 30,
            head: [['Métrica', 'Valor']],
            body: statsData,
            theme: 'grid',
            headStyles: {
                fillColor: [79, 70, 229],
                fontSize: 12,
                fontStyle: 'bold',
            },
            bodyStyles: {
                fontSize: 11,
            },
            columnStyles: {
                0: { cellWidth: 100 },
                1: { cellWidth: 50, halign: 'center' },
            },
        });

        // Descargar PDF
        pdf.save(`proyectos-jurados-${data.feriaActual.nombre}-${new Date().toISOString().split('T')[0]}.pdf`);

        // Limpiar
        document.body.removeChild(wrapper);
    } catch (error) {
        // Limpiar incluso si hay error
        if (wrapper && wrapper.parentNode) {
            document.body.removeChild(wrapper);
        }
        // Restaurar el manejador de errores original
        window.onerror = originalErrorHandler;
        console.error('Error generating PDF:', error);
        throw new Error('Error al generar el PDF. Intenta usar la exportación a Excel o CSV.');
    }
};

// ============================================
// EXPORTACIONES PARA CALIFICACIONES FINALES
// ============================================

/**
 * Exporta el reporte de Calificaciones Finales a CSV
 */
export const exportCalificacionesFinalesToCSV = (data: CalificacionesFinalesData) => {
    if (!data || data.proyectos.length === 0) {
        throw new Error('No hay datos para exportar');
    }

    const headers = ['Proyecto', 'Área', 'Categoría', 'Calificación 1', 'Calificación 2', 'Calificación 3', 'Nota Final'];
    const rows = data.proyectos.map(proyecto => [
        proyecto.nombre,
        proyecto.area,
        proyecto.categoria,
        proyecto.calificacion1,
        proyecto.calificacion2,
        proyecto.calificacion3,
        proyecto.notaFinal,
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `calificaciones-finales-${data.feriaActual.nombre}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Exporta el reporte de Calificaciones Finales a Excel
 */
export const exportCalificacionesFinalesToExcel = (data: CalificacionesFinalesData) => {
    if (!data || data.proyectos.length === 0) {
        throw new Error('No hay datos para exportar');
    }

    const wb = XLSX.utils.book_new();

    const rows = data.proyectos.map(proyecto => ({
        'Proyecto': proyecto.nombre,
        'Área': proyecto.area,
        'Categoría': proyecto.categoria,
        'Calificación 1': proyecto.calificacion1,
        'Calificación 2': proyecto.calificacion2,
        'Calificación 3': proyecto.calificacion3,
        'Nota Final': proyecto.notaFinal,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);

    const colWidths = [
        { wch: 35 }, { wch: 25 }, { wch: 20 },
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Calificaciones Finales');

    const statsData = [
        { Métrica: 'Total Proyectos', Valor: data.estadisticas.totalProyectos },
        { Métrica: 'Proyectos Calificados', Valor: data.estadisticas.proyectosCalificados },
        { Métrica: 'Proyectos Pendientes', Valor: data.estadisticas.proyectosPendientes },
    ];
    const wsStats = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, wsStats, 'Estadísticas');

    XLSX.writeFile(wb, `calificaciones-finales-${data.feriaActual.nombre}-${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Exporta el reporte de Calificaciones Finales a PDF
 */
export const exportCalificacionesFinalesToPDF = async (elementId: string, data: CalificacionesFinalesData) => {
    if (!data || data.proyectos.length === 0) {
        throw new Error('No hay datos para exportar');
    }

    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error('Elemento no encontrado para exportar');
    }

    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    wrapper.style.backgroundColor = '#ffffff';
    wrapper.style.padding = '20px';
    wrapper.style.width = element.offsetWidth + 'px';

    const clone = element.cloneNode(true) as HTMLElement;
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const originalErrorHandler = window.onerror;
    window.onerror = (message) => {
        if (typeof message === 'string' && message.includes('oklch')) {
            return true;
        }
        return false;
    };

    try {
        const canvas = await html2canvas(wrapper, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            ignoreElements: () => false,
            onclone: (clonedDoc) => {
                const style = clonedDoc.createElement('style');
                style.innerHTML = `* { color: inherit !important; background-color: inherit !important; border-color: inherit !important; }`;
                clonedDoc.head.appendChild(style);
            }
        });

        window.onerror = originalErrorHandler;

        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let finalWidth = imgWidth;
        let finalHeight = imgHeight;

        if (imgHeight > pageHeight - 40) {
            finalHeight = pageHeight - 40;
            finalWidth = (canvas.width * finalHeight) / canvas.height;
        }

        const xPosition = (pageWidth - finalWidth) / 2;

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Calificaciones Finales - ${data.feriaActual.nombre}`, pageWidth / 2, 15, { align: 'center' });

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generado: ${new Date().toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })}`, pageWidth / 2, 21, { align: 'center' });

        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', xPosition, 25, finalWidth, finalHeight);

        pdf.addPage();
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Estadísticas del Reporte', pageWidth / 2, 20, { align: 'center' });

        autoTable(pdf, {
            startY: 30,
            head: [['Métrica', 'Valor']],
            body: [
                ['Total Proyectos', data.estadisticas.totalProyectos.toString()],
                ['Proyectos Calificados', data.estadisticas.proyectosCalificados.toString()],
                ['Proyectos Pendientes', data.estadisticas.proyectosPendientes.toString()],
            ],
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229], fontSize: 12, fontStyle: 'bold' },
            bodyStyles: { fontSize: 11 },
            columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 50, halign: 'center' } },
        });

        pdf.save(`calificaciones-finales-${data.feriaActual.nombre}-${new Date().toISOString().split('T')[0]}.pdf`);
        document.body.removeChild(wrapper);
    } catch (error) {
        if (wrapper && wrapper.parentNode) {
            document.body.removeChild(wrapper);
        }
        window.onerror = originalErrorHandler;
        console.error('Error generating PDF:', error);
        throw new Error('Error al generar el PDF. Intenta usar la exportación a Excel o CSV.');
    }
};