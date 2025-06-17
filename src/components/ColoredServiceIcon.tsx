interface ColoredServiceIconProps {
  type: 'automation' | 'inventory' | 'fiscal' | 'financial' | 'support' | 'nfe';
  className?: string;
}

export const getServiceColors = (type: 'automation' | 'inventory' | 'fiscal' | 'financial' | 'support' | 'nfe') => {
  const colorMap = {
    automation: {
      border: 'border-blue-500/20 hover:border-blue-500/40',
      hoverText: 'group-hover:text-blue-500',
      bullet: 'bg-blue-500'
    },
    inventory: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      hoverText: 'group-hover:text-emerald-500',
      bullet: 'bg-emerald-500'
    },
    fiscal: {
      border: 'border-violet-500/20 hover:border-violet-500/40',
      hoverText: 'group-hover:text-violet-500',
      bullet: 'bg-violet-500'
    },
    financial: {
      border: 'border-orange-500/20 hover:border-orange-500/40',
      hoverText: 'group-hover:text-orange-500',
      bullet: 'bg-orange-500'
    },
    support: {
      border: 'border-red-500/20 hover:border-red-500/40',
      hoverText: 'group-hover:text-red-500',
      bullet: 'bg-red-500'
    },
    nfe: {
      border: 'border-teal-500/20 hover:border-teal-500/40',
      hoverText: 'group-hover:text-teal-500',
      bullet: 'bg-teal-500'
    }
  };
  return colorMap[type];
};

