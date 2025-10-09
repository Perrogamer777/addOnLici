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
  {
    sku: '41298U',
    nombre: 'Taladro Inalámbrico Percutor 13mm Bauker',
    marca: 'Bauker',
    categoria: 'Taladros',
    precioUnitario: 86990,
    stock: 80,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 35 },
      { sucursal: 'Las Condes', stock: 20 },
      { sucursal: 'Temuco', stock: 15 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: '98214P',
    nombre: 'Esmeril angular eléctrico 4,5" 820W DeWalt',
    marca: 'DeWalt',
    categoria: 'Esmeriles',
    precioUnitario: 54990,
    stock: 110,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 50 },
      { sucursal: 'Las Condes', stock: 30 },
      { sucursal: 'Temuco', stock: 20 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: '55432M',
    nombre: 'Sierra Circular 7 1/4" 1500W Bosch',
    marca: 'Bosch',
    categoria: 'Sierras',
    precioUnitario: 129990,
    stock: 45,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 20 },
      { sucursal: 'Las Condes', stock: 10 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 5 },
    ]
  },
  {
    sku: 'SKU-004',
    nombre: 'Luminaria LED Panel 60x60',
    marca: 'Philips',
    categoria: 'Paneles LED',
    precioUnitario: 24500,
    stock: 75,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 30 },
      { sucursal: 'Las Condes', stock: 25 },
      { sucursal: 'Temuco', stock: 15 },
      { sucursal: 'Puerto Montt', stock: 5 },
    ]
  },
  {
    sku: 'SKU-005',
    nombre: 'Tomacorriente Doble 10A',
    marca: 'BTicino',
    categoria: 'Tomacorrientes',
    precioUnitario: 1890,
    stock: 600,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 200 },
      { sucursal: 'Las Condes', stock: 150 },
      { sucursal: 'Temuco', stock: 150 },
      { sucursal: 'Puerto Montt', stock: 100 },
    ]
  },
  {
    sku: 'TEC-001',
    nombre: 'Notebook HP 15.6" Intel Core i5',
    marca: 'HP',
    categoria: 'Tecnología',
    precioUnitario: 549990,
    stock: 50,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 20 },
      { sucursal: 'Las Condes', stock: 15 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 5 },
    ]
  },
  {
    sku: 'TEC-002',
    nombre: 'Smartphone Samsung Galaxy A54 128GB',
    marca: 'Samsung',
    categoria: 'Tecnología',
    precioUnitario: 329990,
    stock: 120,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 50 },
      { sucursal: 'Las Condes', stock: 40 },
      { sucursal: 'Temuco', stock: 20 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'ELEC-001',
    nombre: 'Refrigerador No Frost 320L Midea',
    marca: 'Midea',
    categoria: 'Electrodomésticos',
    precioUnitario: 289990,
    stock: 30,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 10 },
      { sucursal: 'Las Condes', stock: 8 },
      { sucursal: 'Temuco', stock: 7 },
      { sucursal: 'Puerto Montt', stock: 5 },
    ]
  },
  {
    sku: 'ELEC-002',
    nombre: 'Lavadora Carga Frontal 8kg LG',
    marca: 'LG',
    categoria: 'Electrodomésticos',
    precioUnitario: 349990,
    stock: 25,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 10 },
      { sucursal: 'Las Condes', stock: 5 },
      { sucursal: 'Temuco', stock: 5 },
      { sucursal: 'Puerto Montt', stock: 5 },
    ]
  },
  {
    sku: 'FER-001',
    nombre: 'Set de 100 Brocas para Metal',
    marca: 'Ubermann',
    categoria: 'Ferretería',
    precioUnitario: 29990,
    stock: 200,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 80 },
      { sucursal: 'Las Condes', stock: 60 },
      { sucursal: 'Temuco', stock: 40 },
      { sucursal: 'Puerto Montt', stock: 20 },
    ]
  },
  {
    sku: 'TEC-003',
    nombre: 'Monitor Gamer 27" Curvo Samsung',
    marca: 'Samsung',
    categoria: 'Tecnología',
    precioUnitario: 249990,
    stock: 60,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 25 },
      { sucursal: 'Las Condes', stock: 15 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'ELEC-003',
    nombre: 'Horno Eléctrico 45L Oster',
    marca: 'Oster',
    categoria: 'Electrodomésticos',
    precioUnitario: 79990,
    stock: 90,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 30 },
      { sucursal: 'Las Condes', stock: 30 },
      { sucursal: 'Temuco', stock: 20 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'FER-002',
    nombre: 'Caja de Herramientas Plástica 20"',
    marca: 'Stanley',
    categoria: 'Ferretería',
    precioUnitario: 19990,
    stock: 150,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 60 },
      { sucursal: 'Las Condes', stock: 40 },
      { sucursal: 'Temuco', stock: 30 },
      { sucursal: 'Puerto Montt', stock: 20 },
    ]
  },
  {
    sku: 'TEC-004',
    nombre: 'Teclado Mecánico Gamer Redragon',
    marca: 'Redragon',
    categoria: 'Tecnología',
    precioUnitario: 49990,
    stock: 250,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 100 },
      { sucursal: 'Las Condes', stock: 80 },
      { sucursal: 'Temuco', stock: 40 },
      { sucursal: 'Puerto Montt', stock: 30 },
    ]
  },
  {
    sku: 'ELEC-004',
    nombre: 'Aspiradora Robot iRobot Roomba',
    marca: 'iRobot',
    categoria: 'Electrodomésticos',
    precioUnitario: 299990,
    stock: 40,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 15 },
      { sucursal: 'Las Condes', stock: 10 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 5 },
    ]
  },
  {
    sku: 'FER-003',
    nombre: 'Escalera Telescópica de Aluminio 3.8m',
    marca: 'Klimber',
    categoria: 'Ferretería',
    precioUnitario: 89990,
    stock: 70,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 30 },
      { sucursal: 'Las Condes', stock: 20 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'TEC-005',
    nombre: 'Mouse Inalámbrico Logitech MX Master 3S',
    marca: 'Logitech',
    categoria: 'Tecnología',
    precioUnitario: 99990,
    stock: 300,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 120 },
      { sucursal: 'Las Condes', stock: 100 },
      { sucursal: 'Temuco', stock: 50 },
      { sucursal: 'Puerto Montt', stock: 30 },
    ]
  },
  {
    sku: 'ELEC-005',
    nombre: 'Cafetera de Goteo Programable Thomas',
    marca: 'Thomas',
    categoria: 'Electrodomésticos',
    precioUnitario: 39990,
    stock: 120,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 50 },
      { sucursal: 'Las Condes', stock: 40 },
      { sucursal: 'Temuco', stock: 20 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'FER-004',
    nombre: 'Candado de Seguridad 50mm',
    marca: 'Odis',
    categoria: 'Ferretería',
    precioUnitario: 9990,
    stock: 400,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 150 },
      { sucursal: 'Las Condes', stock: 100 },
      { sucursal: 'Temuco', stock: 100 },
      { sucursal: 'Puerto Montt', stock: 50 },
    ]
  },
  {
    sku: 'TEC-006',
    nombre: 'Audífonos Inalámbricos Sony WH-1000XM5',
    marca: 'Sony',
    categoria: 'Tecnología',
    precioUnitario: 349990,
    stock: 80,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 30 },
      { sucursal: 'Las Condes', stock: 25 },
      { sucursal: 'Temuco', stock: 15 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'ELEC-006',
    nombre: 'Microondas 20L Somela',
    marca: 'Somela',
    categoria: 'Electrodomésticos',
    precioUnitario: 59990,
    stock: 150,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 60 },
      { sucursal: 'Las Condes', stock: 50 },
      { sucursal: 'Temuco', stock: 25 },
      { sucursal: 'Puerto Montt', stock: 15 },
    ]
  },
  {
    sku: 'FER-005',
    nombre: 'Pintura Látex Blanca 1 Galón',
    marca: 'Sipa',
    categoria: 'Ferretería',
    precioUnitario: 12990,
    stock: 500,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 200 },
      { sucursal: 'Las Condes', stock: 150 },
      { sucursal: 'Temuco', stock: 100 },
      { sucursal: 'Puerto Montt', stock: 50 },
    ]
  },
  {
    sku: 'TEC-007',
    nombre: 'Smart TV 55" 4K UHD LG',
    marca: 'LG',
    categoria: 'Tecnología',
    precioUnitario: 429990,
    stock: 60,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 25 },
      { sucursal: 'Las Condes', stock: 15 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'ELEC-007',
    nombre: 'Hervidor Eléctrico 1.7L',
    marca: 'Sindelen',
    categoria: 'Electrodomésticos',
    precioUnitario: 19990,
    stock: 300,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 120 },
      { sucursal: 'Las Condes', stock: 100 },
      { sucursal: 'Temuco', stock: 50 },
      { sucursal: 'Puerto Montt', stock: 30 },
    ]
  },
  {
    sku: 'FER-006',
    nombre: 'Set de Destornilladores de Precisión',
    marca: 'ProsKit',
    categoria: 'Ferretería',
    precioUnitario: 14990,
    stock: 250,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 100 },
      { sucursal: 'Las Condes', stock: 80 },
      { sucursal: 'Temuco', stock: 40 },
      { sucursal: 'Puerto Montt', stock: 30 },
    ]
  },
  {
    sku: 'TEC-008',
    nombre: 'Tablet Apple iPad 10.2" 64GB',
    marca: 'Apple',
    categoria: 'Tecnología',
    precioUnitario: 329990,
    stock: 70,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 30 },
      { sucursal: 'Las Condes', stock: 20 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'ELEC-008',
    nombre: 'Licuadora Reversible Oster',
    marca: 'Oster',
    categoria: 'Electrodomésticos',
    precioUnitario: 69990,
    stock: 110,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 40 },
      { sucursal: 'Las Condes', stock: 30 },
      { sucursal: 'Temuco', stock: 20 },
      { sucursal: 'Puerto Montt', stock: 20 },
    ]
  },
  {
    sku: 'FER-007',
    nombre: 'Huaipe Industrial 5kg',
    marca: 'Genérico',
    categoria: 'Ferretería',
    precioUnitario: 8990,
    stock: 600,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 250 },
      { sucursal: 'Las Condes', stock: 150 },
      { sucursal: 'Temuco', stock: 100 },
      { sucursal: 'Puerto Montt', stock: 100 },
    ]
  },
  {
    sku: 'TEC-009',
    nombre: 'Impresora Multifuncional Epson L3250',
    marca: 'Epson',
    categoria: 'Tecnología',
    precioUnitario: 189990,
    stock: 90,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 35 },
      { sucursal: 'Las Condes', stock: 25 },
      { sucursal: 'Temuco', stock: 20 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'ELEC-009',
    nombre: 'Plancha a Vapor Vertical',
    marca: 'Philips',
    categoria: 'Electrodomésticos',
    precioUnitario: 49990,
    stock: 130,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 50 },
      { sucursal: 'Las Condes', stock: 40 },
      { sucursal: 'Temuco', stock: 20 },
      { sucursal: 'Puerto Montt', stock: 20 },
    ]
  },
  {
    sku: 'FER-008',
    nombre: 'Carretilla 90L',
    marca: 'Truper',
    categoria: 'Ferretería',
    precioUnitario: 45990,
    stock: 80,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 30 },
      { sucursal: 'Las Condes', stock: 20 },
      { sucursal: 'Temuco', stock: 20 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'TEC-010',
    nombre: 'Router Inalámbrico TP-Link Archer C6',
    marca: 'TP-Link',
    categoria: 'Tecnología',
    precioUnitario: 34990,
    stock: 400,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 150 },
      { sucursal: 'Las Condes', stock: 120 },
      { sucursal: 'Temuco', stock: 80 },
      { sucursal: 'Puerto Montt', stock: 50 },
    ]
  },
  {
    sku: 'ELEC-010',
    nombre: 'Batidora de Pedestal KitchenAid',
    marca: 'KitchenAid',
    categoria: 'Electrodomésticos',
    precioUnitario: 499990,
    stock: 20,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 8 },
      { sucursal: 'Las Condes', stock: 7 },
      { sucursal: 'Temuco', stock: 3 },
      { sucursal: 'Puerto Montt', stock: 2 },
    ]
  },
  {
    sku: 'FER-009',
    nombre: 'Silicona Multiuso Transparente 280ml',
    marca: 'Ceys',
    categoria: 'Ferretería',
    precioUnitario: 3990,
    stock: 1000,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 400 },
      { sucursal: 'Las Condes', stock: 300 },
      { sucursal: 'Temuco', stock: 200 },
      { sucursal: 'Puerto Montt', stock: 100 },
    ]
  },
  {
    sku: 'TEC-011',
    nombre: 'Disco Duro Externo 2TB Seagate',
    marca: 'Seagate',
    categoria: 'Tecnología',
    precioUnitario: 64990,
    stock: 180,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 70 },
      { sucursal: 'Las Condes', stock: 60 },
      { sucursal: 'Temuco', stock: 30 },
      { sucursal: 'Puerto Montt', stock: 20 },
    ]
  },
  {
    sku: 'ELEC-011',
    nombre: 'Freidora de Aire 4L',
    marca: 'Recco',
    categoria: 'Electrodomésticos',
    precioUnitario: 49990,
    stock: 200,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 80 },
      { sucursal: 'Las Condes', stock: 70 },
      { sucursal: 'Temuco', stock: 30 },
      { sucursal: 'Puerto Montt', stock: 20 },
    ]
  },
  {
    sku: 'FER-010',
    nombre: 'Guantes de Seguridad de Cuero',
    marca: '3M',
    categoria: 'Ferretería',
    precioUnitario: 5990,
    stock: 800,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 300 },
      { sucursal: 'Las Condes', stock: 250 },
      { sucursal: 'Temuco', stock: 150 },
      { sucursal: 'Puerto Montt', stock: 100 },
    ]
  },
  {
    sku: 'TEC-012',
    nombre: 'Webcam Full HD 1080p Logitech C920',
    marca: 'Logitech',
    categoria: 'Tecnología',
    precioUnitario: 79990,
    stock: 150,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 60 },
      { sucursal: 'Las Condes', stock: 50 },
      { sucursal: 'Temuco', stock: 25 },
      { sucursal: 'Puerto Montt', stock: 15 },
    ]
  },
  {
    sku: 'ELEC-012',
    nombre: 'Ventilador de Torre 40"',
    marca: 'Somela',
    categoria: 'Electrodomésticos',
    precioUnitario: 54990,
    stock: 100,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 40 },
      { sucursal: 'Las Condes', stock: 30 },
      { sucursal: 'Temuco', stock: 20 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'FER-011',
    nombre: 'Cinta de Embalaje Transparente 48mm x 40m',
    marca: '3M',
    categoria: 'Ferretería',
    precioUnitario: 1490,
    stock: 2000,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 800 },
      { sucursal: 'Las Condes', stock: 600 },
      { sucursal: 'Temuco', stock: 400 },
      { sucursal: 'Puerto Montt', stock: 200 },
    ]
  },
  {
    sku: 'TEC-013',
    nombre: 'Power Bank 20000mAh Anker',
    marca: 'Anker',
    categoria: 'Tecnología',
    precioUnitario: 39990,
    stock: 220,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 90 },
      { sucursal: 'Las Condes', stock: 70 },
      { sucursal: 'Temuco', stock: 40 },
      { sucursal: 'Puerto Montt', stock: 20 },
    ]
  },
  {
    sku: 'ELEC-013',
    nombre: 'Estufa Eléctrica Oleoeléctrica',
    marca: 'Wurden',
    categoria: 'Electrodomésticos',
    precioUnitario: 69990,
    stock: 90,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 35 },
      { sucursal: 'Las Condes', stock: 25 },
      { sucursal: 'Temuco', stock: 20 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'FER-012',
    nombre: 'Tornillo para madera 8x2" 100un',
    marca: 'Mamut',
    categoria: 'Ferretería',
    precioUnitario: 4990,
    stock: 1500,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 600 },
      { sucursal: 'Las Condes', stock: 400 },
      { sucursal: 'Temuco', stock: 300 },
      { sucursal: 'Puerto Montt', stock: 200 },
    ]
  },
  {
    sku: 'TEC-014',
    nombre: 'Tarjeta de Memoria MicroSD 128GB SanDisk',
    marca: 'SanDisk',
    categoria: 'Tecnología',
    precioUnitario: 19990,
    stock: 500,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 200 },
      { sucursal: 'Las Condes', stock: 150 },
      { sucursal: 'Temuco', stock: 100 },
      { sucursal: 'Puerto Montt', stock: 50 },
    ]
  },
  {
    sku: 'ELEC-014',
    nombre: 'Juguera Personal Oster',
    marca: 'Oster',
    categoria: 'Electrodomésticos',
    precioUnitario: 29990,
    stock: 180,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 70 },
      { sucursal: 'Las Condes', stock: 60 },
      { sucursal: 'Temuco', stock: 30 },
      { sucursal: 'Puerto Montt', stock: 20 },
    ]
  },
  {
    sku: 'FER-013',
    nombre: 'Mascarilla Desechable 3 Pliegues 50un',
    marca: 'Genérico',
    categoria: 'Ferretería',
    precioUnitario: 2990,
    stock: 3000,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 1200 },
      { sucursal: 'Las Condes', stock: 800 },
      { sucursal: 'Temuco', stock: 600 },
      { sucursal: 'Puerto Montt', stock: 400 },
    ]
  },
  {
    sku: 'TEC-015',
    nombre: 'Parlante Bluetooth JBL Flip 6',
    marca: 'JBL',
    categoria: 'Tecnología',
    precioUnitario: 129990,
    stock: 100,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 40 },
      { sucursal: 'Las Condes', stock: 30 },
      { sucursal: 'Temuco', stock: 20 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'ELEC-015',
    nombre: 'Sandwichera y Waflera 2 en 1',
    marca: 'Black+Decker',
    categoria: 'Electrodomésticos',
    precioUnitario: 34990,
    stock: 140,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 50 },
      { sucursal: 'Las Condes', stock: 40 },
      { sucursal: 'Temuco', stock: 30 },
      { sucursal: 'Puerto Montt', stock: 20 },
    ]
  },
  {
    sku: 'FER-014',
    nombre: 'Alcohol Desnaturalizado 1L',
    marca: ' Winkler',
    categoria: 'Ferretería',
    precioUnitario: 2490,
    stock: 1200,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 500 },
      { sucursal: 'Las Condes', stock: 300 },
      { sucursal: 'Temuco', stock: 200 },
      { sucursal: 'Puerto Montt', stock: 200 },
    ]
  },
  {
    sku: 'TEC-016',
    nombre: 'Apple Watch SE (2da Gen)',
    marca: 'Apple',
    categoria: 'Tecnología',
    precioUnitario: 299990,
    stock: 50,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 20 },
      { sucursal: 'Las Condes', stock: 15 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 5 },
    ]
  },
  {
    sku: 'ELEC-016',
    nombre: 'Secador de Pelo Profesional',
    marca: 'Gama',
    categoria: 'Electrodomésticos',
    precioUnitario: 24990,
    stock: 200,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 80 },
      { sucursal: 'Las Condes', stock: 60 },
      { sucursal: 'Temuco', stock: 40 },
      { sucursal: 'Puerto Montt', stock: 20 },
    ]
  },
  {
    sku: 'FER-015',
    nombre: 'Brocha de Pintura 2"',
    marca: 'Condor',
    categoria: 'Ferretería',
    precioUnitario: 1990,
    stock: 1000,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 400 },
      { sucursal: 'Las Condes', stock: 300 },
      { sucursal: 'Temuco', stock: 200 },
      { sucursal: 'Puerto Montt', stock: 100 },
    ]
  },
  {
    sku: 'TEC-017',
    nombre: 'Chromecast con Google TV 4K',
    marca: 'Google',
    categoria: 'Tecnología',
    precioUnitario: 59990,
    stock: 180,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 70 },
      { sucursal: 'Las Condes', stock: 60 },
      { sucursal: 'Temuco', stock: 30 },
      { sucursal: 'Puerto Montt', stock: 20 },
    ]
  },
  {
    sku: 'ELEC-017',
    nombre: 'Calefont Ionizado 10L',
    marca: 'Splendid',
    categoria: 'Electrodomésticos',
    precioUnitario: 149990,
    stock: 70,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 30 },
      { sucursal: 'Las Condes', stock: 20 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'FER-016',
    nombre: 'Lija de Agua N° 100',
    marca: 'Norton',
    categoria: 'Ferretería',
    precioUnitario: 590,
    stock: 5000,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 2000 },
      { sucursal: 'Las Condes', stock: 1500 },
      { sucursal: 'Temuco', stock: 1000 },
      { sucursal: 'Puerto Montt', stock: 500 },
    ]
  },
  {
    sku: 'TEC-018',
    nombre: 'Kindle Paperwhite 16GB',
    marca: 'Amazon',
    categoria: 'Tecnología',
    precioUnitario: 149990,
    stock: 90,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 35 },
      { sucursal: 'Las Condes', stock: 25 },
      { sucursal: 'Temuco', stock: 20 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'ELEC-018',
    nombre: 'Purificador de Aire',
    marca: 'Xiaomi',
    categoria: 'Electrodomésticos',
    precioUnitario: 129990,
    stock: 60,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 25 },
      { sucursal: 'Las Condes', stock: 15 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'FER-017',
    nombre: 'Pegamento Epóxico 5 Minutos',
    marca: 'Agorex',
    categoria: 'Ferretería',
    precioUnitario: 4590,
    stock: 700,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 300 },
      { sucursal: 'Las Condes', stock: 200 },
      { sucursal: 'Temuco', stock: 100 },
      { sucursal: 'Puerto Montt', stock: 100 },
    ]
  },
  {
    sku: 'TEC-019',
    nombre: 'Nintendo Switch OLED',
    marca: 'Nintendo',
    categoria: 'Tecnología',
    precioUnitario: 369990,
    stock: 40,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 15 },
      { sucursal: 'Las Condes', stock: 10 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 5 },
    ]
  },
  {
    sku: 'ELEC-019',
    nombre: 'Máquina de Coser',
    marca: 'Brother',
    categoria: 'Electrodomésticos',
    precioUnitario: 149990,
    stock: 50,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 20 },
      { sucursal: 'Las Condes', stock: 15 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 5 },
    ]
  },
  {
    sku: 'FER-018',
    nombre: 'WD-40 Multiuso 330ml',
    marca: 'WD-40',
    categoria: 'Ferretería',
    precioUnitario: 4990,
    stock: 1000,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 400 },
      { sucursal: 'Las Condes', stock: 300 },
      { sucursal: 'Temuco', stock: 200 },
      { sucursal: 'Puerto Montt', stock: 100 },
    ]
  },
  {
    sku: 'TEC-020',
    nombre: 'GoPro HERO11 Black',
    marca: 'GoPro',
    categoria: 'Tecnología',
    precioUnitario: 449990,
    stock: 30,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 10 },
      { sucursal: 'Las Condes', stock: 10 },
      { sucursal: 'Temuco', stock: 5 },
      { sucursal: 'Puerto Montt', stock: 5 },
    ]
  },
  {
    sku: 'ELEC-020',
    nombre: 'Dispensador de Agua Frío/Caliente',
    marca: 'Olimpia',
    categoria: 'Electrodomésticos',
    precioUnitario: 99990,
    stock: 80,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 30 },
      { sucursal: 'Las Condes', stock: 25 },
      { sucursal: 'Temuco', stock: 15 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'FER-019',
    nombre: 'Gafas de Seguridad Claras',
    marca: 'Steelpro',
    categoria: 'Ferretería',
    precioUnitario: 2490,
    stock: 1500,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 600 },
      { sucursal: 'Las Condes', stock: 400 },
      { sucursal: 'Temuco', stock: 300 },
      { sucursal: 'Puerto Montt', stock: 200 },
    ]
  },
  {
    sku: 'TEC-021',
    nombre: 'Pendrive 64GB USB 3.0',
    marca: 'Kingston',
    categoria: 'Tecnología',
    precioUnitario: 9990,
    stock: 800,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 300 },
      { sucursal: 'Las Condes', stock: 250 },
      { sucursal: 'Temuco', stock: 150 },
      { sucursal: 'Puerto Montt', stock: 100 },
    ]
  },
  {
    sku: 'ELEC-021',
    nombre: 'Aire Acondicionado Portátil',
    marca: 'Kendall',
    categoria: 'Electrodomésticos',
    precioUnitario: 249990,
    stock: 50,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 20 },
      { sucursal: 'Las Condes', stock: 15 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 5 },
    ]
  },
  {
    sku: 'FER-020',
    nombre: 'Martillo Carpintero 20oz',
    marca: 'Stanley',
    categoria: 'Ferretería',
    precioUnitario: 15990,
    stock: 300,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 120 },
      { sucursal: 'Las Condes', stock: 80 },
      { sucursal: 'Temuco', stock: 60 },
      { sucursal: 'Puerto Montt', stock: 40 },
    ]
  },
  {
    sku: 'TEC-022',
    nombre: 'Cargador de Pared USB-C 20W',
    marca: 'Apple',
    categoria: 'Tecnología',
    precioUnitario: 22990,
    stock: 400,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 150 },
      { sucursal: 'Las Condes', stock: 120 },
      { sucursal: 'Temuco', stock: 80 },
      { sucursal: 'Puerto Montt', stock: 50 },
    ]
  },
  {
    sku: 'ELEC-022',
    nombre: 'Congeladora Horizontal 150L',
    marca: 'Fensa',
    categoria: 'Electrodomésticos',
    precioUnitario: 189990,
    stock: 40,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 15 },
      { sucursal: 'Las Condes', stock: 10 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 5 },
    ]
  },
  {
    sku: 'FER-021',
    nombre: 'Flexómetro 5m',
    marca: 'Stanley',
    categoria: 'Ferretería',
    precioUnitario: 7990,
    stock: 600,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 250 },
      { sucursal: 'Las Condes', stock: 150 },
      { sucursal: 'Temuco', stock: 100 },
      { sucursal: 'Puerto Montt', stock: 100 },
    ]
  },
  {
    sku: 'TEC-023',
    nombre: 'Cable HDMI 2.0 2m',
    marca: 'Genérico',
    categoria: 'Tecnología',
    precioUnitario: 5990,
    stock: 1000,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 400 },
      { sucursal: 'Las Condes', stock: 300 },
      { sucursal: 'Temuco', stock: 200 },
      { sucursal: 'Puerto Montt', stock: 100 },
    ]
  },
  {
    sku: 'ELEC-023',
    nombre: 'Campana de Cocina 60cm',
    marca: 'Teka',
    categoria: 'Electrodomésticos',
    precioUnitario: 89990,
    stock: 60,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 25 },
      { sucursal: 'Las Condes', stock: 15 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'FER-022',
    nombre: 'Zapato de Seguridad',
    marca: 'Norseg',
    categoria: 'Ferretería',
    precioUnitario: 29990,
    stock: 250,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 100 },
      { sucursal: 'Las Condes', stock: 80 },
      { sucursal: 'Temuco', stock: 40 },
      { sucursal: 'Puerto Montt', stock: 30 },
    ]
  },
  {
    sku: 'TEC-024',
    nombre: 'Silla Gamer Ergonómica',
    marca: 'Cougar',
    categoria: 'Tecnología',
    precioUnitario: 189990,
    stock: 50,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 20 },
      { sucursal: 'Las Condes', stock: 15 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 5 },
    ]
  },
  {
    sku: 'ELEC-024',
    nombre: 'Encimera a Gas 4 Platos',
    marca: 'Mademsa',
    categoria: 'Electrodomésticos',
    precioUnitario: 129990,
    stock: 70,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 30 },
      { sucursal: 'Las Condes', stock: 20 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'FER-023',
    nombre: 'Diluyente Duco 1L',
    marca: 'Tricolor',
    categoria: 'Ferretería',
    precioUnitario: 3490,
    stock: 800,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 300 },
      { sucursal: 'Las Condes', stock: 250 },
      { sucursal: 'Temuco', stock: 150 },
      { sucursal: 'Puerto Montt', stock: 100 },
    ]
  },
  {
    sku: 'TEC-025',
    nombre: 'Micrófono de Condensador Blue Yeti',
    marca: 'Blue',
    categoria: 'Tecnología',
    precioUnitario: 139990,
    stock: 80,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 30 },
      { sucursal: 'Las Condes', stock: 25 },
      { sucursal: 'Temuco', stock: 15 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'ELEC-025',
    nombre: 'Horno Empotrable Eléctrico',
    marca: 'FDV',
    categoria: 'Electrodomésticos',
    precioUnitario: 199990,
    stock: 40,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 15 },
      { sucursal: 'Las Condes', stock: 10 },
      { sucursal: 'Temuco', stock: 10 },
      { sucursal: 'Puerto Montt', stock: 5 },
    ]
  },
  {
    sku: 'FER-024',
    nombre: 'Carro de Arrastre Plegable',
    marca: 'Klimber',
    categoria: 'Ferretería',
    precioUnitario: 39990,
    stock: 100,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 40 },
      { sucursal: 'Las Condes', stock: 30 },
      { sucursal: 'Temuco', stock: 20 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'TEC-026',
    nombre: 'Estabilizador de Voltaje 1000VA',
    marca: 'Forza',
    categoria: 'Tecnología',
    precioUnitario: 29990,
    stock: 300,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 120 },
      { sucursal: 'Las Condes', stock: 80 },
      { sucursal: 'Temuco', stock: 60 },
      { sucursal: 'Puerto Montt', stock: 40 },
    ]
  },
  {
    sku: 'ELEC-026',
    nombre: 'Lavavajillas 12 Cubiertos',
    marca: 'Bosch',
    categoria: 'Electrodomésticos',
    precioUnitario: 399990,
    stock: 30,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 10 },
      { sucursal: 'Las Condes', stock: 10 },
      { sucursal: 'Temuco', stock: 5 },
      { sucursal: 'Puerto Montt', stock: 5 },
    ]
  },
  {
    sku: 'FER-025',
    nombre: 'Plancha de Yeso Cartón 10mm',
    marca: 'Volcan',
    categoria: 'Ferretería',
    precioUnitario: 7990,
    stock: 400,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 150 },
      { sucursal: 'Las Condes', stock: 100 },
      { sucursal: 'Temuco', stock: 100 },
      { sucursal: 'Puerto Montt', stock: 50 },
    ]
  },
  {
    sku: 'TEC-027',
    nombre: 'UPS 850VA',
    marca: 'APC',
    categoria: 'Tecnología',
    precioUnitario: 89990,
    stock: 120,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 50 },
      { sucursal: 'Las Condes', stock: 40 },
      { sucursal: 'Temuco', stock: 20 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'ELEC-027',
    nombre: 'Tostador de Pan Eléctrico',
    marca: 'Moulinex',
    categoria: 'Electrodomésticos',
    precioUnitario: 22990,
    stock: 250,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 100 },
      { sucursal: 'Las Condes', stock: 80 },
      { sucursal: 'Temuco', stock: 40 },
      { sucursal: 'Puerto Montt', stock: 30 },
    ]
  },
  {
    sku: 'FER-026',
    nombre: 'Saco de Cemento 25kg',
    marca: 'Melon',
    categoria: 'Ferretería',
    precioUnitario: 4990,
    stock: 1000,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 400 },
      { sucursal: 'Las Condes', stock: 300 },
      { sucursal: 'Temuco', stock: 200 },
      { sucursal: 'Puerto Montt', stock: 100 },
    ]
  },
  {
    sku: 'TEC-028',
    nombre: 'Repetidor de Señal WiFi',
    marca: 'Xiaomi',
    categoria: 'Tecnología',
    precioUnitario: 19990,
    stock: 350,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 140 },
      { sucursal: 'Las Condes', stock: 100 },
      { sucursal: 'Temuco', stock: 60 },
      { sucursal: 'Puerto Montt', stock: 50 },
    ]
  },
  {
    sku: 'ELEC-028',
    nombre: 'Frigobar 93L',
    marca: 'Midea',
    categoria: 'Electrodomésticos',
    precioUnitario: 119990,
    stock: 80,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 30 },
      { sucursal: 'Las Condes', stock: 25 },
      { sucursal: 'Temuco', stock: 15 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  },
  {
    sku: 'FER-027',
    nombre: 'Adhesivo de Montaje',
    marca: 'Titebond',
    categoria: 'Ferretería',
    precioUnitario: 6990,
    stock: 500,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 200 },
      { sucursal: 'Las Condes', stock: 150 },
      { sucursal: 'Temuco', stock: 100 },
      { sucursal: 'Puerto Montt', stock: 50 },
    ]
  },
  {
    sku: 'TEC-029',
    nombre: 'Proyector Portátil Full HD',
    marca: 'Nebula',
    categoria: 'Tecnología',
    precioUnitario: 399990,
    stock: 30,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 10 },
      { sucursal: 'Las Condes', stock: 10 },
      { sucursal: 'Temuco', stock: 5 },
      { sucursal: 'Puerto Montt', stock: 5 },
    ]
  },
  {
    sku: 'ELEC-029',
    nombre: 'Exprimidor de Cítricos Eléctrico',
    marca: 'Somela',
    categoria: 'Electrodomésticos',
    precioUnitario: 17990,
    stock: 280,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 110 },
      { sucursal: 'Las Condes', stock: 90 },
      { sucursal: 'Temuco', stock: 50 },
      { sucursal: 'Puerto Montt', stock: 30 },
    ]
  },
  {
    sku: 'FER-028',
    nombre: 'Malla Raschel 80% 4x5m',
    marca: 'Genérico',
    categoria: 'Ferretería',
    precioUnitario: 15990,
    stock: 400,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 150 },
      { sucursal: 'Las Condes', stock: 100 },
      { sucursal: 'Temuco', stock: 100 },
      { sucursal: 'Puerto Montt', stock: 50 },
    ]
  },
  {
    sku: 'TEC-030',
    nombre: 'Drone DJI Mini 3',
    marca: 'DJI',
    categoria: 'Tecnología',
    precioUnitario: 549990,
    stock: 20,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 8 },
      { sucursal: 'Las Condes', stock: 7 },
      { sucursal: 'Temuco', stock: 3 },
      { sucursal: 'Puerto Montt', stock: 2 },
    ]
  },
  {
    sku: 'ELEC-030',
    nombre: 'Yogurtera Eléctrica',
    marca: 'Blanik',
    categoria: 'Electrodomésticos',
    precioUnitario: 29990,
    stock: 100,
    stockPorSucursal: [
      { sucursal: 'Santiago Centro', stock: 40 },
      { sucursal: 'Las Condes', stock: 30 },
      { sucursal: 'Temuco', stock: 20 },
      { sucursal: 'Puerto Montt', stock: 10 },
    ]
  }
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
