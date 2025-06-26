
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeBannerCarousel from "@/components/HomeBannerCarousel";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { Phone, Mail } from 'lucide-react';

interface ServiceCard {
  id: string;
  title: string;
  logo_url: string;
  description: string;
  phone: string;
  email: string;
  status: string;
  sort_order: number;
}

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url?: string;
  sort_order: number;
}

const ServicesByCategory = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categorySlug) {
      fetchCategoryData();
    }
  }, [categorySlug]);

  const fetchCategoryData = async () => {
    if (!categorySlug) return;

    try {
      // Fetch category info
      const { data: categoryData, error: categoryError } = await supabase
        .from('service_categories')
        .select('id, name, slug, description')
        .eq('slug', categorySlug)
        .eq('status', 'active')
        .single();

      if (categoryError) {
        console.error('Error fetching category:', categoryError);
        return;
      }

      setCategory(categoryData);

      // Fetch service cards for this category
      const { data: cardsData, error: cardsError } = await supabase
        .from('service_cards')
        .select('*')
        .eq('category_id', categoryData.id)
        .eq('status', 'active')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (cardsError) {
        console.error('Error fetching service cards:', cardsError);
        return;
      }

      setServiceCards(cardsData || []);

      // Fetch banners for this category
      const { data: bannersData, error: bannersError } = await supabase
        .from('home_banners')
        .select('id, title, image_url, link_url, sort_order')
        .eq('category_id', categoryData.id)
        .eq('status', 'active')
        .order('sort_order', { ascending: true });

      if (bannersError) {
        console.error('Error fetching banners:', bannersError);
        return;
      }

      setBanners(bannersData || []);
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  const handleBannerClick = (banner: Banner) => {
    if (banner.link_url) {
      if (banner.link_url.startsWith('http')) {
        window.open(banner.link_url, '_blank', 'noopener noreferrer');
      } else {
        window.location.href = banner.link_url;
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-brand-black mb-6">Categoria não encontrada</h1>
            <p className="text-gray-600">A categoria solicitada não foi encontrada.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${category.name} - MK Tecnologia`}
        description={category.description || `Conheça nossos serviços na categoria ${category.name} em Pontes e Lacerda, MT.`}
        keywords={`${category.name}, serviços, Pontes e Lacerda, Mato Grosso, MK Tecnologia`}
      />
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Início", url: "/" },
            { name: "Serviços", url: "/servicos" },
            { name: category.name, url: `/servicos/${category.slug}` }
          ]
        }}
      />
      <Header />
      
      {/* Category Banners */}
      {banners.length > 0 && (
        <ScrollReveal animation="fade-in">
          <section className="w-full py-6 bg-gradient-to-r from-gray-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {banners.length === 1 ? (
                <div 
                  className={`relative w-full h-40 md:h-56 lg:h-72 rounded-xl overflow-hidden shadow-lg ${
                    banners[0].link_url ? 'cursor-pointer hover:shadow-xl transition-shadow duration-300' : ''
                  }`}
                  onClick={() => handleBannerClick(banners[0])}
                >
                  <img 
                    src={banners[0].image_url} 
                    alt={banners[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {banners.map((banner) => (
                    <div 
                      key={banner.id}
                      className={`relative w-full h-32 md:h-40 rounded-xl overflow-hidden shadow-lg ${
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
                  ))}
                </div>
              )}
            </div>
          </section>
        </ScrollReveal>
      )}
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <ScrollReveal animation="fade-in">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-6">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {category.description}
                </p>
              )}
            </div>
          </ScrollReveal>

          {/* Service Cards Grid */}
          <ScrollReveal animation="fade-up" delay={100}>
            {serviceCards.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-gray-400 text-lg mb-4">Nenhum serviço disponível nesta categoria</div>
                <p className="text-gray-600">Em breve teremos novos serviços disponíveis.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {serviceCards.map((card, index) => (
                  <Card key={card.id} className="hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm border border-gray-200">
                    <CardContent className="p-8 text-center">
                      <div className="mb-6 flex flex-col items-center">
                        <div className="w-24 h-24 mb-4 flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 group-hover:shadow-lg transition-shadow">
                          <img 
                            src={card.logo_url} 
                            alt={`Logo ${card.title}`}
                            className="w-20 h-20 object-contain"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-brand-black mb-2 group-hover:text-brand-gold transition-colors duration-300">
                          {card.title}
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                        {card.description}
                      </p>
                      
                      <div className="space-y-3">
                        <Button
                          onClick={() => handlePhoneClick(card.phone)}
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2 hover:bg-brand-gold hover:text-brand-black hover:border-brand-gold transition-all duration-300"
                        >
                          <Phone className="w-4 h-4" />
                          {card.phone}
                        </Button>
                        
                        <Button
                          onClick={() => handleEmailClick(card.email)}
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2 hover:bg-brand-gold hover:text-brand-black hover:border-brand-gold transition-all duration-300"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{card.email}</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollReveal>

          {/* CTA Section */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="text-center bg-gradient-to-r from-brand-black to-brand-black-light rounded-2xl p-12 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-4">
                Precisa de Mais Informações?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Entre em contato conosco para saber mais sobre nossos serviços e como podemos ajudar seu negócio.
              </p>
              <Button asChild className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold">
                <a href="/contato">
                  Falar Conosco
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesByCategory;
