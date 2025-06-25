
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { X, Plus } from 'lucide-react';

interface BlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: any;
  onSuccess: () => void;
  mode: 'create' | 'edit' | 'view';
}

const BlogPostModal = ({ isOpen, onClose, post, onSuccess, mode }: BlogPostModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    status: 'draft' as 'draft' | 'published',
    tags: [] as string[],
    featured_image: '',
    meta_description: '',
    slug: '',
  });

  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { adminProfile } = useAuth();

  useEffect(() => {
    if (isOpen) {
      if (post && mode !== 'create') {
        setFormData({
          title: post.title || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          status: post.status || 'draft',
          tags: post.tags || [],
          featured_image: post.featured_image || '',
          meta_description: post.meta_description || '',
          slug: post.slug || '',
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, post, mode]);

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      status: 'draft',
      tags: [],
      featured_image: '',
      meta_description: '',
      slug: '',
    });
    setNewTag('');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from title
    if (field === 'title' && mode === 'create') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha pelo menos o título e o conteúdo.",
        variant: "destructive",
      });
      return;
    }

    if (!adminProfile?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Não foi possível identificar o usuário administrador.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        title: formData.title.trim(),
        content: formData.content.trim(),
        slug: formData.slug.trim() || formData.title.toLowerCase().replace(/\s+/g, '-'),
        author_id: adminProfile.id, // Use the admin profile ID instead of temp-author
      };

      if (mode === 'create') {
        const { error } = await supabase
          .from('blog_posts')
          .insert([dataToSave]);

        if (error) {
          console.error('Database error:', error);
          toast({
            title: "Erro ao criar post",
            description: error.message || "Não foi possível criar o post.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Post criado",
          description: "O post foi criado com sucesso.",
        });
      } else if (mode === 'edit') {
        const { error } = await supabase
          .from('blog_posts')
          .update(dataToSave)
          .eq('id', post.id);

        if (error) {
          console.error('Database error:', error);
          toast({
            title: "Erro ao atualizar post",
            description: error.message || "Não foi possível atualizar o post.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Post atualizado",
          description: "O post foi atualizado com sucesso.",
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({
        title: "Erro inesperado",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canEdit = mode === 'create' || mode === 'edit';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-0 shadow-2xl">
        <DialogHeader className="border-b border-gray-200 pb-4 mb-6">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {mode === 'create' && 'Novo Post'}
            {mode === 'edit' && 'Editar Post'}
            {mode === 'view' && 'Visualizar Post'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {mode === 'create' && 'Crie um novo post para o blog'}
            {mode === 'edit' && 'Edite as informações do post'}
            {mode === 'view' && 'Visualize os detalhes do post'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Título *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={!canEdit}
                  className="mt-1"
                  placeholder="Digite o título do post"
                />
              </div>

              <div>
                <Label htmlFor="slug" className="text-sm font-medium text-gray-700">
                  Slug
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  disabled={!canEdit}
                  className="mt-1"
                  placeholder="url-amigavel-do-post"
                />
              </div>

              <div>
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                  disabled={!canEdit}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="featured_image" className="text-sm font-medium text-gray-700">
                  Imagem Destacada
                </Label>
                <Input
                  id="featured_image"
                  value={formData.featured_image}
                  onChange={(e) => handleInputChange('featured_image', e.target.value)}
                  disabled={!canEdit}
                  className="mt-1"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Tags</Label>
                {canEdit && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Nova tag"
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTag}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                      {canEdit && (
                        <button
                          onClick={() => removeTag(index)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700">
              Resumo
            </Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              disabled={!canEdit}
              className="mt-1"
              rows={3}
              placeholder="Breve descrição do post"
            />
          </div>

          <div>
            <Label htmlFor="content" className="text-sm font-medium text-gray-700">
              Conteúdo *
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              disabled={!canEdit}
              className="mt-1"
              rows={12}
              placeholder="Escreva o conteúdo completo do post aqui..."
            />
          </div>

          <div>
            <Label htmlFor="meta_description" className="text-sm font-medium text-gray-700">
              Meta Descrição
            </Label>
            <Textarea
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => handleInputChange('meta_description', e.target.value)}
              disabled={!canEdit}
              className="mt-1"
              rows={2}
              placeholder="Descrição para SEO (máx. 160 caracteres)"
              maxLength={160}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
          <Button
            variant="outline"
            onClick={onClose}
          >
            {mode === 'view' ? 'Fechar' : 'Cancelar'}
          </Button>
          {canEdit && (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Salvando...' : (mode === 'create' ? 'Criar Post' : 'Salvar Alterações')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostModal;
