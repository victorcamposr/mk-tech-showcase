
import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface CardMachineOperator {
  name: string;
  icon: string;
  alt: string;
}

interface CardMachineOperatorsProps {
  variant?: 'compact' | 'full';
  className?: string;
}

const CARD_OPERATORS: CardMachineOperator[] = [
  {
    name: "Stone",
    icon: "/lovable-uploads/a8ecfad8-8626-44ee-a7eb-afcfd88ca462.png",
    alt: "Stone"
  },
  {
    name: "Cielo",
    icon: "/lovable-uploads/76fb354f-89fa-4163-9772-a8f1fdb94668.png",
    alt: "Cielo"
  },
  {
    name: "PagBank",
    icon: "/lovable-uploads/2a8e6032-1804-4f62-aa10-ae0ad095cab8.png",
    alt: "PagBank"
  },
  {
    name: "Moderninha Rede/Itaú",
    icon: "/lovable-uploads/a8ecfad8-8626-44ee-a7eb-afcfd88ca462.png", // Temporário - usar ícone da Stone
    alt: "Moderninha Rede/Itaú"
  },
  {
    name: "Azulzinha (Caixa)",
    icon: "/lovable-uploads/76fb354f-89fa-4163-9772-a8f1fdb94668.png", // Temporário - usar ícone da Cielo
    alt: "Azulzinha (Caixa)"
  },
  {
    name: "Sicredi",
    icon: "/lovable-uploads/a8ecfad8-8626-44ee-a7eb-afcfd88ca462.png", // Temporário - usar ícone da Stone
    alt: "Sicredi"
  },
  {
    name: "Bin",
    icon: "/lovable-uploads/76fb354f-89fa-4163-9772-a8f1fdb94668.png", // Temporário - usar ícone da Cielo
    alt: "Bin"
  },
  {
    name: "GetNet",
    icon: "/lovable-uploads/a8ecfad8-8626-44ee-a7eb-afcfd88ca462.png", // Temporário - usar ícone da Stone
    alt: "GetNet"
  }
];

const CardMachineOperators = ({ variant = 'compact', className = '' }: CardMachineOperatorsProps) => {
  if (variant === 'full') {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {CARD_OPERATORS.map((operator, index) => (
          <div key={index} className="group/tooltip relative">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300">
              <img 
                src={operator.icon} 
                alt={operator.alt}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10 max-w-32 text-center">
              {operator.name}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Compact version - show first 3 + counter
  const visibleOperators = CARD_OPERATORS.slice(0, 3);
  const remainingOperators = CARD_OPERATORS.slice(3);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {visibleOperators.map((operator, index) => (
        <div key={index} className="group/tooltip relative">
          <div className="w-8 h-8 rounded flex items-center justify-center hover:scale-110 transition-all duration-300">
            <img 
              src={operator.icon} 
              alt={operator.alt}
              className="w-6 h-6 object-contain"
            />
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-1.5 py-0.5 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10 max-w-24 text-center">
            {operator.name}
          </div>
        </div>
      ))}
      
      {remainingOperators.length > 0 && (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="w-8 h-8 rounded bg-brand-gold/80 flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer relative">
              <span className="text-xs font-medium text-brand-black">+{remainingOperators.length}</span>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-60 p-2" side="top" align="center">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-brand-black">Outras integrações:</h4>
              <div className="grid grid-cols-1 gap-1">
                {remainingOperators.map((operator, index) => (
                  <div key={index} className="flex items-center gap-2 p-1.5 rounded bg-gray-50">
                    <img 
                      src={operator.icon} 
                      alt={operator.alt}
                      className="w-5 h-5 object-contain"
                    />
                    <span className="text-xs text-gray-700">{operator.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
};

export default CardMachineOperators;
