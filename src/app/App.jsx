import React, { useState, useRef, useCallback, useEffect,useMemo } from 'react';
import { useClient } from './hooks/useClient';
import { useTicketIdFromZendesk } from './hooks/useTicketIdFromZendesk';
import { useLicitacionData } from './hooks/useLicitacionData';
import { useIframeAutoResize } from './hooks/useIframeAutoResize';
import { useProductosSoli } from './hooks/useProductosSoliData';
import { useObtenerSugerencia } from './hooks/useObtenerSugerencia';

import HeaderInfo from './components/HeaderInfo';
import ProductosSolicitados from './components/ProductosSolicitados';
import ResumenCotizacion from './components/ResumenCotizacion';
import StockModal from './components/StockModal';
import SaveConfirmation from './components/SaveConfirmation';
import ModalGenerarCotizacion from './components/ModalGenerarCotizacion';
import ModalAgregarPorSucursal from './components/ModalAgregarPorSucursal';
import ModalBuscarProductos from './components/ModalBuscarProductos';
import ModalReporteAgregado from './components/ModalReporteAgregado';



function App() {
  const client = useClient();

  // Estados de Licitación y Productos Solicitados
  const { idLicitacion, loading: loadingTicket, error: errorTicket } = useTicketIdFromZendesk();
  const { data: licitacionData, loading: loadingLicitacion, error: errorLicitacion } = useLicitacionData(idLicitacion);
  const { productos: productosSolicitados, loading: loadingProductos, error: errorProductos } = useProductosSoli(idLicitacion);
  const { obtenerSugerencia } = useObtenerSugerencia();
  const [isLoadingSugerencia, setIsLoadingSugerencia] = useState(null);
  const [isLoadingSugerencias, setIsLoadingSugerencias] = useState(false);
  const [sugerenciasAgregadas, setSugerenciasAgregadas] = useState(false);


  // Estados de UI y Cotización
  const [itemsCotizacion, setItemsCotizacion] = useState([]);
  const [modalStockData, setModalStockData] = useState(null);
  const [toastState, setToastState] = useState('idle');
  const [isMobile, setIsMobile] = useState(false);
  const [showModalGenerarCotizacion, setShowModalGenerarCotizacion] = useState(false);
  const [productAddedToast, setProductAddedToast] = useState('idle');
  const [lastAddedProduct, setLastAddedProduct] = useState(null);
  const [modalStockDataSucursal, setModalStockDataSucursal] = useState(null);
  const [isBusquedaOpen, setIsBusquedaOpen] = useState(false);
  const [initialSearchTerm, setInitialSearchTerm] = useState('');
  const [skuSolicitadoActual, setSkuSolicitadoActual] = useState(null); // Para rastrear qué producto se está reemplazando
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reporteItemsFallidos, setReporteItemsFallidos] = useState([]);
  const [skuRecienAgregado, setSkuRecienAgregado] = useState(null); // Para destacar el producto en la tabla



  const mainRef = useRef(null);
  useIframeAutoResize(client, mainRef, [
    itemsCotizacion,
    isMobile,
    loadingLicitacion,
    loadingProductos,
    productosSolicitados
  ]);

