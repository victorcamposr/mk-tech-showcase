
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

      setPosts(data || []);
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

  const handleModalSuccess = () => {
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-black flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              Blog
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
              className="border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button
              onClick={handleCreate}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Post
            </Button>
          </div>
        </div>

        {/* Filters Card */}
        <Card className="border-brand-gold/20">
          <CardHeader className="pb-3 bg-gradient-to-r from-brand-gold/5 to-brand-gold/10">
            <CardTitle className="text-lg flex items-center gap-2 text-brand-black">
              <Filter className="w-5 h-5 text-brand-gold" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-gold w-4 h-4" />
                  <Input
                    placeholder="Buscar posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-brand-gold/30 focus:border-brand-gold focus:ring-brand-gold/20"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                  className={statusFilter === 'all' ? 'bg-brand-gold hover:bg-brand-gold-dark text-brand-black' : 'border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10'}
                >
                  Todos
                </Button>
                <Button
                  variant={statusFilter === 'published' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('published')}
                  className={statusFilter === 'published' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-green-300 text-green-600 hover:bg-green-50'}
                >
                  Publicados
                </Button>
                <Button
                  variant={statusFilter === 'draft' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('draft')}
                  className={statusFilter === 'draft' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'border-yellow-300 text-yellow-600 hover:bg-yellow-50'}
                >
                  Rascunhos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Table */}
        <Card className="border-brand-gold/20">
          <CardHeader className="pb-3 bg-gradient-to-r from-brand-gold/5 to-brand-gold/10">
            <CardTitle className="text-lg flex items-center justify-between text-brand-black">
              <span>Posts do Blog</span>
              <Badge variant="outline" className="bg-brand-gold/10 text-brand-gold border-brand-gold/30">{filteredPosts.length} posts</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold mx-auto"></div>
                <p className="mt-2 text-gray-600">Carregando posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-brand-black mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'Nenhum post encontrado' : 'Nenhum post cadastrado'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros para encontrar o que procura.'
                    : 'Comece criando seu primeiro post.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button onClick={handleCreate} size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Post
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="p-4 hover:bg-brand-gold/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-base font-semibold text-brand-black truncate">
                              {post.title}
                            </h3>
                            <Badge 
                              variant={post.status === 'published' ? 'default' : 'secondary'}
                              className={post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                            >
                              {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 font-mono bg-brand-gold/10 px-2 py-1 rounded inline-block mb-1">
                            {post.slug}
                          </p>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                            {post.excerpt}
                          </p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-1">
                              {post.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs border-purple-200 text-purple-700">
                                  {tag}
                                </Badge>
                              ))}
                              {post.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs border-brand-gold/30 text-brand-gold">
                                  +{post.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Criado: {formatDate(post.created_at)}
                            </span>
                            {post.published_at && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Publicado: {formatDate(post.published_at)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(post)}
                          className="border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post)}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(post)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
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
