import React from 'react';

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

export default function ProductAddedToast({ productInfo, toastState }) {
  if (toastState === 'idle') return null;

  return (
    <div 
      className={`mt-2 bg-green-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
        toastState === 'visible' ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0'
      }`}
    >
      <div className="text-green-200 flex-shrink-0">
        <CheckCircleIcon />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">¡Producto agregado!</p>
        <p className="text-xs text-green-100 truncate">
          {productInfo?.nombre} - Cantidad: {productInfo?.cantidad}
        </p>
      </div>
    </div>
  );
}