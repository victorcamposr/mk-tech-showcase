
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomeBannerCarousel from '@/components/HomeBannerCarousel';
import InteractiveDashboard from '@/components/InteractiveDashboard';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import CountUpNumber from '@/components/CountUpNumber';
import ScrollReveal from '@/components/ScrollReveal';
import FiscalDataButton from '@/components/FiscalDataButton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, CheckCircle, Users, TrendingUp, Clock, Star } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const { data: portfolioStats = [] } = useQuery({
    queryKey: ['portfolio-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_stats')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_testimonials')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  const benefits = [
    {
      icon: TrendingUp,
      title: "Crescimento Sustentável",
      description: "Estratégias comprovadas para acelerar o crescimento do seu negócio"
    },
    {
      icon: Users,
      title: "Experiência Personalizada",
      description: "Soluções adaptadas às necessidades específicas da sua empresa"
    },
    {
      icon: Clock,
      title: "Resultados Rápidos",
      description: "Implementação ágil com foco em resultados mensuráveis"
    },
    {
      icon: Star,
      title: "Qualidade Garantida",
      description: "Padrão de excelência em todos os nossos serviços"
    }
  ];

  return (
    <>
      <SEO 
        title="Campin - Transformando Negócios com Tecnologia"
        description="Especialistas em desenvolvimento de soluções digitais inovadoras. Criamos experiências que conectam marcas aos seus clientes de forma memorável."
      />
      <Header />
      
      <main>
        {/* Hero Section with Carousel */}
        <section className="relative">
          <HomeBannerCarousel />
        </section>

        {/* About Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Transformamos <span className="text-brand-gold">Ideias</span> em Realidade
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Somos especialistas em criar soluções digitais inovadoras que impulsionam o crescimento 
                    dos nossos clientes. Nossa paixão é transformar desafios em oportunidades.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-gold/10 rounded-full mb-4">
                        <benefit.icon className="w-8 h-8 text-brand-gold" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={400}>
                <div className="text-center">
                  <Button 
                    onClick={() => navigate('/sobre')}
                    size="lg"
                    className="bg-brand-gold hover:bg-brand-gold/90 text-white px-8 py-4 text-lg font-semibold"
                  >
                    Conheça Nossa História
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {portfolioStats.length > 0 && (
          <section className="py-20 bg-brand-gold">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Números que Falam por Si
                  </h2>
                  <p className="text-xl text-brand-gold/90 max-w-3xl mx-auto">
                    Resultados que demonstram nosso compromisso com a excelência
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {portfolioStats.map((stat, index) => (
                  <ScrollReveal key={stat.id} delay={index * 100}>
                    <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                        <CountUpNumber 
                          end={stat.value} 
                          duration={2} 
                          suffix={stat.suffix || ''}
                        />
                      </div>
                      <p className="text-brand-gold/90 font-semibold text-lg">{stat.label}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Services Preview */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Nossos <span className="text-brand-gold">Serviços</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Oferecemos uma gama completa de soluções digitais para atender às necessidades do seu negócio
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <InteractiveDashboard />
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="text-center mt-12">
                <Button 
                  onClick={() => navigate('/servicos')}
                  size="lg"
                  variant="outline"
                  className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white px-8 py-4 text-lg font-semibold"
                >
                  Ver Todos os Serviços
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    O que Nossos <span className="text-brand-gold">Clientes</span> Dizem
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Depoimentos de quem já experimentou a diferença dos nossos serviços
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <TestimonialCarousel testimonials={testimonials} />
              </ScrollReveal>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-brand-gold to-yellow-500">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Pronto para Transformar seu Negócio?
                </h2>
                <p className="text-xl text-brand-gold/90 mb-8 max-w-2xl mx-auto">
                  Entre em contato conosco e descubra como podemos ajudar sua empresa a alcançar novos patamares
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('/contato')}
                    size="lg"
                    variant="secondary"
                    className="bg-white text-brand-gold hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                  >
                    <CheckCircle className="mr-2 w-5 h-5" />
                    Fale Conosco
                  </Button>
                  <Button 
                    onClick={() => navigate('/portfolio')}
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-brand-gold px-8 py-4 text-lg font-semibold"
                  >
                    Ver Portfólio
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
      <FiscalDataButton />
    </>
  );
};

export default Index;
