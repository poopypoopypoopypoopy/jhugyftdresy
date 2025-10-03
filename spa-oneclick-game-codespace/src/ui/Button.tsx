
import { cn } from "../util/cn";
import React from "react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" };
export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", ...props }, ref) => {
    const base = "inline-flex items-center gap-1 rounded-2xl px-3 py-2 text-sm border transition active:translate-y-px";
    const styles = variant === "primary" ? "bg-black text-white border-black"
      : variant === "secondary" ? "bg-white text-black border-gray-300"
      : "bg-transparent text-black border-transparent";
    return <button ref={ref} className={cn(base, styles, className)} {...props} />;
  }
);
Button.displayName = "Button";
