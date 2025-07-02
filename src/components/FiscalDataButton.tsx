
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

const FiscalDataButton = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => navigate('/cadastro-fiscal')}
        size="lg"
        className="bg-brand-gold hover:bg-brand-gold/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full px-6 py-3"
      >
        <FileText className="w-5 h-5 mr-2" />
        Cadastro Fiscal
      </Button>
    </div>
  );
};

export default FiscalDataButton;
