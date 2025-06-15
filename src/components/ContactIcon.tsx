import { FileText, Archive, Headphones, Settings, Monitor } from 'lucide-react';

interface ContactIconProps {
  type: 'whatsapp' | 'email' | 'location' | 'instagram' | 'phone' | 'clock' | 'map';
  className?: string;
}

const ContactIcon = ({ type, className = "w-8 h-8" }: ContactIconProps) => {
  // For WhatsApp and Instagram, we keep custom SVGs since they're brand-specific
  const customIcons = {
    whatsapp: (
      <svg viewBox="0 0 24 24" className={`${className} text-[#25D366]`}>
        <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" className={`${className} text-[#E4405F]`}>
        <defs>
          <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E4405F" />
            <stop offset="50%" stopColor="#F77737" />
            <stop offset="100%" stopColor="#FCAF45" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="url(#instagram-gradient)" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" fill="none" stroke="url(#instagram-gradient)" strokeWidth="2"/>
        <path d="M16.5 7.5L16.51 7.5" stroke="url(#instagram-gradient)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  };

  const lucideIconMap = {
    email: FileText,
    location: Archive,
    phone: Headphones,
    clock: Settings,
    map: Monitor
  };

  const renderIcon = () => {
    if (type === 'whatsapp' || type === 'instagram') {
      return customIcons[type];
    }
    
    const LucideIcon = lucideIconMap[type as keyof typeof lucideIconMap];
    return (
      <LucideIcon 
        className={`${className} text-brand-gold group-hover:text-brand-gold-dark transition-colors duration-300`}
        strokeWidth={1.5}
      />
    );
  };

  return (
    <div className="flex justify-center items-center p-3 bg-gradient-to-br from-brand-gold/10 to-brand-gold/20 rounded-xl group-hover:from-brand-gold/20 group-hover:to-brand-gold/30 transition-all duration-500">
      <div className="group-hover:scale-110 transition-transform duration-300">
        {renderIcon()}
      </div>
    </div>
  );
};

export default ContactIcon;