import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CountUpNumber from "@/components/CountUpNumber";
import SimpleIcon from "@/components/SimpleIcon";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import InteractiveDashboard from "@/components/InteractiveDashboard";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";

const Portfolio = () => {
  const projects = [
    {
      title: "Supermercado Central",
      category: "Varejo Alimentício",
      description: "Implementação completa de sistema PDV com controle de estoque, emissão fiscal e gestão financeira para rede de supermercados.",
      results: ["Redução de 40% no tempo de fechamento", "Controle preciso de estoque", "Integração com balanças", "Relatórios gerenciais"],
      emoji: "🏪"
    },
    {
      title: "Farmácia Vida & Saúde",
      category: "Farmácia",
      description: "Sistema especializado para farmácia com controle de medicamentos controlados, validades e integração com convênios.",
      results: ["Controle de medicamentos controlados", "Alertas de validade", "Integração com PBM", "NFCe automática"],
      emoji: "💊"
    },
    {
      title: "Loja Fashion Style",
      category: "Moda e Vestuário",
      description: "Automação comercial para loja de roupas com controle de grades, cores, tamanhos e sazonalidade.",
      results: ["Gestão de grades completa", "Controle de sazonalidade", "Relatórios de vendas", "Sistema de fidelidade"],
      emoji: "👕"
    },
    {
      title: "Restaurante Sabor & Arte",
      category: "Alimentação",
      description: "Sistema para restaurante com controle de mesas, comanda eletrônica e integração com delivery.",
      results: ["Comanda eletrônica", "Controle de mesas", "Integração delivery", "Gestão de cardápio"],
      emoji: "🍽️"
    },
    {
      title: "Auto Peças Rondon",
      category: "Autopeças",
      description: "Sistema especializado para autopeças com catálogo integrado, compatibilidade de peças e gestão de orçamentos.",
      results: ["Catálogo de 50mil+ peças", "Compatibilidade automática", "Orçamentos digitais", "Controle de garantias"],
      emoji: "🔧"
    },
    {
      title: "Clínica Médica Bem Estar",
      category: "Saúde",
      description: "Sistema de gestão para clínica médica com agendamento, prontuário eletrônico e controle financeiro.",
      results: ["Agendamento online", "Prontuário digital", "Controle de convênios", "Relatórios médicos"],
      emoji: "🏥"
    }
  ];


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
            <div className="text-center p-6 bg-gradient-to-br from-brand-gold/10 to-brand-gold/20 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-brand-gold mb-2">
                <CountUpNumber end={100} suffix="+" className="block" />
              </div>
              <div className="text-gray-600 font-medium">Empresas Atendidas</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-brand-gold/10 to-brand-gold/20 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-brand-gold mb-2">
                <CountUpNumber end={15} suffix="+" className="block" />
              </div>
              <div className="text-gray-600 font-medium">Segmentos</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-brand-gold/10 to-brand-gold/20 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-brand-gold mb-2">
                <CountUpNumber end={5} suffix="+" className="block" />
              </div>
              <div className="text-gray-600 font-medium">Anos de Experiência</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-brand-gold/10 to-brand-gold/20 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-brand-gold mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Suporte Disponível</div>
            </div>
            </div>
          </ScrollReveal>

          {/* Projetos */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-black text-center mb-12">
              Projetos em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card key={index} className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="text-6xl mb-4 text-center group-hover:animate-pulse">{project.emoji}</div>
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

          {/* Dashboard Interativo */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-black mb-4">
                Tecnologia Preditiva em Ação
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Veja como nossa IA analisa dados em tempo real para impulsionar seu negócio
              </p>
            </div>
            <InteractiveDashboard />
          </div>

          {/* Depoimentos */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-black text-center mb-12">
              O que Nossos Clientes Dizem
            </h2>
            <TestimonialCarousel />
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