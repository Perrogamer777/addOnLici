import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export class generarPdf {
  static generarCotizacion(items, infoLicitacion, totales) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    // --- Colores y Fuentes ---
    const primaryColor = '#2c3e50'; 
    const secondaryColor = '#3498db'; 
    const textColor = '#34495e'; 
    const lightGray = '#ecf0f1'; 
    const white = '#ffffff';

    doc.setFont('helvetica', 'normal');

    // --- Header ---
    const drawHeader = () => {
      // Fondo del header
      doc.setFillColor(primaryColor);
      doc.rect(0, 0, pageWidth, 30, 'F');

      // Título
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(white);
      doc.text('Cotización', pageWidth - margin, 18, { align: 'right' });
    };

    // --- Footer ---
    const drawFooter = (data) => {
      const page = data.pageNumber;
      const pages = doc.internal.getNumberOfPages();
      
      doc.setFontSize(8);
      doc.setTextColor(textColor);
      
      const footerText = `Página ${page} de ${pages}`;
      const footerY = pageHeight - 10;

      doc.setLineWidth(0.2);
      doc.setDrawColor(lightGray);
      doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

      doc.text(footerText, pageWidth / 2, footerY, { align: 'center' });
      doc.text(new Date().toLocaleDateString('es-CL'), pageWidth - margin, footerY, { align: 'right' });
    };

    // --- Información de la Licitación ---
    const drawInfoLicitacion = () => {
      let yPos = 40;
      if (infoLicitacion) {
        doc.setFontSize(10);
        doc.setTextColor(textColor);

        const info = [
          { label: 'ID Licitación:', value: infoLicitacion.idLicitacion || 'N/A' },
          { label: 'Cliente:', value: infoLicitacion.empresaCompradora || 'N/A' },
          { label: 'Fecha de Emisión:', value: new Date().toLocaleDateString('es-CL') },
        ];

        autoTable(doc, {
          startY: yPos,
          body: info.map(i => [i.label, i.value]),
          theme: 'plain',
          styles: {
            fontSize: 10,
            cellPadding: { top: 1.5, right: 0, bottom: 1.5, left: 0 },
          },
          columnStyles: {
            0: { fontStyle: 'bold' },
          },
        });
        
        return doc.lastAutoTable.finalY + 10;
      }
      return yPos;
    };

    // --- Tabla de Productos ---
    const tableData = items.map(item => {
      const precioFinal = (item.precioFinal ?? item.precioTienda ?? item.precioUnitario) || 0;
      const total = item.cantidad * precioFinal;

      return [
        item.sku || '-',
        item.nombre || '-',
        (item.marca && item.marca.trim() !== '') ? item.marca : '-',
        item.cantidad || 0,
        `$${precioFinal.toLocaleString('es-CL')}`,
        `$${total.toLocaleString('es-CL')}`
      ];
    });

    const startY = drawInfoLicitacion();

    autoTable(doc, {
      startY: startY,
      head: [['SKU', 'Nombre', 'Marca', 'Unidades', 'Precio Unitario', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: white,
        fontStyle: 'bold',
        halign: 'center',
      },
      alternateRowStyles: { fillColor: lightGray },
      styles: {
        fontSize: 9,
        cellPadding: { top: 4, right: 4, bottom: 4, left: 4 },
        valign: 'middle',
        lineColor: '#cccccc',
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 25, halign: 'left' },    // SKU
        1: { cellWidth: 'auto', halign: 'left' }, // Nombre
        2: { cellWidth: 30, halign: 'left' },    // Marca
        3: { cellWidth: 20, halign: 'center' },  // Unidades
        4: { cellWidth: 30, halign: 'right' },   // Precio Unitario
        5: { cellWidth: 30, halign: 'right' },   // Total
      },
      didDrawPage: (data) => {
        drawHeader();
        drawFooter(data);
      }
    });

    // --- Totales ---
    const finalY = doc.lastAutoTable.finalY + 10;
    const totals = [
      { label: 'Neto', value: `$${Math.round(totales.neto).toLocaleString('es-CL')}` },
      { label: 'IVA (19%)', value: `$${Math.round(totales.iva).toLocaleString('es-CL')}` },
      { label: 'Total', value: `$${Math.round(totales.total).toLocaleString('es-CL')}` }
    ];

    autoTable(doc, {
      startY: finalY,
      body: totals,
      theme: 'plain',
      tableWidth: 60,
      margin: { left: pageWidth - margin - 60 },
      styles: {
        fontSize: 10,
        cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
      },
      columnStyles: {
        0: { fontStyle: 'bold', halign: 'left' },
        1: { halign: 'right' },
      },
      didParseCell: (data) => {
        if (data.row.index === 2) { // Fila del Total
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fontSize = 11;
        }
      }
    });

    return doc;
  }

  static descargarPDF(doc, nombreArchivo = 'cotizacion.pdf') {
    doc.save(nombreArchivo);
  }

  static abrirPDF(doc) {
    window.open(doc.output('bloburl'), '_blank');
  }
}
