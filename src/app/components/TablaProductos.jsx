import React from 'react';
import FilaProducto from './FilaProducto';
import { useRulifas } from '../hooks/useRulifasData';

export default function TablaProductos({
  productos, onAgregar, onStockClick, searchTerm, setSearchTerm,
  selectedRubro, setSelectedRubro,
  selectedLinea, setSelectedLinea,
  selectedFamilia, setSelectedFamilia,
  availableLineas, availableFamilias,
  currentPage, totalPages, onPageChange
}) {
  const { rubros, lineas, familias, loading, obtenerLineas, obtenerFamilias } = useRulifas();

  const handleRubroChange = async (idRubro) => {
    setSelectedRubro(idRubro);
    setSelectedLinea('');
    setSelectedFamilia('');
    
    if (idRubro) {
      await obtenerLineas(idRubro);
    }
  };

  const handleLineaChange = async (idLinea) => {
    setSelectedLinea(idLinea);
    setSelectedFamilia('');
    
    if (idLinea) {
      await obtenerFamilias(idLinea);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
      {/* Header con título Y buscador */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Búsqueda de Productos</h3>
          
          {/* Buscador con botón */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por SKU, nombre..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    // El filtrado es automático, pero puedes agregar lógica aquí si necesitas
                  }
                }}
              />
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              onClick={() => {
                // El filtrado es automático, este botón es principalmente visual
                console.log('Búsqueda:', searchTerm);
              }}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
      
      {/* Barra de filtros en una sola fila */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-3">
          {/* SELECT RUBRO */}
          <div className="relative">
            <select
              className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all"
              value={selectedRubro}
              onChange={(e) => handleRubroChange(e.target.value)}
              disabled={loading}
            >
              <option value="">Seleccione Rubro</option>
              {rubros.map(r => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          
          {/* SELECT LÍNEA */}
          <div className="relative">
            <select
              className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
              value={selectedLinea}
              onChange={(e) => handleLineaChange(e.target.value)}
              disabled={!selectedRubro || loading}
            >
              <option value="">
                {selectedRubro ? 'Seleccione Línea' : 'Primero seleccione rubro'}
              </option>
              {lineas.map(l => (
                <option key={l.id} value={l.id}>{l.nombre}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          
          {/* SELECT FAMILIA */}
          <div className="relative">
            <select
              className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
              value={selectedFamilia}
              onChange={(e) => setSelectedFamilia(e.target.value)}
              disabled={!selectedLinea || loading}
            >
              <option value="">
                {selectedLinea ? 'Seleccione Familia' : 'Primero seleccione línea'}
              </option>
              {familias.map(f => (
                <option key={f.id} value={f.id}>{f.nombre}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de productos - SIN SCROLL HORIZONTAL */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto overflow-x-hidden" style={{ maxHeight: '400px' }}>
          <table className="w-full text-sm table-fixed">
            {/* Header fijo con z-index mayor */}
            <thead className="bg-gray-100 sticky top-0 z-20">
              <tr className="text-xs font-semibold text-gray-700 uppercase border-b-2 border-gray-300">
                <th className="p-3 text-left" style={{ width: '10%' }}>SKU</th>
                <th className="p-3 text-left" style={{ width: '28%' }}>NOMBRE</th>
                <th className="p-3 text-left" style={{ width: '12%' }}>MARCA</th>
                <th className="p-3 text-left" style={{ width: '15%' }}>CATEGORÍA</th>
                <th className="p-3 text-right" style={{ width: '10%' }}>PRECIO</th>
                <th className="p-3 text-center" style={{ width: '8%' }}>STOCK</th>
                <th className="p-3 text-center" style={{ width: '17%' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                      </svg>
                      <p className="text-sm font-medium">No se encontró el producto</p>
                    
                    </div>
                  </td>
                </tr>
              ) : (
                productos.map(p => (
                  <FilaProducto 
                    key={p.sku} 
                    producto={p} 
                    onAgregar={onAgregar} 
                    onStockClick={onStockClick}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Paginación */}
      <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        
        <div className="text-sm text-gray-700">
          Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
        </div>
        
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

