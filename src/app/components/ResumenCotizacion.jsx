import React from 'react';

const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;

export default function ResumenCotizacion({ items, onRemove }) {
  const neto = items.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
  const iva = neto * 0.19;
  const total = neto + iva;

  return (
    <aside className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-3">Resumen de Cotización</h3>
      <div className="flex-grow space-y-3 overflow-y-auto pr-2 min-h-0">
        {items.length === 0 && <p className="text-sm text-gray-400 text-center mt-8">Agrega productos del catálogo para comenzar a cotizar.</p>}
        {items.map(item => (
          <div key={item.sku} className="flex items-center justify-between text-sm">
            <div>
              <p className="font-semibold text-gray-800">{item.nombre}</p>
              <p className="text-xs text-gray-500">{item.cantidad} x ${item.precioUnitario.toLocaleString('es-CL')}</p>
            </div>
            <div className="flex items-center gap-2">
              <strong className="text-gray-900">${(item.cantidad * item.precioUnitario).toLocaleString('es-CL')}</strong>
              <button type="button" onClick={() => onRemove(item.sku)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-4 border-t">
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex justify-between"><span>Neto</span><span>${Math.round(neto).toLocaleString('es-CL')}</span></div>
          <div className="flex justify-between"><span>IVA (19%)</span><span>${Math.round(iva).toLocaleString('es-CL')}</span></div>
        </div>
        <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t"><span>Total</span><span>${Math.round(total).toLocaleString('es-CL')}</span></div>
        <button className="w-full mt-4 p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">Generar y Enviar Cotización</button>
      </div>
    </aside>
  );
}
