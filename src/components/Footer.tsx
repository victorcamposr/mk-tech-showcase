import ContactIcon from "@/components/ContactIcon";

const Footer = () => {
  return (
    <footer className="bg-brand-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <img 
              src="/lovable-uploads/894786af-af73-492e-ae6a-d8a39e0ac4cb.png" 
              alt="MK Tecnologia" 
              className="h-16 w-auto mb-4 hover:scale-105 transition-transform duration-300"
            />
            <p className="text-gray-300 mb-4 max-w-md">
              Especialistas em automação comercial, oferecendo soluções completas para 
              controle de estoque, emissão fiscal e gestão empresarial.
            </p>
            <div className="flex space-x-6">
              <a 
                href="https://wa.me/5565993535079" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-gold hover:text-brand-gold-light transition-colors group"
              >
                <div className="w-4 h-4 flex-shrink-0">
                  <ContactIcon type="whatsapp" />
                </div>
                <span>WhatsApp</span>
              </a>
              <a 
                href="https://instagram.com/mktecnologiaoficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-gold hover:text-brand-gold-light transition-colors group"
              >
                <div className="w-4 h-4 flex-shrink-0">
                  <ContactIcon type="instagram" />
                </div>
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-brand-gold font-semibold mb-4">Contato</h3>
            <div className="space-y-8 text-gray-300">
              <div className="flex items-center gap-8">
                <div className="w-6 h-6 flex-shrink-0">
                  <ContactIcon type="phone" />
                </div>
                <span>(65) 99353-5079</span>
              </div>
              <div className="flex items-center gap-8">
                <div className="w-6 h-6 flex-shrink-0">
                  <ContactIcon type="email" />
                </div>
                <span>mktecnologiaoficial@gmail.com</span>
              </div>
              <div className="flex items-center gap-8">
                <div className="w-6 h-6 flex-shrink-0">
                  <ContactIcon type="location" />
                </div>
                <span>Av Marechal Rondon, 1512 - Pontes e Lacerda/MT</span>
              </div>
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="text-brand-gold font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Automação Comercial</li>
              <li>Controle de Estoque</li>
              <li>Emissão Fiscal</li>
              <li>Sistemas de Gestão</li>
              <li>Suporte Técnico</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-gold/20 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 MK Tecnologia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;