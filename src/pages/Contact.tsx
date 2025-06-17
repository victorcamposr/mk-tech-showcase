import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ScrollReveal } from "@/components/ScrollReveal";
import ContactForm from "@/components/ContactForm";
import ContactInfo from "@/components/ContactInfo";
import LocationSection from "@/components/LocationSection";
import ContactModal from "@/components/ContactModal";
import { useState } from "react";

const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormSuccess = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Entre em Contato"
        description="Fale conosco para solicitar orçamento ou tirar dúvidas sobre automação comercial. WhatsApp: (65) 99353-5079. Atendemos Pontes e Lacerda e região com suporte especializado."
        keywords="contato MK Tecnologia, orçamento automação comercial, WhatsApp, telefone, endereço Pontes e Lacerda, atendimento"
      />
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Início", url: "/" },
            { name: "Contato", url: "/contato" }
          ]
        }}
      />
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <ScrollReveal animation="fade-in">
            <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-6">
              Entre em <span className="text-brand-gold">Contato</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Estamos prontos para atender você e transformar seu negócio
            </p>
          </div>
        </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ContactInfo />
              <ContactForm onSuccess={handleFormSuccess} />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <LocationSection />
          </ScrollReveal>
        </div>
      </main>

      <Footer />

      <ContactModal isOpen={isModalOpen} onClose={handleModalClose} />
      
    </div>
  );
};

export default Contact;