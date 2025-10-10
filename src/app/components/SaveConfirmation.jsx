import React from 'react';

export default function SaveConfirmation({ toastState }) {
  
  const animationClass = toastState === 'visible'
    ? 'translate-x-0'  
    : 'translate-x-full'; 

  return (

    <div
      className={`fixed top-1 right-0 bg-green-500 text-white py-2 px-4 rounded-l-lg shadow-lg transform transition-transform duration-500 ease-in-out ${animationClass}`}
    >
      <p className="text-sm font-semibold">¡Progreso guardado!</p>
    </div>
  );
}

