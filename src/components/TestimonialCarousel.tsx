
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  id: string;
  content: string;
  author: string;
  company: string;
  rating: number;
}

interface TestimonialCarouselProps {
  testimonials?: Testimonial[];
}

const TestimonialCarousel = ({ testimonials = [] }: TestimonialCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Fallback para depoimentos estáticos se não houver dados do banco
  const defaultTestimonials: Testimonial[] = [
    {
      id: '1',
      content: "A MK Tecnologia transformou nosso negócio. O sistema é intuitivo e o suporte excepcional.",
      author: "João Silva",
      company: "Supermercado Central",
      rating: 5
    },
    {
      id: '2',
      content: "Sistema perfeito para moda. O controle de grades e relatórios são fantásticos.",
      author: "Maria Santos",
      company: "Loja Fashion Style",
      rating: 5
    },
    {
      id: '3',
      content: "Implementaram nosso sistema de autopeças com catálogo completo. A busca por compatibilidade de peças ficou automática e nossos vendedores são muito mais produtivos.",
      author: "Carlos Oliveira",
      company: "Auto Peças Rondon",
      rating: 5
    },
    {
      id: '4',
      content: "O sistema para nossa distribuidora é perfeito. Controle de rotas, app para entregadores e gestão completa. Aumentamos nossa produtividade em 60%.",
      author: "Roberto Lima",
      company: "Distribuidora Água Cristal",
      rating: 5
    },
    {
      id: '5',
      content: "Excelente solução para nossa padaria. O controle de produção e validades facilitou muito nosso trabalho diário.",
      author: "Ana Costa",
      company: "Padaria Doce Vida",
      rating: 5
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('testimonials-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible || displayTestimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayTestimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible, displayTestimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (displayTestimonials.length === 0) {
    return <div>Nenhum depoimento disponível</div>;
  }

  return (
    <div id="testimonials-section" className="relative max-w-6xl mx-auto">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <Card className="border-brand-gold/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-brand-gold text-xl group-hover:animate-pulse">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic group-hover:text-gray-700 transition-colors">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-brand-black group-hover:text-brand-gold transition-colors">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-8 space-x-2">
        {displayTestimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
              index === currentIndex ? 'bg-brand-gold' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Ir para depoimento ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
