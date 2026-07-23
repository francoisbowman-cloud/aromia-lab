import * as React from "react";

import { cn } from "@/lib/utils";

/** Select nativo restilizado — se evitó Radix Select a propósito (no había
 * ningún bug funcional en los <select> existentes, solo estilos repetidos
 * inline; un wrapper liviano alcanza sin sumar una dependencia nueva). */
const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "h-11 w-full rounded border border-input bg-surface px-3 py-2 font-sans text-sm text-ink outline-none transition focus:border-gold disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";

export { Select };
