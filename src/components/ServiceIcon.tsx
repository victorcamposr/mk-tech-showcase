interface ServiceIconProps {
  type: 'automation' | 'inventory' | 'fiscal' | 'financial' | 'support' | 'nfe';
  className?: string;
}

const ServiceIcon = ({ type, className = "w-12 h-12" }: ServiceIconProps) => {
  const imageMap = {
    automation: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Dashboard analytics
    inventory: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Warehouse boxes
    fiscal: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Receipt printer
    financial: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Financial charts
    support: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Customer support
    nfe: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" // Digital documents
  };

  const altTexts = {
    automation: "Sistema de automação comercial",
    inventory: "Controle de estoque",
    fiscal: "Emissão de cupom fiscal",
    financial: "Gestão financeira",
    support: "Suporte técnico",
    nfe: "Nota fiscal eletrônica"
  };

  return (
    <div className="flex justify-center items-center p-3 bg-gradient-to-br from-brand-gold/5 to-brand-gold/10 rounded-xl group-hover:from-brand-gold/10 group-hover:to-brand-gold/15 transition-all duration-500 overflow-hidden">
      <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-lg">
        <img 
          src={imageMap[type]} 
          alt={altTexts[type]}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
    </div>
  );
};

export default ServiceIcon;