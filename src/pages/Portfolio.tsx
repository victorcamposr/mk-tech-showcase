
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CountUpNumber from "@/components/CountUpNumber";
import SimpleIcon from "@/components/SimpleIcon";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PortfolioStat {
  id: string;
  key: string;
  label: string;
  value: number;
  suffix: string;
  sort_order: number;
}

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  results: string[];
  image_url: string | null;
  sort_order: number;
}

interface PortfolioTestimonial {
  id: string;
  content: string;
  author: string;
  company: string;
  rating: number;
  sort_order: number;
}

const Portfolio = () => {
  // Carregar estatísticas - usar mesma query key do admin
  const { data: stats = [] } = useQuery({
    queryKey: ['portfolio-stats'],
    queryFn: async () => {
      console.log('Loading portfolio stats...');
      const { data, error } = await supabase
        .from('portfolio_stats')
        .select('*')
        .eq('status', 'active')
        .order('sort_order');
      
      if (error) throw error;
      console.log('Portfolio stats loaded:', data);
      return data as PortfolioStat[];
    }
  });

  // Carregar projetos - usar mesma query key do admin
  const { data: projects = [] } = useQuery({
    queryKey: ['portfolio-projects'],
    queryFn: async () => {
      console.log('Loading portfolio projects...');
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('status', 'active')
        .order('sort_order');
      
      if (error) throw error;
      console.log('Portfolio projects loaded:', data);
      return data as PortfolioProject[];
    }
  });

  // Carregar depoimentos - usar mesma query key do admin
  const { data: testimonials = [] } = useQuery({
    queryKey: ['portfolio-testimonials'],
    queryFn: async () => {
      console.log('Loading portfolio testimonials...');
      const { data, error } = await supabase
        .from('portfolio_testimonials')
        .select('*')
        .eq('status', 'active')
        .order('sort_order');
      
      if (error) throw error;
      console.log('Portfolio testimonials loaded:', data);
      return data as PortfolioTestimonial[];
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Portfólio de Projetos"
        description="Conheça nossos projetos de automação comercial em Pontes e Lacerda. Mais de 100 empresas atendidas em 15+ segmentos com soluções personalizadas e resultados comprovados."
        keywords="projetos automação comercial, cases de sucesso, clientes MK Tecnologia, portfólio tecnologia empresarial, Pontes e Lacerda"
      />
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Início", url: "/" },
            { name: "Portfólio", url: "/portfolio" }
          ]
        }}
      />
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <ScrollReveal animation="fade-in">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-6">
                Nosso <span className="text-brand-gold">Portfólio</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Conheça alguns dos projetos que transformaram negócios em Pontes e Lacerda e região
              </p>
            </div>
          </ScrollReveal>

          {/* Estatísticas com efeito crescente */}
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat) => (
                <div key={stat.id} className="text-center p-6 bg-gradient-to-br from-brand-gold/10 to-brand-gold/20 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-4xl font-bold text-brand-gold mb-2">
                    {stat.key === 'support' ? (
                      <div>24/7</div>
                    ) : (
                      <CountUpNumber end={stat.value} suffix={stat.suffix} className="block" />
                    )}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Projetos com novo layout de banner horizontal */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-brand-black text-center mb-12">
                Projetos em Destaque
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project) => (
                  <Card key={project.id} className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-2 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm overflow-hidden">
                    {/* Banner horizontal com imagem */}
                    <div className="h-48 overflow-hidden relative">
                      {project.image_url ? (
                        <img 
                          src={project.image_url} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-gold/20 to-brand-gold/30 flex items-center justify-center">
                          <span className="text-6xl">🏢</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-brand-gold/90 backdrop-blur-sm text-brand-black text-xs font-semibold px-3 py-1 rounded-full">
                        {project.category}
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">{project.title}</h3>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{project.description}</p>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-brand-black text-sm">Resultados Alcançados:</h4>
                        <ul className="space-y-2">
                          {project.results.slice(0, 3).map((result, resultIndex) => (
                            <li key={resultIndex} className="flex items-start text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-brand-gold rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                              <span className="group-hover:text-gray-700 transition-colors duration-300">
                                {result}
                              </span>
                            </li>
                          ))}
                          {project.results.length > 3 && (
                            <li className="text-xs text-brand-gold font-medium ml-5">
                              +{project.results.length - 3} resultados adicionais
                            </li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Depoimentos */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-brand-black text-center mb-12">
                O que Nossos Clientes Dizem
              </h2>
              <TestimonialCarousel testimonials={testimonials} />
            </div>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal animation="fade-up" delay={400}>
            <div className="text-center bg-gradient-to-r from-brand-black to-brand-black-light rounded-2xl p-12 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-4">
                Seu Negócio Pode Ser o Próximo Sucesso
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Entre em contato conosco e vamos criar uma solução personalizada para transformar sua empresa.
              </p>
              <div className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold px-8 py-3 rounded-lg transition-colors group inline-flex items-center gap-2">
                <a href="https://wa.me/5565993535079" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <SimpleIcon type="whatsapp-black" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Quero Meu Projeto
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;
