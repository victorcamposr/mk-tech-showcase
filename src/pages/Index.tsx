
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import CountUpNumber from "@/components/CountUpNumber";
import TypewriterText from "@/components/TypewriterText";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import InteractiveDashboard from "@/components/InteractiveDashboard";
import LocationSection from "@/components/LocationSection";
import ContactModal from "@/components/ContactModal";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { supabase } from '@/integrations/supabase/client';
import { Lightbulb, ArrowRight, Sparkles, Target, Users, Award } from "lucide-react";

interface Solution {
  id: string;
  title: string;
  key: string;
  description: string;
  icon_name: string;
  status: 'active' | 'inactive';
}

interface PortfolioStat {
  id: string;
  key: string;
  label: string;
  value: number;
  suffix: string;
  status: 'active' | 'inactive';
}

const Index = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStat[]>([]);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    fetchSolutions();
    fetchPortfolioStats();
  }, []);

  const fetchSolutions = async () => {
    try {
      const { data, error } = await supabase
        .from('solutions')
        .select('id, title, key, description, icon_name, status')
        .eq('status', 'active')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('title', { ascending: true })
        .limit(6);

      if (error) {
        console.error('Error fetching solutions:', error);
        return;
      }

      const typedSolutions = (data || []).map(solution => ({
        ...solution,
        status: solution.status as 'active' | 'inactive'
      }));

      setSolutions(typedSolutions);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

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

      const typedStats = (data || []).map(stat => ({
        ...stat,
        status: stat.status as 'active' | 'inactive'
      }));

      setPortfolioStats(typedStats);
    } catch (error) {
      console.error('Error fetching portfolio stats:', error);
    }
  };

  const typewriterStrings = [
    "Automação Comercial Inteligente",
    "Gestão Empresarial Completa",
    "Soluções Tecnológicas Inovadoras",
    "Transformação Digital Eficiente"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <SEO 
        title="MK Tecnologia - Automação Comercial e Soluções Empresariais"
        description="Transforme seu negócio com nossas soluções completas de automação comercial. PDV, controle de estoque, emissão fiscal, gestão financeira e muito mais em Pontes e Lacerda, MT."
        keywords="automação comercial, PDV, controle estoque, emissão fiscal, NFe, NFCe, gestão empresarial, Pontes e Lacerda, Mato Grosso"
      />
      <StructuredData 
        type="organization" 
        data={{
          name: "MK Tecnologia",
          description: "Soluções completas em automação comercial e gestão empresarial",
          address: "Pontes e Lacerda, MT",
          telephone: "+55 65 99353-5079",
          email: "contato@mktecnologia.co"
        }}
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-black-light to-brand-black opacity-95"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-brand-gold/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-brand-gold/8 rounded-full blur-lg animate-bounce animation-delay-2000"></div>
          
          <div className="relative z-10 text-center max-w-6xl mx-auto">
            <ScrollReveal animation="fade-in">
              <div className="mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-brand-gold/20 backdrop-blur-sm rounded-full border border-brand-gold/30 mb-6">
                  <Sparkles className="w-4 h-4 text-brand-gold mr-2" />
                  <span className="text-sm font-semibold text-brand-gold">Inovação em Tecnologia</span>
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                  <TypewriterText 
                    texts={typewriterStrings}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold"
                  />
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                  Transforme seu negócio com nossas soluções completas de automação comercial. 
                  Tecnologia de ponta para empresas que buscam excelência.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={() => setContactModalOpen(true)}
                  className="bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold hover:from-brand-gold-dark hover:via-brand-gold hover:to-brand-gold-light text-brand-black font-bold px-8 py-4 text-lg transition-all duration-500 hover:scale-110 shadow-2xl hover:shadow-3xl shadow-brand-gold/30 hover:shadow-brand-gold/50 group"
                >
                  <Target className="mr-2 h-5 w-5 group-hover:animate-spin" />
                  Solicitar Demonstração
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild
                  className="border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10 hover:border-brand-gold px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <Link to="/solucoes">
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Conhecer Soluções
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Stats Section */}
        {portfolioStats.length > 0 && (
          <section className="py-20 bg-gradient-to-r from-brand-black to-brand-black-light relative overflow-hidden">
            <div className="absolute inset-0 opacity-50" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.03'%3E%3Cpath d='M20 20c0-11.046 8.954-20 20-20v40c-11.046 0-20-8.954-20-20z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <ScrollReveal animation="fade-up">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Resultados que <span className="text-brand-gold">Impressionam</span>
                  </h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Números que comprovam nossa experiência e sucesso
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {portfolioStats.map((stat, index) => (
                    <div key={stat.id} className="text-center group">
                      <div className="relative mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-brand-gold/20 to-brand-gold/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Award className="w-8 h-8 text-brand-gold" />
                        </div>
                        <div className="absolute -inset-4 bg-brand-gold/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="text-4xl md:text-5xl font-bold text-brand-gold mb-2">
                        <CountUpNumber value={stat.value} suffix={stat.suffix} />
                      </div>
                      <p className="text-gray-300 font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* Solutions Preview */}
        {solutions.length > 0 && (
          <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal animation="fade-up">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-4">
                    Nossas <span className="text-brand-gold">Soluções</span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Tecnologia avançada para transformar sua empresa
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {solutions.map((solution, index) => (
                    <Card key={solution.id} className="group hover:shadow-2xl hover:shadow-brand-gold/20 transition-all duration-500 hover:-translate-y-2 border-brand-gold/20 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                      <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-brand-gold/10 to-brand-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Lightbulb className="w-8 h-8 text-brand-gold" />
                        </div>
                        <CardTitle className="text-xl text-brand-black group-hover:text-brand-gold transition-colors duration-300">
                          {solution.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                          {solution.description}
                        </p>
                        <Button 
                          asChild 
                          variant="outline" 
                          className="border-brand-gold/30 hover:bg-brand-gold/10 hover:border-brand-gold text-brand-black group-hover:scale-105 transition-all duration-300"
                        >
                          <Link to={`/solucoes/${solution.key}`}>
                            Saiba Mais
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center">
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-bold px-8 py-4 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Link to="/solucoes">
                      Ver Todas as Soluções
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* Interactive Dashboard */}
        <section className="py-20 bg-gradient-to-br from-brand-black to-brand-black-light relative overflow-hidden">
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.02'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <InteractiveDashboard />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-4">
                  O que Nossos <span className="text-brand-gold">Clientes</span> Dizem
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Depoimentos reais de empresas que confiam em nossas soluções
                </p>
              </div>
              <TestimonialCarousel />
            </ScrollReveal>
          </div>
        </section>

        {/* Location */}
        <LocationSection />
      </main>

      <Footer />
      <ContactModal 
        isOpen={contactModalOpen} 
        onClose={() => setContactModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
