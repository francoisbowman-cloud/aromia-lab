import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[.08em] transition",
  {
    variants: {
      variant: {
        default: "bg-surface text-ink",
        outline: "border border-line text-muted",
        gold: "bg-[color:color-mix(in_srgb,var(--gold)_15%,transparent)] text-gold-contrast",
        destructive: "bg-[color:color-mix(in_srgb,var(--destructive)_10%,transparent)] text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
