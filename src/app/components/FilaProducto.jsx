import React from 'react';

export default function FilaProducto({ producto, onAgregar, onStockClick }) {


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
        onAgregar(productoParaCotizacion, 1); // Cantidad fija de 1
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
            <td className="p-3 text-center">
                <button 
                    type="button" 
                    onClick={handleAgregarClick} 
                    className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600 transition-colors">
                    Agregar
                </button>
            </td>
        </tr>
    );
}