const ColoredServiceIcon = ({ type, className = "" }: ColoredServiceIconProps) => {
  const icons = {
    automation: (
      <svg viewBox="0 0 64 64" className={`w-16 h-16 ${className}`}>
        <defs>
          <linearGradient id="automation-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
        <rect x="8" y="12" width="48" height="32" rx="4" fill="url(#automation-blue)" opacity="0.2"/>
        <rect x="12" y="16" width="40" height="24" rx="2" fill="none" stroke="url(#automation-blue)" strokeWidth="2"/>
        <circle cx="20" cy="24" r="2" fill="url(#automation-blue)"/>
        <circle cx="32" cy="24" r="2" fill="url(#automation-blue)"/>
        <circle cx="44" cy="24" r="2" fill="url(#automation-blue)"/>
        <rect x="16" y="30" width="32" height="2" rx="1" fill="url(#automation-blue)"/>
        <rect x="16" y="34" width="24" height="2" rx="1" fill="url(#automation-blue)"/>
        <path d="M24 48 L32 52 L40 48" stroke="url(#automation-blue)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    inventory: (
      <svg viewBox="0 0 64 64" className={`w-16 h-16 ${className}`}>
        <defs>
          <linearGradient id="inventory-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <rect x="12" y="16" width="40" height="40" rx="4" fill="none" stroke="url(#inventory-green)" strokeWidth="2"/>
        <rect x="16" y="20" width="32" height="8" rx="2" fill="url(#inventory-green)" opacity="0.3"/>
        <rect x="16" y="32" width="32" height="8" rx="2" fill="url(#inventory-green)" opacity="0.3"/>
        <rect x="16" y="44" width="32" height="8" rx="2" fill="url(#inventory-green)" opacity="0.3"/>
        <circle cx="20" cy="24" r="1.5" fill="url(#inventory-green)"/>
        <circle cx="20" cy="36" r="1.5" fill="url(#inventory-green)"/>
        <circle cx="20" cy="48" r="1.5" fill="url(#inventory-green)"/>
        <path d="M8 8 L56 8 L52 16 L12 16 Z" fill="url(#inventory-green)" opacity="0.6"/>
      </svg>
    ),
    fiscal: (
      <svg viewBox="0 0 64 64" className={`w-16 h-16 ${className}`}>
        <defs>
          <linearGradient id="fiscal-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <rect x="16" y="8" width="32" height="48" rx="4" fill="none" stroke="url(#fiscal-purple)" strokeWidth="2"/>
        <rect x="20" y="12" width="24" height="4" rx="2" fill="url(#fiscal-purple)"/>
        <rect x="20" y="20" width="24" height="2" rx="1" fill="url(#fiscal-purple)" opacity="0.6"/>
        <rect x="20" y="24" width="20" height="2" rx="1" fill="url(#fiscal-purple)" opacity="0.6"/>
        <rect x="20" y="28" width="16" height="2" rx="1" fill="url(#fiscal-purple)" opacity="0.6"/>
        <rect x="20" y="32" width="24" height="2" rx="1" fill="url(#fiscal-purple)" opacity="0.6"/>
        <rect x="20" y="40" width="24" height="8" rx="2" fill="url(#fiscal-purple)" opacity="0.2"/>
        <path d="M24 44 L28 46 L36 42" stroke="url(#fiscal-purple)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    financial: (
      <svg viewBox="0 0 64 64" className={`w-16 h-16 ${className}`}>
        <defs>
          <linearGradient id="financial-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="24" fill="none" stroke="url(#financial-orange)" strokeWidth="2"/>
        <rect x="28" y="20" width="8" height="24" rx="1" fill="url(#financial-orange)" opacity="0.3"/>
        <path d="M28 26 Q32 22 36 26" stroke="url(#financial-orange)" strokeWidth="2" fill="none"/>
        <path d="M28 38 Q32 42 36 38" stroke="url(#financial-orange)" strokeWidth="2" fill="none"/>
        <circle cx="16" cy="20" r="3" fill="url(#financial-orange)" opacity="0.6"/>
        <circle cx="48" cy="20" r="3" fill="url(#financial-orange)" opacity="0.6"/>
        <circle cx="16" cy="44" r="3" fill="url(#financial-orange)" opacity="0.6"/>
        <circle cx="48" cy="44" r="3" fill="url(#financial-orange)" opacity="0.6"/>
      </svg>
    ),
    support: (
      <svg viewBox="0 0 64 64" className={`w-16 h-16 ${className}`}>
        <defs>
          <linearGradient id="support-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="20" fill="none" stroke="url(#support-red)" strokeWidth="2"/>
        <path d="M24 28 Q32 20 40 28" stroke="url(#support-red)" strokeWidth="2" fill="none"/>
        <circle cx="28" cy="30" r="2" fill="url(#support-red)"/>
        <circle cx="36" cy="30" r="2" fill="url(#support-red)"/>
        <path d="M26 38 Q32 44 38 38" stroke="url(#support-red)" strokeWidth="2" fill="none"/>
        <rect x="30" y="16" width="4" height="8" rx="2" fill="url(#support-red)" opacity="0.6"/>
        <rect x="30" y="40" width="4" height="8" rx="2" fill="url(#support-red)" opacity="0.6"/>
        <rect x="16" y="30" width="8" height="4" rx="2" fill="url(#support-red)" opacity="0.6"/>
        <rect x="40" y="30" width="8" height="4" rx="2" fill="url(#support-red)" opacity="0.6"/>
      </svg>
    ),
    nfe: (
      <svg viewBox="0 0 64 64" className={`w-16 h-16 ${className}`}>
        <defs>
          <linearGradient id="nfe-teal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
        </defs>
        <rect x="16" y="8" width="32" height="48" rx="4" fill="none" stroke="url(#nfe-teal)" strokeWidth="2"/>
        <rect x="20" y="12" width="24" height="4" rx="2" fill="url(#nfe-teal)"/>
        <rect x="20" y="20" width="24" height="2" rx="1" fill="url(#nfe-teal)" opacity="0.6"/>
        <rect x="20" y="24" width="20" height="2" rx="1" fill="url(#nfe-teal)" opacity="0.6"/>
        <rect x="20" y="28" width="16" height="2" rx="1" fill="url(#nfe-teal)" opacity="0.6"/>
        <rect x="20" y="32" width="24" height="2" rx="1" fill="url(#nfe-teal)" opacity="0.6"/>
        <rect x="20" y="36" width="18" height="2" rx="1" fill="url(#nfe-teal)" opacity="0.6"/>
        <rect x="20" y="42" width="24" height="8" rx="2" fill="url(#nfe-teal)" opacity="0.2"/>
        <circle cx="24" cy="46" r="1.5" fill="url(#nfe-teal)"/>
        <rect x="28" y="44" width="12" height="2" rx="1" fill="url(#nfe-teal)"/>
        <rect x="28" y="47" width="8" height="2" rx="1" fill="url(#nfe-teal)"/>
      </svg>
    )
  };

  return (
    <div className="flex justify-center items-center p-4 bg-white rounded-2xl group-hover:shadow-lg transition-all duration-500 border border-gray-100">
      {icons[type]}
    </div>
  );
};

export default ColoredServiceIcon;