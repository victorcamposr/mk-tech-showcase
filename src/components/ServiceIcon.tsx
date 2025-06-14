interface ServiceIconProps {
  type: 'automation' | 'inventory' | 'fiscal' | 'financial' | 'support' | 'nfe';
  className?: string;
}

const ServiceIcon = ({ type, className = "w-12 h-12" }: ServiceIconProps) => {
  const icons = {
    automation: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="automation-service" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <rect x="8" y="16" width="48" height="32" rx="6" fill="none" stroke="url(#automation-service)" strokeWidth="3"/>
        <rect x="12" y="20" width="40" height="24" rx="4" fill="url(#automation-service)" opacity="0.1"/>
        <circle cx="20" cy="28" r="3" fill="url(#automation-service)"/>
        <circle cx="32" cy="28" r="3" fill="url(#automation-service)"/>
        <circle cx="44" cy="28" r="3" fill="url(#automation-service)"/>
        <rect x="16" y="36" width="32" height="3" rx="1.5" fill="url(#automation-service)"/>
        <path d="M24 48 L32 52 L40 48" stroke="url(#automation-service)" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="32" cy="8" r="4" fill="url(#automation-service)" opacity="0.6"/>
      </svg>
    ),
    inventory: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="inventory-service" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <rect x="12" y="16" width="40" height="40" rx="6" fill="none" stroke="url(#inventory-service)" strokeWidth="3"/>
        <rect x="16" y="20" width="32" height="8" rx="3" fill="url(#inventory-service)" opacity="0.3"/>
        <rect x="16" y="32" width="32" height="8" rx="3" fill="url(#inventory-service)" opacity="0.3"/>
        <rect x="16" y="44" width="32" height="8" rx="3" fill="url(#inventory-service)" opacity="0.3"/>
        <circle cx="20" cy="24" r="2" fill="url(#inventory-service)"/>
        <circle cx="20" cy="36" r="2" fill="url(#inventory-service)"/>
        <circle cx="20" cy="48" r="2" fill="url(#inventory-service)"/>
        <path d="M8 8 L56 8 L52 16 L12 16 Z" fill="url(#inventory-service)" opacity="0.6"/>
        <path d="M24 14 L40 14" stroke="url(#inventory-service)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    fiscal: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="fiscal-service" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <rect x="16" y="8" width="32" height="48" rx="6" fill="none" stroke="url(#fiscal-service)" strokeWidth="3"/>
        <rect x="20" y="12" width="24" height="6" rx="3" fill="url(#fiscal-service)"/>
        <rect x="20" y="22" width="24" height="2" rx="1" fill="url(#fiscal-service)" opacity="0.6"/>
        <rect x="20" y="26" width="20" height="2" rx="1" fill="url(#fiscal-service)" opacity="0.6"/>
        <rect x="20" y="30" width="16" height="2" rx="1" fill="url(#fiscal-service)" opacity="0.6"/>
        <rect x="20" y="34" width="24" height="2" rx="1" fill="url(#fiscal-service)" opacity="0.6"/>
        <rect x="20" y="42" width="24" height="10" rx="3" fill="url(#fiscal-service)" opacity="0.2"/>
        <path d="M24 46 L28 48 L36 44" stroke="url(#fiscal-service)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="40" cy="48" r="2" fill="url(#fiscal-service)"/>
      </svg>
    ),
    financial: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="financial-service" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="24" fill="none" stroke="url(#financial-service)" strokeWidth="3"/>
        <rect x="28" y="20" width="8" height="24" rx="2" fill="url(#financial-service)" opacity="0.3"/>
        <path d="M28 26 Q32 22 36 26" stroke="url(#financial-service)" strokeWidth="3" fill="none"/>
        <path d="M28 38 Q32 42 36 38" stroke="url(#financial-service)" strokeWidth="3" fill="none"/>
        <circle cx="16" cy="20" r="4" fill="url(#financial-service)" opacity="0.6"/>
        <circle cx="48" cy="20" r="4" fill="url(#financial-service)" opacity="0.6"/>
        <circle cx="16" cy="44" r="4" fill="url(#financial-service)" opacity="0.6"/>
        <circle cx="48" cy="44" r="4" fill="url(#financial-service)" opacity="0.6"/>
        <path d="M20 24 L28 32" stroke="url(#financial-service)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M44 24 L36 32" stroke="url(#financial-service)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    support: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="support-service" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="24" fill="none" stroke="url(#support-service)" strokeWidth="3"/>
        <path d="M32 16 L32 8" stroke="url(#support-service)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M32 56 L32 48" stroke="url(#support-service)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M48 32 L56 32" stroke="url(#support-service)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M8 32 L16 32" stroke="url(#support-service)" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="32" cy="32" r="8" fill="url(#support-service)" opacity="0.3"/>
        <path d="M24 24 L40 40" stroke="url(#support-service)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M40 24 L24 40" stroke="url(#support-service)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="32" cy="32" r="4" fill="url(#support-service)"/>
      </svg>
    ),
    nfe: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="nfe-service" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <rect x="12" y="12" width="40" height="40" rx="6" fill="none" stroke="url(#nfe-service)" strokeWidth="3"/>
        <rect x="16" y="16" width="32" height="6" rx="3" fill="url(#nfe-service)"/>
        <rect x="16" y="26" width="32" height="2" rx="1" fill="url(#nfe-service)" opacity="0.6"/>
        <rect x="16" y="30" width="24" height="2" rx="1" fill="url(#nfe-service)" opacity="0.6"/>
        <rect x="16" y="34" width="28" height="2" rx="1" fill="url(#nfe-service)" opacity="0.6"/>
        <rect x="16" y="38" width="20" height="2" rx="1" fill="url(#nfe-service)" opacity="0.6"/>
        <rect x="16" y="44" width="32" height="4" rx="2" fill="url(#nfe-service)" opacity="0.2"/>
        <circle cx="20" cy="46" r="1" fill="url(#nfe-service)"/>
        <circle cx="24" cy="46" r="1" fill="url(#nfe-service)"/>
        <circle cx="28" cy="46" r="1" fill="url(#nfe-service)"/>
        <path d="M8 8 L16 8 L12 16" fill="url(#nfe-service)" opacity="0.6"/>
        <path d="M56 8 L48 8 L52 16" fill="url(#nfe-service)" opacity="0.6"/>
      </svg>
    )
  };

  return (
    <div className="flex justify-center items-center p-3 bg-gradient-to-br from-brand-gold/10 to-brand-gold/20 rounded-2xl group-hover:from-brand-gold/20 group-hover:to-brand-gold/30 transition-all duration-500 group-hover:scale-110">
      {icons[type]}
    </div>
  );
};

export default ServiceIcon;