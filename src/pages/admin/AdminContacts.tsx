
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mail, 
  Eye, 
  Clock, 
  User, 
  Phone, 
  Building, 
  MessageSquare,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

const AdminContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Erro ao carregar contatos",
        description: "Não foi possível carregar a lista de contatos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleReadStatus = async (contactId: string, currentStatus: boolean) => {
    if (updating === contactId) return; // Prevent multiple clicks
    
    setUpdating(contactId);
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ read: !currentStatus })
        .eq('id', contactId);

      if (error) throw error;

      // Update local state
      setContacts(prev => 
        prev.map(contact => 
          contact.id === contactId 
            ? { ...contact, read: !currentStatus }
            : contact
        )
      );

      // Update selected contact if it's the same one
      if (selectedContact && selectedContact.id === contactId) {
        setSelectedContact(prev => prev ? { ...prev, read: !currentStatus } : null);
      }

      toast({
        title: "Status atualizado",
        description: `Mensagem marcada como ${!currentStatus ? 'lida' : 'não lida'}.`,
      });
    } catch (error) {
      console.error('Error updating contact status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da mensagem.",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
      locale: ptBR
    });
  };

  const unreadCount = contacts.filter(contact => !contact.read).length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Mail className="w-8 h-8 text-brand-gold" />
              Contatos
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie as mensagens enviadas através do formulário de contato
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              Total: {contacts.length}
            </Badge>
            {unreadCount > 0 && (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-sm">
                Não lidas: {unreadCount}
              </Badge>
            )}
          </div>
        </div>

        {/* Contacts List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-gold" />
              Mensagens Recebidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando contatos...</p>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma mensagem encontrada
                </h3>
                <p className="text-gray-600">
                  As mensagens enviadas através do formulário de contato aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div 
                    key={contact.id} 
                    className={`p-4 rounded-lg border transition-colors ${
                      contact.read 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          contact.read ? 'bg-gray-200' : 'bg-blue-200'
                        }`}>
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {contact.name}
                            </span>
                            {!contact.read && (
                              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                Nova
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{contact.email}</p>
                          <p className="text-xs text-gray-500">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {formatDate(contact.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedContact(contact)}
                          className="text-brand-gold border-brand-gold hover:bg-brand-gold hover:text-white"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Detalhes
                        </Button>
                        <Button
                          variant={contact.read ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleReadStatus(contact.id, contact.read)}
                          disabled={updating === contact.id}
                          className={contact.read 
                            ? "text-orange-600 border-orange-300 hover:bg-orange-50" 
                            : "bg-green-600 hover:bg-green-700 text-white"
                          }
                        >
                          {updating === contact.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                          ) : contact.read ? (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Marcar como não lida
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Marcar como lida
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Details Modal */}
        <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white z-[100]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-gold" />
                Detalhes da Mensagem
              </DialogTitle>
            </DialogHeader>
            {selectedContact && (
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Nome
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {selectedContact.name}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {selectedContact.email}
                    </p>
                  </div>
                  {selectedContact.phone && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        Telefone
                      </label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                        {selectedContact.phone}
                      </p>
                    </div>
                  )}
                  {selectedContact.company && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        Empresa
                      </label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                        {selectedContact.company}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    Mensagem
                  </label>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Recebida em {formatDate(selectedContact.created_at)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedContact.read ? "default" : "secondary"}>
                      {selectedContact.read ? "Lida" : "Não lida"}
                    </Badge>
                    <Button
                      variant={selectedContact.read ? "outline" : "default"}
                      size="sm"
                      onClick={() => {
                        toggleReadStatus(selectedContact.id, selectedContact.read);
                      }}
                      disabled={updating === selectedContact.id}
                      className={selectedContact.read 
                        ? "text-orange-600 border-orange-300 hover:bg-orange-50" 
                        : "bg-green-600 hover:bg-green-700 text-white"
                      }
                    >
                      {updating === selectedContact.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                      ) : selectedContact.read ? (
                        "Marcar como não lida"
                      ) : (
                        "Marcar como lida"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminContacts;
