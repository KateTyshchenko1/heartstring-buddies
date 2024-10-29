import { Infinity } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Infinity className="w-6 h-6 text-primary" />
      <span className="font-display text-2xl">Soulmate.ai</span>
    </div>
  );
};

export default Logo;