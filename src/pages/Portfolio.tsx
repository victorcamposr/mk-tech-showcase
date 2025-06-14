import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Portfolio = () => {
  const projects = [
    {
      title: "Supermercado Central",
      category: "Varejo Alimentício",
      description: "Implementação completa de sistema PDV com controle de estoque, emissão fiscal e gestão financeira para rede de supermercados.",
      results: ["Redução de 40% no tempo de fechamento", "Controle preciso de estoque", "Integração com balanças", "Relatórios gerenciais"],
      image: "🏪"
    },
    {
      title: "Farmácia Vida & Saúde",
      category: "Farmácia",
      description: "Sistema especializado para farmácia com controle de medicamentos controlados, validades e integração com convênios.",
      results: ["Controle de medicamentos controlados", "Alertas de validade", "Integração com PBM", "NFCe automática"],
      image: "💊"
    },
    {
      title: "Loja Fashion Style",
      category: "Moda e Vestuário",
      description: "Automação comercial para loja de roupas com controle de grades, cores, tamanhos e sazonalidade.",
      results: ["Gestão de grades completa", "Controle de sazonalidade", "Relatórios de vendas", "Sistema de fidelidade"],
      image: "👕"
    },
    {
      title: "Restaurante Sabor & Arte",
      category: "Alimentação",
      description: "Sistema para restaurante com controle de mesas, comanda eletrônica e integração com delivery.",
      results: ["Comanda eletrônica", "Controle de mesas", "Integração delivery", "Gestão de cardápio"],
      image: "🍽️"
    },
    {
      title: "Auto Peças Rondon",
      category: "Autopeças",
      description: "Sistema especializado para autopeças com catálogo integrado, compatibilidade de peças e gestão de orçamentos.",
      results: ["Catálogo de 50mil+ peças", "Compatibilidade automática", "Orçamentos digitais", "Controle de garantias"],
      image: "🔧"
    },
    {
      title: "Clínica Médica Bem Estar",
      category: "Saúde",
      description: "Sistema de gestão para clínica médica com agendamento, prontuário eletrônico e controle financeiro.",
      results: ["Agendamento online", "Prontuário digital", "Controle de convênios", "Relatórios médicos"],
      image: "🏥"
    }
  ];

  const testimonials = [
    {
      name: "João Silva",
      company: "Supermercado Central",
      text: "A MK Tecnologia transformou nosso negócio. O sistema é intuitivo e o suporte excepcional.",
      rating: 5
    },
    {
      name: "Maria Santos",
      company: "Farmácia Vida & Saúde",
      text: "Excelente solução para farmácia. O controle de medicamentos controlados facilitou muito nosso trabalho.",
      rating: 5
    },
    {
      name: "Carlos Oliveira",
      company: "Loja Fashion Style",
      text: "Sistema perfeito para moda. O controle de grades e relatórios são fantásticos.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-6">
              Nosso <span className="text-brand-gold">Portfólio</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conheça alguns dos projetos que transformaram negócios em Pontes e Lacerda e região
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-gold mb-2">100+</div>
              <div className="text-gray-600">Empresas Atendidas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-gold mb-2">15+</div>
              <div className="text-gray-600">Segmentos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-gold mb-2">5+</div>
              <div className="text-gray-600">Anos de Experiência</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-gold mb-2">24/7</div>
              <div className="text-gray-600">Suporte Disponível</div>
            </div>
          </div>

          {/* Projetos */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-black text-center mb-12">
              Projetos em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card key={index} className="border-brand-gold/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="text-6xl mb-4 text-center">{project.image}</div>
                    <div className="text-sm text-brand-gold font-semibold mb-2">{project.category}</div>
                    <h3 className="text-xl font-bold text-brand-black mb-3">{project.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{project.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-brand-black text-sm">Resultados:</h4>
                      <ul className="space-y-1">
                        {project.results.map((result, resultIndex) => (
                          <li key={resultIndex} className="flex items-start text-xs text-gray-600">
                            <div className="w-1.5 h-1.5 bg-brand-gold rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
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

          {/* Depoimentos */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-black text-center mb-12">
              O que Nossos Clientes Dizem
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-brand-gold/20">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-brand-gold text-xl">⭐</span>
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                    <div>
                      <div className="font-semibold text-brand-black">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.company}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-brand-black to-brand-black-light rounded-lg p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Seu Negócio Pode Ser o Próximo Sucesso
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Entre em contato conosco e vamos criar uma solução personalizada para transformar sua empresa.
            </p>
            <a 
              href="https://wa.me/5565993535079" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Quero Meu Projeto
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;