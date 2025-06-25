
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Plus, Search, Edit, Trash2, Calendar } from 'lucide-react';
import BlogPostModal from '@/components/admin/BlogPostModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published';
  featured_image?: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  meta_description?: string;
  meta_title?: string;
  published_at?: string;
}

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

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
        entity_title: entityTitle,
        user_name: profile?.name || 'Admin'
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Erro ao carregar posts",
        description: "Não foi possível carregar os posts do blog.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (postData: Partial<BlogPost>) => {
    try {
      let result;
      let action;
      let title;

      if (selectedPost) {
        // Editing existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', selectedPost.id);
        
        if (error) throw error;
        action = 'update';
        title = postData.title || selectedPost.title;
      } else {
        // Creating new post
        const { error } = await supabase
          .from('blog_posts')
          .insert(postData);
        
        if (error) throw error;
        action = 'create';
        title = postData.title || 'Novo Post';
      }

      await logActivity(action, title);
      
      toast({
        title: selectedPost ? "Post atualizado" : "Post criado",
        description: selectedPost ? "O post foi atualizado com sucesso." : "O post foi criado com sucesso.",
      });

      fetchPosts();
      setModalOpen(false);
      setSelectedPost(null);
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({
        title: "Erro ao salvar post",
        description: error.message || "Não foi possível salvar o post.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postToDelete.id);

      if (error) throw error;

      await logActivity('delete', postToDelete.title);

      toast({
        title: "Post excluído",
        description: "O post foi excluído com sucesso.",
      });

      fetchPosts();
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast({
        title: "Erro ao excluir post",
        description: error.message || "Não foi possível excluir o post.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-black flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              Gerenciar Blog
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie os posts do seu blog
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedPost(null);
              setModalOpen(true);
            }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Post
          </Button>
        </div>

        {/* Search */}
        <Card className="shadow-lg border-purple-500/20">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
              <Input
                placeholder="Buscar por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <Card className="shadow-lg border-purple-500/20">
          <CardHeader className="bg-gradient-to-r from-purple-500/5 to-purple-600/10 border-b border-purple-500/20">
            <CardTitle className="flex items-center gap-3 text-brand-black">
              <FileText className="w-5 h-5 text-purple-500" />
              Posts do Blog
              <Badge variant="outline" className="ml-auto bg-purple-500/10 text-purple-600 border-purple-500/30">
                {filteredPosts.length} posts
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'Nenhum post encontrado' : 'Nenhum post cadastrado'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="p-6 hover:bg-purple-500/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-brand-black truncate">
                            {post.title}
                          </h3>
                          <Badge
                            variant={post.status === 'published' ? 'default' : 'secondary'}
                            className={post.status === 'published' 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-gray-100 text-gray-800 border-gray-200'
                            }
                          >
                            {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.created_at)}
                          </span>
                        </div>
                        {post.excerpt && (
                          <p className="text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPost(post);
                            setModalOpen(true);
                          }}
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPostToDelete(post);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <BlogPostModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          post={selectedPost}
          onSuccess={fetchPosts}
          mode={selectedPost ? 'edit' : 'create'}
        />

        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          title="Excluir Post"
          description={`Tem certeza que deseja excluir o post "${postToDelete?.title}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
