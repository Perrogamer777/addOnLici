import React, { useState, useEffect, useRef } from 'react';

export default function HeaderInfo({ info }) {
  const [showTooltipComentarios, setShowTooltipComentarios] = useState(false);
  const [estadosSeleccionados, setEstadosSeleccionados] = useState(['vigente']); // Array de estados
  const [showEstadosChecklist, setShowEstadosChecklist] = useState(false);
  const dropdownRef = useRef(null);
  
  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowEstadosChecklist(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Toggle estado en el checklist
  const toggleEstado = (estadoId) => {
    setEstadosSeleccionados(prev => {
      if (prev.includes(estadoId)) {
        return prev.filter(id => id !== estadoId);
      } else {
        return [...prev, estadoId];
      }
    });
  };
  
  // Estados disponibles
  const estadosDisponibles = [
    { id: 'vigente', label: 'Vigente', color: 'bg-green-100 text-green-800 border-green-300' },
    { id: 'autorizado', label: 'Autorizado', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { id: 'cotizado', label: 'Cotizado', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { id: 'facturado', label: 'Facturado', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    { id: 'nulo', label: 'Nulo', color: 'bg-red-100 text-red-800 border-red-300' },
  ];
  
  const estadosActivos = estadosDisponibles.filter(e => estadosSeleccionados.includes(e.id));
  
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
        
        {/* Estado de la licitación */}
        <div className="relative md:col-span-2 lg:col-span-3" ref={dropdownRef}>
          <span className="font-semibold text-gray-600">Estado:</span>
          
          <div className="inline-flex items-center flex-wrap gap-2 ml-2">

            {estadosActivos.map(estado => (
              <span
                key={estado.id}
                className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${estado.color}`}
              >
                {estado.label}
              </span>
            ))}
            
            {/* Botón para gestionar estados */}
            <button
              type="button"
              onClick={() => setShowEstadosChecklist(!showEstadosChecklist)}
              className="px-2 py-0.5 rounded text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300 flex items-center gap-1"
            >
              Gestionar
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
          
          {/* Dropdown checklist */}
          {showEstadosChecklist && (
            <div className="absolute top-8 left-0 z-20 w-64 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden mt-1">
              <div className="p-2 space-y-1">
                {estadosDisponibles.map((estado) => (
                  <label
                    key={estado.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={estadosSeleccionados.includes(estado.id)}
                      onChange={() => toggleEstado(estado.id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-1 ${estado.color}`}>
                      {estado.label}
                    </span>
                  </label>
                ))}
              </div>
              <div className="border-t p-2">
                <button
                  type="button"
                  onClick={() => setShowEstadosChecklist(false)}
                  className="w-full px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
