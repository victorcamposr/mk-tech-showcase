
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  tags: string[];
  published_at: string;
  author_id: string;
  author_name: string;
  meta_title?: string;
  meta_description?: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      console.log('Fetching blog post with slug:', slug);
      
      try {
        // Buscar post pelo slug
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (postError || !postData) {
          console.error('Error fetching blog post:', postError);
          setNotFound(true);
          setLoading(false);
          return;
        }

        console.log('Found post:', postData);

        // Buscar autor
        let authorName = 'MK Tecnologia'; // Nome padrão
        
        if (postData.author_id) {
          console.log('Looking for author with ID:', postData.author_id);
          
          // Tentar buscar pelo user_id primeiro
          const { data: authorByUserId } = await supabase
            .from('admin_profiles')
            .select('name')
            .eq('user_id', postData.author_id)
            .maybeSingle();
          
          if (authorByUserId) {
            authorName = authorByUserId.name;
            console.log('Found author by user_id:', authorName);
          } else {
            // Se não encontrar pelo user_id, tentar pelo id direto
            const { data: authorById } = await supabase
              .from('admin_profiles')
              .select('name')
              .eq('id', postData.author_id)
              .maybeSingle();
            
            if (authorById) {
              authorName = authorById.name;
              console.log('Found author by id:', authorName);
            } else {
              console.log('No author found for ID:', postData.author_id);
            }
          }
        }

        const postWithAuthor: BlogPost = {
          id: postData.id,
          title: postData.title,
          slug: postData.slug,
          content: postData.content,
          excerpt: postData.excerpt || '',
          featured_image: postData.featured_image || '',
          tags: postData.tags || [],
          published_at: postData.published_at || postData.created_at,
          author_id: postData.author_id || '',
          author_name: authorName,
          meta_title: postData.meta_title,
          meta_description: postData.meta_description
        };

        console.log('Post with author:', postWithAuthor);
        setPost(postWithAuthor);
      } catch (error) {
        console.error('Error in fetchPost:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="text-center text-gray-600">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
            <p className="mt-4">Carregando post...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Post não encontrado</h1>
            <p className="text-gray-600 mb-8">O post que você está procurando não existe ou foi removido.</p>
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light transition-colors duration-300 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light transition-colors duration-300 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog
          </Link>
        </div>

        <article className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8">
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* Post Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.published_at), 'dd/MM/yyyy', { locale: ptBR })}
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author_name}
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-brand-gold pl-6 italic">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
            />
          </div>

          {/* Post Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-sm text-gray-500">
                Publicado em {format(new Date(post.published_at), 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
              </div>
              
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light transition-colors duration-300 font-medium"
              >
                Ver mais posts
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </footer>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
