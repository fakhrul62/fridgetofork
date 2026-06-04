"use client";

import { ChefHat } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { CookingAnimationSystem } from "@/components/kitchen/cooking-animation-system";
import { useKitchenStore, type RecipeOption } from "@/store/use-kitchen-store";

const activeRecipeStorageKey = "fridge-to-fork-active-recipe";

export function CookPage() {
  const activeRecipe = useKitchenStore((state) => state.activeRecipe);
  const setActiveRecipe = useKitchenStore((state) => state.setActiveRecipe);

  useEffect(() => {
    if (!activeRecipe) {
      const savedRecipe = window.localStorage.getItem(activeRecipeStorageKey);

      if (savedRecipe) {
        try {
          setActiveRecipe(JSON.parse(savedRecipe) as RecipeOption);
        } catch {
          window.localStorage.removeItem(activeRecipeStorageKey);
        }
      }
    }
  }, [activeRecipe, setActiveRecipe]);

  const recipe = activeRecipe;

  return (
    <main className="grain-overlay grid min-h-screen px-3 py-3 sm:px-5 sm:py-5">
      <section className="mx-auto h-[calc(100svh-1.5rem)] w-full max-w-7xl overflow-hidden rounded-[2rem] border border-[var(--color-warm-brown)] bg-[var(--color-warm-brown)] p-3 shadow-[9px_9px_0_rgba(61,43,31,0.16)] sm:h-[calc(100svh-2.5rem)] sm:p-4">
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1.45rem] border border-white/10 bg-[#2c1d15] p-4 text-[var(--color-cream)] sm:p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(245,200,66,0.18),transparent_22rem)]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/30 to-transparent" />
          {recipe ? (
            <CookingAnimationSystem key={recipe.id} recipe={recipe} />
          ) : (
            <div className="relative z-10 grid h-full place-items-center text-center">
              <div>
                <ChefHat className="mx-auto size-12 text-[var(--color-butter)]" />
                <h1 className="mt-5 font-display text-5xl font-semibold">
                  Choose a dish first.
                </h1>
                <p className="mx-auto mt-3 max-w-md text-white/68">
                  Pick ingredients, choose one generated recipe, then this page becomes the
                  focused cooking animation.
                </p>
                <Link
                  href="/ingredients"
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-butter)] px-5 font-semibold text-[var(--color-warm-brown)]"
                >
                  Open pantry
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
