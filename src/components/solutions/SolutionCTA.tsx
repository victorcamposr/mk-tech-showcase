import { Button } from "@/components/ui/button";
import SimpleIcon from "@/components/SimpleIcon";
import { ScrollReveal } from "@/components/ScrollReveal";

interface SolutionCTAProps {
  title?: string;
  description?: string;
  whatsappUrl?: string;
  buttonText?: string;
}

const SolutionCTA = ({ 
  title = "Pronto para Automatizar seu Negócio?", 
  description = "Entre em contato conosco e descubra qual solução é perfeita para sua empresa.",
  whatsappUrl = "https://wa.me/5565993535079",
  buttonText = "Falar no WhatsApp"
}: SolutionCTAProps) => {
  return (
    <ScrollReveal animation="fade-up" delay={300}>
      <div className="text-center bg-gradient-to-r from-brand-black to-brand-black-light rounded-2xl p-12 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <Button asChild className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold group">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <SimpleIcon type="whatsapp-black" className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {buttonText}
          </a>
        </Button>
      </div>
    </ScrollReveal>
  );
};

export default SolutionCTA;