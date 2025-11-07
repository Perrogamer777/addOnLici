import React, { useState } from 'react';

export default function FilaProducto({ producto, onAgregar, onStockClick }) {
    const [cantidad, setCantidad] = useState(1);


    const stock = producto.stockTotal || 0; 

    const stockColor = stock > 20 ? 'text-green-600' : stock > 0 ? 'text-orange-500' : 'text-red-500';

    const handleAgregarClick = () => {
        const productoParaCotizacion = {
            sku: producto.id, // id -> sku
            nombre: producto.nombreCobol, // nombreCobol -> nombre

            marca: producto.marca,
            categoria: producto.categoria,
            precioUnitario: producto.precio || 0,
            stock: stock
        };
        onAgregar(productoParaCotizacion, cantidad);
        setCantidad(1); 
    };



    return (
        <tr className="hover:bg-gray-50">
            
            {/* Columna SKU: Mapeada a 'id' */}
            <td className="p-3">{producto.id}</td> 
            
            {/* Columna NOMBRE: */}
            <td className="p-3 font-medium text-gray-900">{producto.nombreCobol}</td> 
            
            {/* Columna MARCA*/}
            <td className="p-3">{producto.marca || '-'}</td> 
            
            {/* Columna CATEGORÍA */}
            <td className="p-3">{producto.categoria || '-'}</td> 
            
            {/* Columna PRECIO*/}
            <td className="p-3">
                ${(producto.precio || 0).toLocaleString('es-CL')} 
            </td>
            
            {/* Columna stock muestra un 0 si no existe */}
            <td className="p-3 font-bold text-center">
                <button
                    type="button"
                    onClick={() => onStockClick(producto)}
                    className={`${stockColor} underline hover:opacity-75 disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed`}
                    disabled={stock === 0}
                >
                    {stock}
                </button>
            </td>
            
            {/* Columna ACCIONES*/}
            <td className="p-3 flex items-center gap-2">
                <input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} className="w-16 p-1 border rounded-md text-center" />
                <button 
                    type="button" 
                    onClick={handleAgregarClick} 
                    className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-md hover:bg-green-600">
                    Agregar
                </button>
            </td>
        </tr>
    );
}