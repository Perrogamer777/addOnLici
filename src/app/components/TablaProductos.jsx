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
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
      <h3 className="text-lg font-semibold mb-3">Búsqueda de Productos</h3>
      
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por SKU, nombre..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {/* Selección de rubro */}
        <select
          className="p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedRubro}
          onChange={(e) => handleRubroChange(e.target.value)}
          disabled={loading}
        >
          <option value="">Seleccione Rubro</option>
          {rubros.map(r => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </select>
        
        {/* Selección de linea */}
        <select
          className="p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        
        {/* Selección de familia */}
        <select
          className="p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      </div>

      {/* Tabla de productos */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left table-fixed">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
            <tr>
              <th className="p-3 w-1/6">SKU</th>
              <th className="p-3 w-2/6">Nombre</th>
              <th className="p-3 w-1/6">Marca</th>
              <th className="p-3 w-1/6">Categoría</th>
              <th className="p-3 w-1/12">Precio</th>
              <th className="p-3 w-1/12">Stock</th>
              <th className="p-3 w-1/6">Acciones</th>
            </tr>
          </thead>
        </table>
      </div>
      
      <div className="overflow-y-auto" style={{ height: '280px' }}>
        <table className="w-full text-sm text-left">
          <tbody className="divide-y divide-gray-200">
            {productos.map(p => (
              <FilaProducto 
                key={p.sku} 
                producto={p} 
                onAgregar={onAgregar} 
                onStockClick={onStockClick}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      <div className="flex justify-center items-center mt-4 text-sm">
        <button
          type="button"
          className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="px-3">Página {currentPage} de {totalPages}</span>
        <button
          type="button"
          className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

