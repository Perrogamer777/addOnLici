import React, { useState, useEffect, useMemo } from 'react';
import  { useStockSucursalData } from '../hooks/useStockSucursalData';

export default function StockModal({ producto, onClose, onAgregarDesdeMultiplesSucursales, itemsCotizacion = [] }) {
  const [cantidadesPorSucursal, setCantidadesPorSucursal] = useState({});

  const { stockSucursales, loading, error } = useStockSucursalData(producto?.id);
  
  // Calcular cuánto stock ya fue agregado de este producto por sucursal
  const stockYaAgregado = useMemo(() => {
    if (!producto?.id) return {};
    
    const stockPorSucursal = {};
    
    itemsCotizacion.forEach(item => {
      if (item.sku === producto.id && item.detallesSucursales) {
        item.detallesSucursales.forEach(detalle => {
          if (!stockPorSucursal[detalle.nombreSucursal]) {
            stockPorSucursal[detalle.nombreSucursal] = 0;
          }
          stockPorSucursal[detalle.nombreSucursal] += detalle.cantidad;
        });
      }
    });
    
    return stockPorSucursal;
  }, [producto?.id, itemsCotizacion]);
  
  // Resetear cantidades cuando cambia el producto o se abre el modal
  useEffect(() => {
    setCantidadesPorSucursal({});
  }, [producto?.id]);
  
  if (!producto) return null;

  const handleCantidadChange = (nombreSucursal, cantidad, stockDisponible) => {
    // Limitar la cantidad al stock disponible
    const cantidadValida = Math.max(0, Math.min(cantidad, stockDisponible));
    setCantidadesPorSucursal(prev => ({
      ...prev,
      [nombreSucursal]: cantidadValida
    }));
  };

  const handleConfirmar = () => {
    // Filtrar solo las sucursales con cantidad > 0
    const sucursalesSeleccionadas = Object.entries(cantidadesPorSucursal)
      .filter(([_, cantidad]) => cantidad > 0)
      .map(([nombreSucursal, cantidad]) => {
        const sucursal = stockSucursales.find(s => s.nombreSucursal === nombreSucursal);
        return { sucursal, cantidad };
      })
      .filter(({ sucursal }) => sucursal !== undefined); // Filtrar sucursales no encontradas

    if (sucursalesSeleccionadas.length > 0 && onAgregarDesdeMultiplesSucursales) {
      onAgregarDesdeMultiplesSucursales(producto, sucursalesSeleccionadas);
      onClose();
    }
  };

  const totalSeleccionado = Object.values(cantidadesPorSucursal).reduce((sum, cant) => sum + cant, 0);

  return (
    <div 
      className="fixed inset-0 bg-gray bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 10000 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4"> 
          <h3 className="text-lg font-semibold text-gray-900">Agregar desde Sucursales</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Información del producto */}
        <div className="mb-4 bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-900">{producto.nombreCobol}</h4>
          <p className="text-sm text-gray-600">SKU: {producto.id}</p>
          <p className="text-xs text-blue-600 mt-1">
           Selecciona las cantidades que deseas agregar desde cada sucursal
          </p>
        </div>


        {/* Tabla de stock */}
        <div className="overflow-hidden rounded-lg border border-gray-200 max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Sucursal</th>
                <th className="px-4 py-2 text-right font-medium text-gray-900">Stock Disp.</th>
                <th className="px-4 py-2 text-center font-medium text-gray-900">Cantidad a agregar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
    
              {loading && (
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-center text-gray-500">
                    Cargando stock...
                  </td>
                </tr>
              )}

              {error && (
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-center text-red-500">
                    Error al cargar el stock.
                  </td>
                </tr>
              )}


              {!loading && !error && stockSucursales.length > 0 && (
                stockSucursales.map((sucursal) => {
                  const cantidadSeleccionada = cantidadesPorSucursal[sucursal.nombreSucursal] || 0;
                  const stockYaUsado = stockYaAgregado[sucursal.nombreSucursal] || 0;
                  const stockDisponibleReal = sucursal.stock - stockYaUsado;
                  const stockDisponible = Math.max(0, stockDisponibleReal); // No permitir negativos
                  
                  return (
                    <tr key={sucursal.nombreSucursal} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900">{sucursal.nombreSucursal}</td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex flex-col items-end">
                          <span className={`font-medium ${stockDisponible > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stockDisponible}
                          </span>
                          {stockYaUsado > 0 && (
                            <span className="text-xs text-gray-500">
                              ({stockYaUsado} ya agregado)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCantidadChange(sucursal.nombreSucursal, cantidadSeleccionada - 1, stockDisponible)}
                            disabled={cantidadSeleccionada <= 0}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold"
                          >
                            −
                          </button>
                          
                          <input
                            type="number"
                            value={cantidadSeleccionada}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              handleCantidadChange(sucursal.nombreSucursal, val, stockDisponible);
                            }}
                            min="0"
                            max={stockDisponible}
                            className={`w-16 text-center border rounded px-2 py-1 text-sm ${
                              cantidadSeleccionada >= stockDisponible && stockDisponible > 0
                                ? 'border-orange-400 bg-orange-50' 
                                : 'border-gray-300'
                            }`}
                            title={cantidadSeleccionada >= stockDisponible && stockDisponible > 0 ? 'Stock máximo alcanzado' : ''}
                          />
                          
                          <button
                            type="button"
                            onClick={() => handleCantidadChange(sucursal.nombreSucursal, cantidadSeleccionada + 1, stockDisponible)}
                            disabled={cantidadSeleccionada >= stockDisponible}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
              
              {/* 4. Estado de Éxito */}
              {!loading && !error && stockSucursales.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-center text-gray-500">
                    No hay información de stock disponible
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* Total */}
        {!loading && !error && stockSucursales.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 -mx-6 px-6 py-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Total Stock Disponible:</span>
              <span className="font-bold text-blue-600">
                {stockSucursales.reduce((total, sucursal) => {
                  const yaUsado = stockYaAgregado[sucursal.nombreSucursal] || 0;
                  return total + Math.max(0, sucursal.stock - yaUsado);
                }, 0)} unidades
              </span>
            </div>
            {totalSeleccionado > 0 && (
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-900">Unidades a agregar:</span>
                <span className="font-bold text-xl text-green-600">
                  {totalSeleccionado}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={totalSeleccionado === 0}
            className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            {totalSeleccionado === 0 ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Selecciona cantidades
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Agregar {totalSeleccionado} {totalSeleccionado === 1 ? 'unidad' : 'unidades'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}