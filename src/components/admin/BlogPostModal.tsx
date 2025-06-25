
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Plus, Save, Eye, Trash2 } from 'lucide-react';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface BlogPostData {
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  meta_title: string;
  meta_description: string;
  tags: string;
}

interface BlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  post?: any;
  mode: 'create' | 'edit' | 'view';
}

const BlogPostModal = ({ isOpen, onClose, onSuccess, post, mode }: BlogPostModalProps) => {
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<BlogPostData>({
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      featured_image: '',
      meta_title: '',
      meta_description: '',
      tags: '',
    },
  });

  const isViewMode = mode === 'view';
  const isCreateMode = mode === 'create';

  // Função para registrar atividades
  const logActivity = async (actionType: string, entityTitle: string, entityId?: string) => {
    try {
      await supabase
        .from('admin_activities')
        .insert([{
          action_type: actionType,
          entity_type: 'blog_post',
          entity_id: entityId,
          entity_title: entityTitle,
          user_name: 'Admin',
        }]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  // Função para gerar slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Reset form when post changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (post) {
        form.reset({
          title: post.title || '',
          content: post.content || '',
          excerpt: post.excerpt || '',
          featured_image: post.featured_image || '',
          meta_title: post.meta_title || '',
          meta_description: post.meta_description || '',
          tags: post.tags ? post.tags.join(', ') : '',
        });
      } else {
        form.reset({
          title: '',
          content: '',
          excerpt: '',
          featured_image: '',
          meta_title: '',
          meta_description: '',
          tags: '',
        });
      }
    }
  }, [isOpen, post, form]);

  const handleDelete = async () => {
    if (!post) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;

      // Registrar atividade
      await logActivity('delete', post.title, post.id);
      
      toast({
        title: "Post excluído com sucesso!",
        description: `"${post.title}" foi removido do blog.`,
      });

      onSuccess();
      onClose();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir post",
        description: error.message || "Tente novamente em alguns instantes.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: BlogPostData) => {
    if (isViewMode) return;
    
    setLoading(true);
    
    try {
      const slug = generateSlug(data.title);
      const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

      const postData = {
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt,
        featured_image: data.featured_image || null,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
        tags: tagsArray,
        status: 'draft', // Padrão como rascunho
      };

      if (mode === 'create') {
        const { data: result, error } = await supabase
          .from('blog_posts')
          .insert([{
            ...postData,
            author_id: 'temp-author', // TODO: Usar ID do usuário logado
          }])
          .select()
          .single();

        if (error) throw error;

        // Registrar atividade
        await logActivity('create', data.title, result.id);
        
        toast({
          title: "Post criado com sucesso!",
          description: `"${data.title}" foi adicionado como rascunho.`,
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id);

        if (error) throw error;

        // Registrar atividade
        await logActivity('update', data.title, post.id);
        
        toast({
          title: "Post atualizado com sucesso!",
          description: "As alterações foram salvas.",
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar post",
        description: error.message || "Tente novamente em alguns instantes.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Novo Post';
      case 'edit': return 'Editar Post';
      case 'view': return 'Visualizar Post';
      default: return 'Post';
    }
  };

  const getModalIcon = () => {
    switch (mode) {
      case 'view': return <Eye className="w-5 h-5 text-brand-gold" />;
      default: return <FileText className="w-5 h-5 text-brand-gold" />;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getModalIcon()}
              {getModalTitle()}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título do post" {...field} disabled={isViewMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resumo</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Breve descrição do post..."
                        rows={2}
                        {...field} 
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Conteúdo completo do post..."
                        rows={8}
                        {...field} 
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem Destacada (URL)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://exemplo.com/imagem.jpg"
                        {...field} 
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (separadas por vírgula)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="tecnologia, inovação, negócios"
                        {...field} 
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="meta_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Título (SEO)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Título para SEO"
                          {...field} 
                          disabled={isViewMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meta_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Descrição (SEO)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Descrição para SEO"
                          {...field} 
                          disabled={isViewMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  {isViewMode ? 'Fechar' : 'Cancelar'}
                </Button>
                {!isViewMode && (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-black" />
                    ) : (
                      <>
                        {mode === 'create' ? <Plus className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        {mode === 'create' ? 'Criar' : 'Salvar'}
                      </>
                    )}
                  </Button>
                )}
                {mode === 'edit' && post && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={loading}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Post"
        description={`Tem certeza que deseja excluir o post "${post?.title}"? Esta ação não pode ser desfeita.`}
        loading={loading}
      />
    </>
  );
};

export default BlogPostModal;
