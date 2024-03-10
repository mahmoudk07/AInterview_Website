import React, { useState } from 'react';

const Modal = ({ show , message , close}) => {    
    if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-md w-full">
        <span className='font-bold '>{message}</span>
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none font-bold" onClick = {close}
                  >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
export default Modal;
