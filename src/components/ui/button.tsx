import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        brand:
          "bg-[#FF4D00] text-white hover:bg-[#E04400] shadow-sm border border-transparent",
        ink: "bg-ink text-paper hover:bg-ink/90 border border-transparent",
        header: "bg-transparent text-foreground hover:bg-muted/30",
        size: "border border-border bg-transparent text-foreground hover:border-foreground/60 data-[selected=true]:bg-[#FF4D00] data-[selected=true]:text-white data-[selected=true]:border-[#FF4D00]",
        default: "bg-[#FF4D00] text-white hover:bg-[#E04400] shadow-sm border border-transparent",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent text-foreground shadow-xs hover:bg-muted/30 hover:border-foreground/30",
        secondary: "bg-surface text-foreground border border-border shadow-xs hover:bg-muted",
        ghost: "hover:bg-muted/30 hover:text-[#FF4D00] text-foreground",
        link: "text-[#FF4D00] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-[11px]",
        lg: "h-12 px-8 text-xs tracking-widest",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
            <span>Carregando...</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
