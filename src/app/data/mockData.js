// src/app/data/mockData.js

export const mockLicitacionInfo = {
  id: 'LIC-6927',
  fechaCierre: '03/10/2025',
};

export const mockCliente = {
  nombre: 'Carnes Ñuble S.A.',
  rut: '76.999.888-0',
  comentarios: 'Precio final debe incluir producto puesto en planta, Av Balmaceda 8010, Valdivia, región LOS RIOS.',
};

// Lista de productos que el cliente solicita en la licitación
export const mockProductosSolicitados = [
  { id: 'REQ-001', unidades: 5, descripcion: 'Taladro inalámbrico percutor de 13mm', certificado: 'Certificación SEC' },
  { id: 'REQ-002', unidades: 10, descripcion: 'Esmeril angular de 4,5 pulgadas', certificado: 'Certificación IEC' },
  { id: 'REQ-003', unidades: 20, descripcion: 'Caja de herramientas metálica con 5 cajones' },
];

// Catálogo de productos disponibles en tu empresa
export const mockCatalogoProductos = [
  { 
    sku: '2119021', 
    nombre: 'Taladro Percutor 13mm Bauker', 
    marca: 'Bauker',
    precioUnitario: 86990, 
    stock: 80, 
    rulifa: { rubro: 'Ferretería', familia: 'Taladros', linea: 'Herramientas Eléctricas' }
  },
  { 
    sku: '34511X', 
    nombre: 'Esmeril Angular 4,5" 820W Bosch', 
    marca: 'Bosch',
    precioUnitario: 45990, 
    stock: 120, 
    rulifa: { rubro: 'Ferretería', familia: 'Esmeriles', linea: 'Herramientas Eléctricas' }
  },
  { 
    sku: '78966P', 
    nombre: 'Caja Metálica 5 Gavetas Ubermann', 
    marca: 'Ubermann',
    precioUnitario: 89990, 
    stock: 45, 
    rulifa: { rubro: 'Ferretería', familia: 'Almacenamiento', linea: 'Herramientas Manuales' }
  },
  { 
    sku: '11234Q', 
    nombre: 'Rotomartillo SDS Plus 800W Makita', 
    marca: 'Makita',
    precioUnitario: 179990, 
    stock: 30, 
    rulifa: { rubro: 'Ferretería', familia: 'Rotomartillos', linea: 'Herramientas Eléctricas' }
  },
  // Productos del mercado chileno
  {
    sku: 'CL-CEM-25001',
    nombre: 'Cemento Melón Saco 25 kg',
    marca: 'Melón',
    precioUnitario: 6990,
    stock: 200,
    rulifa: { rubro: 'Construcción', familia: 'Cementos', linea: 'Materiales' }
  },
  {
    sku: 'CL-OSB-11002',
    nombre: 'Plancha OSB 11 mm 1.22x2.44 m LP',
    marca: 'LP',
    precioUnitario: 13990,
    stock: 60,
    rulifa: { rubro: 'Construcción', familia: 'Maderas y Tableros', linea: 'Tableros OSB' }
  },
  {
    sku: 'CL-PIN-1GAL03',
    nombre: 'Pintura Látex Interior 1 Gal Ceresita Blanco',
    marca: 'Ceresita',
    precioUnitario: 24990,
    stock: 90,
    rulifa: { rubro: 'Pinturas', familia: 'Látex Interior', linea: 'Pinturas y Químicos' }
  },
  {
    sku: 'CL-SIL-28004',
    nombre: 'Silicona Acética Transparente 280 ml',
    marca: 'Sika',
    precioUnitario: 2990,
    stock: 150,
    rulifa: { rubro: 'Ferretería', familia: 'Sellantes', linea: 'Adhesivos y Sellantes' }
  },
  {
    sku: 'CL-PPR-2005',
    nombre: 'Tubo PPR 20 mm PN20',
    marca: 'Tigre',
    precioUnitario: 1290,
    stock: 500,
    rulifa: { rubro: 'Gasfitería', familia: 'PPR', linea: 'Cañerías y Fittings' }
  },
  {
    sku: 'CL-PPR-ELB20-06',
    nombre: 'Codo PPR 20 mm 90°',
    marca: 'Tigre',
    precioUnitario: 490,
    stock: 800,
    rulifa: { rubro: 'Gasfitería', familia: 'PPR', linea: 'Cañerías y Fittings' }
  },
  {
    sku: 'CL-THHN-25-07',
    nombre: 'Cable THHN 2.5 mm² Rollo 100 m',
    marca: 'Prysmian',
    precioUnitario: 89990,
    stock: 25,
    rulifa: { rubro: 'Electricidad', familia: 'Cables', linea: 'Conductores' }
  },
  {
    sku: 'CL-BTI-INT10-08',
    nombre: 'Interruptor Simple 10A',
    marca: 'BTicino',
    precioUnitario: 3990,
    stock: 140,
    rulifa: { rubro: 'Electricidad', familia: 'Interruptores', linea: 'Mecanismos' }
  },
  {
    sku: 'CL-LED-9W-09',
    nombre: 'Ampolleta LED 9W E27 6500K',
    marca: 'Philips',
    precioUnitario: 1990,
    stock: 300,
    rulifa: { rubro: 'Electricidad', familia: 'Iluminación', linea: 'Ampolletas' }
  },
  {
    sku: 'CL-EPP-GUAN-10',
    nombre: 'Guantes Nitrilo Talla M',
    marca: 'Ansell',
    precioUnitario: 1990,
    stock: 250,
    rulifa: { rubro: 'Seguridad', familia: 'Guantes', linea: 'EPP' }
  },
  {
    sku: 'CL-TRU-MAR16-11',
    nombre: 'Martillo Carpintero 16 oz',
    marca: 'Truper',
    precioUnitario: 7990,
    stock: 110,
    rulifa: { rubro: 'Ferretería', familia: 'Martillos', linea: 'Herramientas Manuales' }
  },
  {
    sku: 'CL-PRE-CARR-12',
    nombre: 'Carretilla 90 L Estructura Acero',
    marca: 'Pretul',
    precioUnitario: 59990,
    stock: 40,
    rulifa: { rubro: 'Construcción', familia: 'Carretillas', linea: 'Herramientas de Obra' }
  },
  {
    sku: 'CL-AIS-20MM-13',
    nombre: 'Plancha Aislapol 20 mm 1x2 m',
    marca: 'Aislapol',
    precioUnitario: 4990,
    stock: 75,
    rulifa: { rubro: 'Construcción', familia: 'Aislación', linea: 'Poliestireno Expandido' }
  },
  {
    sku: 'CL-DRY-6X1-14',
    nombre: 'Tornillo para Volcanita 6x1" Punta Fina',
    marca: 'Fixser',
    precioUnitario: 5900,
    stock: 95,
    rulifa: { rubro: 'Ferretería', familia: 'Tornillos', linea: 'Drywall' }
  }
];

