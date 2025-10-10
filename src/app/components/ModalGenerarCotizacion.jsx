const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

export default function ModalGenerarCotizacion({ isOpen, onClose, licitacionInfo, items, onConfirmSend }) {
  if (!isOpen) return null;

  const neto = items.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
  const iva = neto * 0.19;
  const total = neto + iva;
  const totalProductos = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div 
      className="fixed inset-0 bg-gray bg-opacity-20 backdrop-blur-sm flex items-start justify-center pt-16 p-2"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header más compacto */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Resumen de Cotización</h2>
            <p className="text-xs text-gray-600">Revisa los datos antes de enviar</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Info Licitación */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Información de Licitación</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-600">ID:</span>
                <p className="font-medium">{licitacionInfo.id}</p>
              </div>
              <div>
                <span className="text-gray-600">Cliente:</span>
                <p className="font-medium text-xs">{licitacionInfo.cliente.nombre}</p>
              </div>
              <div>
                <span className="text-gray-600">RUT:</span>
                <p className="font-medium">{licitacionInfo.cliente.rut}</p>
              </div>
              <div>
                <span className="text-gray-600">Fecha:</span>
                <p className="font-medium">{licitacionInfo.fechaCierre}</p>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-blue-600">{items.length}</p>
                <p className="text-xs text-gray-600">Productos</p>
              </div>
              <div>
                <p className="text-xl font-bold text-green-600">{totalProductos}</p>
                <p className="text-xs text-gray-600">Unidades</p>
              </div>
              <div>
                <p className="text-xl font-bold text-black-600">
                  ${Math.round(total).toLocaleString('es-CL')}
                </p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </div>

          {/* Lista de productos */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Productos</h3>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {items.map(item => (
                <div key={item.sku} className="flex justify-between items-center py-2 px-3 bg-white border rounded text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 truncate">{item.nombre}</p>
                    <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium">{item.cantidad} × ${item.precioUnitario.toLocaleString('es-CL')}</p>
                    <p className="text-xs text-gray-600">${(item.cantidad * item.precioUnitario).toLocaleString('es-CL')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totales */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Neto:</span>
                <span className="font-medium">${Math.round(neto).toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IVA:</span>
                <span className="font-medium">${Math.round(iva).toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-gray-300">
                <span>Total:</span>
                <span className="text-blue-600">${Math.round(total).toLocaleString('es-CL')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmSend}
            className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <CheckIcon />
            Confirmar y Enviar
          </button>
        </div>
      </div>
    </div>
  );
}