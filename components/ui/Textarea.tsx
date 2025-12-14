import { forwardRef } from "react";
import { cn } from "../../lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full min-h-[140px] rounded-xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 transition placeholder:text-muted/70 focus:bg-white/10 focus:border-white/30 border border-white/10",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
