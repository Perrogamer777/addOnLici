import React from 'react';

const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;

export default function ResumenCotizacion({ 
    items, 
    onRemove, 
    onSave, 
    onUpdateCantidad, 
    onOpenModalGenerarCotizacion, 
    isMobile,
    productAddedToast,
    lastAddedProduct
}) {
    const neto = items.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
    const iva = neto * 0.19;
    const total = neto + iva;

    const handleCantidadChange = (itemId, nuevaCantidad) => {
        if (nuevaCantidad <= 0) {
            onRemove(itemId);
        } else {
            onUpdateCantidad(itemId, nuevaCantidad);
        }
    };

    const handleGenerarCotizacion = () => {
        if (items.length === 0) {
            console.warn('Agrega al menos un producto para generar la cotización');
            return;
        }
        onOpenModalGenerarCotizacion();
    };

    return (
        <aside className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Resumen de Cotización</h3>
                </div>
                <button
                    type="button"
                    onClick={onSave}
                    className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded hover:bg-blue-600 transition-colors"
                >
                    Guardar
                </button>
            </div>
            
            <div className="space-y-3 overflow-y-auto pr-2 max-h-96">
                {items.length === 0 && (
                    <p className="text-sm text-gray-400 text-center mt-8">
                        Agrega productos del catálogo para comenzar a cotizar.
                    </p>
                )}
                
                {items.map(item => (
                    <div key={item.itemId} className="bg-gray-50 p-3 rounded-lg border">
                        {/* Header del producto */}
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                                    {item.nombre}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                    SKU: {item.id } • Uni solicitadas: {item.cantidad}
                                </p>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => onRemove(item.id)} 
                                className="text-red-500 hover:text-red-700 p-1 ml-2"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                        
                        {/* Controles de cantidad y precio */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleCantidadChange(item.id, item.cantidad - 1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-lg font-bold"
                                >
                                    −
                                </button>
                                
                                <input
                                    type="number"
                                    min="1"
                                    value={item.cantidad}
                                    onChange={(e) => handleCantidadChange(item.id, parseInt(e.target.value) || 1)}
                                    className="w-12 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                                />
                                
                                <button
                                    type="button"
                                    onClick={() => handleCantidadChange(item.id, item.cantidad + 1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-lg font-bold"
                                >
                                    +
                                </button>
                            </div>
                            
                            <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">
                                    ${item.precioUnitario.toLocaleString('es-CL')} c/u
                                </div>
                            </div>
                        </div>
                        
                        {/* Subtotal del producto */}
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                            <span className="text-sm text-gray-600">Subtotal</span>
                            <span className="font-bold text-lg">
                                ${(item.cantidad * item.precioUnitario).toLocaleString('es-CL')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Totales */}
            <div className="pt-4 border-t mt-4">
                <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between"><span>Neto</span><span>${Math.round(neto).toLocaleString('es-CL')}</span></div>
                    <div className="flex justify-between"><span>IVA (19%)</span><span>${Math.round(iva).toLocaleString('es-CL')}</span></div>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>${Math.round(total).toLocaleString('es-CL')}</span>
                </div>
                <button 
                    onClick={handleGenerarCotizacion}
                    className="w-full mt-4 p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Generar y Enviar Cotización
                </button>
                
                {/* Toast de producto agregado */}
                {productAddedToast !== 'idle' && (
                    <div 
                        className={`mt-2 bg-green-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                            productAddedToast === 'visible' ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0'
                        }`}
                    >
                        <div className="text-green-200 flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">¡Producto agregado!</p>
                            <p className="text-xs text-green-100 truncate">
                                {lastAddedProduct?.nombre} - Cantidad: {lastAddedProduct?.cantidad}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}