// Función para agregar todas las sugerencias
  const handleAgregarTodasSugerencias = useCallback(async () => {
    setIsLoadingSugerencias(true);
    setReporteItemsFallidos([]); 

    const skusEnCotizacion = new Set(itemsCotizacion.map(item => item.originalSolicitadoSku));
    const itemsParaBuscar = productosSolicitados.filter(
      p => !skusEnCotizacion.has(p.sku)
    );

    if (itemsParaBuscar.length === 0) {
      console.log("No hay productos nuevos para agregar.");
      setIsLoadingSugerencias(false);
      return;
    }

    const promesas = itemsParaBuscar.map(item => obtenerSugerencia(item));
    const resultados = await Promise.allSettled(promesas);
    const itemsNuevosParaCotizacion = [];
    const itemsFallidosParaReporte = []; 

  resultados.forEach((res, index) => {
      const itemSolicitadoOriginal = itemsParaBuscar[index]; // El producto que se solicitó

      if (res.status === 'fulfilled' && res.value !== null) {
        const { producto, cantidad, originalSku } = res.value;

        if (producto.stockTotal > 0) {
          itemsNuevosParaCotizacion.push({
            id: `${producto.id}-PENDIENTE`, 
            sku: producto.id,
            nombre: `${producto.nombreCobol} (Suc. por asignar)`,
            // Precio de tienda desde BD
            precioTienda: producto.precioUnitario || 0,
            precioUnitario: producto.precioUnitario || 0,
            // Precio final editable 
            precioFinal: (producto.precioUnitario || 0),
            cantidad: cantidad,
            sucursal: null,
            originalSolicitadoSku: originalSku
          });
        } else {
          itemsFallidosParaReporte.push({
            ...itemSolicitadoOriginal,
            razon: "Sugerencia encontrada sin stock"
          });
        }
      } else {
        itemsFallidosParaReporte.push({
          ...itemSolicitadoOriginal,
          razon: "No se encontró sugerencia"
        });
      }
    });


    if (itemsNuevosParaCotizacion.length > 0) {
      setItemsCotizacion(prevItems => [...prevItems, ...itemsNuevosParaCotizacion]);
      setSugerenciasAgregadas(true); // Activar el botón de limpiar
    }
    console.log(`Se agregaron ${itemsNuevosParaCotizacion.length} productos.`);
    console.log(`Fallaron ${itemsFallidosParaReporte.length} productos.`);

    setReporteItemsFallidos(itemsFallidosParaReporte);
    setIsReportModalOpen(true);
    setIsLoadingSugerencias(false);

  }, [productosSolicitados, itemsCotizacion, obtenerSugerencia]);

  // Función para limpiar/quitar las sugerencias agregadas automáticamente
  const handleLimpiarSugerencias = useCallback(() => {
    // Filtra solo los items que tienen -PENDIENTE en su ID
    setItemsCotizacion(prevItems => 
      prevItems.filter(item => !item.id.includes('-PENDIENTE'))
    );
    setSugerenciasAgregadas(false);
  }, []);


  // funcion para reasignar sucursal a un item que se agregó con las sugerencias
  const handleReasignarSucursal = useCallback((itemParaAsignar) => {

    setItemsCotizacion(prev => prev.filter(i => i.id !== itemParaAsignar.id));
  
    const productoParaModal = {
      id: itemParaAsignar.sku,
      nombreCobol: itemParaAsignar.nombre.replace(' (Suc. por asignar)', ''), 
      precioUnitario: itemParaAsignar.precioUnitario
    };
    
    setModalStockDataSucursal({
      producto: productoParaModal,
      cantidad: itemParaAsignar.cantidad,
      originalSku: itemParaAsignar.originalSolicitadoSku
    });

  }, []); 


  const handleSugerenciaClick = async (itemSolicitado) => {
    setIsLoadingSugerencia(itemSolicitado.sku);
    
    try {
      const resultado = await obtenerSugerencia(itemSolicitado);
      if (resultado) {
        setModalStockDataSucursal(resultado);
      } else {
        // Si no hay sugerencia, abrir búsqueda vinculada al SKU solicitado
        handleBuscarProductoClick(itemSolicitado.descripcion, itemSolicitado.sku);
      }

    } catch (error) {
      console.error("Fallo al obtener sugerencia:", error);
      handleBuscarProductoClick(itemSolicitado.descripcion, itemSolicitado.sku);
    } finally {
      setIsLoadingSugerencia(null); 
    }
  };

  const handleBuscarProductoClick = useCallback((terminoBusqueda, skuSolicitado = null) => {
    console.log("Buscar producto clickeado con término:", terminoBusqueda); 
    setInitialSearchTerm(terminoBusqueda); 
    setSkuSolicitadoActual(skuSolicitado); // Guardar el SKU solicitado si se está reemplazando
    setIsBusquedaOpen(true); 
  }, []); 


  const handleConfirmSend = useCallback(() => { /* ... */ }, [itemsCotizacion, licitacionData]);
  useEffect(() => { /* ... */ }, []);


const handleAgregarProductoDesdeModal = useCallback((producto, cantidad) => {

    const productoParaModalSucursal = {
        id: producto.sku,       
        nombreCobol: producto.nombre, 
        precioUnitario: producto.precioUnitario || 0, 
    };

  // se incluye el SKU solicitado actual para mantener la referencia
  setModalStockDataSucursal({ producto: productoParaModalSucursal, cantidad, originalSku: skuSolicitadoActual });
    setIsBusquedaOpen(false); 
  }, []);


  const handleAgregarDesdeSucursal = useCallback((producto, sucursal, cantidad, originalSku) => { 
      const itemId = `${producto.id}-${sucursal.nombreSucursal}`;
      
      // usar el originalSku
      const skuFinal = skuSolicitadoActual || originalSku;
      
      const nuevoItem = {
        id: itemId,
        sku: producto.id,
        nombre: `${producto.nombreCobol} (Suc. ${sucursal.nombreSucursal})`,
        // Precio de tienda desde BD
        precioTienda: producto.precioUnitario || 0,
        // Mantener compatibilidad
        precioUnitario: producto.precioUnitario || 0,
        // Precio final editable (inicia igual al de tienda)
        precioFinal: (producto.precioUnitario || 0),
        cantidad: cantidad,
        sucursal: sucursal.nombreSucursal,
        originalSolicitadoSku: skuFinal
      };

      setItemsCotizacion(prevItems => {
        // Si estamos en modo reemplazo, eliminar productos anteriores con el mismo SKU solicitado
        let itemsFiltrados = prevItems;
        if (skuSolicitadoActual) {
          itemsFiltrados = prevItems.filter(item => item.originalSolicitadoSku !== skuSolicitadoActual);
        }
        
        const itemExistente = itemsFiltrados.find(item => item.id === itemId);
        if (itemExistente) {
          return itemsFiltrados.map(item =>
            item.id === itemId
              ? { ...item, cantidad: item.cantidad + cantidad } 
              : item
          );
        }
        return [...itemsFiltrados, nuevoItem];
      });

      setModalStockDataSucursal(null);
      setSkuSolicitadoActual(null); // Limpiar el SKU solicitado después de agregar
      
      // Destacar el producto solicitado 
      setSkuRecienAgregado(skuFinal);
      setTimeout(() => setSkuRecienAgregado(null), 3000); // quitar efecto de destacado en 3 segundos
  }, [skuSolicitadoActual]);

  // Función para destacar un producto al hacer clic en el sku de referencia
  const handleDestacarProducto = useCallback((sku) => {
    setSkuRecienAgregado(sku);
    setTimeout(() => setSkuRecienAgregado(null), 3000);
  }, []);

