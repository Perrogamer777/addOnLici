import { useStockSucursalData } from '../hooks/useStockSucursalData';

export default function ModalAgregarPorSucursal({ modalData, onClose, onAgregarDesdeSucursal }) {

  const { stockSucursales, loading, error } = useStockSucursalData(modalData?.producto?.id);
  console.log('id del producto', modalData?.producto?.id);

  if (!modalData) return null;

  const { producto, cantidad } = modalData;
  const handleAgregarClick = (sucursal) => {
    onAgregarDesdeSucursal(producto, sucursal, cantidad);
  };

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
          <h3 className="text-lg font-semibold text-gray-900">Seleccionar Sucursal</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
  
        {/* Info del Producto */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900">{producto.nombreCobol}</h4>
          <p className="text-sm text-gray-600">SKU: {producto.id}</p>
          <p className="text-md font-bold text-blue-600">Cantidad a agregar: {cantidad}</p>
        </div>

        {/* Tabla de Sucursales */}
        <div className="overflow-hidden rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Sucursal</th>
                <th className="px-4 py-2 text-right font-medium text-gray-900">Stock Disp.</th>
                <th className="px-4 py-2 text-center font-medium text-gray-900">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              
              {loading && (
                <tr><td colSpan="3" className="p-4 text-center text-gray-500">Cargando...</td></tr>
              )}
              {error && (
                <tr><td colSpan="3" className="p-4 text-center text-red-500">Error al cargar.</td></tr>
              )}

              {!loading && !error && stockSucursales.map((sucursal) => (
                <tr key={sucursal.nombreSucursal} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-900">{sucursal.nombreSucursal}</td>
                  <td className="px-4 py-2 text-right">
                    <span className={`font-medium ${sucursal.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {sucursal.stock}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      type="button"

                      disabled={sucursal.stock === 0 || cantidad > sucursal.stock}
                      onClick={() => handleAgregarClick(sucursal)}
                      className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Agregar
                    </button>
                  </td>
                </tr>
              ))}
              
              {!loading && !error && stockSucursales.length === 0 && (
                 <tr><td colSpan="3" className="p-4 text-center text-gray-500">No hay stock en ninguna sucursal.</td></tr>
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}