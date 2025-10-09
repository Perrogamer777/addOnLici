export default function ProductosSolicitados({ items, onSugerenciaClick }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col" style={{ minHeight: '200px' }}>
      <h3 className="text-lg font-semibold mb-3">Productos Solicitados</h3>
      <div className="flex-grow rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs text-gray-00 uppercase sticky top-0">
            <tr>
              <th className="p-3 w-1/6">SKU Ref.</th>
              <th className="p-3 w-2/5">Descripción Solicitada</th>
              <th className="p-3 w-1/6">Categoría</th>
              <th className="p-3 w-1/12 text-center">Unidades solicitadas</th>
              <th className="p-3 w-1/5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-3 text-gray-500">{item.sku}</td>
                <td className="p-3 font-medium text-gray-800">{item.descripcion}</td>
                <td className="p-3 text-gray-500">{item.categoria}</td>
                <td className="p-3 font-bold text-center">{item.unidades}</td>
                <td className="p-3 text-center">
                  <button
                    type="button"
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full hover:bg-blue-200 transition-colors"
                    onClick={() => onSugerenciaClick(item.descripcion)}
                  >
                    Ir a sugerencia
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

