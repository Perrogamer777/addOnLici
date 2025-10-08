export const mockLicitacionInfo = {
  id: 'LIC-6927',
  cliente: {
    nombre: 'Carnes Ñuble S.A'
  },
  fechaCierre: '31/10/2024',
};

// Datos para la lista de "Productos Solicitados"
export const mockProductosSolicitados = [
  { 
    id: 'REQ-001', 
    unidades: 5, 
    descripcion: 'Taladro Inalámbrico Percutor 13 mm 18 V', 
    sku: '41298U',
    categoria: 'Taladros'
  },
  { 
    id: 'REQ-002', 
    unidades: 3, 
    descripcion: 'Esmeril angular eléctrico 4,5" 820W', 
    sku: '98214P',
    categoria: 'Esmeriles'
  },
  { 
    id: 'REQ-003', 
    unidades: 10, 
    descripcion: 'Sierra Circular 7 1/4" 1500W',
    sku: '55432M',
    categoria: 'Sierras'
  },
];

// Datos para la tabla de "Búsqueda de Productos"
export const mockCatalogoProductos = [
  { sku: '41298U', nombre: 'Taladro Inalámbrico Percutor 13mm Bauker', marca: 'Bauker', categoria: 'Taladros', precioUnitario: 86990, stock: 80 },
  { sku: '98214P', nombre: 'Esmeril angular eléctrico 4,5" 820W DeWalt', marca: 'DeWalt', categoria: 'Esmeriles', precioUnitario: 54990, stock: 110 },
  { sku: '55432M', nombre: 'Sierra Circular 7 1/4" 1500W Bosch', marca: 'Bosch', categoria: 'Sierras', precioUnitario: 129990, stock: 45 },
  { sku: 'SKU-004', nombre: 'Luminaria LED Panel 60x60', marca: 'Philips', categoria: 'Paneles LED', precioUnitario: 24500, stock: 75 },
  { sku: 'SKU-005', nombre: 'Tomacorriente Doble 10A', marca: 'BTicino', categoria: 'Tomacorrientes', precioUnitario: 1890, stock: 600 },
];


export const rubros = [
  { id: 'ferreteria', nombre: 'Ferretería' },
  { id: 'electricidad', nombre: 'Electricidad' },
  { id: 'iluminacion', nombre: 'Iluminación' },
  { id: 'construccion', nombre: 'Construcción' },
  { id: 'gasfiteria', nombre: 'Gasfitería' },
  { id: 'seguridad', nombre: 'Seguridad Industrial' },
  { id: 'pinturas', nombre: 'Pinturas y Químicos' },
];

export const linea = [

  { id: 'herramientas-electricas', rubroId: 'ferreteria', nombre: 'Herramientas Eléctricas' },
  { id: 'herramientas-manuales', rubroId: 'ferreteria', nombre: 'Herramientas Manuales' },
  { id: 'fijaciones', rubroId: 'ferreteria', nombre: 'Fijaciones' },
  { id: 'mecanismos', rubroId: 'electricidad', nombre: 'Mecanismos' },
  { id: 'cableado', rubroId: 'electricidad', nombre: 'Cableado y Conductores' },
  { id: 'tableros', rubroId: 'electricidad', nombre: 'Tableros y Protecciones' },
  { id: 'iluminacion-interior', rubroId: 'iluminacion', nombre: 'Iluminación Interior' },
  { id: 'iluminacion-exterior', rubroId: 'iluminacion', nombre: 'Iluminación Exterior' },
  { id: 'maderas', rubroId: 'construccion', nombre: 'Maderas y Tableros' },
  { id: 'cementos', rubroId: 'construccion', nombre: 'Cementos y Morteros' },
  { id: 'ppr', rubroId: 'gasfiteria', nombre: 'PPR y Accesorios' },
  { id: 'sanitarios', rubroId: 'gasfiteria', nombre: 'Sanitarios' },
  { id: 'epi', rubroId: 'seguridad', nombre: 'Elementos de Protección Personal (EPP)' },
  { id: 'latex', rubroId: 'pinturas', nombre: 'Pinturas Látex' },
  { id: 'sellantes', rubroId: 'pinturas', nombre: 'Sellantes y Adhesivos' },
];

export const familia = [
  { id: 'taladros', lineaId: 'herramientas-electricas', nombre: 'Taladros' },
  { id: 'esmeriles', lineaId: 'herramientas-electricas', nombre: 'Esmeriles' },
  { id: 'sierras', lineaId: 'herramientas-electricas', nombre: 'Sierras' },
  { id: 'atornilladores', lineaId: 'herramientas-electricas', nombre: 'Atornilladores' },
  { id: 'martillos', lineaId: 'herramientas-manuales', nombre: 'Martillos' },
  { id: 'llaves', lineaId: 'herramientas-manuales', nombre: 'Llaves' },
  { id: 'destornilladores', lineaId: 'herramientas-manuales', nombre: 'Destornilladores' },
  { id: 'tornillos-volcanita', lineaId: 'fijaciones', nombre: 'Tornillos para Volcanita' },
  { id: 'tarugos', lineaId: 'fijaciones', nombre: 'Tarugos' },
  { id: 'clavos', lineaId: 'fijaciones', nombre: 'Clavos' },
  { id: 'tomacorrientes', lineaId: 'mecanismos', nombre: 'Tomacorrientes' },
  { id: 'interruptores', lineaId: 'mecanismos', nombre: 'Interruptores' },
  { id: 'placas', lineaId: 'mecanismos', nombre: 'Placas y Marcos' },
  { id: 'cable-thhn', lineaId: 'cableado', nombre: 'Cable THHN/THWN' },
  { id: 'canaletas', lineaId: 'cableado', nombre: 'Canaletas y Ductos' },
  { id: 'disyuntores', lineaId: 'tableros', nombre: 'Disyuntores/Automáticos' },
  { id: 'paneles-led', lineaId: 'iluminacion-interior', nombre: 'Paneles LED' },
  { id: 'ampolletas-led', lineaId: 'iluminacion-interior', nombre: 'Ampolletas LED' },
  { id: 'proyectores-led', lineaId: 'iluminacion-exterior', nombre: 'Proyectores LED' },
  { id: 'osb', lineaId: 'maderas', nombre: 'OSB' },
  { id: 'pino', lineaId: 'maderas', nombre: 'Madera Pino' },
  { id: 'cemento', lineaId: 'cementos', nombre: 'Cemento' },
  { id: 'morteros', lineaId: 'cementos', nombre: 'Morteros' },
  { id: 'tubos-ppr', lineaId: 'ppr', nombre: 'Tubos PPR' },
  { id: 'fittings-ppr', lineaId: 'ppr', nombre: 'Fittings PPR' },
  { id: 'griferia', lineaId: 'sanitarios', nombre: 'Grifería' },
  { id: 'wc', lineaId: 'sanitarios', nombre: 'WC/Artefactos' },
  { id: 'guantes', lineaId: 'epi', nombre: 'Guantes de Seguridad' },
  { id: 'cascos', lineaId: 'epi', nombre: 'Cascos' },
  { id: 'latex-int', lineaId: 'latex', nombre: 'Látex Interior' },
  { id: 'siliconas', lineaId: 'sellantes', nombre: 'Siliconas' },
];
