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

