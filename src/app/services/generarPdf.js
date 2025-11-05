import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export class generarPdf {
  static generarCotizacion(items, infoLicitacion, totales) {
    const doc = new jsPDF();
    
    // Configuración de fuente
    doc.setFont('helvetica');
    
    // Encabezado
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204); // Azul
    doc.text('Cotización', 105, 20, { align: 'center' });
    
    // Info de la licitación
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    let yPos = 35;
    
    if (infoLicitacion) {
      doc.setFont('helvetica', 'bold');
      doc.text('Información de la Licitación', 14, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;
      
      doc.text(`ID Licitación: ${infoLicitacion.idLicitacion || 'N/A'}`, 14, yPos);
      yPos += 5;
      doc.text(`Cliente: ${infoLicitacion.empresaCompradora || 'N/A'}`, 14, yPos);
      yPos += 5;
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-CL')}`, 14, yPos);
      yPos += 10;
    }
    
    // Tabla de productos
    const tableData = items.map((item, index) => [
      index + 1,
      item.sku,
      item.nombre,
      item.cantidad,
      `$${((item.precioTienda ?? item.precioUnitario) || 0).toLocaleString('es-CL')}`,
      `$${((item.precioFinal ?? item.precioTienda ?? item.precioUnitario) || 0).toLocaleString('es-CL')}`,
      `$${(item.cantidad * ((item.precioFinal ?? item.precioTienda ?? item.precioUnitario) || 0)).toLocaleString('es-CL')}`
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['#', 'SKU', 'Producto', 'Cant.', 'Precio Tienda', 'Precio Final', 'Subtotal']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 25 },
        2: { cellWidth: 60 },
        3: { cellWidth: 15, halign: 'center' },
        4: { cellWidth: 25, halign: 'right' },
        5: { cellWidth: 25, halign: 'right' },
        6: { cellWidth: 30, halign: 'right' }
      }
    });
    
    // Totales
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'normal');
    doc.text('Neto:', 140, finalY);
    doc.text(`$${Math.round(totales.neto).toLocaleString('es-CL')}`, 190, finalY, { align: 'right' });
    
    doc.text('IVA (19%):', 140, finalY + 7);
    doc.text(`$${Math.round(totales.iva).toLocaleString('es-CL')}`, 190, finalY + 7, { align: 'right' });
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total:', 140, finalY + 15);
    doc.text(`$${Math.round(totales.total).toLocaleString('es-CL')}`, 190, finalY + 15, { align: 'right' });
    
    return doc;
  }
  
  static descargarPDF(doc, nombreArchivo = 'cotizacion.pdf') {
    doc.save(nombreArchivo);
  }
  
  static abrirPDF(doc) {
    window.open(doc.output('bloburl'), '_blank');
  }
}