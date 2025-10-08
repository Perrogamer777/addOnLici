import React, { useState, useEffect, useRef } from 'react';
import { mockLicitacionInfo, mockProductosSolicitados, mockCatalogoProductos } from './data/mockData';
import { useClient } from './hooks/useClient';

// --- Iconos (Simulados) ---
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;

// --- Componentes de la Interfaz con Tailwind ---

const HeaderInfo = ({ info }) => (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg grid grid-cols-3 gap-4 text-sm">
        <div><span className="font-semibold text-gray-600">ID Licitación:</span> <strong className="font-normal">{info.id}</strong></div>
        <div><span className="font-semibold text-gray-600">Cliente:</span> <strong className="font-normal">{info.cliente.nombre}</strong></div>
        <div><span className="font-semibold text-gray-600">Fecha Cierre:</span> <strong className="font-normal">{info.fechaCierre}</strong></div>
    </div>
);

const ProductosSolicitados = ({ items, onSugerenciaClick }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-0">
        <h3 className="text-lg font-semibold mb-3">Productos Solicitados</h3>
        <div className="flex-grow overflow-y-auto min-h-0">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs text-gray-600 uppercase sticky top-0">
                    <tr>
                        <th className="p-3">SKU Ref.</th>
                        <th className="p-3">Descripción Solicitada</th>
                        <th className="p-3">Categoría</th>
                        <th className="p-3">Unidades</th>
                        <th className="p-3">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="p-3 text-gray-500">{item.sku}</td>
                            <td className="p-3 font-medium text-gray-800">{item.descripcion}</td>
                            <td className="p-3 text-gray-500">{item.categoria}</td>
                            <td className="p-3 font-bold text-center">{item.unidades}</td>
                            <td className="p-3 text-center">
                                <button type="button" className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full hover:bg-blue-200 transition-colors" onClick={() => onSugerenciaClick(item.descripcion)}>
                                    Ir a sugerencia
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const TablaProductos = ({ productos, onAgregar, searchTerm, setSearchTerm }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-0">
            <h3 className="text-lg font-semibold mb-3">Búsqueda de Productos</h3>
            <div className="flex items-center gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Buscar por SKU, nombre..."
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select className="p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"><option>Rubro</option></select>
                <select className="p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"><option>Línea</option></select>
                <select className="p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"><option>Familia</option></select>
            </div>
            <div className="flex-grow overflow-y-auto min-h-0">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-600 uppercase sticky top-0">
                        <tr>
                            <th className="p-3">SKU</th>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Marca</th>
                            <th className="p-3">Categoría</th>
                            <th className="p-3">Precio</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {productos.map(p => (
                           <FilaProducto key={p.sku} producto={p} onAgregar={onAgregar} />
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="flex justify-center items-center mt-4 text-sm">
                <button type="button" className="px-3 py-1 border rounded-md hover:bg-gray-100">Anterior</button>
                <span className="px-3">Página 1 de 10</span>
                <button type="button" className="px-3 py-1 border rounded-md hover:bg-gray-100">Siguiente</button>
            </div>
        </div>
    );
};

const FilaProducto = ({ producto, onAgregar }) => {
    const [cantidad, setCantidad] = useState(1);
    return (
        <tr className="hover:bg-gray-50">
            <td className="p-3">{producto.sku}</td>
            <td className="p-3 font-medium text-gray-900">{producto.nombre}</td>
            <td className="p-3">{producto.marca}</td>
            <td className="p-3">{producto.categoria}</td>
            <td className="p-3">${producto.precioUnitario.toLocaleString('es-CL')}</td>
            <td className="p-3">{producto.stock}</td>
            <td className="p-3 flex items-center gap-2">
                <input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} className="w-16 p-1 border rounded-md text-center" />
                <button type="button" onClick={() => onAgregar(producto, cantidad)} className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-md hover:bg-green-600">Agregar</button>
            </td>
        </tr>
    );
};

const ResumenCotizacion = ({ items, onRemove }) => {
    const neto = items.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
    const iva = neto * 0.19;
    const total = neto + iva;

    return (
        <aside className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full min-h-0">
            <h3 className="text-lg font-semibold mb-3">Resumen de Cotización</h3>
            <br />
            
            <div className="flex-grow space-y-3 overflow-y-auto pr-2 min-h-0">
                {items.length === 0 && <p className="text-sm text-gray-400 text-center mt-8">Agrega productos del catálogo para comenzar a cotizar.</p>}
                {items.map(item => (
                    <div key={item.sku} className="flex items-center justify-between text-sm">
                        <div>
                            <p className="font-semibold text-gray-800">{item.nombre}</p>
                            <p className="text-xs text-gray-500">{item.cantidad} x ${item.precioUnitario.toLocaleString('es-CL')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <strong className="text-gray-900">${(item.cantidad * item.precioUnitario).toLocaleString('es-CL')}</strong>
                            <button type="button" onClick={() => onRemove(item.sku)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon /></button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-auto pt-4 border-t">
                <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between"><span>Neto</span><span>${Math.round(neto).toLocaleString('es-CL')}</span></div>
                    <div className="flex justify-between"><span>IVA (19%)</span><span>${Math.round(iva).toLocaleString('es-CL')}</span></div>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t"><span>Total</span><span>${Math.round(total).toLocaleString('es-CL')}</span></div>
                <button className="w-full mt-4 p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">Generar y Enviar Cotización</button>
            </div>
        </aside>
    );
};

function App() {
    const client = useClient();
    const [itemsCotizacion, setItemsCotizacion] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(mockCatalogoProductos);
    const mainRef = useRef(null);

    // Ajusta dinámicamente la altura del iframe a la altura del contenido en px
    useEffect(() => {
        if (!client) return;
        const el = mainRef.current;
        if (!el) return;

        const resizeToContent = () => {
            const minH = 520; // altura mínima razonable
            const maxH = 1400; // tope para no desbordar demasiado
            const needed = Math.ceil(el.scrollHeight);
            const target = Math.max(minH, Math.min(maxH, needed));
            client.invoke('resize', { width: '100%', height: `${target}px` });
        };

        // Primer ajuste
        resizeToContent();

        const ro = new ResizeObserver(() => resizeToContent());
        ro.observe(el);

        return () => ro.disconnect();
    }, [client, itemsCotizacion, filteredProducts, searchTerm]);

    useEffect(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        if (lowercasedTerm) {
            setFilteredProducts(mockCatalogoProductos.filter(p =>
                p.nombre.toLowerCase().includes(lowercasedTerm) || p.sku.toLowerCase().includes(lowercasedTerm)
            ));
        } else {
            setFilteredProducts(mockCatalogoProductos);
        }
    }, [searchTerm]);

    const handleSugerenciaClick = (descripcion) => {
        const palabrasClave = descripcion.split(' ').slice(0, 2).join(' ');
        setSearchTerm(palabrasClave);
    };

    const handleAgregarProducto = (producto, cantidad) => {
        setItemsCotizacion(prevItems => {
            const existingItem = prevItems.find(item => item.sku === producto.sku);
            if (existingItem) {
                return prevItems.map(item =>
                    item.sku === producto.sku ? { ...item, cantidad: item.cantidad + cantidad } : item
                );
            }
            return [...prevItems, { ...producto, cantidad }];
        });
    };

    const handleQuitarProducto = (sku) => {
        setItemsCotizacion(prevItems => prevItems.filter(item => item.sku !== sku));
    };

    return (
        <main ref={mainRef} className="bg-gray-100 p-6 grid grid-cols-3 gap-6 font-sans h-full min-h-0">
            <div className="col-span-2 flex flex-col gap-6 min-h-0">
                <HeaderInfo info={mockLicitacionInfo} />
                <div className="grid gap-6 flex-1 min-h-0" style={{ gridTemplateRows: 'minmax(0,1fr) minmax(0,2fr)' }}>
                  <ProductosSolicitados items={mockProductosSolicitados} onSugerenciaClick={handleSugerenciaClick} />
                  <TablaProductos
                    productos={filteredProducts}
                    onAgregar={handleAgregarProducto}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </div>
            </div>
            <div className="col-span-1 min-h-0">
                <ResumenCotizacion items={itemsCotizacion} onRemove={handleQuitarProducto} />
            </div>
        </main>
    );
}

export default App;

