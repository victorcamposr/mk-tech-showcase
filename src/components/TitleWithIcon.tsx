import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TitleWithIconProps {
  children: React.ReactNode;
  className?: string;
}

const TitleWithIcon = ({ children, className }: TitleWithIconProps) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
        "bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-200/50",
        "shadow-sm shadow-amber-200/30",
        "group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-md group-hover:shadow-amber-300/40",
        "transition-all duration-300 ease-out",
        "group-hover:bg-gradient-to-br group-hover:from-amber-200 group-hover:to-amber-300"
      )}>
        <Check className="w-4 h-4 text-amber-700 group-hover:text-amber-800 transition-colors duration-300" strokeWidth={2.5} />
      </div>
      <span className="group-hover:text-brand-gold transition-colors duration-300">
        {children}
      </span>
    </div>
  );
};

export default TitleWithIcon;