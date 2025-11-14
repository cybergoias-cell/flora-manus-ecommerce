import React from 'react';
import BannerCarousel from '../components/BannerCarousel';
import { VisualConfig } from '../types/visualConfig';

interface HomeProps {
  visualConfig: VisualConfig;
}

const Home: React.FC<HomeProps> = ({ visualConfig }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Página Inicial da Loja</h1>
      <div className="p-4 border rounded">
        <BannerCarousel banners={visualConfig.banners} autoplayInterval={4000} />
      </div>
      {/* Aqui iriam outros componentes da página inicial */}
    </div>
  );
};

export default Home;
