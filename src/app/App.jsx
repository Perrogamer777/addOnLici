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
import SaveConfirmation from './components/SaveConfirmation'; // <-- Se importa el componente del toast

const ITEMS_PER_PAGE = 10;

function App() {
  const client = useClient();
  const [itemsCotizacion, setItemsCotizacion] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalStockData, setModalStockData] = useState(null);
  
  // --- ESTADO PARA LA ANIMACIÓN DEL TOAST ---
  const [toastState, setToastState] = useState('idle'); // 'idle', 'visible', 'exiting'

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
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSugerenciaClick = useCallback((descripcion) => {
    const palabrasClave = descripcion.split(' ').slice(0, 2).join(' ');
    setSearchTerm(palabrasClave);
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
  
  const handleShowStock = useCallback((producto) => {
    setModalStockData(producto);
  }, []);

  const handleCloseStock = useCallback(() => {
    setModalStockData(null);
  }, []);

  // --- FUNCIÓN PARA GUARDAR PROGRESO CON ANIMACIÓN ---
  const handleSaveProgress = useCallback(() => {
    console.log("Guardando progreso...", itemsCotizacion);
    setToastState('visible');
    setTimeout(() => setToastState('exiting'), 4500);
    setTimeout(() => setToastState('idle'), 5000);
  }, [itemsCotizacion]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRubro, selectedLinea, selectedFamilia]);

  return (
    <>
      <main ref={mainRef} className="bg-gray-100 p-6 grid grid-cols-3 gap-6 font-sans">
        <div className="col-span-2 flex flex-col gap-6">
          <HeaderInfo info={mockLicitacionInfo} />
          <ProductosSolicitados items={mockProductosSolicitados} onSugerenciaClick={handleSugerenciaClick} />
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
        <div className="col-span-1">
          {/* Se pasa la nueva función onSave al componente */}
          <ResumenCotizacion items={itemsCotizacion} onRemove={handleQuitarProducto} onSave={handleSaveProgress} />
        </div>
      </main>

      <StockModal producto={modalStockData} onClose={handleCloseStock} />
      
      {/* Se renderiza el toast solo cuando no está 'idle' */}
      {toastState !== 'idle' && <SaveConfirmation toastState={toastState} />}
    </>
  );
}

export default App;

