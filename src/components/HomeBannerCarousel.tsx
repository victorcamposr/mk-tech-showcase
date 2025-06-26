
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HomeBanner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  status: 'active' | 'inactive';
}

const HomeBannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Carregar banners ativos
  const { data: banners = [] } = useQuery({
    queryKey: ['home-banners'],
    queryFn: async () => {
      console.log('Loading home banners...');
      const { data, error } = await supabase
        .from('home_banners')
        .select('*')
        .eq('status', 'active')
        .order('sort_order');
      
      if (error) throw error;
      console.log('Home banners loaded:', data);
      return data as HomeBanner[];
    }
  });

  // Auto-play do carrossel se houver mais de um banner
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Troca a cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Não renderizar se não houver banners
  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  const handleBannerClick = () => {
    if (currentBanner.link_url) {
      window.open(currentBanner.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-2xl shadow-lg mb-16">
      {/* Banner atual */}
      <div 
        className={`relative w-full h-full transition-all duration-500 ${
          currentBanner.link_url ? 'cursor-pointer' : ''
        }`}
        onClick={handleBannerClick}
      >
        <img
          src={currentBanner.image_url}
          alt={currentBanner.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        
        {/* Título do banner */}
        <div className="absolute bottom-4 left-6">
          <h3 className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">
            {currentBanner.title}
          </h3>
        </div>
      </div>

      {/* Controles do carrossel - apenas se houver mais de um banner */}
      {banners.length > 1 && (
        <>
          {/* Botões de navegação */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-lg"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-lg"
            onClick={goToNext}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Indicadores */}
          <div className="absolute bottom-4 right-6 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-brand-gold shadow-lg' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HomeBannerCarousel;
