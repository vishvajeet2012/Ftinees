"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function PrimaryButton({ 
  children, 
  className, 
  onClick, 
  disabled,
  type = "button" 
}: PrimaryButtonProps) {
  return (
    <Button
      type={type}
      size="lg"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "bg-white hover:bg-zinc-200 text-black font-bold text-lg py-6 px-8",
        "shadow-[0_0_30px_rgba(255,255,255,0.1)]",
        "hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]",
        "transition-all duration-300",
        className
      )}
    >
      {children}
    </Button>
  );
}
