import ExcelJS from 'exceljs';

export async function generarExcelResumen(items, infoLicitacion, totales) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Resumen Cotización');
    
    // Encabezado: sku, nombre, rulifa, marca, sucursal, unidades, precio de tienda, precio unitario, total
    sheet.addRow(['SKU', 'Nombre', 'Rulifa', 'Marca', 'Sucursal', 'Unidades', 'Precio Tienda', 'Precio Unitario', 'Total']);

    // Filas de productos
    items.forEach((item, idx) => {
      const rowData = [
        item.sku || '',
        item.nombre || '',
        item.categoria || '', 
        item.marca || '',
        item.sucursal || '',
        item.cantidad || 0,
        item.precioTienda ?? item.precioUnitario ?? 0,
        item.precioFinal ?? item.precioTienda ?? item.precioUnitario ?? 0,
        (item.cantidad * (item.precioFinal ?? item.precioTienda ?? item.precioUnitario ?? 0)) || 0
      ];
      
      sheet.addRow(rowData);
    });

   // Formato de columnas 
  sheet.columns.forEach(col => { col.width = 18; });

  // generar y descrargar el archivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer],{type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  
  // Nombre del archivo con fecha y hora
  const fecha = new Date();
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  const horas = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  const nombreArchivo = `cotizacion_${infoLicitacion?.idLicitacion || 'SinID'}_${dia}-${mes}-${año}_${horas}-${minutos}.xlsx`;

  // descarga del archivo
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}