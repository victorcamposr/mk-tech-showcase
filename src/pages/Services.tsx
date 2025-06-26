
import { useState, useEffect } from 'react';
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

const Services = () => {
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiceCards();
  }, []);

  const fetchServiceCards = async () => {
    try {
      const { data, error } = await supabase
        .from('service_cards')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching service cards:', error);
        return;
      }

      setServiceCards(data || []);
    } catch (error) {
      console.error('Error fetching service cards:', error);
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

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Nossos Serviços - MK Tecnologia"
        description="Conheça nossos serviços especializados em automação comercial, tecnologia empresarial e soluções digitais em Pontes e Lacerda, MT."
        keywords="serviços, automação comercial, tecnologia empresarial, soluções digitais, Pontes e Lacerda, Mato Grosso"
      />
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Início", url: "/" },
            { name: "Serviços", url: "/servicos" }
          ]
        }}
      />
      <Header />
      
      {/* Banner Section */}
      <HomeBannerCarousel />
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <ScrollReveal animation="fade-in">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-6">
                Nossos <span className="text-brand-gold">Serviços</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Conheça nossa rede de parceiros especializados em diversos segmentos tecnológicos
              </p>
            </div>
          </ScrollReveal>

          {/* Service Cards Grid */}
          <ScrollReveal animation="fade-up" delay={100}>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-lg text-gray-600">Carregando serviços...</div>
              </div>
            ) : serviceCards.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-gray-400 text-lg mb-4">Nenhum serviço cadastrado ainda</div>
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

export default Services;
