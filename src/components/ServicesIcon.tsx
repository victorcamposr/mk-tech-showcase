interface ServicesIconProps {
  type: 'analysis' | 'implementation' | 'training' | 'maintenance';
  className?: string;
}

const ServicesIcon = ({ type, className = "w-12 h-12" }: ServicesIconProps) => {
  const icons = {
    analysis: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="analysis-services" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="20" fill="none" stroke="url(#analysis-services)" strokeWidth="3"/>
        <circle cx="32" cy="32" r="12" fill="none" stroke="url(#analysis-services)" strokeWidth="2"/>
        <circle cx="32" cy="32" r="4" fill="url(#analysis-services)"/>
        <path d="M48 16 L56 8" stroke="url(#analysis-services)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="54" cy="10" r="2" fill="url(#analysis-services)"/>
      </svg>
    ),
    implementation: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="implementation-services" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <rect x="8" y="20" width="48" height="32" rx="4" fill="none" stroke="url(#implementation-services)" strokeWidth="3"/>
        <rect x="12" y="24" width="40" height="24" rx="2" fill="url(#implementation-services)" opacity="0.2"/>
        <path d="M20 32 L28 40 L44 24" stroke="url(#implementation-services)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    training: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="training-services" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="20" r="8" fill="none" stroke="url(#training-services)" strokeWidth="3"/>
        <path d="M16 40 Q32 32 48 40" stroke="url(#training-services)" strokeWidth="3" fill="none"/>
        <rect x="28" y="48" width="8" height="8" rx="2" fill="url(#training-services)" opacity="0.3"/>
        <circle cx="32" cy="20" r="3" fill="url(#training-services)"/>
      </svg>
    ),
    maintenance: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="maintenance-services" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="16" fill="none" stroke="url(#maintenance-services)" strokeWidth="3"/>
        <path d="M24 24 L40 40" stroke="url(#maintenance-services)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M40 24 L24 40" stroke="url(#maintenance-services)" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="32" cy="32" r="4" fill="url(#maintenance-services)"/>
      </svg>
    )
  };

  return (
    <div className="flex justify-center items-center p-3 bg-gradient-to-br from-brand-gold to-brand-gold-dark rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
      {icons[type]}
    </div>
  );
};

export default ServicesIcon;