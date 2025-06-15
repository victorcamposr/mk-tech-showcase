interface ServiceIconProps {
  type: 'automation' | 'inventory' | 'fiscal' | 'financial' | 'support' | 'nfe';
  className?: string;
}

const ServiceIcon = ({ type, className = "w-12 h-12" }: ServiceIconProps) => {
  const imageMap = {
    automation: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    inventory: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    fiscal: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    financial: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    support: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    nfe: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
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
    <div className="flex justify-center items-center p-3 bg-gradient-to-br from-brand-gold/10 to-brand-gold/20 rounded-xl group-hover:from-brand-gold/20 group-hover:to-brand-gold/30 transition-all duration-500 overflow-hidden">
      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
        <img 
          src={imageMap[type]} 
          alt={altTexts[type]}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/20 to-brand-gold/40 group-hover:from-brand-gold/30 group-hover:to-brand-gold/50 transition-all duration-500"></div>
      </div>
    </div>
  );
};

export default ServiceIcon;