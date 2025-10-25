import React, { useState, useEffect, useCallback } from 'react';
import { Banner } from '../types/visualConfig';

interface BannerCarouselProps {
  banners: Banner[];
  autoplayInterval?: number; // Interval in milliseconds for autoplay
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners, autoplayInterval = 5000 }) => {
  const activeBanners = banners.filter(banner => banner.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === activeBanners.length - 1 ? 0 : prevIndex + 1
    );
  }, [activeBanners.length]);

  useEffect(() => {
    if (activeBanners.length > 1) {
      const interval = setInterval(nextSlide, autoplayInterval);
      return () => clearInterval(interval);
    }
  }, [activeBanners.length, nextSlide, autoplayInterval]);

  if (activeBanners.length === 0) {
    return <div className="text-center p-8 bg-gray-100">Nenhum banner ativo para exibir.</div>;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {activeBanners.map((banner) => (
          <div key={banner.id} className="w-full flex-shrink-0">
            <a href={banner.link} target="_blank" rel="noopener noreferrer">
              <img
                src={banner.url}
                alt={banner.alt}
                className="w-full h-auto object-cover"
              />
            </a>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2">
        {activeBanners.map((_, index) => (
          <span
            key={index}
            className={`block w-2 h-2 mx-1 rounded-full cursor-pointer ${
              index === currentIndex ? 'bg-white opacity-100' : 'bg-gray-400 opacity-70'
            }`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
