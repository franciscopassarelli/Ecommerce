import React from 'react';

const Boton = ({ children, className = '', type = 'button', ...props }) => {
  return (
    <button
      type={type}
      className={`
        rounded-xl py-2 px-4 md:py-3 md:px-6 
        bg-blue-400 text-white text-center 
        hover:bg-blue-500 focus:outline-none 
        focus:ring-2 focus:ring-blue-300 
        disabled:opacity-50 disabled:cursor-not-allowed 
        transition duration-200 ease-in-out
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Boton;
