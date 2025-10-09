import React from 'react';

export default function HeaderInfo({ info }) {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg grid grid-cols-3 gap-4 text-sm">
      <div><span className="font-semibold text-gray-600">ID Licitación:</span> <strong className="font-normal">{info.id}</strong></div>
      <div><span className="font-semibold text-gray-600">Cliente:</span> <strong className="font-normal">{info.cliente.nombre}</strong></div>
      <div><span className="font-semibold text-gray-600">Fecha Cierre:</span> <strong className="font-normal">{info.fechaCierre}</strong></div>
    </div>
  );
}
