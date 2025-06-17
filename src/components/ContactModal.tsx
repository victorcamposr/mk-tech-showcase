import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SimpleIcon from "@/components/SimpleIcon";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-brand-gold/20 shadow-2xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100000]">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-brand-gold/20 to-brand-gold/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <DialogTitle className="text-xl font-semibold text-brand-black">
            Mensagem Enviada!
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Recebemos sua mensagem e entraremos em contato em breve. Você também pode nos chamar diretamente no WhatsApp para um atendimento mais rápido.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-6">
          <Button 
            onClick={onClose}
            className="w-full bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold transition-all duration-300"
          >
            Entendi
          </Button>
          <Button 
            asChild
            variant="outline"
            className="w-full border-brand-gold/20 hover:bg-brand-gold/5 text-brand-black transition-all duration-300"
          >
            <a href="https://wa.me/5565993535079" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <SimpleIcon type="whatsapp-black" className="w-4 h-4" />
              Abrir WhatsApp
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;