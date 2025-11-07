import React, { useEffect, useRef } from 'react';

export default function ProductosSolicitados({ 
  items, 
  onSugerenciaClick, 
  onBuscarProductoClick, 
  loadingSku, 
  skusAgregados,
  onAgregarTodas,
  isLoadingSugerencias,
  onLimpiarSugerencias,
  sugerenciasAgregadas,
  skuRecienAgregado,
  skusSinSugerencia
}) {
  
  const isScrollable = items.length > 3;
  const rowRefs = useRef({}); // Para guardar referencias a cada fila

  // Hacer scroll cuando se destaque un producto
  useEffect(() => {
    if (skuRecienAgregado && rowRefs.current[skuRecienAgregado]) {
      rowRefs.current[skuRecienAgregado].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [skuRecienAgregado]);

  const handleBuscarClick = (descripcion, skuSolicitado = null) => {
    if (onBuscarProductoClick) {
      onBuscarProductoClick(descripcion, skuSolicitado);
    }
  };

    // animación de carga 
  const SpinnerIcon = () => (
  <svg 
    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4"
    ></circle>
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

  const BoltIcon = () => (
  <svg 
    className="w-5 h-5 flex-shrink-0" 
    fill="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
  </svg>
);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
      <div className="flex justify-between items-center mb-3"> 
        <h3 className="text-lg font-semibold">
          Productos Solicitados
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-2">
            {items.length} productos
          </span>
        </h3>
        
        <div className="flex gap-2">
          {/* Botón de Limpiar Sugerencias - Solo visible después de agregar */}
          {sugerenciasAgregadas && (
            <button
              type="button"
              onClick={onLimpiarSugerencias}
              className="px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Limpiar Sugerencias
            </button>
          )}
          
          {/* Botón de Agregar Todas las Sugerencias */}
          <button
            type="button"
            onClick={onAgregarTodas}
            disabled={isLoadingSugerencias || items.length === 0}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoadingSugerencias ? (
              <>
                <SpinnerIcon /> 
                Buscando productos...
              </>
            ) : (
              <>
                <BoltIcon />
                Agregar Todas las Sugerencias
              </>
            )}
          </button>
        </div>
      </div>

      
      
      {/* Contenedor con altura fija y scroll cuando hay más de 3 items */}
      <div className="overflow-y-auto relative" style={{ maxHeight: '200px' }}>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase sticky top-0">
            <tr>
              <th className="p-3">SKU Wherex</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Unidades</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500 text-sm">
                  No hay productos solicitados para esta licitación
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                
                const isAgregado = skusAgregados && skusAgregados.has(item.sku);
                const isRecienAgregado = skuRecienAgregado === item.sku;

                return (
                  <tr 
                    key={`${item.sku}-${index}`}
                    ref={(el) => (rowRefs.current[item.sku] = el)}
                    className={`hover:bg-gray-50 transition-all duration-500 ${
                      isAgregado ? 'bg-blue-50 border-l-4 border-blue-400' : ''
                    } ${
                      isRecienAgregado ? 'animate-pulse bg-green-200 border-l-4 border-green-600' : ''
                    }`}
                  >
                    <td className="p-3 text-gray-500">{item.sku}</td>
                    <td className="p-3 font-medium text-gray-800">{item.descripcion}</td>
                    <td className="p-3 text-gray-500">{item.categoria}</td>
                    <td className="p-3 font-bold text-center">{item.cantidad}</td>
                    <td className="p-3 text-center">

                      {isAgregado ? (
                        
                        // Si está agregado, muestra el indicador y botón de cambiar
                        <div className="flex gap-2 justify-center items-center">
                          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Agregado
                          </span>
                          
                          {/* Botón para cambiar producto */}
                          <button 
                            onClick={() => handleBuscarClick(item.descripcion, item.sku)} 
                            className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded hover:bg-orange-600 flex items-center gap-1"
                            title="Cambiar por otro producto"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                            </svg>
                            Cambiar
                          </button>
                        </div>

                      ) : (
                        
                        // Si no está agregado, muestra los botones
                        <div className="flex gap-2 justify-center">
                          <button 
                            type="button" 
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              skusSinSugerencia && skusSinSugerencia.has(item.sku)
                                ? 'bg-gray-200 text-gray-600 cursor-not-allowed' 
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                            onClick={() => {
                              if (!skusSinSugerencia || !skusSinSugerencia.has(item.sku)) {
                                onSugerenciaClick(item);
                              }
                            }} 
                            disabled={loadingSku === item.sku || (skusSinSugerencia && skusSinSugerencia.has(item.sku))}
                          >
                            {loadingSku === item.sku 
                              ? 'Buscando...' 
                              : skusSinSugerencia && skusSinSugerencia.has(item.sku)
                                ? 'Sin sugerencia'
                                : 'Sugerencia'}
                          </button>

                          <button 
                            onClick={() => handleBuscarClick(item.descripcion, item.sku)} 
                            className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded hover:bg-green-600"
                          >
                            Buscar producto
                          </button>
                        </div>
                      )}

                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        
        {/* Indicador de scroll cuando hay más elementos */}
        {isScrollable && (
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        )}
      </div>
      
      {/* Mensaje informativo cuando hay scroll */}
      {isScrollable && (
        <div className="text-xs text-gray-500 text-center mt-2 flex items-center justify-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
          Deslizar para ver todos los productos
        </div>
      )}
    </div>
  );
}