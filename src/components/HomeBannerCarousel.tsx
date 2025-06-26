
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ScrollReveal } from '@/components/ScrollReveal';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface HomeBanner {
  id: string;
  title: string;
  image_url: string;
  link_url?: string;
  sort_order: number;
  status: string;
  category_id?: string;
}

const HomeBannerCarousel = () => {
  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchBanners();
  }, [location.pathname]);

  const fetchBanners = async () => {
    try {
      // Check if we're on a category page
      const categoryMatch = location.pathname.match(/^\/servicos\/([^\/]+)$/);
      let query = supabase
        .from('home_banners')
        .select('*')
        .eq('status', 'active');

      if (categoryMatch) {
        // On category page, get banners for this category
        const categorySlug = categoryMatch[1];
        
        // First get the category ID
        const { data: categoryData, error: categoryError } = await supabase
          .from('service_categories')
          .select('id')
          .eq('slug', categorySlug)
          .eq('status', 'active')
          .single();

        if (categoryError || !categoryData) {
          setBanners([]);
          setLoading(false);
          return;
        }

        query = query.eq('category_id', categoryData.id);
      } else {
        // On home page, get banners without category (home banners)
        query = query.is('category_id', null);
      }

      const { data, error } = await query.order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching banners:', error);
        return;
      }

      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || banners.length === 0) {
    return null;
  }

  const handleBannerClick = (banner: HomeBanner) => {
    if (banner.link_url) {
      if (banner.link_url.startsWith('http')) {
        window.open(banner.link_url, '_blank', 'noopener noreferrer');
      } else {
        window.location.href = banner.link_url;
      }
    }
  };

  // Se houver apenas um banner, exibir estaticamente
  if (banners.length === 1) {
    const banner = banners[0];
    return (
      <ScrollReveal animation="fade-in">
        <section className="w-full py-6 bg-gradient-to-r from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              className={`relative w-full h-40 md:h-56 lg:h-72 rounded-xl overflow-hidden shadow-lg ${
                banner.link_url ? 'cursor-pointer hover:shadow-xl transition-shadow duration-300' : ''
              }`}
              onClick={() => handleBannerClick(banner)}
            >
              <img 
                src={banner.image_url} 
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    );
  }

  // Se houver mais de um banner, exibir como carrossel com autoplay
  return (
    <ScrollReveal animation="fade-in">
      <section className="w-full py-6 bg-gradient-to-r from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Carousel 
            className="w-full" 
            opts={{ 
              loop: true, 
              align: "start" 
            }}
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: true,
              }),
            ]}
          >
            <CarouselContent>
              {banners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div 
                    className={`relative w-full h-40 md:h-56 lg:h-72 rounded-xl overflow-hidden shadow-lg ${
                      banner.link_url ? 'cursor-pointer hover:shadow-xl transition-shadow duration-300' : ''
                    }`}
                    onClick={() => handleBannerClick(banner)}
                  >
                    <img 
                      src={banner.image_url} 
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </section>
    </ScrollReveal>
  );
};

export default HomeBannerCarousel;
