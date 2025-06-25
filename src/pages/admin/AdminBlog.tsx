import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BlogPostModal from '@/components/admin/BlogPostModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  FileText,
  Filter,
  RefreshCw,
  Calendar
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  status: 'published' | 'draft';
  tags: string[];
  author_id: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, statusFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Type assertion to ensure proper typing
      const typedPosts = (data || []).map(post => ({
        ...post,
        status: post.status as 'published' | 'draft'
      })) as BlogPost[];

      setPosts(typedPosts);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Erro ao carregar posts",
        description: error.message || "Não foi possível carregar os posts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (actionType: string, entityTitle: string, entityId: string) => {
    try {
      // Get current user profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('admin_profiles')
        .select('name')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        await supabase
          .from('admin_activities')
          .insert({
            action_type: actionType,
            entity_type: 'blog_posts',
            entity_title: entityTitle,
            entity_id: entityId,
            user_name: profile.name
          });
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    setFilteredPosts(filtered);
  };

  const handleCreate = () => {
    setSelectedPost(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleView = (post: BlogPost) => {
    setSelectedPost(post);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDelete = (post: BlogPost) => {
    setSelectedPost(post);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPost) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', selectedPost.id);

      if (error) {
        throw error;
      }

      // Log delete activity
      await logActivity('delete', selectedPost.title, selectedPost.id);

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
      setSelectedPost(null);
    }
  };

  const handleModalSuccess = async (postData?: any, isNew?: boolean) => {
    if (postData && postData.title) {
      const actionType = isNew ? 'create' : 'update';
      await logActivity(actionType, postData.title, postData.id || 'new');
    }
    fetchPosts();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-brand-gold" />
              Gerenciar Blog
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie os posts do blog
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={fetchPosts}
              variant="outline"
              size="sm"
              className="shadow-md hover:shadow-lg transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Post
            </Button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
              />
            </div>
          </div>
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {posts.filter(p => p.status === 'published').length}
                </div>
                <div className="text-sm text-gray-600">Publicados</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {posts.filter(p => p.status === 'draft').length}
                </div>
                <div className="text-sm text-gray-600">Rascunhos</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-brand-gold" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' 
                  ? 'bg-brand-gold hover:bg-brand-gold-dark text-white shadow-md' 
                  : 'shadow-md hover:shadow-lg transition-all duration-200'
                }
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === 'published' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('published')}
                className={statusFilter === 'published' 
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' 
                  : 'shadow-md hover:shadow-lg transition-all duration-200'
                }
              >
                Publicados
              </Button>
              <Button
                variant={statusFilter === 'draft' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('draft')}
                className={statusFilter === 'draft' 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-md' 
                  : 'shadow-md hover:shadow-lg transition-all duration-200'
                }
              >
                Rascunhos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-gold" />
                Posts do Blog
              </span>
              <Badge variant="outline" className="bg-brand-gold/10 text-brand-gold border-brand-gold/30">
                {filteredPosts.length} posts
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto"></div>
                  <p className="mt-4 text-gray-600">Carregando posts...</p>
                </div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'Nenhum post encontrado' : 'Nenhum post cadastrado'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros para encontrar o que procura.'
                    : 'Comece criando seu primeiro post.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button 
                    onClick={handleCreate} 
                    className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-white font-semibold shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Post
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border-l-4 border-brand-gold"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                          <FileText className="w-6 h-6 text-brand-gold" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                          <span className="text-xs text-gray-500 font-mono bg-brand-gold/10 px-2 py-1 rounded mt-1 inline-block">
                            {post.slug}
                          </span>
                        </div>
                      </div>
                      <Badge 
                        variant={post.status === 'published' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-purple-200 text-purple-700 bg-purple-50">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs border-brand-gold/30 text-brand-gold bg-brand-gold/10">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.created_at)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleView(post)}
                          className="shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(post)}
                          className="shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(post)}
                          className="shadow-md hover:shadow-lg transition-all duration-200"
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
      </div>

      <BlogPostModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
        onSuccess={handleModalSuccess}
        mode={modalMode}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedPost(null);
        }}
        onConfirm={confirmDelete}
        title="Excluir Post"
        description={
          selectedPost 
            ? `Tem certeza que deseja excluir o post "${selectedPost.title}"? Esta ação não pode ser desfeita.`
            : ''
        }
      />
    </AdminLayout>
  );
};

export default AdminBlog;
