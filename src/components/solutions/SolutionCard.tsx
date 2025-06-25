
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServiceColors } from "@/components/ColoredServiceIcon";
import CheckBullet from "@/components/CheckBullet";
import { SOLUTION_IMAGES } from "@/data/solutions";
import CardMachineOperators from "./CardMachineOperators";

interface SolutionCardProps {
  solutionKey: string;
  solution: {
    title: string;
    icon: React.ComponentType<any>;
    description: string;
    features: string[];
    industries: string[];
  };
}

const SolutionCard = ({ solutionKey, solution }: SolutionCardProps) => {
  const IconComponent = solution.icon;
  const colors = getServiceColors('automation');
  
  // Função para buscar imagem do card usando a constante SOLUTION_IMAGES
  const getCardImage = (solutionKey: string) => {
    return SOLUTION_IMAGES.cards[solutionKey as keyof typeof SOLUTION_IMAGES.cards] || SOLUTION_IMAGES.cards['pdv-frente-caixa'];
  };
  
  return (
    <Card className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm overflow-hidden cursor-pointer">
      <a href={`/solucoes/${solutionKey}`} className="block">
        {/* Imagem demonstrativa */}
        <div className="h-48 overflow-hidden relative">
          <img 
            src={getCardImage(solutionKey)} 
            alt={`Demonstração ${solution.title}`}
            className="w-full h-full object-cover bg-gray-50 group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 right-4 bg-gradient-to-r from-brand-gold to-brand-gold-light p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
            <IconComponent className="w-5 h-5 text-brand-black" />
          </div>
          
          {/* Seção especial para maquininhas de cartão */}
          {solutionKey === 'maquininhas-cartao' && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-4">
              <CardMachineOperators isCompact={true} maxVisible={3} />
            </div>
          )}
        </div>
        
        <CardHeader className="pb-4">
          <div className="mb-3">
            <CardTitle className="text-lg font-bold text-brand-black group-hover:text-brand-gold transition-colors duration-300">
              {solution.title}
            </CardTitle>
          </div>
          <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 text-sm"
             style={{
               display: '-webkit-box',
               WebkitLineClamp: 3,
               WebkitBoxOrient: 'vertical',
               overflow: 'hidden'
             }}>
            {solution.description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h4 className="font-semibold text-brand-black mb-2 text-sm">Principais Recursos:</h4>
            <ul className="space-y-1">
              {solution.features.slice(0, 4).map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                  <CheckBullet />
                  <span className="group-hover:text-gray-700 transition-colors duration-300"
                        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {feature}
                  </span>
                </li>
              ))}
              {solution.features.length > 4 && (
                <li className="text-xs text-brand-gold font-medium ml-6">
                  +{solution.features.length - 4} recursos adicionais
                </li>
              )}
            </ul>
          </div>
          <div className="border-t pt-4">
            <div className="flex flex-wrap gap-1">
              {solution.industries.slice(0, 3).map((industry, industryIndex) => (
                <span key={industryIndex} className="bg-brand-gold/10 text-brand-black text-xs px-2 py-1 rounded group-hover:bg-brand-gold/20 transition-colors duration-300">
                  {industry}
                </span>
              ))}
              {solution.industries.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{solution.industries.length - 3}
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-brand-gold font-medium group-hover:text-brand-gold-dark transition-colors duration-300">
              Clique para ver detalhes
            </span>
            <div className="w-6 h-6 rounded-full bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold group-hover:scale-110 transition-all duration-300">
              <svg className="w-3 h-3 text-brand-gold group-hover:text-brand-black transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </CardContent>
      </a>
    </Card>
  );
};

export default SolutionCard;
