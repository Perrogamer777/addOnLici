import React, { useState } from 'react';

export default function HeaderInfo({ info }) {
  const [showTooltipComentarios, setShowTooltipComentarios] = useState(false);
  
  // Valores adaptados a la nueva estructura
  const idLicitacion = info?.idLicitacion || 'N/A';
  const empresaCompradora = info?.empresaCompradora || 'Sin información';
  const fechaCierreOferta = info?.fechaCierreOferta;
  const comentariosGenerales = info?.comentariosGenerales || null;
  const linkMasDetalles = info?.linkMasDetalles || null;
  const telefono = info?.telefono || 'Sin información';
  const correo = info?.correo || 'Sin información';
  
  return (
    <div className="p-3 lg:p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs lg:text-sm">
      {/* Grid responsivo: 3 columnas en desktop, 2 en tablet, 1 en móvil */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
        
        {/* ID Licitación */}
        <div>
          <span className="font-semibold text-gray-600">ID Licitación:</span> 
          <strong className="font-normal ml-1">{idLicitacion}</strong>
        </div>
        
        {/* Empresa Compradora (Cliente) */}
        <div>
          <span className="font-semibold text-gray-600">Cliente:</span> 
          <strong className="font-bold ml-1">{empresaCompradora}</strong>
        </div>
        
        {/* Fecha Cierre Oferta */}
        <div>
          <span className="font-semibold text-gray-600">Fecha Cierre:</span> 
          <strong className="font-normal ml-1">{fechaCierreOferta}</strong>
        </div>

        {/* Teléfono */}
        <div>
          <span className="font-semibold text-gray-600">Teléfono:</span> 
          <strong className="font-normal ml-1">{telefono}</strong>
        </div>

        {/* Correo */}
        <div>
          <span className="font-semibold text-gray-600">Correo:</span> 
          <strong className="font-normal ml-1">{correo}</strong>
        </div>
        
        {/* Link a Más Detalles (Portal externo) */}
        <div className="relative">
          <span className="font-semibold text-gray-600">Más Detalles:</span>
          
          {linkMasDetalles ? (
            <a 
              href={linkMasDetalles} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-xs ml-2 inline-flex items-center gap-1"
            >
              Ver info.
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          ) : (
            <span className="text-gray-400 text-xs ml-2">Sin enlace</span>
          )}
        </div>

        {/* Comentarios Generales (Tooltip separado) */}
        <div className="relative md:col-span-2 lg:col-span-3">
          <span className="font-semibold text-gray-600">Comentarios:</span>
          
          {comentariosGenerales ? (
            <div className="relative inline-block ml-2">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 underline text-xs"
                onMouseEnter={() => setShowTooltipComentarios(true)}
                onMouseLeave={() => setShowTooltipComentarios(false)}
                onClick={() => setShowTooltipComentarios(!showTooltipComentarios)}
              >
                Ver comentarios
              </button>
              
              {showTooltipComentarios && (
                <div className="absolute top-6 left-0 z-10 w-80 lg:w-96 p-3 bg-white border border-gray-300 rounded-lg shadow-lg text-xs text-gray-700 leading-relaxed">
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-white border-l border-t border-gray-300 transform rotate-45"></div>
                  {comentariosGenerales}
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-400 text-xs ml-2">Sin comentarios</span>
          )}
        </div>
        
      </div>
    </div>
  );
}
