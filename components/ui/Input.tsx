import { forwardRef } from "react";
import { cn } from "../../lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full border-b border-white/30 bg-transparent px-0 pb-2 text-sm text-white outline-none ring-0 transition placeholder:text-muted/60 focus:border-white focus:bg-transparent",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
