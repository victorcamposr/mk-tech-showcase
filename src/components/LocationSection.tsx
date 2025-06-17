import ContactIcon from "@/components/ContactIcon";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LocationSection = () => {
  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-brand-black text-center mb-8">
        Nossa Localização
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informações da Localização */}
        <Card className="border-brand-gold/20 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/30">
          <CardContent className="p-6 text-center">
            <ContactIcon type="map" />
            <h3 className="text-xl font-semibold text-brand-black mb-2">
              Av Marechal Rondon, 1512
            </h3>
            <p className="text-gray-600 mb-4 font-medium">Pontes e Lacerda - MT</p>
            <p className="text-gray-600 mb-6">
              Estamos localizados no centro da cidade, facilitando o acesso de nossos clientes 
              e parceiros. Nossa sede conta com estacionamento e está próxima aos principais 
              pontos comerciais da cidade.
            </p>
            <Button asChild className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black transition-all duration-300 hover:scale-105">
              <a 
                href="https://maps.google.com/?q=Av+Marechal+Rondon+1512+Pontes+e+Lacerda+MT" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Ver no Google Maps
              </a>
            </Button>
          </CardContent>
        </Card>
        
        {/* Mapa Interativo */}
        <div className="flex flex-col">
          <div className="w-full h-80 lg:h-full rounded-xl overflow-hidden border border-brand-gold/20 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3858.1234567890!2d-59.3559!3d-15.2293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDE0JzMxLjMiUyA1OcKwMjEnMjMuNSJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização MK Tecnologia - Av Marechal Rondon, 1512, Pontes e Lacerda - MT"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;