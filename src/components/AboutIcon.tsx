interface AboutIconProps {
  type: 'speed' | 'customize' | 'support' | 'history' | 'values';
  className?: string;
}

const AboutIcon = ({ type, className = "w-8 h-8" }: AboutIconProps) => {
  const icons = {
    speed: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="speed-about" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="24" fill="none" stroke="url(#speed-about)" strokeWidth="3"/>
        <path d="M16 32 L32 16 L48 32" stroke="url(#speed-about)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="32" cy="32" r="3" fill="url(#speed-about)"/>
        <path d="M32 32 L42 42" stroke="url(#speed-about)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    customize: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="customize-about" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="20" r="8" fill="none" stroke="url(#customize-about)" strokeWidth="3"/>
        <circle cx="20" cy="44" r="8" fill="none" stroke="url(#customize-about)" strokeWidth="3"/>
        <circle cx="44" cy="44" r="8" fill="none" stroke="url(#customize-about)" strokeWidth="3"/>
        <path d="M32 28 L20 36" stroke="url(#customize-about)" strokeWidth="2"/>
        <path d="M32 28 L44 36" stroke="url(#customize-about)" strokeWidth="2"/>
      </svg>
    ),
    support: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="support-about" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <path d="M32 8 L20 20 L20 32 L32 44 L44 32 L44 20 Z" fill="none" stroke="url(#support-about)" strokeWidth="3"/>
        <circle cx="32" cy="26" r="6" fill="url(#support-about)" opacity="0.3"/>
        <path d="M32 32 L32 38" stroke="url(#support-about)" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    history: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="history-about" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <rect x="16" y="12" width="32" height="40" rx="4" fill="none" stroke="url(#history-about)" strokeWidth="3"/>
        <rect x="20" y="8" width="24" height="8" rx="2" fill="url(#history-about)" opacity="0.3"/>
        <path d="M24 20 L40 20" stroke="url(#history-about)" strokeWidth="2"/>
        <path d="M24 28 L40 28" stroke="url(#history-about)" strokeWidth="2"/>
        <path d="M24 36 L32 36" stroke="url(#history-about)" strokeWidth="2"/>
      </svg>
    ),
    values: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="values-about" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <path d="M32 8 L40 24 L56 24 L44 36 L48 52 L32 44 L16 52 L20 36 L8 24 L24 24 Z" fill="url(#values-about)" opacity="0.3"/>
        <path d="M32 8 L40 24 L56 24 L44 36 L48 52 L32 44 L16 52 L20 36 L8 24 L24 24 Z" fill="none" stroke="url(#values-about)" strokeWidth="2"/>
        <circle cx="32" cy="32" r="6" fill="url(#values-about)"/>
      </svg>
    )
  };

  return (
    <div className="flex justify-center items-center p-2 bg-gradient-to-br from-brand-gold/10 to-brand-gold/20 rounded-lg group-hover:from-brand-gold/20 group-hover:to-brand-gold/30 transition-all duration-500">
      {icons[type]}
    </div>
  );
};

export default AboutIcon;