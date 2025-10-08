import React, { useState, useEffect } from 'react';
import { mockLicitacionInfo, mockCliente, mockProductosSolicitados, mockCatalogoProductos } from './data/mockData';
import { useClient } from './hooks/useClient'; // Se importa el hook para el cliente ZAF

// --- Iconos (Simulados para no requerir dependencias externas) ---
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);


// --- Componentes de la Interfaz ---

const HeaderInfo = ({ info }) => (
    <header className="header-info">
        <div><span>ID Licitación: <strong>{info.id}</strong></span></div>
        <div><span>Cliente: <strong>{info.cliente.nombre}</strong></span></div>
        <div><span>Fecha Cierre: <strong>{info.fechaCierre}</strong></span></div>
    </header>
);

const ProductosSolicitados = ({ items, onSugerenciaClick }) => (
    <div className="card">
        <h3>Productos Solicitados por Cliente</h3>
        <div className="solicitados-list">
            {items.map((item, index) => (
                <div key={index} className="solicitado-item">
                    <div className="item-info">
                        <span>{item.descripcion}</span>
                        <small>Unidades Solicitadas: {item.unidades}</small>
                    </div>
                    <button className="sugerencia-btn" onClick={() => onSugerenciaClick(item.descripcion)}>Ir a sugerencia</button>
                </div>
            ))}
        </div>
    </div>
);

const TablaProductos = ({ productos, onAgregar, searchTerm, setSearchTerm }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Define cuántos productos mostrar por página

    // Lógica de Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = productos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(productos.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    // Resetear a la página 1 cuando cambia el filtro
    useEffect(() => {
        setCurrentPage(1);
    }, [productos]);

    const FilaProducto = ({ producto }) => {
        const [cantidad, setCantidad] = useState(1);
        return (
            <tr>
                <td>{producto.sku}</td>
                <td>{producto.nombre}</td>
                <td>{producto.marca}</td>
                <td>{producto.categoria}</td>
                <td>${producto.precioUnitario.toLocaleString('es-CL')}</td>
                <td>{producto.stock}</td>
                <td className="actions-cell">
                    <input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} />
                    <button onClick={() => onAgregar(producto, cantidad)}>Agregar</button>
                </td>
            </tr>
        );
    };

    return (
        <div className="card">
            <h3>Búsqueda de Productos en Catálogo</h3>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Buscar por SKU, nombre..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select><option>Rubro</option></select>
                <select><option>Línea</option></select>
                <select><option>Familia</option></select>
            </div>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Nombre del Producto</th>
                        <th>Marca</th>
                        <th>Categoría</th>
                        <th>Precio Unit.</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(p => (
                        <FilaProducto key={p.sku} producto={p} />
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                    Siguiente
                </button>
            </div>
        </div>
    );
};


const ResumenCotizacion = ({ items, onRemove }) => {
    const neto = items.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
    const iva = neto * 0.19;
    const total = neto + iva;

    return (
        <aside className="summary-card">
            <h3>Resumen de Cotización</h3>
            <div className="summary-items-list">
                {items.map(item => (
                    <div key={item.sku} className="summary-item">
                        <div className="item-info">
                            <span>{item.nombre}</span>
                            <small>SKU: {item.sku}</small>
                        </div>
                        <div className="item-details">
                            <span>{item.cantidad} x ${item.precioUnitario.toLocaleString('es-CL')}</span>
                            <sub>Subtotal: ${(item.cantidad * item.precioUnitario).toLocaleString('es-CL')}</sub>
                        </div>
                        <button onClick={() => onRemove(item.sku)} className="remove-btn"><TrashIcon /></button>
                    </div>
                ))}
            </div>
            <div className="summary-totals">
                <div className="total-row"><span>Neto</span><span>${Math.round(neto).toLocaleString('es-CL')}</span></div>
                <div className="total-row"><span>IVA (19%)</span><span>${Math.round(iva).toLocaleString('es-CL')}</span></div>
                <div className="total-row grand-total"><strong>Total</strong><strong>${Math.round(total).toLocaleString('es-CL')}</strong></div>
            </div>
            <button className="submit-btn">Generar y Enviar Cotización</button>
        </aside>
    );
};


// --- Componente Principal ---
function App() {
    const client = useClient();
    const [itemsCotizacion, setItemsCotizacion] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(mockCatalogoProductos);

    // Efecto para cambiar el tamaño del addon al cargar
    useEffect(() => {
        if (client) {
            client.invoke('resize', { width: '100%', height: '800px' });
        }
    }, [client]);

    // Efecto para filtrar los productos cuando cambia el término de búsqueda
    useEffect(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        if (lowercasedTerm) {
            const results = mockCatalogoProductos.filter(p =>
                p.nombre.toLowerCase().includes(lowercasedTerm) ||
                p.sku.toLowerCase().includes(lowercasedTerm) ||
                p.categoria.toLowerCase().includes(lowercasedTerm)
            );
            setFilteredProducts(results);
        } else {
            setFilteredProducts(mockCatalogoProductos);
        }
    }, [searchTerm]);

    const handleSugerenciaClick = (descripcion) => {
        // Lógica de búsqueda simple: tomar las primeras palabras clave
        const palabrasClave = descripcion.split(' ').slice(0, 3).join(' ');
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
        <main className="app-layout">
            {/* --- Columna Principal Izquierda --- */}
            <div className="main-content">
                <HeaderInfo info={{...mockLicitacionInfo, cliente: mockCliente}} />
                <ProductosSolicitados items={mockProductosSolicitados} onSugerenciaClick={handleSugerenciaClick} />
                <TablaProductos 
                    productos={filteredProducts} 
                    onAgregar={handleAgregarProducto} 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm} 
                />
            </div>

            {/* --- Barra Lateral Derecha --- */}
            <ResumenCotizacion items={itemsCotizacion} onRemove={handleQuitarProducto} />
        </main>
    );
}

export default App;

