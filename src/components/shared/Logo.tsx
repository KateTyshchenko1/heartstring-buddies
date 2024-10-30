import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showName?: boolean;
}

const Logo = ({ className, showName = true }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center">
        <span className="text-3xl text-primary">∞</span>
      </div>
      {showName && (
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl">Romantics.ai</span>
          {/* Only show user name if passed as a prop in future updates */}
        </div>
      )}
    </div>
  );
};

export default Logo;