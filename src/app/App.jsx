import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { mockLicitacionInfo, mockProductosSolicitados, mockCatalogoProductos } from './data/mockData';
import { useClient } from './hooks/useClient';
import { useCatalogFilters } from './hooks/useCatalogFilters';
import { useIframeAutoResize } from './hooks/useIframeAutoResize';

import HeaderInfo from './components/HeaderInfo';
import ProductosSolicitados from './components/ProductosSolicitados';
import TablaProductos from './components/TablaProductos';
import ResumenCotizacion from './components/ResumenCotizacion';
import StockModal from './components/StockModal';
import SaveConfirmation from './components/SaveConfirmation';

const ITEMS_PER_PAGE = 7;

function App() {
  const client = useClient();
  const [itemsCotizacion, setItemsCotizacion] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalStockData, setModalStockData] = useState(null);
  const [toastState, setToastState] = useState('idle');

  const {
    filteredProducts,
    selectedRubro, setSelectedRubro,
    selectedLinea, setSelectedLinea,
    selectedFamilia, setSelectedFamilia,
    availableLineas, availableFamilias,
  } = useCatalogFilters(mockCatalogoProductos, searchTerm);

  const mainRef = useRef(null);
  useIframeAutoResize(client, mainRef, [itemsCotizacion, filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleSugerenciaClick = useCallback((descripcion) => {
    setSearchTerm(descripcion.split(' ').slice(0, 2).join(' '));
    setCurrentPage(1);
  }, []);

  const handleAgregarProducto = useCallback((producto, cantidad) => {
    setItemsCotizacion(prev => {
      const existing = prev.find(i => i.sku === producto.sku);
      if (existing) return prev.map(i => i.sku === producto.sku ? { ...i, cantidad: i.cantidad + cantidad } : i);
      return [...prev, { ...producto, cantidad }];
    });
  }, []);

  const handleQuitarProducto = useCallback((sku) => {
    setItemsCotizacion(prev => prev.filter(i => i.sku !== sku));
  }, []);

  const handleShowStock = useCallback((producto) => setModalStockData(producto), []);
  const handleCloseStock = useCallback(() => setModalStockData(null), []);

  const handleSaveProgress = useCallback(() => {
    setToastState('visible');
    setTimeout(() => setToastState('exiting'), 4500);
    setTimeout(() => setToastState('idle'), 5000);
  }, [itemsCotizacion]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRubro, selectedLinea, selectedFamilia]);

  return (
    <>
      {/* Contenedor principal con grid de 3 filas */}
      <main ref={mainRef} className="bg-gray-100 p-6 font-sans h-screen flex flex-col gap-6">
        {/* Header que ocupa todo el ancho */}
        <HeaderInfo info={mockLicitacionInfo} />
        
        {/* Grid de 2 columnas para el contenido principal */}
        <div className="flex gap-6 flex-1 min-h-0">
          {/* Columna izquierda con productos solicitados y búsqueda */}
          <div className="w-2/3 flex flex-col gap-6 min-h-0">
            <ProductosSolicitados items={mockProductosSolicitados} onSugerenciaClick={handleSugerenciaClick} />
            {/* Este div permite que la tabla crezca para ocupar el espacio restante */}
            <div className="flex-grow min-h-0">
              <TablaProductos
                productos={paginatedProducts}
                onAgregar={handleAgregarProducto}
                onStockClick={handleShowStock}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedRubro={selectedRubro}
                setSelectedRubro={(val) => { setSelectedRubro(val); setSelectedLinea(''); setSelectedFamilia(''); }}
                selectedLinea={selectedLinea}
                setSelectedLinea={(val) => { setSelectedLinea(val); setSelectedFamilia(''); }}
                selectedFamilia={selectedFamilia}
                setSelectedFamilia={setSelectedFamilia}
                availableLineas={availableLineas}
                availableFamilias={availableFamilias}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
          
          {/* Columna derecha con resumen de cotización */}
          <div className="w-1/3 min-h-0">
            <ResumenCotizacion items={itemsCotizacion} onRemove={handleQuitarProducto} onSave={handleSaveProgress} />
          </div>
        </div>
      </main>
      <StockModal producto={modalStockData} onClose={handleCloseStock} />
      {toastState !== 'idle' && <SaveConfirmation toastState={toastState} />}
    </>
  );
}

export default App;

