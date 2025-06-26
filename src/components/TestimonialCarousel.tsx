
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const TestimonialCarousel = ({ testimonials }: TestimonialCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Depoimentos padrão caso não sejam fornecidos
  const defaultTestimonials = [
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
      content: "Implementaram nosso sistema de autopeças com catálogo completo. A busca por compatibilidade de peças ficou automática.",
      author: "Carlos Oliveira",
      company: "Auto Peças Rondon", 
      rating: 5
    }
  ];

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === displayTestimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [displayTestimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? displayTestimonials.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === displayTestimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-brand-gold fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-brand-gold/20">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {renderStars(displayTestimonials[currentIndex].rating)}
          </div>
          <blockquote className="text-lg text-gray-700 mb-6 italic">
            "{displayTestimonials[currentIndex].content}"
          </blockquote>
          <div className="border-t border-brand-gold/20 pt-6">
            <cite className="not-italic">
              <div className="font-semibold text-brand-black">
                {displayTestimonials[currentIndex].author}
              </div>
              <div className="text-brand-gold font-medium">
                {displayTestimonials[currentIndex].company}
              </div>
            </cite>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <Button
        variant="outline"
        size="sm"
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10 rounded-full w-10 h-10 p-0"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={goToNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10 rounded-full w-10 h-10 p-0"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Dots indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {displayTestimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-brand-gold' : 'bg-gray-300 hover:bg-brand-gold/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
