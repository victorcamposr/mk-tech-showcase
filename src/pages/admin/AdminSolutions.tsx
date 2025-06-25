
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Calculator, Coffee, QrCode, CreditCard, Truck, Link2, BarChart3, Bot, Receipt, Monitor, TrendingUp, Banknote, Building2, Tablet, Fuel, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SolutionModal from "@/components/admin/SolutionModal";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";

interface Solution {
  id: string;
  title: string;
  key: string;
  description: string;
  features: string[];
  benefits: string[];
  industries: string[];
  icon_name: string;
  card_image_url: string | null;
  hero_image_url: string | null;
  status: 'active' | 'inactive';
  sort_order: number | null;
  created_at: string;
}

const AdminSolutions = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [solutionToDelete, setSolutionToDelete] = useState<Solution | null>(null);
  const { toast } = useToast();

  // Static solution icon mapping based on solution keys (same as Header)
  const staticSolutionIcons: Record<string, any> = {
    'pdv-frente-caixa': Calculator,
    'mesas-comandas': Coffee,
    'cardapio-digital': QrCode,
    'maquininhas-cartao': CreditCard,
    'controle-motoboys': Truck,
    'integracoes': Link2,
    'gestao-analise': BarChart3,
    'robo-whatsapp': Bot,
    'nota-fiscal': Receipt,
    'auto-atendimento': Monitor,
    'marketing-vendas': TrendingUp,
    'pagamento-tef': Banknote,
    'franquias-filiais': Building2,
    'autoatendimento-tablet': Tablet,
    'sistema-revendas-gas-agua': Fuel,
  };

  const getIconComponent = (solution: Solution) => {
    // First try to get icon from static mapping based on solution key
    if (staticSolutionIcons[solution.key]) {
      return staticSolutionIcons[solution.key];
    }
    // Fallback to default icon
    return Lightbulb;
  };

  const fetchSolutions = async () => {
    try {
      const { data, error } = await supabase
        .from('solutions')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSolutions(data || []);
    } catch (error) {
      console.error('Error fetching solutions:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as soluções",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (solution: Solution) => {
    setSolutionToDelete(solution);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!solutionToDelete) return;

    try {
      const { error } = await supabase
        .from('solutions')
        .delete()
        .eq('id', solutionToDelete.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Solução excluída com sucesso",
      });

      fetchSolutions();
    } catch (error) {
      console.error('Error deleting solution:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a solução",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setSolutionToDelete(null);
    }
  };

  const handleEdit = (solution: Solution) => {
    setSelectedSolution(solution);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedSolution(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSolution(null);
    fetchSolutions();
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-black">Gerenciar Soluções</h2>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Solução
        </Button>
      </div>

      <div className="grid gap-6">
        {solutions.map((solution) => {
          const IconComponent = getIconComponent(solution);
          return (
            <Card key={solution.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-brand-gold/20 to-brand-gold-light/20 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-brand-gold" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{solution.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Key: {solution.key}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={solution.status === 'active' ? 'default' : 'secondary'}>
                      {solution.status === 'active' ? 'Ativa' : 'Inativa'}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(solution)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(solution)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{solution.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-brand-black mb-2">Recursos ({solution.features.length})</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {solution.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 bg-brand-gold rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                      {solution.features.length > 3 && (
                        <li className="text-brand-gold font-medium">
                          +{solution.features.length - 3} mais recursos
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-brand-black mb-2">Benefícios ({solution.benefits.length})</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {solution.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 bg-brand-gold rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {benefit}
                        </li>
                      ))}
                      {solution.benefits.length > 3 && (
                        <li className="text-brand-gold font-medium">
                          +{solution.benefits.length - 3} mais benefícios
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {solution.industries.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm text-brand-black mb-2">Segmentos</h4>
                    <div className="flex flex-wrap gap-2">
                      {solution.industries.map((industry, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  Ordem: {solution.sort_order || 'Não definida'} | 
                  Criado em: {new Date(solution.created_at).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {solutions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nenhuma solução cadastrada ainda.</p>
            <Button onClick={handleAdd} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Criar primeira solução
            </Button>
          </CardContent>
        </Card>
      )}

      <SolutionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        solution={selectedSolution}
      />

      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Solução"
        description={`Tem certeza que deseja excluir a solução "${solutionToDelete?.title}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};

export default AdminSolutions;
