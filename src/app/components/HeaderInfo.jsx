import React, { useState } from 'react';

export default function HeaderInfo({ info }) {
  const [showTooltip, setShowTooltip] = useState(false);
  // Valores por defecto si no hay datos
  const idLicitacion = info?.idLicitacion || 'N/A';
  const idCliente = info?.idCliente || 'N/A';
  const nombreCliente = info?.nombreCliente || 'Sin información';
  const fechaLimite = info?.fechaLimite || 'N/A';
  const comentarios = info?.comentarios || 'Sin comentario';
  
  return (
    <div className="p-3 lg:p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs lg:text-sm">
      {/* Grid responsivo: 1 columna en móvil, 4 en desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
        <div><span className="font-semibold text-gray-600">ID Licitación:</span> <strong className="font-normal">{idLicitacion}</strong></div>
        <div><span className="font-semibold text-gray-600">Cliente:</span> <strong className="font-normal">{nombreCliente}</strong></div>
        <div><span className="font-semibold text-gray-600">Fecha Cierre:</span> <strong className="font-normal">{fechaLimite}</strong></div>
        
        {/* Comentarios con tooltip responsivo */}
        <div className="relative">
          <span className="font-semibold text-gray-600">Comentarios:</span>
          {comentarios ? (
            <div className="relative inline-block ml-2">
              <button
                className="text-blue-600 hover:text-blue-800 underline text-xs"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
              >
                Ver detalles
              </button>
              
              {showTooltip && (
                <div className="absolute top-6 right-0 lg:right-0 z-10 w-72 lg:w-80 p-3 bg-white border border-gray-300 rounded-lg shadow-lg text-xs text-gray-700 leading-relaxed">
                  <div className="absolute -top-1 right-4 w-2 h-2 bg-white border-l border-t border-gray-300 transform rotate-45"></div>
                  {comentarios}
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-400 text-xs ml-2">{comentarios}</span>
          )}
        </div>
      </div>
    </div>
  );
}
