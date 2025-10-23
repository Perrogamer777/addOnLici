import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { mockLicitacionInfo, mockProductosSolicitados } from './data/mockData';
import { useClient } from './hooks/useClient';
import { useTicketIdFromZendesk } from './hooks/useTicketIdFromZendesk';
import { useLicitacionData } from './hooks/useLicitacionData';
import { useIframeAutoResize } from './hooks/useIframeAutoResize';
import { useProductosSoli } from './hooks/useProductosSoliData';
import { useCatalogoProductos } from './hooks/useCatalogoProductos'; 

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
  
  // Estados de Licitación y Productos Solicitados
  const { idLicitacion, loading: loadingTicket, error: errorTicket } = useTicketIdFromZendesk();
  const { data: licitacionData, loading: loadingLicitacion, error: errorLicitacion } = useLicitacionData(idLicitacion);
  const { productos: productosSolicitados, loading: loadingProductos, error: errorProductos } = useProductosSoli(idLicitacion);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedRubro, setSelectedRubro] = useState('');
  const [selectedLinea, setSelectedLinea] = useState('');
  const [selectedFamilia, setSelectedFamilia] = useState('');


const { 
    productos: catalogoProductos, 
    loading: loadingCatalogo, 
    error: errorCatalogo, 
    totalPages: apiTotalPages 
  } = useCatalogoProductos(
    currentPage,
    itemsPorPagina,
    searchTerm,
    selectedRubro,
    selectedLinea,
    selectedFamilia
  );


  const [itemsCotizacion, setItemsCotizacion] = useState([]);
  const [modalStockData, setModalStockData] = useState(null);
  const [toastState, setToastState] = useState('idle');
  const [isMobile, setIsMobile] = useState(false);
  const [showModalGenerarCotizacion, setShowModalGenerarCotizacion] = useState(false);
  const [productAddedToast, setProductAddedToast] = useState('idle');
  const [lastAddedProduct, setLastAddedProduct] = useState(null);
  


  const mainRef = useRef(null);
  useIframeAutoResize(client, mainRef, [
    itemsCotizacion,
    catalogoProductos, 
    currentPage,
    isMobile,
    loadingLicitacion,
    loadingProductos,
    productosSolicitados
  ]);


  const handleConfirmSend = useCallback(() => {
    console.log('Cotización enviada:', { 
      licitacionInfo: licitacionData, 
      items: itemsCotizacion 
    });
    
    setShowModalGenerarCotizacion(false);
    setToastState('visible');
    setTimeout(() => setToastState('exiting'), 4500);
    setTimeout(() => setToastState('idle'), 5000);
    setItemsCotizacion([]);
  }, [itemsCotizacion, licitacionData]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); 
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);


  const totalPages = apiTotalPages || 1; 
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSugerenciaClick = useCallback((descripcion) => {
    setSearchTerm(descripcion.split(' ').slice(0, 2).join(' '));
    setCurrentPage(1);
  }, []);

  const handleAgregarProducto = useCallback((producto, cantidad) => {
    setItemsCotizacion(prev => {

      const existing = prev.find(i => i.sku === producto.sku);
      
      if (existing) {
        const newCantidad = existing.cantidad + cantidad;
        setLastAddedProduct({
          nombre: producto.nombre,
          cantidad: newCantidad,
          isUpdate: true
        });
        
        setProductAddedToast('visible');
        setTimeout(() => setProductAddedToast('exiting'), 2500);
        setTimeout(() => setProductAddedToast('idle'), 3000);
        
        return prev.map(i => i.sku === producto.sku ? { ...i, cantidad: newCantidad } : i);
      } else {
        setLastAddedProduct({
          nombre: producto.nombre,
          cantidad: cantidad,
          isUpdate: false
        });
        
        setProductAddedToast('visible');
        setTimeout(() => setProductAddedToast('exiting'), 2500);
        setTimeout(() => setProductAddedToast('idle'), 3000);
        
        return [...prev, { ...producto, cantidad }];
      }
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
  }, []);

  const handleUpdateCantidad = useCallback((sku, nuevaCantidad) => {
    setItemsCotizacion(prev => 
      prev.map(item => 
        item.sku === sku 
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  }, []);


  // Efecto para resetear la página a 1 si cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRubro, selectedLinea, selectedFamilia]);

  // Mostrar loading de la licitación
  if (loadingTicket || loadingLicitacion) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información de la licitación...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main ref={mainRef} 
      className="bg-gray-100 p-3 lg:p-6 font-sans min-h-screen flex flex-col gap-3 lg:gap-6"
      style={{ minHeight: '750px' }}>
        
        <HeaderInfo info={licitacionData} />
        
        <div className={`flex gap-3 lg:gap-6 flex-1 min-h-0 ${isMobile ? 'flex-col' : ''}`}>
          {/* Columna izquierda */}
          <div className={`flex flex-col gap-3 lg:gap-6 min-h-0 ${isMobile ? 'w-full' : 'w-2/3'}`}>
            <ProductosSolicitados items={productosSolicitados} 
            onSugerenciaClick={handleSugerenciaClick} />
            
            <div className="flex-grow min-h-0">
              <TablaProductos
                productos={catalogoProductos} 
                loading={loadingCatalogo} 
                onAgregar={handleAgregarProducto}
                onStockClick={handleShowStock}
                
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedRubro={selectedRubro}
                setSelectedRubro={setSelectedRubro}
                selectedLinea={selectedLinea}
                setSelectedLinea={setSelectedLinea}
                selectedFamilia={selectedFamilia}
                setSelectedFamilia={setSelectedFamilia}
                currentPage={currentPage}
                totalPages={apiTotalPages}
                onPageChange={handlePageChange}
                
                isMobile={isMobile}
              />
            </div>
          </div>
          
          {/* Columna derecha */}
          <div className={`min-h-0 ${isMobile ? 'w-full order-first' : 'w-1/3'} ${isMobile && itemsCotizacion.length === 0 ? 'hidden' : ''}`}>
            <ResumenCotizacion 
              items={itemsCotizacion} 
              onRemove={handleQuitarProducto} 
              onSave={handleSaveProgress}
              onUpdateCantidad={handleUpdateCantidad}
              onOpenModalGenerarCotizacion={() => setShowModalGenerarCotizacion(true)}
              isMobile={isMobile}
              productAddedToast={productAddedToast}
              lastAddedProduct={lastAddedProduct}
            />
          </div>
        </div>
      </main>
      
      {/* Modales y Toasts */}
      <StockModal producto={modalStockData} onClose={handleCloseStock} />
      {toastState !== 'idle' && <SaveConfirmation toastState={toastState} />}
      
      <ModalGenerarCotizacion
        isOpen={showModalGenerarCotizacion}
        onClose={() => setShowModalGenerarCotizacion(false)}
        licitacionInfo={licitacionData}
        items={itemsCotizacion}
        onConfirmSend={handleConfirmSend}
      />
    </>
  );
}

export default App;