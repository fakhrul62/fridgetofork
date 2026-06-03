"use client";

import { useEffect } from "react";

import { CookingAnimationSystem } from "@/components/kitchen/cooking-animation-system";
import { useKitchenStore, type RecipeOption } from "@/store/use-kitchen-store";

type RecipeReplayProps = {
  recipe: RecipeOption;
};

export function RecipeReplay({ recipe }: RecipeReplayProps) {
  const setStageStatus = useKitchenStore((state) => state.setStageStatus);

  useEffect(() => {
    setStageStatus("cooking");
  }, [setStageStatus]);

  return (
    <div className="min-h-[700px] rounded-[2rem] border border-[var(--color-warm-brown)] bg-[var(--color-warm-brown)] p-4 text-[var(--color-cream)] shadow-[9px_9px_0_rgba(61,43,31,0.14)]">
      <div className="relative flex min-h-[660px] flex-col overflow-hidden rounded-[1.45rem] border border-white/10 bg-[#2c1d15] p-5 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(245,200,66,0.18),transparent_22rem)]" />
        <CookingAnimationSystem recipe={recipe} />
      </div>
    </div>
  );
}
