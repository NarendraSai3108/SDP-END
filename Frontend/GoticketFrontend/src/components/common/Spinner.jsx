import React from 'react';

const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="loader border-4 border-red-600 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
  </div>
);

export default Spinner;
