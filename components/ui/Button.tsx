import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-white text-black hover:bg-muted/90 focus-visible:outline-accent shadow-glow",
        ghost: "bg-white/5 text-white hover:bg-white/10 border border-white/10 focus-visible:outline-accent"
      },
      tone: {
        default: "",
        muted: "text-muted"
      }
    },
    defaultVariants: {
      variant: "primary",
      tone: "default"
    }
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, tone, ...props }, ref) => (
    <button ref={ref} className={cn(buttonStyles({ variant, tone }), className)} {...props} />
  )
);

Button.displayName = "Button";
