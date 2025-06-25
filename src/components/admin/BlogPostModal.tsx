
import { useState } from 'react';
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
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Plus, Save, Upload } from 'lucide-react';

interface BlogPostData {
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published';
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
      title: post?.title || '',
      content: post?.content || '',
      excerpt: post?.excerpt || '',
      status: post?.status || 'draft',
      meta_title: post?.meta_title || '',
      meta_description: post?.meta_description || '',
      tags: post?.tags?.join(', ') || '',
      featured_image: post?.featured_image || '',
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const onSubmit = async (data: BlogPostData) => {
    if (mode === 'view') return;
    
    setLoading(true);
    try {
      const slug = generateSlug(data.title);
      const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      if (mode === 'create') {
        const { error } = await supabase
          .from('blog_posts')
          .insert([{
            title: data.title,
            content: data.content,
            excerpt: data.excerpt,
            status: data.status,
            slug: slug,
            meta_title: data.meta_title,
            meta_description: data.meta_description,
            tags: tagsArray,
            featured_image: data.featured_image,
            author_id: crypto.randomUUID(), // Temporary - would be current user
            published_at: data.status === 'published' ? new Date().toISOString() : null,
          }]);

        if (error) throw error;
        
        toast({
          title: "Post criado com sucesso!",
          description: `O post foi ${data.status === 'published' ? 'publicado' : 'salvo como rascunho'}.`,
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: data.title,
            content: data.content,
            excerpt: data.excerpt,
            status: data.status,
            slug: slug,
            meta_title: data.meta_title,
            meta_description: data.meta_description,
            tags: tagsArray,
            featured_image: data.featured_image,
            published_at: data.status === 'published' && !post.published_at ? new Date().toISOString() : post.published_at,
          })
          .eq('id', post.id);

        if (error) throw error;
        
        toast({
          title: "Post atualizado com sucesso!",
          description: "As alterações foram salvas.",
        });
      }

      onSuccess();
      onClose();
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar post",
        description: "Tente novamente em alguns instantes.",
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
                      <Input placeholder="Digite o título do post" {...field} disabled={isReadOnly} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
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
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumo</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Breve descrição do post (aparece nos cards)" 
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Escreva o conteúdo completo do post..." 
                      className="min-h-[200px]" 
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
                name="featured_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem Destacada (URL)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://exemplo.com/imagem.jpg" 
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
                      <Input 
                        placeholder="tecnologia, desenvolvimento, web" 
                        {...field} 
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">SEO</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="meta_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Título</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Título para mecanismos de busca" 
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
                  name="meta_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Descrição</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Descrição para mecanismos de busca" 
                          {...field} 
                          disabled={isReadOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

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
