import { Card, CardContent } from "@/components/ui/card";
import ColoredServiceIcon, { getServiceColors } from "@/components/ColoredServiceIcon";
import { ScrollReveal } from "@/components/ScrollReveal";
import { benefits } from "@/data/solutions";

const SolutionBenefits = () => {
  return (
    <ScrollReveal animation="fade-up" delay={100}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        {benefits.map((benefit, index) => {
          const colors = getServiceColors(benefit.iconType);
          return (
            <Card key={index} className={`${colors.border} hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm text-center`}>
              <CardContent className="p-8">
                <div className="flex justify-center mb-4">
                  <ColoredServiceIcon type={benefit.iconType} className="group-hover:animate-pulse" />
                </div>
                <h3 className={`text-lg font-semibold text-brand-black mb-2 ${colors.hoverText} transition-colors duration-300`}>{benefit.title}</h3>
                <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">{benefit.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollReveal>
  );
};

export default SolutionBenefits;