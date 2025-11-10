import React, { useState, useRef, useCallback, useEffect,useMemo } from 'react';
import { useClient } from './hooks/useClient';
import { useTicketIdFromZendesk } from './hooks/useTicketIdFromZendesk';
import { useLicitacionData } from './hooks/useLicitacionData';
import { useIframeAutoResize } from './hooks/useIframeAutoResize';
import { useProductosSoli } from './hooks/useProductosSoliData';
import { useObtenerSugerencia } from './hooks/useObtenerSugerencia';

const API_BASE_URL = 'http://localhost:8080/datos-internos';

import HeaderInfo from './components/HeaderInfo';
import ProductosSolicitados from './components/ProductosSolicitados';
import ResumenCotizacion from './components/ResumenCotizacion';
import StockModal from './components/StockModal';
import SaveConfirmation from './components/SaveConfirmation';
import ModalGenerarCotizacion from './components/ModalGenerarCotizacion';

import ModalBuscarProductos from './components/ModalBuscarProductos';
import ModalReporteAgregado from './components/ModalReporteAgregado';
import { useResumenCotizacion } from './hooks/useResumenCotizacion';



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
  const [skusSinSugerencia, setSkusSinSugerencia] = useState(new Set());


  // Estados de UI y Cotización
  const [itemsCotizacion, setItemsCotizacion] = useState([]);
  const [modalStockData, setModalStockData] = useState(null);
  const [toastState, setToastState] = useState('idle');
  const [isMobile, setIsMobile] = useState(false);
  const [showModalGenerarCotizacion, setShowModalGenerarCotizacion] = useState(false);
  const [productAddedToast, setProductAddedToast] = useState('idle');
  const [lastAddedProduct, setLastAddedProduct] = useState(null);

  const [isBusquedaOpen, setIsBusquedaOpen] = useState(false);
  const [initialSearchTerm, setInitialSearchTerm] = useState('');
  const [nombreProductoOrigen, setNombreProductoOrigen] = useState('');
  const [skuSolicitadoActual, setSkuSolicitadoActual] = useState(null); 
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reporteItemsFallidos, setReporteItemsFallidos] = useState([]);
  const [skuRecienAgregado, setSkuRecienAgregado] = useState(null);
  
  // Resumen persistente (carga/guardado)
  const {
    itemsCotizacion: itemsGuardados,
    isLoadingResumen,
    isSavingResumen,
    guardarResumen,
    lastSavedAt,
  } = useResumenCotizacion(idLicitacion);



  const mainRef = useRef(null);
  useIframeAutoResize(client, mainRef, [
    itemsCotizacion,
    isMobile,
    loadingLicitacion,
    loadingProductos,
    productosSolicitados
  ]);

  // Cargar items guardados si existen y aún no hemos cargado nada localmente
  useEffect(() => {
    if (!isLoadingResumen && itemsCotizacion.length === 0 && (itemsGuardados?.length || 0) > 0) {
      setItemsCotizacion(itemsGuardados);
    }
  }, [isLoadingResumen, itemsGuardados]);

  // Limpiar nombres legacy que puedan tener sucursales incluidas
  useEffect(() => {
    if (itemsCotizacion.length > 0) {
      const itemsLimpiados = itemsCotizacion.map(item => {
        const nombreOriginal = item.nombre || '';
        const indiceSuc = nombreOriginal.lastIndexOf(' (Suc.');
        
        if (indiceSuc !== -1) {
          // Este item tiene un nombre legacy con sucursales, limpiarlo
          const nombreLimpio = nombreOriginal.substring(0, indiceSuc).trim();
          return { ...item, nombre: nombreLimpio };
        }
        
        return item; // Sin cambios si ya está limpio
      });
      
      // Solo actualizar si hubo cambios
      const hayItemsModificados = itemsLimpiados.some((item, index) => 
        item.nombre !== itemsCotizacion[index].nombre
      );
      
      if (hayItemsModificados) {
        setItemsCotizacion(itemsLimpiados);
      }
    }
  }, [itemsCotizacion]);

  // Crear mapa de SKU y descripción de productos solicitados
  const mapaProductosSolicitados = useMemo(() => {
    const mapa = new Map();
    productosSolicitados.forEach(producto => {
      mapa.set(producto.sku, producto.descripcion);
    });
    return mapa;
  }, [productosSolicitados]);

