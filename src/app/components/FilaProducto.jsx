import { useState } from 'react';

export default function FilaProducto({ producto, onAgregar }) {
  const [cantidad, setCantidad] = useState(1);
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-3">{producto.sku}</td>
      <td className="p-3 font-medium text-gray-900">{producto.nombre}</td>
      <td className="p-3">{producto.marca}</td>
      <td className="p-3">{producto.categoria}</td>
      <td className="p-3">${producto.precioUnitario.toLocaleString('es-CL')}</td>
      <td className="p-3">{producto.stock}</td>
      <td className="p-3 flex items-center gap-2">
        <input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value) || 1)} className="w-16 p-1 border rounded-md text-center" />
        <button type="button" onClick={() => onAgregar(producto, cantidad)} className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-md hover:bg-green-600">Agregar</button>
      </td>
    </tr>
  );
}