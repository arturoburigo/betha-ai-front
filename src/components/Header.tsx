import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 shadow-sm">
      <div className="px-5 py-4">
        <div className="flex items-center ">
          <img 
            src="/betha-logo.png" 
            alt="Betha Sistemas" 
            className="rounded-lg w-14 h-14"
          />
          <h1 className="text-2xl font-bold text-gray-100 ml-4">
            Betha Sistemas
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;