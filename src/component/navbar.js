// Navbar.js

import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <a className="text-xl font-bold" href="#">Your Logo</a>
          </div>
          <div className="flex">
            <a className="text-white hover:text-gray-300 px-3 py-2 rounded-md" href="#">Home</a>
            <a className="text-white hover:text-gray-300 px-3 py-2 rounded-md" href="#">About</a>
            <a className="text-white hover:text-gray-300 px-3 py-2 rounded-md" href="#">Services</a>
            <a className="text-white hover:text-gray-300 px-3 py-2 rounded-md" href="#">Contact</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
