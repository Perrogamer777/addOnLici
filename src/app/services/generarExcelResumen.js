import ExcelJS from 'exceljs';

export async function generarExcelResumen(items, infoLicitacion, totales) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'TuEmpresa';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Resumen Cotización');

    // Titulo
    sheet.mergeCells('A1:I1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `Cotización para Licitación: ${infoLicitacion?.idLicitacion || 'N/A'}`;
    titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF2c3e50' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getRow(1).height = 30;

    // Cliente
    sheet.mergeCells('A2:I2');
    const clienteCell = sheet.getCell('A2');
    clienteCell.value = `Cliente: ${infoLicitacion?.empresaCompradora || 'No especificado'}`;
    clienteCell.font = { name: 'Calibri', size: 12, italic: true, color: { argb: 'FF6c757d' } };
    clienteCell.alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getRow(2).height = 25;

    sheet.addRow([]); 

    // Encabezados 
    const headers = ['SKU', 'Nombre', 'Categoría', 'Marca', 'Sucursales', 'Unidades', 'Precio de Venta', 'Precio Final', 'Total'];
    const headerRow = sheet.addRow(headers);
    headerRow.eachCell((cell) => {
        cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF3498db' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = { bottom: { style: 'thin', color: { argb: 'FF2c3e50' } } };
    });
    headerRow.height = 30;

    //  Filas de productos
    items.forEach(item => {
        let sucursales = '-';
        if (Array.isArray(item.detallesSucursales) && item.detallesSucursales.length > 0) {
            sucursales = item.detallesSucursales
                .map(d => `${d.nombreSucursal}: ${d.cantidad}`)
                .join('\n'); 
        } else if (item.sucursal) {
            sucursales = `${item.sucursal}: ${item.cantidad}`;
        }

        const precioVenta = item.precioTienda ?? item.precioUnitario ?? 0;
        const precioFinal = item.precioFinal ?? precioVenta;
        const total = item.cantidad * precioFinal;

        const row = sheet.addRow([
            item.sku || '-',
            item.nombre || '-',
            item.categoria || '-',
            item.marca || '-',
            sucursales,
            item.cantidad || 0,
            precioVenta,
            precioFinal,
            total
        ]);

        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            cell.font = { name: 'Calibri', size: 11 };
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
            if ([7, 8, 9].includes(colNumber)) { // Columnas de precios y total
                cell.alignment.horizontal = 'right';
                cell.numFmt = '"$"#,##0';
            }
            if (colNumber === 6) { // Unidades
                cell.alignment.horizontal = 'center';
            }
        });
    });

    // ancho de columnas 
    sheet.columns = [
        { key: 'sku', width: 20 },
        { key: 'nombre', width: 40 },
        { key: 'categoria', width: 25 },
        { key: 'marca', width: 25 },
        { key: 'sucursales', width: 30 },
        { key: 'unidades', width: 15 },
        { key: 'precioVenta', width: 20 },
        { key: 'precioFinal', width: 20 },
        { key: 'total', width: 20 },
    ];

    // totales
    if (totales) {
        sheet.addRow([]); 
        const netRow = sheet.addRow(['', '', '', '', '', '', '', 'Neto', totales.neto]);
        const ivaRow = sheet.addRow(['', '', '', '', '', '', '', 'IVA (19%)', totales.iva]);
        const totalRow = sheet.addRow(['', '', '', '', '', '', '', 'Total', totales.total]);

        [netRow, ivaRow, totalRow].forEach((row, index) => {
            const labelCell = row.getCell(8);
            const valueCell = row.getCell(9);
            
            labelCell.font = { name: 'Calibri', size: 12, bold: true };
            labelCell.alignment = { horizontal: 'right' };
            valueCell.numFmt = '"$"#,##0';
            valueCell.font = { name: 'Calibri', size: 12 };

            if (index === 2) { // Fila del Total
                labelCell.font.size = 14;
                labelCell.font.color = { argb: 'FF3498db' };
                valueCell.font.size = 14;
                valueCell.font.bold = true;
                valueCell.font.color = { argb: 'FF3498db' };
            }
        });
    }

    // generar y descargar 
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    
    const nombreArchivo = `Cotizacion_${infoLicitacion?.idLicitacion || 'SinID'}_${dia}-${mes}-${año}_${hora}-${minutos}.xlsx`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
