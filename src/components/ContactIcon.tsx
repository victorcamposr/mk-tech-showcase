interface ContactIconProps {
  type: 'whatsapp' | 'email' | 'location' | 'instagram' | 'phone' | 'clock' | 'map';
  className?: string;
}

const ContactIcon = ({ type, className }: ContactIconProps) => {
  const iconSize = className || "w-6 h-6";
  
  const icons = {
    whatsapp: (
      <svg viewBox="0 0 24 24" className={`${iconSize} flex-shrink-0`} fill="#25D366" width="24" height="24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
      </svg>
    ),
    email: (
      <svg viewBox="0 0 24 24" className={`${iconSize} flex-shrink-0`} fill="none" stroke="#D4AF37" strokeWidth="2" width="24" height="24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    location: (
      <svg viewBox="0 0 24 24" className={`${iconSize} flex-shrink-0`} fill="none" stroke="#D4AF37" strokeWidth="2" width="24" height="24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" className={`${iconSize} flex-shrink-0`} fill="none" stroke="#E4405F" strokeWidth="2" width="24" height="24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 24 24" className={`${iconSize} flex-shrink-0`} fill="none" stroke="#D4AF37" strokeWidth="2" width="24" height="24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 24 24" className={`${iconSize} flex-shrink-0`} fill="none" stroke="#D4AF37" strokeWidth="2" width="24" height="24">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
      </svg>
    ),
    map: (
      <svg viewBox="0 0 24 24" className={`${iconSize} flex-shrink-0`} fill="none" stroke="#D4AF37" strokeWidth="2" width="24" height="24">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/>
        <line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
    )
  };

  return (
    <div className="flex justify-center items-center p-3 bg-gradient-to-br from-brand-gold/10 to-brand-gold/20 rounded-xl group-hover:from-brand-gold/20 group-hover:to-brand-gold/30 transition-all duration-500 group-hover:scale-110 transition-transform duration-300">
      {icons[type]}
    </div>
  );
};

export default ContactIcon;