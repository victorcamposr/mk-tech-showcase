import { ScrollReveal } from "@/components/ScrollReveal";

interface SolutionHeroProps {
  title: string;
  subtitle?: string;
  highlight?: string;
}

const SolutionHero = ({ title, subtitle, highlight }: SolutionHeroProps) => {
  return (
    <ScrollReveal animation="fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-6">
          {title}{highlight && <span className="text-brand-gold"> {highlight}</span>}
        </h1>
        {subtitle && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
};

export default SolutionHero;