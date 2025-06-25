
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
import { PenTool, Plus, Save, X } from 'lucide-react';

interface BlogPostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  status: 'draft' | 'published' | 'archived';
  tags: string;
  meta_title: string;
  meta_description: string;
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
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();
  
  const form = useForm<BlogPostData>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      status: 'draft',
      tags: '',
      meta_title: '',
      meta_description: '',
    },
  });

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
          user_name: 'Admin', // Temporário - em produção seria do perfil do usuário
        }]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  // Reset form when post changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (post) {
        console.log('Setting form values for post:', post);
        const postTags = Array.isArray(post.tags) ? post.tags : [];
        setTags(postTags);
        
        form.reset({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          featured_image: post.featured_image || '',
          status: post.status || 'draft',
          tags: postTags.join(', '),
          meta_title: post.meta_title || '',
          meta_description: post.meta_description || '',
        });
      } else {
        setTags([]);
        setTagInput('');
        form.reset({
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          featured_image: '',
          status: 'draft',
          tags: '',
          meta_title: '',
          meta_description: '',
        });
      }
    }
  }, [isOpen, post, form]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    form.setValue('title', title);
    if (!post) {
      const slug = generateSlug(title);
      form.setValue('slug', slug);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue('tags', newTags.join(', '));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue('tags', newTags.join(', '));
  };

  const onSubmit = async (data: BlogPostData) => {
    if (mode === 'view') return;
    
    setLoading(true);
    console.log('Submitting blog post data:', data);
    
    try {
      const publishedAt = data.status === 'published' ? new Date().toISOString() : null;
      
      if (mode === 'create') {
        const { data: result, error } = await supabase
          .from('blog_posts')
          .insert([{
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            featured_image: data.featured_image || null,
            status: data.status,
            tags: tags,
            meta_title: data.meta_title || null,
            meta_description: data.meta_description || null,
            published_at: publishedAt,
            author_id: null, // Não usar foreign key constraint
          }])
          .select()
          .single();

        console.log('Insert result:', result, 'Error:', error);
        if (error) throw error;
        
        // Registrar atividade
        await logActivity('create', data.title, result.id);
        
        toast({
          title: "Post criado com sucesso!",
          description: "O novo post foi adicionado ao blog.",
        });
      } else {
        const { data: result, error } = await supabase
          .from('blog_posts')
          .update({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            featured_image: data.featured_image || null,
            status: data.status,
            tags: tags,
            meta_title: data.meta_title || null,
            meta_description: data.meta_description || null,
            published_at: data.status === 'published' && !post.published_at ? new Date().toISOString() : post.published_at,
          })
          .eq('id', post.id)
          .select()
          .single();

        console.log('Update result:', result, 'Error:', error);
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-brand-gold" />
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
                      <Input 
                        placeholder="Título do post" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          handleTitleChange(e.target.value);
                        }}
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <FormControl>
                      <Input placeholder="slug-do-post" {...field} disabled={isReadOnly} />
                    </FormControl>
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
                      placeholder="Breve descrição do post" 
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
                      placeholder="Conteúdo completo do post" 
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
                        <SelectItem value="archived">Arquivado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <FormLabel>Tags</FormLabel>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Digite uma tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  disabled={isReadOnly}
                />
                {!isReadOnly && (
                  <Button type="button" onClick={addTag} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    {!isReadOnly && (
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">SEO</h3>
              <FormField
                control={form.control}
                name="meta_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título para SEO" {...field} disabled={isReadOnly} />
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
                      <Textarea 
                        placeholder="Descrição para SEO" 
                        className="min-h-[80px]" 
                        {...field} 
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
