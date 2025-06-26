
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
import { useEffect, useState } from "react";

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
  const [stats, setStats] = useState<PortfolioStat[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [testimonials, setTestimonials] = useState<PortfolioTestimonial[]>([]);

  // Carregar estatísticas
  const { data: statsData } = useQuery({
    queryKey: ['portfolio-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_stats')
        .select('*')
        .eq('status', 'active')
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });

  // Carregar projetos
  const { data: projectsData } = useQuery({
    queryKey: ['portfolio-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('status', 'active')
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });

  // Carregar depoimentos
  const { data: testimonialsData } = useQuery({
    queryKey: ['portfolio-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_testimonials')
        .select('*')
        .eq('status', 'active')
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (statsData) setStats(statsData);
    if (projectsData) setProjects(projectsData);
    if (testimonialsData) setTestimonials(testimonialsData);
  }, [statsData, projectsData, testimonialsData]);

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

          {/* Projetos */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-brand-black text-center mb-12">
                Projetos em Destaque
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <Card key={project.id} className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <div className="text-6xl mb-4 text-center group-hover:animate-pulse">
                        {project.image_url ? (
                          <img 
                            src={project.image_url} 
                            alt={project.title}
                            className="w-16 h-16 mx-auto object-contain"
                          />
                        ) : (
                          <div className="w-16 h-16 mx-auto bg-brand-gold/20 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🏢</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-brand-gold font-semibold mb-2">{project.category}</div>
                      <h3 className="text-xl font-bold text-brand-black mb-3 group-hover:text-brand-gold transition-colors duration-300">{project.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm group-hover:text-gray-700 transition-colors duration-300">{project.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-brand-black text-sm">Resultados:</h4>
                        <ul className="space-y-1">
                          {project.results.map((result, resultIndex) => (
                            <li key={resultIndex} className="flex items-start text-xs text-gray-600">
                              <div className="w-1.5 h-1.5 bg-brand-gold rounded-full mt-1.5 mr-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                              {result}
                            </li>
                          ))}
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
