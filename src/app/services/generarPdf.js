import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export class generarPdf {
  static generarCotizacion(items, infoLicitacion, totales) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const headerHeight = 20;

    // Info de la licitación
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  let yPos = headerHeight + 12;
    
    if (infoLicitacion) {
      // Título sección info
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30);
      doc.text('Información de la Licitación', margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60);
      yPos += 6;

      const info = [
        [`ID Licitación:`, `${infoLicitacion.idLicitacion || 'N/A'}`],
        [`Cliente:`, `${infoLicitacion.empresaCompradora || 'N/A'}`],
        [`Fecha:`, `${new Date().toLocaleDateString('es-CL')}`]
      ];
      const labelColor = 100;
      const valueColor = 20;
      const colGap = 80;
      const leftX = margin;

      info.forEach((pair, idx) => {
        const rowY = yPos + idx * 5.5;
        doc.setTextColor(labelColor);
        doc.text(pair[0], leftX, rowY);
        doc.setTextColor(valueColor);
        doc.text(pair[1], leftX + colGap, rowY);
      });

      yPos += info.length * 5.5 + 6;
      // Separador
      doc.setDrawColor(230);
      doc.setLineWidth(0.2);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 6;
    }
    
    // Tabla de productos
    const tableData = items.map((item, index) => [
      index + 1,
      item.sku,
      item.nombre,
      item.marca || '-',
      item.cantidad,
      `$${((item.precioTienda ?? item.precioUnitario) || 0).toLocaleString('es-CL')}`,
      `$${((item.precioFinal ?? item.precioTienda ?? item.precioUnitario) || 0).toLocaleString('es-CL')}`,
      `$${(item.cantidad * ((item.precioFinal ?? item.precioTienda ?? item.precioUnitario) || 0)).toLocaleString('es-CL')}`
    ]);
    
    // Header y footer en cada página (barra superior y número de página)
    const drawHeaderFooter = (data) => {
      // Header
      doc.setFillColor(0, 102, 204);
      doc.rect(0, 0, pageWidth, headerHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Cotización', margin, headerHeight / 1.4);
      // Datos breves derecha
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const fechaStr = new Date().toLocaleDateString('es-CL');
      const headerRight = [
        infoLicitacion?.idLicitacion ? `ID: ${infoLicitacion.idLicitacion}` : null,
        `Fecha: ${fechaStr}`
      ].filter(Boolean);
      const rightX = pageWidth - margin;
      headerRight.forEach((txt, i) => {
        doc.text(txt, rightX, 8 + i * 5, { align: 'right', baseline: 'middle' });
      });
      // Footer
      const page = data.pageNumber;
      const pages = doc.internal.getNumberOfPages();
      doc.setDrawColor(230);
      doc.setLineWidth(0.2);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
      doc.setTextColor(120);
      doc.setFontSize(9);
      doc.text(`Página ${page} de ${pages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
    };

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'SKU', 'Producto', 'Marca', 'Cant.', 'Precio Tienda', 'Precio Final', 'Subtotal']],
      body: tableData,
      theme: 'striped',
      margin: { top: headerHeight + 8, right: margin, bottom: 20, left: margin },
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center',
        lineColor: [0, 102, 204],
        lineWidth: 0.2
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        lineColor: [230, 230, 230],
        lineWidth: 0.1
      },
      alternateRowStyles: { fillColor: [245, 248, 255] },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },   // #
        1: { cellWidth: 20 },                      // SKU
        2: { cellWidth: 46 },                      // Producto
        3: { cellWidth: 18 },                      // Marca
        4: { cellWidth: 14, halign: 'center' },    // Cant.
        5: { cellWidth: 22, halign: 'right' },     // Precio Tienda
        6: { cellWidth: 22, halign: 'right' },     // Precio Final
        7: { cellWidth: 30, halign: 'right' }      // Subtotal
      },
      didDrawPage: drawHeaderFooter
    });
    
    // Totales
    const finalY = doc.lastAutoTable.finalY + 8;
    const boxWidth = 80;
    const boxHeight = 28;
    const boxX = pageWidth - margin - boxWidth;
    let boxY = finalY;

    // Si no cabe la caja de totales en la página actual, agrega una nueva página
    if (boxY + boxHeight > pageHeight - margin) {
      doc.addPage();
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
      drawHeaderFooter({ pageNumber });
      boxY = headerHeight + 12; // debajo del header
    }

  // Caja de totales
  doc.setFillColor(248, 249, 251);
  doc.setDrawColor(220);
  doc.setLineWidth(0.3);
  doc.rect(boxX, boxY, boxWidth, boxHeight, 'FD');

  const labelX = boxX + 6;
  const valueX = boxX + boxWidth - 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80);
  doc.setFontSize(10);
  doc.text('Neto', labelX, boxY + 8);
  doc.text(`$${Math.round(totales.neto).toLocaleString('es-CL')}`, valueX, boxY + 8, { align: 'right' });

  doc.text('IVA (19%)', labelX, boxY + 15);
  doc.text(`$${Math.round(totales.iva).toLocaleString('es-CL')}`, valueX, boxY + 15, { align: 'right' });

  doc.setDrawColor(230);
  doc.setLineWidth(0.2);
  doc.line(labelX, boxY + 18, boxX + boxWidth - 6, boxY + 18);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20);
  doc.setFontSize(11);
  doc.text('Total', labelX, boxY + 25);
  doc.text(`$${Math.round(totales.total).toLocaleString('es-CL')}`, valueX, boxY + 25, { align: 'right' });
    
    return doc;
  }
  
  static descargarPDF(doc, nombreArchivo = 'cotizacion.pdf') {
    doc.save(nombreArchivo);
  }
  
  static abrirPDF(doc) {
    window.open(doc.output('bloburl'), '_blank');
  }
}