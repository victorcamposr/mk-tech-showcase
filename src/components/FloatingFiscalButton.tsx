
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FloatingFiscalButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate("/cadastro-fiscal")}
      className="fixed bottom-6 right-6 z-50 bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-14 h-14 p-0 group"
      title="Cadastro de Dados Fiscais"
    >
      <FileText className="w-6 h-6 group-hover:scale-110 transition-transform" />
    </Button>
  );
};

export default FloatingFiscalButton;
