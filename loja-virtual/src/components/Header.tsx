import React from 'react';
import { LogoConfig } from '../types/visualConfig';

interface HeaderProps {
  logoConfig: LogoConfig;
}

const Header: React.FC<HeaderProps> = ({ logoConfig }) => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img
          src={logoConfig.url}
          alt={logoConfig.alt}
          width={logoConfig.width}
          height={logoConfig.height}
          className="h-10 w-auto"
        />
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="/" className="text-gray-600 hover:text-gray-900">Home</a></li>
          <li><a href="/products" className="text-gray-600 hover:text-gray-900">Produtos</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
