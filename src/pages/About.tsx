import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutIcon from "@/components/AboutIcon";
import SimpleIcon from "@/components/SimpleIcon";
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
      iconType: "customize" as const,
      title: "Personalização",
      description: "Soluções adaptadas às necessidades específicas de cada cliente, garantindo máxima eficiência operacional."
    },
    {
      iconType: "support" as const,
      title: "Suporte",
      description: "Suporte técnico especializado e acompanhamento contínuo para garantir o melhor desempenho dos sistemas."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-6">
              Sobre a <span className="text-brand-gold">MK Tecnologia</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Inovação e excelência em automação comercial desde nossa fundação
            </p>
          </div>

          {/* História */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="animate-fade-in">
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
            <div className="bg-gradient-to-br from-brand-gold/10 to-brand-black/5 rounded-2xl p-8 backdrop-blur-sm animate-fade-in hover:shadow-xl transition-all duration-500">
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

          {/* Diferenciais */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-black text-center mb-12">
              Nossos Diferenciais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {differentials.map((differential, index) => (
                <Card key={index} className="border-brand-gold/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <AboutIcon type={differential.iconType} className="mb-4 group-hover:animate-pulse" />
                    <h3 className="text-lg font-semibold text-brand-black mb-3 group-hover:text-brand-gold transition-colors duration-300">{differential.title}</h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {differential.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;