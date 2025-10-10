import FilaProducto from './FilaProducto';
import { rubros } from '../data/mockData';

export default function TablaProductos({
  productos, onAgregar, onStockClick, searchTerm, setSearchTerm,
  selectedRubro, setSelectedRubro,
  selectedLinea, setSelectedLinea,
  selectedFamilia, setSelectedFamilia,
  availableLineas, availableFamilias,
  currentPage, totalPages, onPageChange
}) {
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
        <select
          className="p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedRubro}
          onChange={(e) => setSelectedRubro(e.target.value)}
        >
          <option value="">Rubro</option>
          {rubros.map(r => (<option key={r.id} value={r.id}>{r.nombre}</option>))}
        </select>
        <select
          className="p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedLinea}
          onChange={(e) => setSelectedLinea(e.target.value)}
          disabled={!selectedRubro}
        >
          <option value="">{selectedRubro ? 'Línea' : 'Seleccione rubro'}</option>
          {availableLineas.map(l => (<option key={l.id} value={l.id}>{l.nombre}</option>))}
        </select>
        <select
          className="p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedFamilia}
          onChange={(e) => setSelectedFamilia(e.target.value)}
          disabled={!selectedLinea}
        >
          <option value="">{selectedLinea ? 'Familia' : 'Seleccione línea'}</option>
          {availableFamilias.map(f => (<option key={f.id} value={f.id}>{f.nombre}</option>))}
        </select>
      </div>
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
        <table className="w-full text-sm text-left ">
          <tbody className="divide-y divide-gray-200">
            {productos.map(p => (<FilaProducto key={p.sku} producto={p} onAgregar={onAgregar} onStockClick={onStockClick}/>))}
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