// Función para agregar todas las sugerencias automáticamente con cantidad 0
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

    console.log(" [handleAgregarTodasSugerencias] Iniciando búsqueda masiva para items:", itemsParaBuscar);
    const promesas = itemsParaBuscar.map((item, index) => {
      console.log(` [handleAgregarTodasSugerencias] Item ${index + 1}/${itemsParaBuscar.length}:`, item);
      return obtenerSugerencia(item);
    });
    const resultados = await Promise.allSettled(promesas);
    console.log(" [handleAgregarTodasSugerencias] Resultados de búsqueda masiva:", resultados);
    const itemsNuevosParaCotizacion = [];
    const itemsFallidosParaReporte = []; 

    resultados.forEach((res, index) => {
      const itemSolicitadoOriginal = itemsParaBuscar[index];

      if (res.status === 'fulfilled' && res.value !== null) {
        const { producto, cantidad, originalSku } = res.value;

        if (producto.stockTotal > 0) {
          itemsNuevosParaCotizacion.push({
            id: `${producto.id}-PENDIENTE-${Date.now()}-${index}`,
            sku: producto.id,
            nombre: `${producto.nombreCobol}`,
            marca: producto.marca,
            categoria: producto.categoria,
            precioTienda: producto.precioUnitario || 0,
            precioUnitario: producto.precioUnitario || 0,
            precioFinal: (producto.precioUnitario || 0),
            cantidad: 0, // Cantidad inicial en 0
            sucursal: null, // Sucursal pendiente
            originalSolicitadoSku: originalSku,
            originalSolicitadoNombre: mapaProductosSolicitados.get(originalSku) || null,
            cantidadSolicitada: cantidad, // Guardar la cantidad solicitada original
            esAgregadoMasivo: true // para identificar sugerencias agregadas masivamente
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
    
    console.log(`Se agregaron ${itemsNuevosParaCotizacion.length} productos con cantidad 0.`);
    console.log(`Fallaron ${itemsFallidosParaReporte.length} productos.`);

    setReporteItemsFallidos(itemsFallidosParaReporte);
    if (itemsFallidosParaReporte.length > 0) {
      setIsReportModalOpen(true);
    }
    setIsLoadingSugerencias(false);

  }, [productosSolicitados, itemsCotizacion, obtenerSugerencia]);

  const handleLimpiarSugerencias = useCallback(() => {
    // filtra los items que fueron agregados masivamente 
    setItemsCotizacion(prevItems => 
      prevItems.filter(item => !item.esAgregadoMasivo)
    );
    setSugerenciasAgregadas(false);
  }, []);

  const handleSugerenciaClick = async (itemSolicitado) => {
    console.log(" [handleSugerenciaClick] Iniciando búsqueda individual para:", itemSolicitado);
    setIsLoadingSugerencia(itemSolicitado.sku);
    
    try {
      const resultado = await obtenerSugerencia(itemSolicitado);
      console.log(" [handleSugerenciaClick] Resultado obtenido:", resultado);
      if (resultado && resultado.producto) {
        const { producto, cantidad, originalSku } = resultado;
        
        // Verificar si el producto tiene stock
        if (producto.stockTotal > 0) {
          try {
            // Obtener información de stock por sucursal
            const response = await fetch(
              `${API_BASE_URL}/catalogo/productos/${producto.id}/stock-sucursales`
            );
            
            if (response.ok) {
              const stockSucursales = await response.json();
              console.log(" [handleSugerenciaClick] Stock por sucursales:", stockSucursales);
              
              if (stockSucursales && stockSucursales.length > 0) {
                // Filtrar sucursales con stock disponible
                const sucursalesConStock = stockSucursales.filter(s => s.stock > 0);
                console.log(" [handleSugerenciaClick] Sucursales con stock:", sucursalesConStock);
                console.log(" [handleSugerenciaClick] Cantidad solicitada:", cantidad);
                
                if (sucursalesConStock.length > 0) {
                  // Distribuir la cantidad automáticamente entre las sucursales con stock
                  let cantidadRestante = cantidad;
                  const sucursalesSeleccionadas = [];
                  
                  console.log("[handleSugerenciaClick] Iniciando distribución. Cantidad restante:", cantidadRestante);
                  
                  for (const sucursal of sucursalesConStock) {
                    if (cantidadRestante <= 0) break;
                    
                    const cantidadParaEstaSucursal = Math.min(cantidadRestante, sucursal.stock);
                    console.log(` [handleSugerenciaClick] Sucursal ${sucursal.nombreSucursal}: stock=${sucursal.stock}, asignar=${cantidadParaEstaSucursal}`);
                    
                    if (cantidadParaEstaSucursal > 0) {
                      sucursalesSeleccionadas.push({
                        sucursal: {
                          nombreSucursal: sucursal.nombreSucursal
                        },
                        cantidad: cantidadParaEstaSucursal
                      });
                      cantidadRestante -= cantidadParaEstaSucursal;
                      console.log(`[handleSugerenciaClick] Sucursal agregada. Cantidad restante: ${cantidadRestante}`);
                    }
                  }
                  
                  console.log("[handleSugerenciaClick] Sucursales seleccionadas final:", sucursalesSeleccionadas);
                  console.log("[handleSugerenciaClick] Total unidades a agregar:", sucursalesSeleccionadas.reduce((total, s) => total + s.cantidad, 0));
                  
                  if (sucursalesSeleccionadas.length > 0) {
                    // Agregar producto automáticamente con el originalSku del item solicitado
                    const productoConOriginal = {
                      ...producto,
                      originalSolicitadoSku: originalSku
                    };
                    handleAgregarDesdeMultiplesSucursales(productoConOriginal, sucursalesSeleccionadas);
                    
                    // Mostrar mensaje de éxito
                    const totalAgregado = sucursalesSeleccionadas.reduce((total, s) => total + s.cantidad, 0);
                    console.log(` Producto sugerido agregado: ${producto.nombreCobol} (${totalAgregado}/${cantidad} unidades)`);
                    
                    // Si no se pudo agregar la cantidad completa, mostrar advertencia
                    if (totalAgregado < cantidad) {
                      console.warn(`Solo se agregaron ${totalAgregado} de ${cantidad} unidades solicitadas debido a stock limitado`);
                    }
                  } else {

                    const productoConCero = {
                      id: `${producto.id}-INDIVIDUAL-${Date.now()}`,
                      sku: producto.id,
                      nombre: producto.nombreCobol,
                      marca: producto.marca,
                      categoria: producto.categoria,
                      precioTienda: producto.precioUnitario || 0,
                      precioUnitario: producto.precioUnitario || 0,
                      precioFinal: producto.precioUnitario || 0,
                      cantidad: 0, // Cantidad inicial en 0 para gestión manual
                      originalSolicitadoSku: originalSku,
                      originalSolicitadoNombre: itemSolicitado.descripcion,
                      cantidadSolicitada: cantidad,
                      categoria: producto.categoria
                    };
                    setItemsCotizacion(prev => [...prev, productoConCero]);
                  }
                } else {

                  const productoConCero = {
                    id: `${producto.id}-INDIVIDUAL-${Date.now()}`,
                    sku: producto.id,
                    nombre: producto.nombreCobol,
                    marca: producto.marca,
                    categoria: producto.categoria,
                    precioTienda: producto.precioUnitario || 0,
                    precioUnitario: producto.precioUnitario || 0,
                    precioFinal: producto.precioUnitario || 0,
                    cantidad: 0, // Cantidad inicial en 0
                    originalSolicitadoSku: originalSku,
                    originalSolicitadoNombre: itemSolicitado.descripcion,
                    cantidadSolicitada: cantidad,
                    categoria: producto.categoria
                  };
                  setItemsCotizacion(prev => [...prev, productoConCero]);
                  console.log("✅ Producto agregado con cantidad 0 - usar modal de gestión para asignar stock");
                }
              } else {
                const productoConCero = {
                  id: `${producto.id}-INDIVIDUAL-${Date.now()}`,
                  sku: producto.id,
                  nombre: producto.nombreCobol,
                  marca: producto.marca,
                  categoria: producto.categoria,
                  precioTienda: producto.precioUnitario || 0,
                  precioUnitario: producto.precioUnitario || 0,
                  precioFinal: producto.precioUnitario || 0,
                  cantidad: 0,
                  originalSolicitadoSku: originalSku,
                  originalSolicitadoNombre: itemSolicitado.descripcion,
                  cantidadSolicitada: cantidad,
                  categoria: producto.categoria
                };
                setItemsCotizacion(prev => [...prev, productoConCero]);
                console.log("✅ Producto agregado con cantidad 0 - usar modal de gestión para asignar stock");
              }
            } else {

              // Agregar producto con cantidad 0
              const productoConCero = {
                id: `${producto.id}-INDIVIDUAL-${Date.now()}`,
                sku: producto.id,
                nombre: producto.nombreCobol,
                marca: producto.marca,
                categoria: producto.categoria,
                precioTienda: producto.precioUnitario || 0,
                precioUnitario: producto.precioUnitario || 0,
                precioFinal: producto.precioUnitario || 0,
                cantidad: 0,
                originalSolicitadoSku: originalSku,
                originalSolicitadoNombre: itemSolicitado.descripcion,
                cantidadSolicitada: cantidad,
                categoria: producto.categoria
              };
              setItemsCotizacion(prev => [...prev, productoConCero]);
              console.log("✅ Producto agregado con cantidad 0 - usar modal de gestión para asignar stock");
            }
          } catch (stockError) {

            // Agregar producto con cantidad 0
            const productoConCero = {
              id: `${producto.id}-INDIVIDUAL-${Date.now()}`,
              sku: producto.id,
              nombre: producto.nombreCobol,
              marca: producto.marca,
              categoria: producto.categoria,
              precioTienda: producto.precioUnitario || 0,
              precioUnitario: producto.precioUnitario || 0,
              precioFinal: producto.precioUnitario || 0,
              cantidad: 0,
              originalSolicitadoSku: originalSku,
              originalSolicitadoNombre: itemSolicitado.descripcion,
              cantidadSolicitada: cantidad,
              categoria: producto.categoria
            };
            setItemsCotizacion(prev => [...prev, productoConCero]);
          }
        } else {
          const productoConCero = {
            id: `${producto.id}-INDIVIDUAL-${Date.now()}`,
            sku: producto.id,
            nombre: producto.nombreCobol,
            marca: producto.marca,
            categoria: producto.categoria,
            precioTienda: producto.precioUnitario || 0,
            precioUnitario: producto.precioUnitario || 0,
            precioFinal: producto.precioUnitario || 0,
            cantidad: 0,
            originalSolicitadoSku: originalSku,
            originalSolicitadoNombre: itemSolicitado.descripcion,
            cantidadSolicitada: cantidad,
            categoria: producto.categoria
          };
          setItemsCotizacion(prev => [...prev, productoConCero]);
        }
      } else {
        // Si no hay sugerencia, marcar como sin sugerencia
        console.log("No se encontró sugerencia para este producto");
        setSkusSinSugerencia(prev => new Set([...prev, itemSolicitado.sku]));
      }

    } catch (error) {
      console.error("Fallo al obtener sugerencia:", error);
      setSkusSinSugerencia(prev => new Set([...prev, itemSolicitado.sku]));
    } finally {
      setIsLoadingSugerencia(null); 
    }
  };

  const handleBuscarProductoClick = useCallback((terminoBusqueda, skuSolicitado = null) => {
    console.log("Buscar producto clickeado con término:", terminoBusqueda); 
    setInitialSearchTerm(terminoBusqueda); 
    setNombreProductoOrigen(terminoBusqueda);
    setSkuSolicitadoActual(skuSolicitado); // Guardar el SKU solicitado si se está reemplazando
    
    // Limpiar el SKU de la lista de sin sugerencia para permitir reintentar
    if (skuSolicitado) {
      setSkusSinSugerencia(prev => {
        const newSet = new Set(prev);
        newSet.delete(skuSolicitado);
        return newSet;
      });
    }
    
    setIsBusquedaOpen(true); 
  }, []); 


  const handleConfirmSend = useCallback(() => { /* ... */ }, [itemsCotizacion, licitacionData]);
  useEffect(() => { /* ... */ }, []);

  // Nueva función para agregar desde múltiples sucursales
  const handleAgregarDesdeMultiplesSucursales = useCallback((producto, sucursalesSeleccionadas) => {
    setItemsCotizacion(prevItems => {
      // Buscar si ya existe un item con este SKU
      const itemExistenteIndex = prevItems.findIndex(item => item.sku === producto.id);
      
      // Calcular la cantidad total a agregar
      const cantidadTotal = sucursalesSeleccionadas.reduce((sum, { cantidad }) => sum + cantidad, 0);
      
      // Crear el detalle de sucursales (con validación)
      const detallesSucursales = sucursalesSeleccionadas
        .filter(({ sucursal }) => sucursal && sucursal.nombreSucursal)
        .map(({ sucursal, cantidad }) => ({
          nombreSucursal: sucursal.nombreSucursal,
          cantidad: cantidad
        }));
      
      if (itemExistenteIndex !== -1) {
        // Si ya existe, actualizar cantidad y CONSOLIDAR detalles de sucursales
        const itemExistente = prevItems[itemExistenteIndex];
        const nuevosItems = [...prevItems];
        
        // Consolidar detalles de sucursales (sumar cantidades de la misma sucursal)
        const detallesConsolidados = [...(itemExistente.detallesSucursales || [])];
        
        detallesSucursales.forEach(nuevoDetalle => {
          const detalleExistente = detallesConsolidados.find(
            d => d.nombreSucursal === nuevoDetalle.nombreSucursal
          );
          
          if (detalleExistente) {
            // Si ya existe esta sucursal, sumar la cantidad
            detalleExistente.cantidad += nuevoDetalle.cantidad;
          } else {
            // Si no existe, agregarla
            detallesConsolidados.push(nuevoDetalle);
          }
        });
        
        // Guardar solo el nombre limpio, las sucursales van en detallesSucursales
        nuevosItems[itemExistenteIndex] = {
          ...itemExistente,
          nombre: producto.nombreCobol, // Nombre limpio sin sucursales
          marca: producto.marca,
          categoria: producto.categoria,
          cantidad: itemExistente.cantidad + cantidadTotal,
          detallesSucursales: detallesConsolidados
        };
        
        return nuevosItems;
      } else {
        // Si no existe, crear nuevo item
        const itemId = `${producto.id}-${Date.now()}`;
        
        // Crear nuevo item con nombre limpio, las sucursales van en detallesSucursales
        const nuevoItem = {
          id: itemId,
          sku: producto.id,
          nombre: producto.nombreCobol, // Nombre limpio sin sucursales
          marca: producto.marca,
          categoria: producto.categoria,
          precioTienda: producto.precioUnitario || 0,
          precioUnitario: producto.precioUnitario || 0,
          precioFinal: (producto.precioUnitario || 0),
          cantidad: cantidadTotal,
          detallesSucursales: detallesSucursales,
          originalSolicitadoSku: producto.originalSolicitadoSku || null,
          originalSolicitadoNombre: producto.originalSolicitadoSku ? mapaProductosSolicitados.get(producto.originalSolicitadoSku) || null : null
        };
        
        return [...prevItems, nuevoItem];
      }
    });

    // Cerrar modal
    setModalStockData(null);
  }, [mapaProductosSolicitados]);


const handleAgregarProductoDesdeModal = useCallback(async (producto, cantidad) => {
    try {
      // Obtener información de stock por sucursal
      const response = await fetch(
        `${API_BASE_URL}/catalogo/productos/${producto.sku}/stock-sucursales`
      );
      
      if (response.ok) {
        const stockSucursales = await response.json();
        
        if (stockSucursales && stockSucursales.length > 0) {
          // Filtrar sucursales con stock disponible
          const sucursalesConStock = stockSucursales.filter(s => s.stock > 0);
          
          if (sucursalesConStock.length > 0) {
            // Distribuir la cantidad automáticamente entre las sucursales con stock
            let cantidadRestante = cantidad;
            const sucursalesSeleccionadas = [];
            
            for (const sucursal of sucursalesConStock) {
              if (cantidadRestante <= 0) break;
              
              const cantidadParaEstaSucursal = Math.min(cantidadRestante, sucursal.stock);
              if (cantidadParaEstaSucursal > 0) {
                sucursalesSeleccionadas.push({
                  sucursal: {
                    nombreSucursal: sucursal.nombreSucursal
                  },
                  cantidad: cantidadParaEstaSucursal
                });
                cantidadRestante -= cantidadParaEstaSucursal;
              }
            }
            
            if (sucursalesSeleccionadas.length > 0) {
              // Crear producto con los campos necesarios
              const productoParaAgregar = {
                id: producto.sku,
                nombreCobol: producto.nombre,
                marca: producto.marca,
                categoria: producto.categoria,
                precioUnitario: producto.precioUnitario || 0,
                originalSolicitadoSku: skuSolicitadoActual
              };
              
              // Agregar producto automáticamente
              handleAgregarDesdeMultiplesSucursales(productoParaAgregar, sucursalesSeleccionadas);
              
              console.log(`Producto agregado: ${producto.nombre} (${sucursalesSeleccionadas.reduce((total, s) => total + s.cantidad, 0)} unidades)`);
            } else {
              console.log("No hay stock suficiente en ninguna sucursal");
            }
          } else {
            console.log("El producto no tiene stock disponible en ninguna sucursal");
          }
        } else {
          console.log("No se pudieron obtener las sucursales del producto");
        }
      } else {
        console.log("Error al obtener stock por sucursal del producto");
      }
    } catch (error) {
      console.error("Error al agregar producto desde modal:", error);
    }
    
    setIsBusquedaOpen(false);
  }, [skuSolicitadoActual, handleAgregarDesdeMultiplesSucursales]);


  const handleAgregarDesdeSucursal = useCallback((producto, sucursal, cantidad, originalSku) => { 
      const itemId = `${producto.sku}-${sucursal.nombreSucursal}-${Date.now()}`;
      
      // usar el originalSku
      const skuFinal = skuSolicitadoActual || originalSku;
      
      const nuevoItem = {
        id: itemId,
        sku: producto.sku,
        nombre: producto.nombre, // Nombre limpio sin sucursales
        marca: producto.marca,
        categoria: producto.categoria,
        // Precio de tienda desde BD
        precioTienda: producto.precioUnitario || 0,
        // Mantener compatibilidad
        precioUnitario: producto.precioUnitario || 0,
        // Precio final editable (inicia igual al de tienda)
        precioFinal: (producto.precioUnitario || 0),
        cantidad: cantidad,
        sucursal: sucursal.nombreSucursal,
        originalSolicitadoSku: skuFinal,
        originalSolicitadoNombre: mapaProductosSolicitados.get(skuFinal) || null
      };

      setItemsCotizacion(prevItems => {
        let itemsFiltrados = prevItems;
        let insertIndex = prevItems.length; // Por defecto, al final
        
        if (skuFinal) {
          // Buscar si ya existe un item con el mismo originalSolicitadoSku para mantener orden cerca
          const itemExistenteIndex = prevItems.findIndex(item => item.originalSolicitadoSku === skuFinal);
          if (itemExistenteIndex !== -1) {
            insertIndex = itemExistenteIndex + 1; // Insertar justo después
          }
          itemsFiltrados = prevItems.filter(item => item.originalSolicitadoSku !== skuFinal || item.sucursal !== sucursal.nombreSucursal);
        }
        
        // Insertar el nuevo item en la posición correcta
        const nuevosItems = [...itemsFiltrados];
        nuevosItems.splice(insertIndex, 0, nuevoItem);
        return nuevosItems;
      });

      // Destacar el producto solicitado 
      setSkuRecienAgregado(skuFinal);
      setTimeout(() => setSkuRecienAgregado(null), 3000);
      
      // Limpiar estados
      setSkuSolicitadoActual(null);
  }, [skuSolicitadoActual, mapaProductosSolicitados]);



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

  const handleQuitarTodosProductos = useCallback(() => {
      setItemsCotizacion([]);
  }, []);
  
  const handleUpdateCantidad = useCallback((itemId, nuevaCantidad, detallesSucursales) => {
      setItemsCotizacion(prev => prev.map(i => 
          i.id === itemId ? { 
              ...i, 
              cantidad: nuevaCantidad, 
              categoria: i.categoria,
              detallesSucursales: detallesSucursales || i.detallesSucursales
          } : i
      ));
  }, []);
  
  const handleUpdatePrecioFinal = useCallback((itemId, nuevoPrecio) => {
    const precioNumber = Number.isFinite(nuevoPrecio) ? nuevoPrecio : 0;
    setItemsCotizacion(prev => prev.map(item => item.id === itemId ? { ...item, precioFinal: precioNumber, categoria: item.categoria } : item));
  }, []);


  const handleShowStock = useCallback((producto) => {    
      setModalStockData(producto); 
  }, []);
  const handleCloseStock = useCallback(() => setModalStockData(null), []);
  const handleSaveProgress = useCallback(async () => {
      try {
      const ok = await guardarResumen(itemsCotizacion);
      setToastState(ok ? 'success' : 'error');
      setTimeout(() => setToastState('idle'), 1500);
      return ok; 
    } catch (e) {
      setToastState('error');
      setTimeout(() => setToastState('idle'), 1500);
      return false;
    }
  }, [itemsCotizacion, guardarResumen]);


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
            skusSinSugerencia={skusSinSugerencia}
          />


          {/* ResumenCotizacion */}
          <ResumenCotizacion
            items={itemsCotizacion}
            onRemove={handleQuitarProducto}
            onRemoveAll={handleQuitarTodosProductos}
            onSave={handleSaveProgress}
            onUpdateCantidad={handleUpdateCantidad}
            onUpdatePrecioFinal={handleUpdatePrecioFinal}
            onOpenModalGenerarCotizacion={() => setShowModalGenerarCotizacion(true)}
            isMobile={isMobile}
            productAddedToast={productAddedToast}
            lastAddedProduct={lastAddedProduct}
            onDestacarProducto={handleDestacarProducto}
            infoLicitacion={licitacionData}
            onOpenStockModal={handleShowStock}
          />
        </div>
      </main>

 
      {/* Modal para Ver Stock */}
      <StockModal 
        producto={modalStockData} 
        onClose={handleCloseStock}
        onAgregarDesdeMultiplesSucursales={handleAgregarDesdeMultiplesSucursales}
        itemsCotizacion={itemsCotizacion}
      />



      {/* Modal para Buscar Productos */}
      <ModalBuscarProductos
        isOpen={isBusquedaOpen}
        onClose={() => setIsBusquedaOpen(false)}
        onProductoSeleccionado={handleAgregarProductoDesdeModal} 
        onStockClick={handleShowStock} 
        initialSearchTerm={initialSearchTerm}
        nombreProductoOrigen={nombreProductoOrigen}
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
