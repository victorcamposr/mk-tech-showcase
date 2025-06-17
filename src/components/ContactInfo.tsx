import ContactIcon from "@/components/ContactIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const contactInfo = [
  {
    iconType: "whatsapp" as const,
    title: "WhatsApp",
    info: "(65) 99353-5079",
    link: "https://wa.me/5565993535079"
  },
  {
    iconType: "email" as const,
    title: "E-mail",
    info: "mktecnologiaoficial@gmail.com",
    link: "mailto:mktecnologiaoficial@gmail.com"
  },
  {
    iconType: "instagram" as const,
    title: "Instagram",
    info: "@mktecnologiaoficial",
    link: "https://instagram.com/mktecnologiaoficial"
  }
];

const ContactInfo = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-black mb-8">
        Fale Conosco
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {contactInfo.map((contact, index) => (
           <Card key={index} className="border-brand-gold/20 hover:shadow-lg hover:shadow-brand-gold/5 transition-all duration-300 hover:-translate-y-1 group bg-gradient-to-br from-white to-gray-50/30">
             <CardContent className="p-6 text-center">
               <ContactIcon type={contact.iconType} />
               <h3 className="text-sm font-semibold text-brand-black mb-2 group-hover:text-brand-gold transition-colors duration-300">{contact.title}</h3>
              {contact.link ? (
                <a 
                  href={contact.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-gold hover:text-brand-gold-dark transition-colors text-sm font-medium block break-words"
                >
                  {contact.info}
                </a>
              ) : (
                <p className="text-gray-600 whitespace-pre-line text-sm break-words">{contact.info}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Horário de Atendimento */}
      <Card className="border-brand-gold/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-gray-50/30">
        <CardHeader className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
              <ContactIcon type="clock" />
            </div>
            <CardTitle className="text-base text-brand-black flex items-center">Horário de Atendimento</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-4">
          <div className="space-y-3 text-gray-600 text-sm">
            <div className="flex justify-between items-center">
              <span>Segunda a Sexta:</span>
              <span className="text-brand-black font-medium">08:00 - 18:00</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Sábado:</span>
              <span className="text-brand-black font-medium">08:00 - 12:00</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Domingo:</span>
              <span className="text-brand-black font-medium">Fechado</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gradient-to-r from-brand-gold/10 to-brand-gold/15 rounded-lg">
            <p className="text-xs text-brand-black">
              <strong>Suporte de Emergência:</strong> Disponível 24/7 via WhatsApp para clientes com contratos de suporte.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInfo;