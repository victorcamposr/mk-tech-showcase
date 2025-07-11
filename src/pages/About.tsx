import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ColoredServiceIcon, { getServiceColors } from "@/components/ColoredServiceIcon";
import SimpleIcon from "@/components/SimpleIcon";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const About = () => {
  const differentials = [
    {
      iconType: "speed" as const,
      title: "Agilidade",
      description: "Implementação rápida e eficiente de nossas soluções, minimizando o tempo de adaptação do seu negócio."
    },
    {
      iconType: "customization" as const,
      title: "Personalização",
      description: "Soluções adaptadas às necessidades específicas de cada cliente, garantindo máxima eficiência operacional."
    },
    {
      iconType: "headset" as const,
      title: "Suporte",
      description: "Suporte técnico especializado e acompanhamento contínuo para garantir o melhor desempenho dos sistemas."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Sobre a MK Tecnologia"
        description="Conheça a história da MK Tecnologia, empresa especializada em automação comercial em Pontes e Lacerda, MT. Nossos valores, missão e diferenciais que fazem de nós referência em tecnologia empresarial."
        keywords="sobre MK Tecnologia, empresa automação comercial, história empresa, valores, missão, Pontes e Lacerda, tecnologia empresarial MT"
      />
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Início", url: "/" },
            { name: "Sobre", url: "/sobre" }
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
              Sobre a <span className="text-brand-gold">MK Tecnologia</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Inovação e excelência em automação comercial desde nossa fundação
            </p>
          </div>
        </ScrollReveal>

          {/* História */}
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div>
              <h2 className="text-3xl font-bold text-brand-black mb-6">Nossa História</h2>
              <p className="text-gray-600 mb-4">
                A MK Tecnologia nasceu da visão de transformar a gestão empresarial através 
                de soluções tecnológicas inovadoras e acessíveis. Nossa jornada começou com 
                o objetivo de simplificar os processos comerciais das empresas.
              </p>
              <p className="text-gray-600 mb-4">
                Hoje, somos referência em Pontes e Lacerda/MT e região, oferecendo automação 
                comercial completa que inclui controle de estoque, emissão de cupons fiscais, 
                notas fiscais de produtos e serviços.
              </p>
              <p className="text-gray-600">
                Nossa missão é capacitar empresas a alcançarem seu máximo potencial através 
                da tecnologia, proporcionando eficiência, controle e crescimento sustentável.
              </p>
            </div>
            <div className="bg-gradient-to-br from-brand-gold/10 to-brand-black/5 rounded-2xl p-8 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
              <h3 className="text-2xl font-bold text-brand-black mb-4">Nossos Valores</h3>
              <ul className="space-y-3">
                <li className="flex items-start group">
                  <div className="w-3 h-3 bg-brand-gold rounded-full mt-2 mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="text-gray-600">Inovação constante em soluções tecnológicas</span>
                </li>
                <li className="flex items-start group">
                  <div className="w-3 h-3 bg-brand-gold rounded-full mt-2 mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="text-gray-600">Compromisso com a excelência no atendimento</span>
                </li>
                <li className="flex items-start group">
                  <div className="w-3 h-3 bg-brand-gold rounded-full mt-2 mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="text-gray-600">Transparência em todos os processos</span>
                </li>
                <li className="flex items-start group">
                  <div className="w-3 h-3 bg-brand-gold rounded-full mt-2 mr-3 group-hover:scale-125 transition-transform"></div>
                  <span className="text-gray-600">Parceria duradoura com nossos clientes</span>
                </li>
              </ul>
            </div>
            </div>
          </ScrollReveal>

          {/* Diferenciais */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-black text-center mb-12">
              Nossos Diferenciais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {differentials.map((differential, index) => {
                const colors = getServiceColors(differential.iconType);
                return (
                 <Card key={index} className={`${colors.border} hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm`}>
                   <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <ColoredServiceIcon type={differential.iconType} className="group-hover:animate-pulse" />
                      </div>
                     <h3 className={`text-lg font-semibold text-brand-black mb-3 ${colors.hoverText} transition-colors duration-300`}>{differential.title}</h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {differential.description}
                    </p>
                  </CardContent>
                </Card>
                );
              })}
            </div>
            </div>
          </ScrollReveal>

          {/* Processo de Trabalho */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-brand-black text-center mb-12">
                Como Trabalhamos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-gold to-brand-gold-dark rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-2xl font-bold text-brand-black">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-brand-black mb-2 group-hover:text-brand-gold transition-colors">Análise</h3>
                  <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
                    Entendemos suas necessidades e processos atuais para propor a melhor solução.
                  </p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-gold to-brand-gold-dark rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-2xl font-bold text-brand-black">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-brand-black mb-2 group-hover:text-brand-gold transition-colors">Personalização</h3>
                  <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
                    Adaptamos nossos sistemas às especificidades do seu negócio.
                  </p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-gold to-brand-gold-dark rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-2xl font-bold text-brand-black">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-brand-black mb-2 group-hover:text-brand-gold transition-colors">Implementação</h3>
                  <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
                    Instalação e configuração completa com treinamento da equipe.
                  </p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-gold to-brand-gold-dark rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-2xl font-bold text-brand-black">4</span>
                  </div>
                  <h3 className="text-lg font-semibold text-brand-black mb-2 group-hover:text-brand-gold transition-colors">Suporte</h3>
                  <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
                    Acompanhamento contínuo e suporte técnico especializado.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="text-center bg-gradient-to-r from-brand-black to-brand-black-light rounded-2xl p-12 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para Transformar seu Negócio?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Entre em contato conosco e descubra como a MK Tecnologia pode 
              revolucionar a gestão da sua empresa.
            </p>
            <Button asChild className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold group">
              <a href="https://wa.me/5565993535079" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <SimpleIcon type="whatsapp-black" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Fale Conosco
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

export default About;