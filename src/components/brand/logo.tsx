import { ChefHat } from "lucide-react";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-[var(--color-warm-brown)]",
        className,
      )}
    >
      <span className="grid size-10 place-items-center rounded-full border border-current bg-[var(--color-cream)] shadow-[3px_3px_0_var(--color-warm-brown)]">
        <ChefHat className="size-5" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="font-display text-2xl font-semibold tracking-normal">Fridge to Fork</span>
    </div>
  );
}
