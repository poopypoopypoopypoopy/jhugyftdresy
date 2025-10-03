
import { cn } from "../util/cn";
import React from "react";
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn("h-9 rounded-2xl border border-gray-300 bg-white px-3 text-sm outline-none placeholder:text-gray-400", className)} {...props} />
  )
);
Input.displayName = "Input";
