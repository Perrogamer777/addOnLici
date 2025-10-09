import React, { useState } from 'react';

export default function FilaProducto({ producto, onAgregar, onStockClick }) {
    const [cantidad, setCantidad] = useState(1);
    const stockColor = producto.stock > 20 ? 'text-green-600' : producto.stock > 0 ? 'text-orange-500' : 'text-red-500';

    return (
        <tr className="hover:bg-gray-50">
            <td className="p-3">{producto.sku}</td>
            <td className="p-3 font-medium text-gray-900">{producto.nombre}</td>
            <td className="p-3">{producto.marca}</td>
            <td className="p-3">{producto.categoria}</td>
            <td className="p-3">${producto.precioUnitario.toLocaleString('es-CL')}</td>
            <td className="p-3 font-bold text-center">
                <button
                    type="button"
                    onClick={() => onStockClick(producto)}
                    className={`${stockColor} underline hover:opacity-75 disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed`}
                    disabled={producto.stock === 0}
                >
                    {producto.stock}
                </button>
            </td>
            <td className="p-3 flex items-center gap-2">
                <input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} className="w-16 p-1 border rounded-md text-center" />
                <button type="button" onClick={() => onAgregar(producto, cantidad)} className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-md hover:bg-green-600">Agregar</button>
            </td>
        </tr>
    );
}

