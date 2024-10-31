import { cn } from "@/lib/utils";
import { Infinity } from "lucide-react";

interface LogoProps {
  className?: string;
  showName?: boolean;
}

const Logo = ({ className, showName = true }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center">
        <Infinity className="w-6 h-6 text-[#D91F3A]" />
      </div>
      {showName && (
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl">WhatAGirlWants.ai</span>
        </div>
      )}
    </div>
  );
};

export default Logo;