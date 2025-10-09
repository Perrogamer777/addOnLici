import React from 'react';

const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;

export default function StockModal({ producto, onClose }) {
    if (!producto) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Sucursales con Stock</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><CloseIcon /></button>
                </div>
                <div className="p-6">
                    <p className="font-bold text-gray-800 mb-4">{producto.nombre}</p>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {producto.stockPorSucursal && producto.stockPorSucursal.length > 0 ? (
                            producto.stockPorSucursal.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                                    <span className="text-gray-700">{item.sucursal}</span>
                                    <strong className="text-gray-900">{item.stock} unidades</strong>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No hay stock disponible en ninguna sucursal.</p>
                        )}
                    </div>
                </div>
                <div className="p-4 border-t text-right bg-gray-50 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cerrar</button>
                </div>
            </div>
        </div>
    );
}
