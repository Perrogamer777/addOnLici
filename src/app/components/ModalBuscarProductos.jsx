// /components/ModalBusquedaProductos.jsx
import React, { useState, useEffect } from 'react';
import FilaProducto from './FilaProducto';
import { useRulifas } from '../hooks/useRulifasData';
import { useCatalogoProductos } from '../hooks/useCatalogoProductos';

const itemsPorPagina = 10;

export default function ModalBusquedaProductos({
  isOpen,
  onClose,
  onProductoSeleccionado,
  initialSearchTerm,
  onStockClick 
}) {

  // estados del modal 
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const [selectedRubro, setSelectedRubro] = useState('');
  const [selectedLinea, setSelectedLinea] = useState('');
  const [selectedFamilia, setSelectedFamilia] = useState('');

  // hook de Rulifas
  const { rubros, lineas, familias, loading: loadingRulifas, obtenerLineas, obtenerFamilias } = useRulifas();
  
  const [soloConStock, setSoloConStock] = useState(true);

  // hook de Productos
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
    selectedFamilia,
    soloConStock
  );

  const totalPages = apiTotalPages || 1;

  const handleRubroChange = async (idRubro) => {
    setSelectedRubro(idRubro);
    setSelectedLinea('');
    setSelectedFamilia('');
    setCurrentPage(1);
    if (idRubro) await obtenerLineas(idRubro);
  };
  const handleLineaChange = async (idLinea) => {
    setSelectedLinea(idLinea);
    setSelectedFamilia('');
    setCurrentPage(1);
    if (idLinea) await obtenerFamilias(idLinea);
  };
  const handleFamiliaChange = (idFamilia) => {
    setSelectedFamilia(idFamilia);
    setCurrentPage(1);
  };
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStockChange = (e) => {
    setSoloConStock(e.target.checked);
    setCurrentPage(1);
  }


   useEffect(() => {
     if (isOpen && initialSearchTerm) {
       setSearchTerm(initialSearchTerm);
     }

     if (isOpen && !initialSearchTerm) {
       setSearchTerm('');
     }

     if (isOpen){
      setCurrentPage(1);
      setSoloConStock(true);
     }
   }, [initialSearchTerm, isOpen]);


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 9000 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 flex flex-col h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Modal */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Búsqueda de Productos</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Buscador */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por SKU, nombre..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
          </div>
          <button type="button" className="px-4 py-2 bg-blue-600 border-round">Buscar</button>
        </div>

        {/* Checkbox del stock */}
          <div className="flex items-center pl-4">
            <input
              type="checkbox"
              id="stockCheckbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={soloConStock}
              onChange={handleStockChange}
            />
            <label htmlFor="stockCheckbox" className="ml-2 block text-sm font-medium text-gray-700 select-none">
              Sólo con stock
            </label>
          </div>

        {/* Filtros Rulifas */}
        <div className="p-4 bg-gray-50 border-y border-gray-200 mb-4">
          <div className="grid grid-cols-3 gap-3">
             <select value={selectedRubro} onChange={(e) => handleRubroChange(e.target.value)} disabled={loadingRulifas} className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all">
               <option value="">Seleccione Rubro</option>
               {rubros.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
             </select>
             <select value={selectedLinea} onChange={(e) => handleLineaChange(e.target.value)} disabled={!selectedRubro || loadingRulifas} className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500">
               <option value="">{selectedRubro ? 'Seleccione Línea' : 'Primero seleccione rubro'}</option>
               {lineas.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
             </select>
             <select value={selectedFamilia} onChange={(e) => handleFamiliaChange(e.target.value)} disabled={!selectedLinea || loadingRulifas} className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500">
               <option value="">{selectedLinea ? 'Seleccione Familia' : 'Primero seleccione línea'}</option>
               {familias.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
             </select>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loadingCatalogo ? (
             <div className="flex-1 flex items-center justify-center text-gray-500">Cargando productos...</div>
          ) : errorCatalogo ? (
             <div className="flex-1 flex items-center justify-center text-red-500">Error al cargar productos.</div>
          ) : (
             <div className="overflow-y-auto overflow-x-hidden flex-1">
               <table className="w-full text-sm table-fixed">
                 <thead className="bg-gray-100 sticky top-0 z-10">
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
                   {catalogoProductos.length === 0 ? (
                     <tr><td colSpan="7" className="p-8 text-center text-gray-500"><div className="flex flex-col items-center gap-3"><svg className="w-12 h-12 text-gray-300" /*...*/></svg><p>No se encontró el producto</p></div></td></tr>
                   ) : (
                     catalogoProductos.map(p => (
                       <FilaProducto
                         key={p.id} 
                         producto={p}
                         onAgregar={onProductoSeleccionado} 
                         onStockClick={onStockClick} 
                       />
                     ))
                   )}
                 </tbody>
               </table>
             </div>
          )}
        </div>

        {/* Paginación */}
        {!loadingCatalogo && !errorCatalogo && (
          <div className="flex justify-between items-center p-4 mt-4 border-t border-gray-200 bg-gray-50">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Anterior</button>
            <div className="text-sm text-gray-700">Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong></div>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Siguiente</button>
          </div>
        )}

      </div>
    </div>
  );
}