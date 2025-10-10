export default function ProductosSolicitados({ items, onSugerenciaClick }) {
  const isScrollable = items.length > 3;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Productos Solicitados</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {items.length} productos
        </span>
      </div>
      
      {/* Contenedor con altura fija y scroll cuando hay más de 3 items */}
      <div className="overflow-y-auto relative" style={{ maxHeight: '200px' }}>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase sticky top-0">
            <tr>
              <th className="p-3">SKU Ref.</th>
              <th className="p-3">Descripción Solicitada</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Uni. Solicitadas</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-3 text-gray-500">{item.sku}</td>
                <td className="p-3 font-medium text-gray-800">{item.descripcion}</td>
                <td className="p-3 text-gray-500">{item.categoria}</td>
                <td className="p-3 font-bold text-center">{item.unidades}</td>
                <td className="p-3 text-center">
                  <button 
                    type="button" 
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full hover:bg-blue-200" 
                    onClick={() => onSugerenciaClick(item.descripcion)}
                  >
                    Ir a sugerencia
                  </button>
                </td>
              </tr>
            ))}
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

