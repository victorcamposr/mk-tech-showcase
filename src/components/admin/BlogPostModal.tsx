
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Plus, Save, Eye, X } from 'lucide-react';

interface BlogPostData {
  title: string;
  content: string;
  status: 'draft' | 'published';
  excerpt: string;
  meta_title: string;
  meta_description: string;
  tags: string;
  featured_image: string;
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
  const { toast } = useToast();
  
  const form = useForm<BlogPostData>({
    defaultValues: {
      title: '',
      content: '',
      status: 'draft',
      excerpt: '',
      meta_title: '',
      meta_description: '',
      tags: '',
      featured_image: '',
    },
  });

  // Reset form when post changes or modal opens
  useEffect(() => {
    if (isOpen && post) {
      console.log('Setting form values for post:', post);
      form.reset({
        title: post?.title || '',
        content: post?.content || '',
        status: post?.status || 'draft',
        excerpt: post?.excerpt || '',
        meta_title: post?.meta_title || '',
        meta_description: post?.meta_description || '',
        tags: post?.tags?.join(', ') || '',
        featured_image: post?.featured_image || '',
      });
    } else if (isOpen && !post) {
      form.reset({
        title: '',
        content: '',
        status: 'draft',
        excerpt: '',
        meta_title: '',
        meta_description: '',
        tags: '',
        featured_image: '',
      });
    }
  }, [isOpen, post, form]);

  const onSubmit = async (data: BlogPostData) => {
    if (mode === 'view') return;
    
    setLoading(true);
    console.log('Submitting blog post data:', data);
    
    try {
      const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      
      if (mode === 'create') {
        const { data: result, error } = await supabase
          .from('blog_posts')
          .insert([{
            title: data.title,
            content: data.content,
            status: data.status,
            excerpt: data.excerpt || null,
            meta_title: data.meta_title || null,
            meta_description: data.meta_description || null,
            tags: tagsArray,
            featured_image: data.featured_image || null,
            author_id: 'temp-author-id', // Temporário - em produção seria do usuário logado
            slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            published_at: data.status === 'published' ? new Date().toISOString() : null,
          }]);

        console.log('Insert result:', result, 'Error:', error);
        if (error) throw error;
        
        toast({
          title: "Post criado com sucesso!",
          description: "O novo artigo foi adicionado ao blog.",
        });
      } else {
        const { data: result, error } = await supabase
          .from('blog_posts')
          .update({
            title: data.title,
            content: data.content,
            status: data.status,
            excerpt: data.excerpt || null,
            meta_title: data.meta_title || null,
            meta_description: data.meta_description || null,
            tags: tagsArray,
            featured_image: data.featured_image || null,
            slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            published_at: data.status === 'published' ? new Date().toISOString() : null,
          })
          .eq('id', post.id);

        console.log('Update result:', result, 'Error:', error);
        if (error) throw error;
        
        toast({
          title: "Post atualizado com sucesso!",
          description: "As alterações foram salvas.",
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar post",
        description: error.message || "Tente novamente em alguns instantes.",
      });
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-gold" />
            {mode === 'create' ? 'Novo Post' : mode === 'edit' ? 'Editar Post' : 'Visualizar Post'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input placeholder="Título do post" {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Conteúdo do post" 
                      className="min-h-[200px]" 
                      {...field} 
                      disabled={isReadOnly}
                    />
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
                      placeholder="Breve resumo do post" 
                      className="min-h-[80px]" 
                      {...field} 
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="meta_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Título (SEO)</FormLabel>
                    <FormControl>
                      <Input placeholder="Título para SEO" {...field} disabled={isReadOnly} />
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
                      <Input placeholder="https://exemplo.com/imagem.jpg" {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="meta_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Descrição (SEO)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição para motores de busca" 
                      className="min-h-[80px]" 
                      {...field} 
                      disabled={isReadOnly}
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
                    <Input placeholder="tecnologia, inovação, negócios" {...field} disabled={isReadOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isReadOnly && (
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancelar
                </Button>
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
                      {mode === 'create' ? 'Criar Post' : 'Salvar Alterações'}
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostModal;
