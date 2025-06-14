const Footer = () => {
  return (
    <footer className="bg-brand-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <img 
              src="/lovable-uploads/a60d254c-a883-48c4-b073-85cb46bc5238.png" 
              alt="MK Tecnologia" 
              className="h-16 w-auto mb-4"
            />
            <p className="text-gray-300 mb-4 max-w-md">
              Especialistas em automação comercial, oferecendo soluções completas para 
              controle de estoque, emissão fiscal e gestão empresarial.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://wa.me/5565993535079" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-gold hover:text-brand-gold-light transition-colors"
              >
                WhatsApp
              </a>
              <a 
                href="https://instagram.com/mktecnologiaoficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-gold hover:text-brand-gold-light transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-brand-gold font-semibold mb-4">Contato</h3>
            <div className="space-y-2 text-gray-300">
              <p>📱 (65) 99353-5079</p>
              <p>✉️ mktecnologiaoficial@gmail.com</p>
              <p>📍 Av Marechal Rondon, 1512</p>
              <p>Pontes e Lacerda/MT</p>
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
          <p>&copy; 2024 MK Tecnologia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;