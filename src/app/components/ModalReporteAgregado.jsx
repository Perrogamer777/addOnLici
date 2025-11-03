
const SearchOffIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l.01.01"></path>
  </svg>
);
const NoStockIcon = () => (
  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01"></path>
  </svg>
);

export default function ModalReporteAgregado({ isOpen, onClose, items }) {
  if (!isOpen) return null;

  const productosEncontrados = items.filter(item => item.razon === "Sugerencia encontrada sin stock");
  const productosNoEncontrados = items.filter(item => item.razon === "No se encontró sugerencia");

  return (
    <div
      className="fixed inset-0 bg-gray bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 10000 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 flex flex-col h-auto max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Modal */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Info sobre productos agregados automaticamente</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="overflow-y-auto space-y-4 bg-green-100 p-4 rounded-md flex-1">
          
          {items.length === 0 ? (
            <p className="text-gray-600 text-center bg-green-100">✔ Todos los productos disponibles fueron agregados exitosamente.</p>
          ) : (
            <>
              {/* Productos No Encontrados */}
              {productosNoEncontrados.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-700 flex items-center gap-2 mb-2">
                    <SearchOffIcon />
                    No se encontró sugerencia ({productosNoEncontrados.length})
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-2">
                    {productosNoEncontrados.map(item => (
                      <li key={item.sku}>
                        {item.descripcion} (SKU: {item.sku})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Productos Sin Stock */}
              {productosEncontrados.length > 0 && (
                <div>
                  <h4 className="font-semibold text-yellow-800 flex items-center gap-2 mb-2">
                    <NoStockIcon />
                    Sugerencias sin stock ({productosEncontrados.length})
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-2">
                    {productosEncontrados.map(item => (
                      <li key={item.sku}>
                        {item.descripcion} (SKU: {item.sku})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}