const skusAgregados = useMemo(() => 
    new Set(itemsCotizacion.map(item => item.originalSolicitadoSku)),
    [itemsCotizacion]
  );

  const handleQuitarProducto = useCallback((itemId) => {
      setItemsCotizacion(prev => prev.filter(i => i.id !== itemId));
  }, []);
  const handleUpdateCantidad = useCallback((itemId, nuevaCantidad) => {
      setItemsCotizacion(prev => prev.map(item => item.id === itemId ? { ...item, cantidad: nuevaCantidad } : item));
  }, []);
  const handleUpdatePrecioFinal = useCallback((itemId, nuevoPrecio) => {
    const precioNumber = Number.isFinite(nuevoPrecio) ? nuevoPrecio : 0;
    setItemsCotizacion(prev => prev.map(item => item.id === itemId ? { ...item, precioFinal: precioNumber } : item));
  }, []);


  const handleShowStock = useCallback((producto) => {    
      setModalStockData(producto); 
  }, []);
  const handleCloseStock = useCallback(() => setModalStockData(null), []);
  const handleSaveProgress = useCallback(() => { /* ... */ }, []);


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
      <main ref={mainRef} className="...">
        <HeaderInfo info={licitacionData} />
        <br />
        {/* Contenedor principal */}
        <div className="flex flex-col gap-3 lg:gap-6 w-full">
          <ProductosSolicitados
            items={productosSolicitados}
            onBuscarProductoClick={handleBuscarProductoClick}
            onSugerenciaClick={handleSugerenciaClick}
            loadingSku={isLoadingSugerencia}
            skusAgregados={skusAgregados}
            onAgregarTodas={handleAgregarTodasSugerencias}
            isLoadingSugerencias={isLoadingSugerencias}
            onLimpiarSugerencias={handleLimpiarSugerencias}
            sugerenciasAgregadas={sugerenciasAgregadas}
            skuRecienAgregado={skuRecienAgregado}
          />


          {/* ResumenCotizacion */}
          <ResumenCotizacion
            items={itemsCotizacion}
            onRemove={handleQuitarProducto}
            onSave={handleSaveProgress}
            onUpdateCantidad={handleUpdateCantidad}
            onUpdatePrecioFinal={handleUpdatePrecioFinal}
            onOpenModalGenerarCotizacion={() => setShowModalGenerarCotizacion(true)}
            isMobile={isMobile}
            productAddedToast={productAddedToast}
            lastAddedProduct={lastAddedProduct}
            onReasignarSucursal={handleReasignarSucursal}
            onDestacarProducto={handleDestacarProducto}
          />
        </div>
      </main>

 
      {/* Modal para Ver Stock */}
      <StockModal producto={modalStockData} onClose={handleCloseStock} />

      {/* Modal para Agregar por Sucursal */}
      <ModalAgregarPorSucursal
        modalData={modalStockDataSucursal}
        onClose={() => setModalStockDataSucursal(null)}
        onAgregarDesdeSucursal={handleAgregarDesdeSucursal}
      />

      {/* Modal para Buscar Productos */}
      <ModalBuscarProductos
        isOpen={isBusquedaOpen}
        onClose={() => setIsBusquedaOpen(false)}
        onProductoSeleccionado={handleAgregarProductoDesdeModal} 
        onStockClick={handleShowStock} 
      />
      {/* Modal de Reporte de Agregado Automático */}
      <ModalReporteAgregado
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        items={reporteItemsFallidos}
      />

      {toastState !== 'idle' && <SaveConfirmation toastState={toastState} />}
      <ModalGenerarCotizacion isOpen={showModalGenerarCotizacion} /*...*/ />
    </>
  );
}

export default App;