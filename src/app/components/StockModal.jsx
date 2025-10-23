import React from 'react';
import  { useStockSucursalData } from '../hooks/useStockSucursalData';

export default function StockModal({ producto, onClose }) {


  const { stockSucursales, loading, error } = useStockSucursalData(producto?.id);
  
  if (!producto) return null;

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
          <h3 className="text-lg font-semibold text-gray-900">Stock por Sucursal</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Información del producto */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900">{producto.nombreCobol}</h4>
          <p className="text-sm text-gray-600">ID: {producto.id}</p>
        </div>


        {/* Tabla de stock */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Sucursal</th>
                <th className="px-4 py-2 text-right font-medium text-gray-900">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
    
              {loading && (
                <tr>
                  <td colSpan="2" className="px-4 py-3 text-center text-gray-500">
                    Cargando stock...
                  </td>
                </tr>
              )}

              {error && (
                <tr>
                  <td colSpan="2" className="px-4 py-3 text-center text-red-500">
                    Error al cargar el stock.
                  </td>
                </tr>
              )}


              {!loading && !error && stockSucursales.length > 0 && (
                stockSucursales.map((sucursal) => (
                  <tr key={sucursal.nombreSucursal} className="hover:bg-gray-50">
                    {/* Usamos 'nombreSucursal' de tu JSON */}
                    <td className="px-4 py-2 text-gray-900">{sucursal.nombreSucursal}</td>
                    <td className="px-4 py-2 text-right">
                      <span className={`font-medium ${sucursal.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {sucursal.stock}
                      </span>
                    </td>
                  </tr>
                ))
              )}
              
              {/* 4. Estado de Éxito */}
              {!loading && !error && stockSucursales.length === 0 && (
                <tr>
                  <td colSpan="2" className="px-4 py-3 text-center text-gray-500">
                    No hay información de stock disponible
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* Total */}
        {!loading && !error && stockSucursales.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Total Stock:</span>
              <span className="font-bold text-lg text-blue-600">
                {/* Calculamos el total desde 'stockSucursales' */}
                {stockSucursales.reduce((total, sucursal) => total + sucursal.stock, 0)}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}