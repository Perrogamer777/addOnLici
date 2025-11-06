import ExcelJS from 'exceljs';

export async function generarExcelResumen(items, infoLicitacion, totales) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Resumen Cotización');

    // DEBUG: Log los items que llegan
    console.log('Items para Excel (antes de filtrar):', items);
    
    // Log detallado de primeros items
    if (items.length > 0) {
      console.log('=== PRIMER ITEM (antes de filtrar) ===');
      console.log('Completo:', items[0]);
      console.log('marca:', items[0].marca);
      console.log('categoria:', items[0].categoria);
      console.log('rulifa:', items[0].rulifa);
      console.log('sucursal:', items[0].sucursal);
      console.log('cantidad:', items[0].cantidad);
    }

    // IMPORTANTE: Filtrar solo items completados (con sucursal asignada y cantidad > 0)
    const itemsCompletos = items.filter(item => item.sucursal && item.cantidad > 0);
    
    console.log('Items para Excel (después de filtrar):', itemsCompletos);
    console.log(`Filtrados: ${items.length} → ${itemsCompletos.length}`);
    
    if (itemsCompletos.length > 0) {
      console.log('=== PRIMER ITEM COMPLETO (después de filtrar) ===');
      console.log('Completo:', itemsCompletos[0]);
      console.log('marca:', itemsCompletos[0].marca);
      console.log('categoria:', itemsCompletos[0].categoria);
      console.log('rulifa:', itemsCompletos[0].rulifa);
    }

    // Encabezado: sku, nombre, rulifa, marca, sucursal, unidades, precio de tienda, precio unitario, total
    sheet.addRow(['SKU', 'Nombre', 'Rulifa', 'Marca', 'Sucursal', 'Unidades', 'Precio Tienda', 'Precio Unitario', 'Total']);

    // Filas de productos
    itemsCompletos.forEach((item, idx) => {
      console.log(`Item ${idx}:`, {
        sku: item.sku,
        nombre: item.nombre,
        rulifa: item.rulifa,
        categoria: item.categoria,
        marca: item.marca,
        sucursal: item.sucursal,
        cantidad: item.cantidad,
        precioTienda: item.precioTienda,
        precioFinal: item.precioFinal
      });
      
      const rowData = [
        item.sku || '',
        item.nombre || '',
        item.rulifa || item.categoria || '', // rulifa = categoria
        item.marca || '',
        item.sucursal || '',
        item.cantidad || 0,
        item.precioTienda ?? item.precioUnitario ?? 0,
        item.precioFinal ?? item.precioTienda ?? item.precioUnitario ?? 0,
        (item.cantidad * (item.precioFinal ?? item.precioTienda ?? item.precioUnitario ?? 0)) || 0
      ];
      
      console.log(`Row ${idx} que se va a escribir:`, rowData);
      sheet.addRow(rowData);
    });

    // Advertencia si hay items incompletos
    if (items.length > itemsCompletos.length) {
      const incompletos = items.length - itemsCompletos.length;
      alert(`⚠️ Se exportarán ${itemsCompletos.length} productos completados.\n${incompletos} producto(s) aún pendiente(s) de asignar sucursal o cantidad.`);
    }

   // Formato de columnas (opcional)
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