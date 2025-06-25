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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageUpload } from '@/components/ui/image-upload';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  status: z.enum(['draft', 'published']),
  featured_image: z.string().optional(),
  meta_description: z.string().optional(),
  slug: z.string().min(1, 'Slug é obrigatório'),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

interface BlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: any;
  onSuccess: () => void;
  mode: 'create' | 'edit' | 'view';
}

const BlogPostModal = ({ isOpen, onClose, post, onSuccess, mode }: BlogPostModalProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { adminProfile } = useAuth();

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      status: 'draft',
      featured_image: '',
      meta_description: '',
      slug: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (post && mode !== 'create') {
        form.reset({
          title: post.title || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          status: post.status || 'draft',
          featured_image: post.featured_image || '',
          meta_description: post.meta_description || '',
          slug: post.slug || '',
        });
        setTags(post.tags || []);
      } else {
        form.reset({
          title: '',
          excerpt: '',
          content: '',
          status: 'draft',
          featured_image: '',
          meta_description: '',
          slug: '',
        });
        setTags([]);
      }
      setNewTag('');
    }
  }, [isOpen, post, mode, form]);

  const handleTitleChange = (value: string) => {
    form.setValue('title', value);
    
    // Auto-generate slug from title
    if (mode === 'create') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue('slug', slug);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  const logActivity = async (action: string, entityTitle: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('admin_profiles')
        .select('name')
        .eq('user_id', user.id)
        .single();

      await supabase.from('admin_activities').insert({
        action_type: action,
        entity_type: 'blog_posts',
        entity_id: mode === 'edit' ? post?.id : undefined,
        entity_title: entityTitle,
        user_name: profile?.name || 'Admin'
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const onSubmit = async (data: BlogPostFormData) => {
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
        title: data.title,
        content: data.content,
        slug: data.slug,
        excerpt: data.excerpt || '',
        status: data.status,
        featured_image: data.featured_image || '',
        meta_description: data.meta_description || '',
        tags: tags,
        author_id: adminProfile.id,
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

        await logActivity('create', data.title);

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

        await logActivity('update', data.title);

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Título *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleTitleChange(e.target.value);
                          }}
                          disabled={!canEdit}
                          placeholder="Digite o título do post"
                          className={form.formState.errors.title ? 'border-red-500 focus:border-red-500' : ''}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Slug *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!canEdit}
                          placeholder="url-amigavel-do-post"
                          className={form.formState.errors.slug ? 'border-red-500 focus:border-red-500' : ''}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Status
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!canEdit}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="featured_image"
                  render={({ field }) => (
                    <FormItem>
                      <ImageUpload
                        label="Imagem Destacada" 
                        value={field.value}
                        onChange={field.onChange}
                        disabled={!canEdit}
                      />
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <div>
                  <Label className="text-sm font-medium text-gray-700">Tags</Label>
                  {canEdit && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Nova tag"
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
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
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                        {canEdit && (
                          <button
                            type="button"
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

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Resumo
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={!canEdit}
                      rows={3}
                      placeholder="Breve descrição do post"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Conteúdo *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={!canEdit}
                      rows={12}
                      placeholder="Escreva o conteúdo completo do post aqui..."
                      className={form.formState.errors.content ? 'border-red-500 focus:border-red-500' : ''}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meta_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Meta Descrição
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={!canEdit}
                      rows={2}
                      placeholder="Descrição para SEO (máx. 160 caracteres)"
                      maxLength={160}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                {mode === 'view' ? 'Fechar' : 'Cancelar'}
              </Button>
              {canEdit && (
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loading ? 'Salvando...' : (mode === 'create' ? 'Criar Post' : 'Salvar Alterações')}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostModal;
