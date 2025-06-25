
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CheckBullet from "@/components/CheckBullet";
import InteractiveDashboard from "@/components/InteractiveDashboard";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Award } from "lucide-react";
import { specificSolutions, SOLUTION_IMAGES } from "@/data/solutions";
import { getWhatsAppMessage } from "@/utils/whatsapp";
import SolutionHero from "@/components/solutions/SolutionHero";
import SolutionBenefits from "@/components/solutions/SolutionBenefits";
import SolutionCard from "@/components/solutions/SolutionCard";
import SolutionCTA from "@/components/solutions/SolutionCTA";
import CardMachineOperators from "@/components/solutions/CardMachineOperators";

const Solutions = () => {
  const location = useLocation();
  
  // Detectar qual solução específica está sendo visualizada
  const currentPath = location.pathname;
  const isSpecificSolution = currentPath.includes('/solucoes/');
  const solutionKey = currentPath.split('/solucoes/')[1] as keyof typeof specificSolutions;
  const currentSolution = specificSolutions[solutionKey];

  // Se for uma solução específica, renderizar conteúdo personalizado
  if (isSpecificSolution && currentSolution) {
    const IconComponent = currentSolution.icon;
    
    return (
      <div className="min-h-screen bg-background">
        <SEO 
          title={currentSolution.title}
          description={currentSolution.description}
          keywords={`${currentSolution.title}, automação comercial, Pontes e Lacerda`}
        />
        <Header />
        
        <main className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <ScrollReveal animation="fade-in">
              <div className="text-center mb-16">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-brand-gold to-brand-gold-light p-4 rounded-full">
                    <IconComponent className="w-12 h-12 text-brand-black" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-6">
                  {currentSolution.title}
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  {currentSolution.description}
                </p>
                
                {/* Imagem demonstrativa */}
                <div className="max-w-4xl mx-auto mb-8 relative">
                  <img 
                    src={SOLUTION_IMAGES.cards[solutionKey] || SOLUTION_IMAGES.cards['pdv-frente-caixa']} 
                    alt={`Demonstração ${currentSolution.title}`}
                    className="w-full h-64 md:h-80 object-cover bg-gray-50 rounded-xl shadow-2xl"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Seção especial para operadoras de maquininhas */}
            {solutionKey === 'maquininhas-cartao' && (
              <ScrollReveal animation="fade-up" delay={100}>
                <div className="mb-16">
                  <CardMachineOperators />
                </div>
              </ScrollReveal>
            )}

            {/* Recursos */}
            <ScrollReveal animation="fade-up" delay={150}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <Card className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-brand-black flex items-center gap-2 group-hover:text-brand-gold transition-colors duration-300">
                      <IconComponent className="w-6 h-6 text-brand-gold group-hover:scale-110 transition-transform duration-300" />
                      Principais Recursos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {currentSolution.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          <CheckBullet />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-brand-black flex items-center gap-2 group-hover:text-brand-gold transition-colors duration-300">
                      <Award className="w-6 h-6 text-brand-gold group-hover:scale-110 transition-transform duration-300" />
                      Benefícios Garantidos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {currentSolution.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          <CheckBullet />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <h4 className="font-semibold text-brand-black mb-2 group-hover:text-brand-gold transition-colors duration-300">Ideal para:</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentSolution.industries.map((industry, index) => (
                          <span key={index} className="bg-brand-gold/10 text-brand-black text-sm px-3 py-1 rounded-full group-hover:bg-brand-gold/20 transition-colors duration-300">
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>

            {/* CTA */}
            <SolutionCTA 
              title={`Interessado em ${currentSolution.title}?`}
              description="Entre em contato conosco e receba uma demonstração gratuita personalizada para seu negócio."
              whatsappUrl={getWhatsAppMessage(currentSolution.title, solutionKey)}
              buttonText="Solicitar Demonstração"
            />
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Soluções em Automação Comercial"
        description="Conheça nossas soluções completas: PDV, gestão de estoque inteligente, emissão fiscal, gestão financeira e sistema para revendas de gás e água. Tecnologia de ponta para todos os segmentos empresariais em Pontes e Lacerda, MT."
        keywords="soluções automação comercial, PDV completo, gestão estoque inteligente, emissão fiscal, gestão financeira, sistema revendas gás água, tecnologia empresarial, Pontes e Lacerda"
      />
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Início", url: "/" },
            { name: "Soluções", url: "/solucoes" }
          ]
        }}
      />
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SolutionHero 
            title="Nossas"
            highlight="Soluções"
            subtitle="Tecnologia de ponta para transformar e automatizar seu negócio"
          />

          <SolutionBenefits />

          {/* Dashboard Interativo */}
          <ScrollReveal animation="fade-up" delay={150}>
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
          </ScrollReveal>

          {/* Soluções do Dropdown */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-brand-black text-center mb-12">
                Todas as Nossas <span className="text-brand-gold">Soluções</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(specificSolutions).map(([key, solution]) => (
                  <SolutionCard 
                    key={key} 
                    solutionKey={key} 
                    solution={solution} 
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>

          <SolutionCTA />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Solutions;
