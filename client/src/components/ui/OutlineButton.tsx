"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OutlineButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function OutlineButton({ 
  children, 
  className, 
  onClick, 
  disabled,
  type = "button" 
}: OutlineButtonProps) {
  return (
    <Button
      type={type}
      size="lg"
      variant="outline"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-full px-8 text-lg",
        "border-white/20 text-white",
        "hover:bg-white/10 hover:text-white",
        "transition-all duration-300 h-[3.6rem]",
        className
      )}
    >
      {children}
    </Button>
  );
}
