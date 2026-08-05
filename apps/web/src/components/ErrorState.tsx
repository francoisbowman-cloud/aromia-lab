"use client";

import { Button } from "@/components/ui/button";

export function ErrorState({ message, reset }: { message: string; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl p-8 text-center">
      <p className="rounded-card border border-line bg-surface p-8 font-sans text-sm text-muted">
        {message}
      </p>
      <Button onClick={reset} className="mt-4">
        Reintentar
      </Button>
    </div>
  );
}
