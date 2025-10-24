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
import StockModal from './components/StockModal'; // Modal "Ver Stock"
import SaveConfirmation from './components/SaveConfirmation';
import ModalGenerarCotizacion from './components/ModalGenerarCotizacion';
import ModalAgregarPorSucursal from './components/ModalAgregarPorSucursal'; // Modal "Agregar por Sucursal"

const itemsPorPagina = 10;

function App() {
  const client = useClient();
  
  // (Estados de Licitación, Productos, Filtros y Paginación - Sin cambios)
  const { idLicitacion, loading: loadingTicket, error: errorTicket } = useTicketIdFromZendesk();
  const { data: licitacionData, loading: loadingLicitacion, error: errorLicitacion } = useLicitacionData(idLicitacion);
  const { productos: productosSolicitados, loading: loadingProductos, error: errorProductos } = useProductosSoli(idLicitacion);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRubro, setSelectedRubro] = useState('');
  const [selectedLinea, setSelectedLinea] = useState('');
  const [selectedFamilia, setSelectedFamilia] = useState('');

  // (Hook de Productos - Sin cambios)
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

  // (Estados de UI y Cotización - Sin cambios)
  const [itemsCotizacion, setItemsCotizacion] = useState([]);
  const [modalStockData, setModalStockData] = useState(null); // Modal "Ver Stock"
  const [toastState, setToastState] = useState('idle');
  const [isMobile, setIsMobile] = useState(false);
  const [showModalGenerarCotizacion, setShowModalGenerarCotizacion] = useState(false);
  const [productAddedToast, setProductAddedToast] = useState('idle');
  const [lastAddedProduct, setLastAddedProduct] = useState(null);
  
  // (Tu estado para el nuevo modal)
  const [modalStockDataSucursal, setModalStockDataSucursal] = useState(null);

  // (useIframeAutoResize y handleConfirmSend - Sin cambios)
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
    // ... (tu lógica de confirmación)
  }, [itemsCotizacion, licitacionData]);

  // (useEffect de isMobile, totalPages, handlePageChange, handleSugerenciaClick - Sin cambios)
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 1024);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const totalPages = apiTotalPages || 1; 
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };
  const handleSugerenciaClick = useCallback((descripcion) => {
    setSearchTerm(descripcion.split(' ').slice(0, 2).join(' '));
    setCurrentPage(1);
  }, []);


  // --- INICIO DE LAS CORRECCIONES ---

  // 1. 'handleAgregarProducto' (MODIFICADO)
  //    Tu lógica de 'sku' y 'toast' se ha movido a 'handleAgregarDesdeSucursal'
  //    Esta función ahora SOLO abre el modal.
  const handleAgregarProducto = useCallback((producto, cantidad) => {
    // 'producto' es el obj traducido de FilaProducto: { sku, nombre, precio... }
    setModalStockDataSucursal({ producto, cantidad });
  }, []);

  // 2. 'handleAgregarDesdeSucursal' (NUEVA FUNCIÓN)
  //    Esta función es llamada por el modal y contiene tu lógica de "toasts"
  const handleAgregarDesdeSucursal = useCallback((producto, sucursal, cantidad) => {
    // 'producto' es el obj { sku, nombre, ... }
    // 'sucursal' es el obj { nombreSucursal, stock }
    const itemId = `${producto.sku}-${sucursal.nombreSucursal}`;
    
    setItemsCotizacion(prev => {
      const existing = prev.find(i => i.id === itemId);
      
      if (existing) {
        // --- Tu lógica de TOAST (para actualizar) ---
        const newCantidad = existing.cantidad + cantidad;
        setLastAddedProduct({
          nombre: producto.nombre,
          cantidad: newCantidad,
          isUpdate: true
        });
        setProductAddedToast('visible');
        setTimeout(() => setProductAddedToast('exiting'), 2500);
        setTimeout(() => setProductAddedToast('idle'), 3000);
        
        return prev.map(i => i.id === itemId ? { ...i, cantidad: newCantidad } : i);
      } else {
        // --- Tu lógica de TOAST (para agregar nuevo) ---
        setLastAddedProduct({
          nombre: producto.nombre,
          cantidad: cantidad,
          isUpdate: false
        });
        setProductAddedToast('visible');
        setTimeout(() => setProductAddedToast('exiting'), 2500);
        setTimeout(() => setProductAddedToast('idle'), 3000);
        
        return [...prev, { 
          ...producto, 
          id: itemId, // ID único (ej: "123-Sucursal A")
          cantidad: cantidad,
          sucursal: sucursal.nombreSucursal // Guarda la sucursal
        }];
      }
    });
    
    setModalStockDataSucursal(null); // Cierra el modal
  }, []);

  // 3. 'handleQuitarProducto' (MODIFICADO)
  //    Actualizado para usar 'itemId' en lugar de 'sku'
  const handleQuitarProducto = useCallback((itemId) => {
    setItemsCotizacion(prev => prev.filter(i => i.id !== itemId));
  }, []);

  // 4. 'handleUpdateCantidad' (MODIFICADO)
  //    Actualizado para usar 'itemId' en lugar de 'sku'
  const handleUpdateCantidad = useCallback((itemId, nuevaCantidad) => {
    setItemsCotizacion(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  }, []);

  // (handleShowStock, handleCloseStock, handleSaveProgress - Sin cambios)
  const handleShowStock = useCallback((producto) => setModalStockData(producto), []);
  const handleCloseStock = useCallback(() => setModalStockData(null), []);
  const handleSaveProgress = useCallback(() => {
    setToastState('visible');
    setTimeout(() => setToastState('exiting'), 4500);
    setTimeout(() => setToastState('idle'), 5000);
  }, []);

  // --- FIN DE LAS CORRECCIONES ---

  // (useEffect de reseteo de página y render de 'loading' - Sin cambios)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRubro, selectedLinea, selectedFamilia]);

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
                onAgregar={handleAgregarProducto} // Esta es la función que abre el modal
                onStockClick={handleShowStock} // Esta es la que abre el modal de "ver"
                
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
              onRemove={handleQuitarProducto} // Esta función ahora usa itemId
              onSave={handleSaveProgress}
              onUpdateCantidad={handleUpdateCantidad} // Esta función ahora usa itemId
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
      
      {/* --- AÑADE EL NUEVO MODAL AQUÍ --- */}
      <ModalAgregarPorSucursal
        modalData={modalStockDataSucursal}
        onClose={() => setModalStockDataSucursal(null)}
        onAgregarDesdeSucursal={handleAgregarDesdeSucursal}
      />
      
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