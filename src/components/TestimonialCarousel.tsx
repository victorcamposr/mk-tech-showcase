import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  id: number;
  content: string;
  author: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    content: "A MK Tecnologia revolucionou nosso controle de estoque. Agora temos relatórios em tempo real e nunca mais perdemos vendas por falta de produtos. O suporte é excepcional!",
    author: "Maria Silva",
    company: "Farmácia São José"
  },
  {
    id: 2,
    content: "O sistema de emissão fiscal automatizada nos poupou horas de trabalho diário. Agora focamos no que realmente importa: nossos clientes.",
    author: "João Santos",
    company: "Supermercado Central"
  },
  {
    id: 3,
    content: "Profissionais competentes e solução completa. Nossa gestão financeira ficou muito mais organizada e conseguimos reduzir custos operacionais significativamente.",
    author: "Ana Costa",
    company: "Loja de Roupas Elegante"
  },
  {
    id: 4,
    content: "Implementaram nosso sistema de autopeças com catálogo completo. A busca por compatibilidade de peças ficou automática e nossos vendedores são muito mais produtivos.",
    author: "Carlos Oliveira",
    company: "Auto Peças Rondon"
  },
  {
    id: 5,
    content: "O sistema para nossa clínica médica é perfeito. Agendamento online, prontuário digital e controle de convênios tudo integrado. Recomendo para qualquer clínica.",
    author: "Dr. Roberto Lima",
    company: "Clínica Médica Bem Estar"
  }
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

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
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div id="testimonials-section" className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <Card className="border-brand-gold/20 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl text-brand-gold mb-4">"</div>
                  <p className="text-lg text-gray-700 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <div>
                      <h4 className="font-semibold text-brand-black">{testimonial.author}</h4>
                      <p className="text-sm text-gray-600">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
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