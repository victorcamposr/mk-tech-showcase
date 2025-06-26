import { useEffect, useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypewriterText from "@/components/TypewriterText";
import ColoredServiceIcon from "@/components/ColoredServiceIcon";
import CountUpNumber from "@/components/CountUpNumber";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import InteractiveDashboard from "@/components/InteractiveDashboard";
import ContactModal from "@/components/ContactModal";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Target, Users, TrendingUp, Award } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface PortfolioStat {
  id: string;
  key: string;
  label: string;
  value: number;
  suffix: string;
}

const Index = () => {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStat[]>([]);

  useEffect(() => {
    fetchPortfolioStats();
  }, []);

  const fetchPortfolioStats = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_stats')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching portfolio stats:', error);
        return;
      }

      setPortfolioStats(data || []);
    } catch (error) {
      console.error('Error fetching portfolio stats:', error);
    }
  };

  const handleContactClick = () => {
    setContactModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Sistemas para Automação Comercial - Soluções Completas para seu Negócio"
        description="Transforme seu negócio com nossos sistemas de automação comercial. PDV, controle de estoque, emissão fiscal e muito mais. Atendemos Pontes e Lacerda e região."
        keywords="automação comercial, PDV, sistema de vendas, controle de estoque, emissão fiscal, NFe, NFCe, Pontes e Lacerda, Mato Grosso"
      />
      <StructuredData 
        type="organization" 
        data={{
          name: "Sistemas de Automação Comercial",
          description: "Soluções completas em automação comercial para empresas de todos os tamanhos.",
          address: "Pontes e Lacerda, MT",
          phone: "(65) 99353-5079"
        }}
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-black via-brand-black-light to-brand-black overflow-hidden">
          <div className="absolute inset-0 bg-hero-pattern opacity-10 z-0"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <ScrollReveal animation="fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Acelere seu negócio com <br />
                  <TypewriterText
                    texts={[
                      'Automação Comercial',
                      'Sistemas de Gestão',
                      'Soluções Inovadoras'
                    ]}
                  />
                </h1>
              </ScrollReveal>
              <ScrollReveal animation="fade-in" delay={200}>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                  Simplifique processos, impulsione suas vendas e tenha o controle total do seu negócio.
                </p>
              </ScrollReveal>
              <ScrollReveal animation="fade-in" delay={400}>
                <Button onClick={handleContactClick} className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black">
                  Solicitar Orçamento
                </Button>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-brand-black">
                  Nossos Serviços em Destaque
                </h2>
                <p className="text-gray-600">
                  Conheça as soluções que oferecemos para otimizar seu negócio.
                </p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ScrollReveal animation="fade-up" delay={100}>
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <ColoredServiceIcon type="automation" className="w-5 h-5" />
                        Automação Comercial
                      </div>
                    </CardTitle>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-500">
                      Implementação de sistemas para otimizar processos e aumentar a eficiência.
                    </CardDescription>
                  </CardContent>
                </Card>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={200}>
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <ColoredServiceIcon type="inventory" className="w-5 h-5" />
                        Controle de Estoque
                      </div>
                    </CardTitle>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-500">
                      Gerenciamento eficiente do seu estoque, evitando perdas e otimizando compras.
                    </CardDescription>
                  </CardContent>
                </Card>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={300}>
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <ColoredServiceIcon type="financial" className="w-5 h-5" />
                        Gestão Financeira
                      </div>
                    </CardTitle>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-500">
                      Controle financeiro completo para sua empresa, com relatórios e análises.
                    </CardDescription>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
            <ScrollReveal animation="fade-in" delay={400}>
              <div className="text-center mt-8">
                <Button className="bg-brand-black hover:bg-brand-black-light text-white">
                  Ver Todos os Serviços
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-brand-black">
                  Por Que Escolher Nossos Sistemas?
                </h2>
                <p className="text-gray-600">
                  Descubra os benefícios que nossos sistemas oferecem para o seu negócio.
                </p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ScrollReveal animation="fade-up" delay={100}>
                <Card className="bg-gray-50 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="space-y-2.5">
                    <CardTitle className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Soluções Personalizadas
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-500">
                      Sistemas adaptados às necessidades específicas do seu negócio.
                    </CardDescription>
                  </CardContent>
                </Card>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={200}>
                <Card className="bg-gray-50 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="space-y-2.5">
                    <CardTitle className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        Foco em Resultados
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-500">
                      Acompanhamento constante para garantir o sucesso da sua empresa.
                    </CardDescription>
                  </CardContent>
                </Card>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={300}>
                <Card className="bg-gray-50 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="space-y-2.5">
                    <CardTitle className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-brand-gold" />
                        Suporte Especializado
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-500">
                      Equipe pronta para auxiliar em todas as etapas, desde a implementação até o uso diário.
                    </CardDescription>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-brand-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-white">
                  Nossos Números
                </h2>
                <p className="text-gray-300">
                  Confira alguns resultados que comprovam a qualidade do nosso trabalho.
                </p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {portfolioStats.map(stat => (
                <ScrollReveal animation="fade-up" key={stat.id}>
                  <Card className="bg-brand-black-light text-white shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="space-y-2.5">
                      <CardTitle className="text-2xl font-bold">
                        <CountUpNumber end={stat.value} suffix={stat.suffix} />
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        {stat.label}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Dashboard Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-brand-black">
                  Painel Interativo
                </h2>
                <p className="text-gray-600">
                  Acompanhe em tempo real os principais indicadores do seu negócio.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-in">
              <InteractiveDashboard />
            </ScrollReveal>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-brand-black">
                  O Que Nossos Clientes Dizem
                </h2>
                <p className="text-gray-600">
                  Veja o que nossos clientes estão falando sobre nossos sistemas e serviços.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-in">
              <TestimonialCarousel />
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </div>
  );
};

export default Index;
