interface ModernIconProps {
  type: 'automation' | 'inventory' | 'fiscal' | 'financial';
  className?: string;
}

const ModernIcon = ({ type, className = "" }: ModernIconProps) => {
  const icons = {
    automation: (
      <svg viewBox="0 0 64 64" className={`w-18 h-18 ${className}`}>
        <defs>
          <linearGradient id="automation-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <rect x="8" y="12" width="48" height="32" rx="4" fill="url(#automation-gradient)" opacity="0.2"/>
        <rect x="12" y="16" width="40" height="24" rx="2" fill="none" stroke="url(#automation-gradient)" strokeWidth="2"/>
        <circle cx="20" cy="24" r="2" fill="url(#automation-gradient)"/>
        <circle cx="32" cy="24" r="2" fill="url(#automation-gradient)"/>
        <circle cx="44" cy="24" r="2" fill="url(#automation-gradient)"/>
        <rect x="16" y="30" width="32" height="2" rx="1" fill="url(#automation-gradient)"/>
        <rect x="16" y="34" width="24" height="2" rx="1" fill="url(#automation-gradient)"/>
        <path d="M24 48 L32 52 L40 48" stroke="url(#automation-gradient)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    inventory: (
      <svg viewBox="0 0 64 64" className={`w-18 h-18 ${className}`}>
        <defs>
          <linearGradient id="inventory-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <rect x="12" y="16" width="40" height="40" rx="4" fill="none" stroke="url(#inventory-gradient)" strokeWidth="2"/>
        <rect x="16" y="20" width="32" height="8" rx="2" fill="url(#inventory-gradient)" opacity="0.3"/>
        <rect x="16" y="32" width="32" height="8" rx="2" fill="url(#inventory-gradient)" opacity="0.3"/>
        <rect x="16" y="44" width="32" height="8" rx="2" fill="url(#inventory-gradient)" opacity="0.3"/>
        <circle cx="20" cy="24" r="1.5" fill="url(#inventory-gradient)"/>
        <circle cx="20" cy="36" r="1.5" fill="url(#inventory-gradient)"/>
        <circle cx="20" cy="48" r="1.5" fill="url(#inventory-gradient)"/>
        <path d="M8 8 L56 8 L52 16 L12 16 Z" fill="url(#inventory-gradient)" opacity="0.6"/>
      </svg>
    ),
    fiscal: (
      <svg viewBox="0 0 64 64" className={`w-18 h-18 ${className}`}>
        <defs>
          <linearGradient id="fiscal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <rect x="16" y="8" width="32" height="48" rx="4" fill="none" stroke="url(#fiscal-gradient)" strokeWidth="2"/>
        <rect x="20" y="12" width="24" height="4" rx="2" fill="url(#fiscal-gradient)"/>
        <rect x="20" y="20" width="24" height="2" rx="1" fill="url(#fiscal-gradient)" opacity="0.6"/>
        <rect x="20" y="24" width="20" height="2" rx="1" fill="url(#fiscal-gradient)" opacity="0.6"/>
        <rect x="20" y="28" width="16" height="2" rx="1" fill="url(#fiscal-gradient)" opacity="0.6"/>
        <rect x="20" y="32" width="24" height="2" rx="1" fill="url(#fiscal-gradient)" opacity="0.6"/>
        <rect x="20" y="40" width="24" height="8" rx="2" fill="url(#fiscal-gradient)" opacity="0.2"/>
        <path d="M24 44 L28 46 L36 42" stroke="url(#fiscal-gradient)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    financial: (
      <svg viewBox="0 0 64 64" className={`w-18 h-18 ${className}`}>
        <defs>
          <linearGradient id="financial-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="24" fill="none" stroke="url(#financial-gradient)" strokeWidth="2"/>
        <rect x="28" y="20" width="8" height="24" rx="1" fill="url(#financial-gradient)" opacity="0.3"/>
        <path d="M28 26 Q32 22 36 26" stroke="url(#financial-gradient)" strokeWidth="2" fill="none"/>
        <path d="M28 38 Q32 42 36 38" stroke="url(#financial-gradient)" strokeWidth="2" fill="none"/>
        <circle cx="16" cy="20" r="3" fill="url(#financial-gradient)" opacity="0.6"/>
        <circle cx="48" cy="20" r="3" fill="url(#financial-gradient)" opacity="0.6"/>
        <circle cx="16" cy="44" r="3" fill="url(#financial-gradient)" opacity="0.6"/>
        <circle cx="48" cy="44" r="3" fill="url(#financial-gradient)" opacity="0.6"/>
      </svg>
    )
  };

  return (
    <div className="flex justify-center items-center p-4 bg-gradient-to-br from-brand-gold/10 to-brand-gold/20 rounded-2xl group-hover:from-brand-gold/20 group-hover:to-brand-gold/30 transition-all duration-500">
      {icons[type]}
    </div>
  );
};

export default ModernIcon;