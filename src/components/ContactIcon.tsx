interface ContactIconProps {
  type: 'whatsapp' | 'email' | 'location' | 'instagram' | 'phone' | 'clock' | 'map';
  className?: string;
}

const ContactIcon = ({ type, className = "w-6 h-6" }: ContactIconProps) => {
  const icons = {
    whatsapp: (
      <svg viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="whatsapp-contact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#25D366" />
            <stop offset="100%" stopColor="#128C7E" />
          </linearGradient>
        </defs>
        <path fill="url(#whatsapp-contact)" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
      </svg>
    ),
    email: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="email-contact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <rect x="8" y="16" width="48" height="32" rx="6" fill="none" stroke="url(#email-contact)" strokeWidth="3"/>
        <path d="M8 16 L32 32 L56 16" stroke="url(#email-contact)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="32" cy="32" r="4" fill="url(#email-contact)" opacity="0.6"/>
        <path d="M8 48 L24 32" stroke="url(#email-contact)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M56 48 L40 32" stroke="url(#email-contact)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    location: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="location-contact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <path d="M32 8 C24 8 18 14 18 22 C18 34 32 56 32 56 C32 56 46 34 46 22 C46 14 40 8 32 8 Z" fill="url(#location-contact)" opacity="0.3"/>
        <path d="M32 8 C24 8 18 14 18 22 C18 34 32 56 32 56 C32 56 46 34 46 22 C46 14 40 8 32 8 Z" fill="none" stroke="url(#location-contact)" strokeWidth="3"/>
        <circle cx="32" cy="22" r="6" fill="url(#location-contact)"/>
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="instagram-contact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E4405F" />
            <stop offset="50%" stopColor="#F77737" />
            <stop offset="100%" stopColor="#FCAF45" />
          </linearGradient>
        </defs>
        <rect x="12" y="12" width="40" height="40" rx="12" fill="url(#instagram-contact)" opacity="0.2"/>
        <rect x="12" y="12" width="40" height="40" rx="12" fill="none" stroke="url(#instagram-contact)" strokeWidth="3"/>
        <circle cx="32" cy="32" r="10" fill="none" stroke="url(#instagram-contact)" strokeWidth="3"/>
        <circle cx="44" cy="20" r="3" fill="url(#instagram-contact)"/>
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="phone-contact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <rect x="20" y="8" width="24" height="48" rx="6" fill="none" stroke="url(#phone-contact)" strokeWidth="3"/>
        <rect x="24" y="12" width="16" height="24" rx="2" fill="url(#phone-contact)" opacity="0.3"/>
        <circle cx="32" cy="44" r="4" fill="url(#phone-contact)" opacity="0.6"/>
        <rect x="28" y="48" width="8" height="2" rx="1" fill="url(#phone-contact)"/>
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="clock-contact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="24" fill="none" stroke="url(#clock-contact)" strokeWidth="3"/>
        <circle cx="32" cy="32" r="20" fill="url(#clock-contact)" opacity="0.1"/>
        <path d="M32 16 L32 32 L44 40" stroke="url(#clock-contact)" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="32" cy="32" r="2" fill="url(#clock-contact)"/>
        <circle cx="32" cy="12" r="2" fill="url(#clock-contact)"/>
        <circle cx="32" cy="52" r="2" fill="url(#clock-contact)"/>
        <circle cx="52" cy="32" r="2" fill="url(#clock-contact)"/>
        <circle cx="12" cy="32" r="2" fill="url(#clock-contact)"/>
      </svg>
    ),
    map: (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="map-contact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-dark))" />
          </linearGradient>
        </defs>
        <rect x="8" y="12" width="48" height="40" rx="6" fill="none" stroke="url(#map-contact)" strokeWidth="3"/>
        <path d="M8 24 L22 20 L42 28 L56 24 L56 52 L42 48 L22 40 L8 44 Z" fill="url(#map-contact)" opacity="0.3"/>
        <path d="M22 20 L22 40" stroke="url(#map-contact)" strokeWidth="2"/>
        <path d="M42 28 L42 48" stroke="url(#map-contact)" strokeWidth="2"/>
        <circle cx="32" cy="28" r="3" fill="url(#map-contact)"/>
      </svg>
    )
  };

  return (
    <div className="flex justify-center items-center p-3 bg-gradient-to-br from-brand-gold/10 to-brand-gold/20 rounded-xl group-hover:from-brand-gold/20 group-hover:to-brand-gold/30 transition-all duration-500">
      {icons[type]}
    </div>
  );
};

export default ContactIcon;