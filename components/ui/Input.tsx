import { forwardRef } from "react";
import { cn } from "../../lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 transition placeholder:text-muted/70 focus:bg-white/10 focus:border-white/30 border border-white/10",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
