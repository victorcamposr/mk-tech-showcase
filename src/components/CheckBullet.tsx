import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckBulletProps {
  className?: string;
}

const CheckBullet = ({ className }: CheckBulletProps) => {
  return (
    <div className={cn(
      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5",
      "bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-200/50",
      "shadow-sm shadow-amber-200/30",
      "group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-md group-hover:shadow-amber-300/40",
      "transition-all duration-300 ease-out",
      "group-hover:bg-gradient-to-br group-hover:from-amber-200 group-hover:to-amber-300",
      className
    )}>
      <Check className="w-3 h-3 text-amber-700 group-hover:text-amber-800 transition-colors duration-300" strokeWidth={2.5} />
    </div>
  );
};

export default CheckBullet;