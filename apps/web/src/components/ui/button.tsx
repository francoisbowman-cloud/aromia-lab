"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-card font-sans text-[12px] font-semibold uppercase tracking-[.08em] transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:brightness-105",
        // Secundario queda en píldora (999px) — distinción intencional del
        // sistema "Aromia Lujo": primario recto, secundario redondeado.
        outline: "rounded-full border border-line bg-transparent text-ink hover:border-gold",
        ghost: "rounded-full text-muted hover:text-ink",
        destructive: "bg-destructive text-destructive-foreground hover:brightness-105",
        link: "rounded-none normal-case tracking-normal text-gold-contrast underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-[48px] px-6",
        sm: "min-h-[40px] px-4 text-[11px]",
        lg: "min-h-[52px] px-8",
        icon: "h-9 w-9 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
