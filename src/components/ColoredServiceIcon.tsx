interface ColoredServiceIconProps {
  type: 'automation' | 'inventory' | 'fiscal' | 'financial' | 'support' | 'nfe' | 'speed' | 'customization' | 'headset' | 'efficiency' | 'control' | 'cost-reduction' | 'growth' | 'cupom-fiscal';
  className?: string;
}

export const getServiceColors = (type: 'automation' | 'inventory' | 'fiscal' | 'financial' | 'support' | 'nfe' | 'speed' | 'customization' | 'headset' | 'efficiency' | 'control' | 'cost-reduction' | 'growth' | 'cupom-fiscal') => {
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
    },
    speed: {
      border: 'border-green-500/20 hover:border-green-500/40',
      hoverText: 'group-hover:text-green-500',
      bullet: 'bg-green-500'
    },
    customization: {
      border: 'border-pink-500/20 hover:border-pink-500/40',
      hoverText: 'group-hover:text-pink-500',
      bullet: 'bg-pink-500'
    },
    headset: {
      border: 'border-indigo-500/20 hover:border-indigo-500/40',
      hoverText: 'group-hover:text-indigo-500',
      bullet: 'bg-indigo-500'
    },
    },
    efficiency: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      hoverText: 'group-hover:text-cyan-500',
      bullet: 'bg-cyan-500'
    },
    control: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      hoverText: 'group-hover:text-purple-500',
      bullet: 'bg-purple-500'
    },
    'cost-reduction': {
      border: 'border-red-600/20 hover:border-red-600/40',
      hoverText: 'group-hover:text-red-600',
      bullet: 'bg-red-600'
    },
    growth: {
      border: 'border-lime-500/20 hover:border-lime-500/40',
      hoverText: 'group-hover:text-lime-500',
      bullet: 'bg-lime-500'
    },
    'cupom-fiscal': {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      hoverText: 'group-hover:text-amber-500',
      bullet: 'bg-amber-500'
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
        <rect x="10" y="14" width="44" height="28" rx="6" fill="url(#automation-blue)" opacity="0.15"/>
        <rect x="12" y="16" width="40" height="24" rx="4" fill="none" stroke="url(#automation-blue)" strokeWidth="2"/>
        <rect x="16" y="20" width="32" height="16" rx="2" fill="url(#automation-blue)" opacity="0.3"/>
        <circle cx="48" cy="18" r="1.5" fill="url(#automation-blue)"/>
        <rect x="20" y="24" width="6" height="2" rx="1" fill="url(#automation-blue)"/>
        <rect x="28" y="24" width="4" height="2" rx="1" fill="url(#automation-blue)"/>
        <rect x="20" y="28" width="8" height="2" rx="1" fill="url(#automation-blue)"/>
        <rect x="30" y="28" width="6" height="2" rx="1" fill="url(#automation-blue)"/>
        <path d="M26 44 L32 48 L38 44" stroke="url(#automation-blue)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <rect x="20" y="50" width="24" height="4" rx="2" fill="url(#automation-blue)" opacity="0.6"/>
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
        {/* Elaborate 3D box */}
        {/* Base shadow */}
        <ellipse cx="32" cy="50" rx="18" ry="4" fill="url(#inventory-green)" opacity="0.2"/>
        
        {/* Main box front face */}
        <rect x="16" y="24" width="32" height="24" rx="2" fill="url(#inventory-green)" opacity="0.3"/>
        <rect x="16" y="24" width="32" height="24" rx="2" fill="none" stroke="url(#inventory-green)" strokeWidth="2"/>
        
        {/* Box right side (3D effect) */}
        <path d="M48 24 L54 18 L54 42 L48 48" stroke="url(#inventory-green)" strokeWidth="2" fill="url(#inventory-green)" opacity="0.2"/>
        
        {/* Box top (3D effect) */}
        <path d="M16 24 L22 18 L54 18 L48 24" stroke="url(#inventory-green)" strokeWidth="2" fill="url(#inventory-green)" opacity="0.25"/>
        
        {/* Box details - front panel lines */}
        <rect x="20" y="28" width="24" height="2" rx="1" fill="url(#inventory-green)" opacity="0.4"/>
        <rect x="20" y="32" width="20" height="2" rx="1" fill="url(#inventory-green)" opacity="0.4"/>
        <rect x="20" y="36" width="16" height="2" rx="1" fill="url(#inventory-green)" opacity="0.4"/>
        
        {/* Box handle */}
        <rect x="28" y="40" width="8" height="4" rx="2" fill="none" stroke="url(#inventory-green)" strokeWidth="1.5"/>
        
        {/* Corner reinforcements */}
        <circle cx="20" cy="28" r="1" fill="url(#inventory-green)" opacity="0.6"/>
        <circle cx="44" cy="28" r="1" fill="url(#inventory-green)" opacity="0.6"/>
        <circle cx="20" cy="44" r="1" fill="url(#inventory-green)" opacity="0.6"/>
        <circle cx="44" cy="44" r="1" fill="url(#inventory-green)" opacity="0.6"/>
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
        <rect x="8" y="16" width="16" height="20" rx="2" fill="none" stroke="url(#financial-orange)" strokeWidth="2"/>
        <rect x="10" y="18" width="12" height="4" rx="1" fill="url(#financial-orange)" opacity="0.6"/>
        <rect x="10" y="24" width="5" height="2" rx="1" fill="url(#financial-orange)" opacity="0.5"/>
        <rect x="17" y="24" width="5" height="2" rx="1" fill="url(#financial-orange)" opacity="0.5"/>
        <rect x="10" y="28" width="5" height="2" rx="1" fill="url(#financial-orange)" opacity="0.5"/>
        <rect x="17" y="28" width="5" height="2" rx="1" fill="url(#financial-orange)" opacity="0.5"/>
        <rect x="10" y="32" width="5" height="2" rx="1" fill="url(#financial-orange)" opacity="0.5"/>
        <rect x="17" y="32" width="5" height="2" rx="1" fill="url(#financial-orange)" opacity="0.5"/>
        <rect x="28" y="32" width="6" height="12" rx="1" fill="url(#financial-orange)" opacity="0.3"/>
        <rect x="36" y="28" width="6" height="16" rx="1" fill="url(#financial-orange)" opacity="0.3"/>
        <rect x="44" y="24" width="6" height="20" rx="1" fill="url(#financial-orange)" opacity="0.3"/>
        <circle cx="48" cy="16" r="8" fill="none" stroke="url(#financial-orange)" strokeWidth="2"/>
        <path d="M44 12 L48 16 L52 12" stroke="url(#financial-orange)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <rect x="8" y="40" width="20" height="12" rx="2" fill="url(#financial-orange)" opacity="0.2"/>
        <rect x="12" y="44" width="12" height="4" rx="1" fill="url(#financial-orange)" opacity="0.6"/>
        <circle cx="18" cy="46" r="1.5" fill="url(#financial-orange)"/>
        <circle cx="52" cy="48" r="8" fill="url(#financial-orange)" opacity="0.2"/>
        <path d="M49 45 Q52 42 55 45 Q52 48 49 45" fill="url(#financial-orange)" opacity="0.7"/>
        <circle cx="52" cy="45" r="1.5" fill="url(#financial-orange)"/>
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
        {/* Person with headset */}
        {/* Head */}
        <circle cx="32" cy="24" r="8" fill="url(#support-red)" opacity="0.3"/>
        <circle cx="32" cy="24" r="8" fill="none" stroke="url(#support-red)" strokeWidth="2"/>
        
        {/* Headset band */}
        <path d="M24 20 Q32 14 40 20" stroke="url(#support-red)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        
        {/* Left earpiece */}
        <ellipse cx="24" cy="22" rx="2" ry="3" fill="url(#support-red)" opacity="0.6"/>
        <ellipse cx="24" cy="22" rx="2" ry="3" fill="none" stroke="url(#support-red)" strokeWidth="1"/>
        
        {/* Right earpiece */}
        <ellipse cx="40" cy="22" rx="2" ry="3" fill="url(#support-red)" opacity="0.6"/>
        <ellipse cx="40" cy="22" rx="2" ry="3" fill="none" stroke="url(#support-red)" strokeWidth="1"/>
        
        {/* Microphone */}
        <path d="M40 24 L44 26" stroke="url(#support-red)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="44" cy="26" r="1.5" fill="url(#support-red)" opacity="0.8"/>
        
        {/* Body/shoulders */}
        <path d="M20 32 Q32 36 44 32 L42 48 L22 48 Z" fill="url(#support-red)" opacity="0.2"/>
        <path d="M20 32 Q32 36 44 32" stroke="url(#support-red)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        
        {/* Arms */}
        <path d="M22 40 L16 44" stroke="url(#support-red)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M42 40 L48 44" stroke="url(#support-red)" strokeWidth="2" strokeLinecap="round"/>
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
    ),
    speed: (
      <svg viewBox="0 0 64 64" className={`w-16 h-16 ${className}`}>
        <defs>
          <linearGradient id="speed-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
        </defs>
        {/* Speedometer circle */}
        <circle cx="32" cy="38" r="18" fill="none" stroke="url(#speed-green)" strokeWidth="3"/>
        
        {/* Speed indicator marks */}
        <path d="M20 26 L22 24" stroke="url(#speed-green)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M32 18 L32 20" stroke="url(#speed-green)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M44 26 L42 24" stroke="url(#speed-green)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18 38 L20 38" stroke="url(#speed-green)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M46 38 L44 38" stroke="url(#speed-green)" strokeWidth="2" strokeLinecap="round"/>
        
        {/* Speed needle pointing to high speed */}
        <path d="M32 38 L42 28" stroke="url(#speed-green)" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="32" cy="38" r="2" fill="url(#speed-green)"/>
        
        {/* Motion lines indicating speed */}
        <path d="M8 48 L18 46" stroke="url(#speed-green)" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <path d="M10 52 L16 51" stroke="url(#speed-green)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        <path d="M12 56 L20 54" stroke="url(#speed-green)" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
      </svg>
    ),
    customization: (
      <svg viewBox="0 0 64 64" className={`w-16 h-16 ${className}`}>
        <defs>
          <linearGradient id="customization-pink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>
        </defs>
        <ellipse cx="20" cy="20" rx="8" ry="6" fill="url(#customization-pink)" opacity="0.3"/>
        <path d="M12 14 Q20 8 28 14 Q20 20 12 14" fill="url(#customization-pink)" opacity="0.6"/>
        <rect x="28" y="16" width="24" height="32" rx="2" fill="none" stroke="url(#customization-pink)" strokeWidth="2"/>
        <rect x="32" y="20" width="16" height="24" rx="1" fill="url(#customization-pink)" opacity="0.1"/>
        <circle cx="36" cy="26" r="3" fill="url(#customization-pink)" opacity="0.6"/>
        <circle cx="44" cy="32" r="2" fill="url(#customization-pink)" opacity="0.6"/>
        <circle cx="38" cy="38" r="2.5" fill="url(#customization-pink)" opacity="0.6"/>
        <path d="M16 26 L24 34 L20 38 L12 30 Z" fill="url(#customization-pink)" opacity="0.4"/>
        <circle cx="18" cy="32" r="1.5" fill="url(#customization-pink)"/>
      </svg>
    ),
    headset: (
      <svg viewBox="0 0 64 64" className={`w-16 h-16 ${className}`}>
        <defs>
          <linearGradient id="headset-indigo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
        {/* Conventional Headset */}
        {/* Main headband arc */}
        <path d="M18 32 Q32 16 46 32" stroke="url(#headset-indigo)" strokeWidth="3" fill="none" strokeLinecap="round"/>
        
        {/* Headband padding */}
        <path d="M22 24 Q32 20 42 24" stroke="url(#headset-indigo)" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.4"/>
        
        {/* Left ear cup outer */}
        <circle cx="18" cy="32" r="7" fill="url(#headset-indigo)" opacity="0.2"/>
        <circle cx="18" cy="32" r="7" fill="none" stroke="url(#headset-indigo)" strokeWidth="2"/>
        
        {/* Left ear cup inner driver */}
        <circle cx="18" cy="32" r="4" fill="url(#headset-indigo)" opacity="0.4"/>
        <circle cx="18" cy="32" r="2.5" fill="none" stroke="url(#headset-indigo)" strokeWidth="1.5"/>
        
        {/* Right ear cup outer */}
        <circle cx="46" cy="32" r="7" fill="url(#headset-indigo)" opacity="0.2"/>
        <circle cx="46" cy="32" r="7" fill="none" stroke="url(#headset-indigo)" strokeWidth="2"/>
        
        {/* Right ear cup inner driver */}
        <circle cx="46" cy="32" r="4" fill="url(#headset-indigo)" opacity="0.4"/>
        <circle cx="46" cy="32" r="2.5" fill="none" stroke="url(#headset-indigo)" strokeWidth="1.5"/>
        
        {/* Headband adjustment points */}
        <rect x="30" y="18" width="4" height="2" rx="1" fill="url(#headset-indigo)" opacity="0.6"/>
        <rect x="29" y="20" width="6" height="1" rx="0.5" fill="url(#headset-indigo)" opacity="0.4"/>
        
        {/* Driver details */}
        <circle cx="18" cy="30" r="0.8" fill="url(#headset-indigo)"/>
        <circle cx="18" cy="34" r="0.8" fill="url(#headset-indigo)"/>
        <circle cx="46" cy="30" r="0.8" fill="url(#headset-indigo)"/>
        <circle cx="46" cy="34" r="0.8" fill="url(#headset-indigo)"/>
        
        {/* Connection hinges */}
        <rect x="16" y="24" width="4" height="3" rx="1.5" fill="url(#headset-indigo)" opacity="0.5"/>
        <rect x="44" y="24" width="4" height="3" rx="1.5" fill="url(#headset-indigo)" opacity="0.5"/>
      </svg>
    ),
    efficiency: (
      <svg viewBox="0 0 64 64" className={`w-16 h-16 ${className}`}>
        <defs>
          <linearGradient id="efficiency-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="16" fill="none" stroke="url(#efficiency-cyan)" strokeWidth="2"/>
        <path d="M32 20 L36 28 L28 28 Z" fill="url(#efficiency-cyan)" opacity="0.8"/>
        <circle cx="32" cy="32" r="2" fill="url(#efficiency-cyan)"/>
        <path d="M32 16 L34 18 L32 20 L30 18 Z" fill="url(#efficiency-cyan)"/>
        <path d="M48 32 L46 30 L44 32 L46 34 Z" fill="url(#efficiency-cyan)"/>
        <path d="M32 48 L30 46 L32 44 L34 46 Z" fill="url(#efficiency-cyan)"/>
        <path d="M16 32 L18 34 L20 32 L18 30 Z" fill="url(#efficiency-cyan)"/>
        <circle cx="42" cy="22" r="1.5" fill="url(#efficiency-cyan)" opacity="0.7"/>
        <circle cx="42" cy="42" r="1.5" fill="url(#efficiency-cyan)" opacity="0.7"/>
        <circle cx="22" cy="22" r="1.5" fill="url(#efficiency-cyan)" opacity="0.7"/>
        <circle cx="22" cy="42" r="1.5" fill="url(#efficiency-cyan)" opacity="0.7"/>
      </svg>
    ),
    control: (
      <svg viewBox="0 0 64 64" className={`w-16 h-16 ${className}`}>
        <defs>
          <linearGradient id="control-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <rect x="12" y="16" width="40" height="32" rx="6" fill="none" stroke="url(#control-purple)" strokeWidth="2"/>
        <rect x="16" y="20" width="32" height="6" rx="3" fill="url(#control-purple)" opacity="0.3"/>
        <circle cx="20" cy="32" r="3" fill="url(#control-purple)" opacity="0.6"/>
        <circle cx="32" cy="32" r="3" fill="url(#control-purple)" opacity="0.6"/>
        <circle cx="44" cy="32" r="3" fill="url(#control-purple)" opacity="0.6"/>
        <rect x="18" y="38" width="8" height="6" rx="1" fill="url(#control-purple)" opacity="0.4"/>
        <rect x="28" y="38" width="8" height="6" rx="1" fill="url(#control-purple)" opacity="0.4"/>
        <rect x="38" y="38" width="8" height="6" rx="1" fill="url(#control-purple)" opacity="0.4"/>
        <circle cx="48" cy="12" r="2" fill="url(#control-purple)" opacity="0.8"/>
        <path d="M48 10 L48 6 M46 12 L42 12" stroke="url(#control-purple)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    'cost-reduction': (
      <svg viewBox="0 0 64 64" className={`w-16 h-16 ${className}`}>
        <defs>
          <linearGradient id="cost-reduction-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
        </defs>
        <path d="M12 20 L20 28 L28 24 L36 32 L44 28 L52 36" stroke="url(#cost-reduction-red)" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="20" cy="28" r="2" fill="url(#cost-reduction-red)"/>
        <circle cx="28" cy="24" r="2" fill="url(#cost-reduction-red)"/>
        <circle cx="36" cy="32" r="2" fill="url(#cost-reduction-red)"/>
        <circle cx="44" cy="28" r="2" fill="url(#cost-reduction-red)"/>
        <path d="M46 38 L52 32 L46 32 Z" fill="url(#cost-reduction-red)"/>
        <rect x="16" y="42" width="32" height="12" rx="2" fill="url(#cost-reduction-red)" opacity="0.2"/>
        <path d="M24 48 L20 46 L20 50 Z" fill="url(#cost-reduction-red)" opacity="0.6"/>
        <path d="M32 48 L28 46 L28 50 Z" fill="url(#cost-reduction-red)" opacity="0.6"/>
        <path d="M40 48 L36 46 L36 50 Z" fill="url(#cost-reduction-red)" opacity="0.6"/>
      </svg>
    ),
    growth: (
      <svg viewBox="0 0 64 64" className={`w-16 h-16 ${className}`}>
        <defs>
          <linearGradient id="growth-lime" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#65A30D" />
            <stop offset="100%" stopColor="#4D7C0F" />
          </linearGradient>
        </defs>
        <path d="M12 44 L20 36 L28 40 L36 28 L44 32 L52 20" stroke="url(#growth-lime)" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="20" cy="36" r="2" fill="url(#growth-lime)"/>
        <circle cx="28" cy="40" r="2" fill="url(#growth-lime)"/>
        <circle cx="36" cy="28" r="2" fill="url(#growth-lime)"/>
        <circle cx="44" cy="32" r="2" fill="url(#growth-lime)"/>
        <path d="M46 22 L52 20 L52 26 Z" fill="url(#growth-lime)"/>
        <path d="M28 48 Q32 44 36 48 Q32 52 28 48" fill="url(#growth-lime)" opacity="0.4"/>
        <rect x="30" y="50" width="4" height="8" rx="2" fill="url(#growth-lime)" opacity="0.6"/>
        <path d="M26 46 Q28 42 30 46" fill="url(#growth-lime)" opacity="0.5"/>
        <path d="M34 46 Q36 42 38 46" fill="url(#growth-lime)" opacity="0.5"/>
      </svg>
    ),
    'cupom-fiscal': (
      <svg viewBox="0 0 64 64" className={`w-16 h-16 ${className}`}>
        <defs>
          <linearGradient id="cupom-amber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        <rect x="18" y="12" width="28" height="44" rx="2" fill="none" stroke="url(#cupom-amber)" strokeWidth="2"/>
        <path d="M18 16 L46 16 L44 20 L20 20 Z" fill="url(#cupom-amber)" opacity="0.6"/>
        <rect x="22" y="24" width="20" height="2" rx="1" fill="url(#cupom-amber)" opacity="0.6"/>
        <rect x="22" y="28" width="16" height="2" rx="1" fill="url(#cupom-amber)" opacity="0.6"/>
        <rect x="22" y="32" width="18" height="2" rx="1" fill="url(#cupom-amber)" opacity="0.6"/>
        <rect x="22" y="36" width="14" height="2" rx="1" fill="url(#cupom-amber)" opacity="0.6"/>
        <rect x="22" y="42" width="20" height="4" rx="2" fill="url(#cupom-amber)" opacity="0.3"/>
        <circle cx="26" cy="44" r="1" fill="url(#cupom-amber)"/>
        <rect x="30" y="43" width="8" height="2" rx="1" fill="url(#cupom-amber)"/>
        <path d="M14 20 L18 18 L18 22 Z" fill="url(#cupom-amber)" opacity="0.5"/>
        <path d="M50 20 L46 18 L46 22 Z" fill="url(#cupom-amber)" opacity="0.5"/>
        <path d="M14 36 L18 34 L18 38 Z" fill="url(#cupom-amber)" opacity="0.5"/>
        <path d="M50 36 L46 34 L46 38 Z" fill="url(#cupom-amber)" opacity="0.5"/>
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