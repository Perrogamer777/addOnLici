import React, { useState, useRef, useCallback, useMemo, useEffect, use } from 'react';
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
import ModalGenerarCotizacion from './components/ModalGenerarCotizacion';

const itemsPorPagina = 10;

function App() {
  const client = useClient();
  const [itemsCotizacion, setItemsCotizacion] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalStockData, setModalStockData] = useState(null);
  const [toastState, setToastState] = useState('idle');
  const [isMobile, setIsMobile] = useState(false);
  const [showModalGenerarCotizacion, setShowModalGenerarCotizacion] = useState(false);

  const {
    filteredProducts,
    selectedRubro, setSelectedRubro,
    selectedLinea, setSelectedLinea,
    selectedFamilia, setSelectedFamilia,
    availableLineas, availableFamilias,
  } = useCatalogFilters(mockCatalogoProductos, searchTerm);

  const mainRef = useRef(null);
  useIframeAutoResize(client, mainRef, [itemsCotizacion, filteredProducts, currentPage, isMobile]);

  const handleConfirmSend = useCallback(() => {

    console.log('Cotización enviada:', { 
      licitacionInfo: mockLicitacionInfo, 
      items: itemsCotizacion 
    });
    
    setShowModalGenerarCotizacion(false);
    setToastState('visible');
    setTimeout(() => setToastState('exiting'), 4500);
    setTimeout(() => setToastState('idle'), 5000);
    setItemsCotizacion([]);
  }, [itemsCotizacion]);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); 
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const totalPages = Math.ceil(filteredProducts.length / itemsPorPagina);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPorPagina;
    return filteredProducts.slice(startIndex, startIndex + itemsPorPagina);
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

  const handleUpdateCantidad = useCallback((sku, nuevaCantidad) => {
    setItemsCotizacion(prev => 
      prev.map(item => 
        item.sku === sku 
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRubro, selectedLinea, selectedFamilia]);

  return (
    <>
      <main ref={mainRef} className="bg-gray-100 p-3 lg:p-6 font-sans min-h-screen flex flex-col gap-3 lg:gap-6">
        {/* Header responsivo */}
        <HeaderInfo info={mockLicitacionInfo} />
        
        <div className={`flex gap-3 lg:gap-6 flex-1 min-h-0 ${isMobile ? 'flex-col' : ''}`}>
          {/* Columna izquierda */}
          <div className={`flex flex-col gap-3 lg:gap-6 min-h-0 ${isMobile ? 'w-full' : 'w-2/3'}`}>
            <ProductosSolicitados items={mockProductosSolicitados} onSugerenciaClick={handleSugerenciaClick} />
            
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
                isMobile={isMobile}
              />
            </div>
          </div>
          
          {/* Columna derecha - se mueve arriba si hay items */}
          <div className={`min-h-0 ${isMobile ? 'w-full order-first' : 'w-1/3'} ${isMobile && itemsCotizacion.length === 0 ? 'hidden' : ''}`}>
            <ResumenCotizacion 
              items={itemsCotizacion} 
              onRemove={handleQuitarProducto} 
              onSave={handleSaveProgress}
              onUpdateCantidad={handleUpdateCantidad}
              onOpenModalGenerarCotizacion={() => setShowModalGenerarCotizacion(true)}
              isMobile={isMobile}
            />
          </div>
        </div>
      </main>
      
      {/* Modales */}
      <StockModal producto={modalStockData} onClose={handleCloseStock} />
      {toastState !== 'idle' && <SaveConfirmation toastState={toastState} />}
      <ModalGenerarCotizacion
        isOpen={showModalGenerarCotizacion}
        onClose={() => setShowModalGenerarCotizacion(false)}
        licitacionInfo={mockLicitacionInfo}
        items={itemsCotizacion}
        onConfirmSend={handleConfirmSend}
      />
    </>
  );
}

export default App;

