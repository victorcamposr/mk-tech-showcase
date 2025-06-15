import { Monitor, Package, Receipt, FileText, DollarSign, Headphones } from 'lucide-react';

interface ServiceIconProps {
  type: 'automation' | 'inventory' | 'fiscal' | 'financial' | 'support' | 'nfe';
  className?: string;
}

const ServiceIcon = ({ type, className = "w-12 h-12" }: ServiceIconProps) => {
  const iconMap = {
    automation: Monitor,
    inventory: Package,
    fiscal: Receipt,
    financial: DollarSign,
    support: Headphones,
    nfe: FileText
  };

  const IconComponent = iconMap[type];

  return (
    <div className="flex justify-center items-center p-4 bg-gradient-to-br from-brand-gold/10 to-brand-gold/20 rounded-xl group-hover:from-brand-gold/20 group-hover:to-brand-gold/30 transition-all duration-500 mx-auto">
      <IconComponent 
        className={`${className} text-brand-gold group-hover:text-brand-gold-dark transition-all duration-300 group-hover:scale-110`}
        strokeWidth={1.5}
      />
    </div>
  );
};

export default ServiceIcon;