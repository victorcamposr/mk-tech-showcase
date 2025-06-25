
import { CARD_MACHINE_OPERATORS } from "@/data/solutions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useState } from "react";

interface CardMachineOperatorsProps {
  isCompact?: boolean;
  maxVisible?: number;
}

const CardMachineOperators = ({ isCompact = false, maxVisible }: CardMachineOperatorsProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const operatorsToShow = maxVisible 
    ? CARD_MACHINE_OPERATORS.slice(0, maxVisible)
    : CARD_MACHINE_OPERATORS;
  
  const remainingOperators = maxVisible 
    ? CARD_MACHINE_OPERATORS.slice(maxVisible)
    : [];
  
  const remainingCount = remainingOperators.length;

  if (isCompact) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-sm font-semibold text-white mb-2">
            Integrado com as principais operadoras:
          </h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {operatorsToShow.map((operator, index) => (
            <ScrollReveal key={operator.id} animation="fade-up" delay={index * 50}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-brand-gold/20 bg-gradient-to-br from-white/90 to-gray-50/80 backdrop-blur-sm">
                <CardContent className="p-3 text-center">
                  <div className="mb-2 flex justify-center">
                    <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src={operator.icon} 
                        alt={operator.name}
                        className="w-6 h-6 object-contain" 
                      />
                    </div>
                  </div>
                  <div className="text-xs font-medium text-brand-black group-hover:text-brand-gold transition-colors duration-300">
                    {operator.name}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
          
          {remainingCount > 0 && (
            <div className="relative">
              <Card 
                className="border-brand-gold/20 bg-gradient-to-br from-brand-gold/5 to-brand-gold/10 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <CardContent className="p-3 text-center flex items-center justify-center">
                  <div className="text-xs font-medium text-brand-gold">
                    +{remainingCount} mais
                  </div>
                </CardContent>
              </Card>
              
              {/* Tooltip com as outras operadoras */}
              {showTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 bg-white rounded-lg shadow-xl border border-brand-gold/20 p-3 min-w-48">
                  <div className="text-xs font-semibold text-brand-black mb-2">Outras integrações:</div>
                  <div className="space-y-1">
                    {remainingOperators.map((operator) => (
                      <div key={operator.id} className="flex items-center gap-2 text-xs text-gray-600">
                        <img 
                          src={operator.icon} 
                          alt={operator.name}
                          className="w-4 h-4 object-contain" 
                        />
                        <span>{operator.name}</span>
                      </div>
                    ))}
                  </div>
                  {/* Seta do tooltip */}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-brand-gold/20 rotate-45"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-black mb-4">
          Integrado com as <span className="text-brand-gold">Principais Operadoras</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Oferecemos integração completa com as melhores operadoras do mercado, 
          garantindo flexibilidade e as melhores condições para seu negócio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {CARD_MACHINE_OPERATORS.map((operator, index) => (
          <ScrollReveal key={operator.id} animation="fade-up" delay={index * 100}>
            <Card className="group hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 border-brand-gold/20 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  {/* Logo da operadora - sem borda branca */}
                  <div className="flex justify-center">
                    <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <img 
                        src={operator.icon} 
                        alt={operator.name}
                        className="w-10 h-10 object-contain" 
                      />
                    </div>
                  </div>

                  {/* Nome da operadora */}
                  <div>
                    <h3 className="font-bold text-brand-black group-hover:text-brand-gold transition-colors duration-300 text-lg mb-2">
                      {operator.name}
                    </h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {operator.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {operator.features.map((feature, featureIndex) => (
                      <Badge 
                        key={featureIndex}
                        variant="secondary" 
                        className="text-xs bg-brand-gold/10 text-brand-black hover:bg-brand-gold/20 transition-colors duration-300 mr-1 mb-1"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Status indicator */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">Integração Ativa</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      {/* Call to action */}
      <div className="text-center pt-8">
        <div className="bg-gradient-to-r from-brand-gold/10 to-brand-gold/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-brand-black mb-2">
            Não encontrou sua operadora?
          </h3>
          <p className="text-gray-600 mb-4">
            Entre em contato conosco! Trabalhamos para integrar com todas as principais operadoras do mercado.
          </p>
          <Badge className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black">
            Consulte outras opções
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default CardMachineOperators;
