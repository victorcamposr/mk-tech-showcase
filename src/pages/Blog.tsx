
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  tags: string[];
  published_at: string;
  author_id: string;
  admin_profiles: {
    name: string;
  };
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          admin_profiles!inner(name)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-black via-brand-black-light to-brand-black">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="text-center text-white">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
            <p className="mt-4">Carregando posts...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-black via-brand-black-light to-brand-black">
      <SEO 
        title="Blog - MK Tecnologia"
        description="Acompanhe as últimas novidades em tecnologia, dicas e insights sobre soluções para seu negócio."
      />
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Blog <span className="text-brand-gold">MK Tecnologia</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Acompanhe as últimas novidades em tecnologia, dicas e insights 
            para impulsionar seu negócio com nossas soluções inovadoras.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-white mb-4">Em breve!</h3>
            <p className="text-gray-300">
              Estamos preparando conteúdos incríveis para você. Volte em breve!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card 
                key={post.id}
                className="bg-white/10 backdrop-blur-xl border-brand-gold/30 hover:border-brand-gold/50 transition-all duration-300 hover:scale-105 group"
              >
                {post.featured_image && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src={post.featured_image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(post.published_at), 'dd/MM/yyyy', { locale: ptBR })}
                    <span className="mx-2">•</span>
                    <User className="w-4 h-4" />
                    {post.admin_profiles.name}
                  </div>
                  
                  <CardTitle className="text-xl text-white group-hover:text-brand-gold transition-colors duration-300">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary"
                          className="bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light transition-colors duration-300 font-medium"
                  >
                    Ler mais
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
