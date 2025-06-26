
import { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import HomeBannerCarousel from "@/components/HomeBannerCarousel";

interface ServiceCard {
  id: string;
  logo_url: string;
  description: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
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

  const handleContactClick = (type: 'phone' | 'email', value: string) => {
    if (type === 'phone') {
      window.open(`tel:${value}`, '_self');
    } else {
      window.open(`mailto:${value}`, '_self');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Serviços de Automação Comercial"
        description="Descubra nossos serviços completos de automação comercial: PDV, controle de estoque, emissão fiscal, gestão financeira e suporte técnico especializado em Pontes e Lacerda, MT."
        keywords="serviços automação comercial, PDV, controle estoque, emissão fiscal, NFe, NFCe, gestão financeira, suporte técnico, Pontes e Lacerda"
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
      
      {/* Banner Carousel */}
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
                Soluções completas em automação comercial para impulsionar seu negócio
              </p>
            </div>
          </ScrollReveal>

          {/* Service Cards */}
          <ScrollReveal animation="fade-up" delay={100}>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando serviços...</p>
                </div>
              </div>
            ) : serviceCards.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum serviço disponível
                </h3>
                <p className="text-gray-600">
                  Em breve teremos mais informações sobre nossos serviços.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {serviceCards.map((card, index) => (
                  <Card 
                    key={card.id} 
                    className="hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm border-brand-gold/20"
                  >
                    <CardHeader className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-brand-gold/10 to-brand-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <img
                            src={card.logo_url}
                            alt="Logo do Serviço"
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300 text-center">
                        {card.description}
                      </p>
                      
                      <div className="space-y-3">
                        <Button
                          onClick={() => handleContactClick('phone', card.phone)}
                          className="w-full bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-semibold group/btn"
                        >
                          <Phone className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                          {card.phone}
                        </Button>
                        
                        <Button
                          onClick={() => handleContactClick('email', card.email)}
                          variant="outline"
                          className="w-full border-brand-gold/30 hover:bg-brand-gold/10 hover:border-brand-gold text-brand-black group/btn"
                        >
                          <Mail className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                          {card.email}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="text-center bg-gradient-to-r from-brand-black to-brand-black-light rounded-2xl p-12 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-4">
                Precisa de uma Solução Personalizada?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Entre em contato conosco e vamos desenvolver a solução perfeita para seu negócio.
              </p>
              <Button asChild className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold group">
                <a href="https://wa.me/5565993535079" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Solicitar Orçamento
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
