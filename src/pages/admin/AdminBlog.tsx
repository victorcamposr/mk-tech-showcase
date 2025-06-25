
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogPostModal from '@/components/admin/BlogPostModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit,
  Eye,
  Calendar,
  User,
  TrendingUp
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  status: string; // Changed from 'draft' | 'published' to string
  author_id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  tags: string[] | null;
}

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar posts",
        description: "Não foi possível carregar a lista de posts.",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePostStatus = async (postId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ status: newStatus })
        .eq('id', postId);

      if (error) throw error;

      await fetchPosts();
      toast({
        title: "Status atualizado",
        description: `Post ${newStatus === 'published' ? 'publicado' : 'movido para rascunho'} com sucesso.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do post.",
      });
    }
  };

  const handleNewPost = () => {
    setSelectedPost(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleViewPost = (post: BlogPost) => {
    setSelectedPost(post);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setModalMode('edit');
    setModalOpen(true);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const publishedCount = posts.filter(post => post.status === 'published').length;
  const draftCount = posts.filter(post => post.status === 'draft').length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando posts...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
              Crie e gerencie artigos do blog
            </p>
          </div>
          <Button 
            onClick={handleNewPost}
            className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Post
          </Button>
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
                className="pl-10 bg-white border-gray-300 focus:border-brand-gold focus:ring-brand-gold"
              />
            </div>
          </div>
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
                <div className="text-sm text-gray-600">Publicados</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{draftCount}</div>
                <div className="text-sm text-gray-600">Rascunhos</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-gold" />
              Posts do Blog
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Nenhum post encontrado' : 'Nenhum post criado'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Tente usar outros termos de busca.' 
                    : 'Crie seu primeiro post do blog.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                            {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{truncateContent(post.content)}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Autor: {post.author_id}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewPost(post)}
                          className="shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditPost(post)}
                          className="shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant={post.status === 'published' ? 'destructive' : 'default'}
                          onClick={() => togglePostStatus(post.id, post.status)}
                          className="shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          {post.status === 'published' ? 'Despublicar' : 'Publicar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Blog Post Modal */}
        <BlogPostModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={fetchPosts}
          post={selectedPost}
          mode={modalMode}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
