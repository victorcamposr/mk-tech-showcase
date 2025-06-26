
import { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { Phone, Mail } from 'lucide-react';
import HomeBannerCarousel from "@/components/HomeBannerCarousel";

interface ServiceCard {
  id: string;
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
        .order('sort_order', { ascending: true });

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

  const handleContact = (type: 'phone' | 'email', value: string) => {
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
      
      {/* Banner Carousel no topo */}
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
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
            </div>
          ) : serviceCards.length === 0 ? (
            <ScrollReveal animation="fade-up">
              <div className="text-center py-16">
                <p className="text-xl text-gray-600">
                  Em breve, novos serviços serão disponibilizados.
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {serviceCards.map((service, index) => (
                  <Card key={service.id} className="hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm border-brand-gold/20">
                    <CardContent className="p-6">
                      {/* Logo */}
                      <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <img 
                            src={service.logo_url} 
                            alt="Logo do serviço"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Descrição */}
                      <div className="text-center mb-6">
                        <p className="text-gray-700 group-hover:text-gray-800 transition-colors duration-300 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Contatos */}
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2 hover:bg-brand-gold hover:text-brand-black transition-colors"
                          onClick={() => handleContact('phone', service.phone)}
                        >
                          <Phone className="w-4 h-4" />
                          {service.phone}
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2 hover:bg-brand-gold hover:text-brand-black transition-colors"
                          onClick={() => handleContact('email', service.email)}
                        >
                          <Mail className="w-4 h-4" />
                          {service.email}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
