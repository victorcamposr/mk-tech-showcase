
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string | null;
    email: string;
  };
}

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando posts...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Blog - MK Tecnologia"
        description="Fique por dentro das últimas novidades, dicas e tendências em automação comercial e tecnologia empresarial."
        keywords="blog tecnologia, automação comercial, dicas empresariais, inovação, MK Tecnologia"
      />
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <ScrollReveal animation="fade-in">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-6">
                Nosso <span className="text-brand-gold">Blog</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Fique por dentro das últimas novidades, dicas e tendências em automação comercial e tecnologia empresarial
              </p>
            </div>
          </ScrollReveal>

          {/* Posts Grid */}
          {posts && posts.length > 0 ? (
            <ScrollReveal animation="fade-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Card key={post.id} className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm overflow-hidden cursor-pointer">
                    {post.featured_image && (
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          className="w-full h-full object-cover bg-gray-50 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(post.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.profiles.full_name || 'MK Tecnologia'}
                        </div>
                      </div>
                      
                      <CardTitle className="text-lg font-bold text-brand-black group-hover:text-brand-gold transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 text-sm mb-4 line-clamp-3">
                        {post.excerpt || post.content.substring(0, 150) + '...'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-brand-gold/10 text-brand-black">
                          Tecnologia
                        </Badge>
                        <div className="flex items-center text-brand-gold group-hover:text-brand-gold-dark transition-colors duration-300">
                          <span className="text-sm font-medium mr-2">Ler mais</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal animation="fade-up">
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-brand-gold" />
                </div>
                <h3 className="text-2xl font-bold text-brand-black mb-4">
                  Em breve novos conteúdos!
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Estamos preparando conteúdos exclusivos sobre automação comercial e tecnologia empresarial. 
                  Volte em breve para conferir nossas novidades.
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
