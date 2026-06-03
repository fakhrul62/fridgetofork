"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChefHat, Clock3, Flame, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { useKitchenStore, type RecipeOption } from "@/store/use-kitchen-store";

type GenerateRecipeResponse = {
  recipes: RecipeOption[];
  error?: string;
};

export function CookingStage() {
  const selectedIngredients = useKitchenStore((state) => state.selectedIngredients);
  const recipeOptions = useKitchenStore((state) => state.recipeOptions);
  const activeRecipe = useKitchenStore((state) => state.activeRecipe);
  const stageStatus = useKitchenStore((state) => state.stageStatus);
  const deselectIngredient = useKitchenStore((state) => state.deselectIngredient);
  const setRecipeOptions = useKitchenStore((state) => state.setRecipeOptions);
  const setActiveRecipe = useKitchenStore((state) => state.setActiveRecipe);
  const setStageStatus = useKitchenStore((state) => state.setStageStatus);
  const [errorMessage, setErrorMessage] = useState("");
  const canGenerate = selectedIngredients.length >= 2;
  const isGenerating = stageStatus === "suggesting";

  const generateRecipes = async () => {
    if (!canGenerate || isGenerating) {
      return;
    }

    setErrorMessage("");
    setStageStatus("suggesting");

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: selectedIngredients.map((ingredient) => ingredient.name),
        }),
      });
      const payload = (await response.json()) as GenerateRecipeResponse;

      if (!response.ok) {
        throw new Error(payload.error ?? "The kitchen could not think of a dish yet.");
      }

      setRecipeOptions(payload.recipes);
    } catch (error) {
      setStageStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The kitchen could not think of a dish yet.",
      );
    }
  };

  return (
    <section className="sticky top-5 overflow-hidden rounded-[2rem] border border-[var(--color-warm-brown)] bg-[var(--color-warm-brown)] p-4 shadow-[9px_9px_0_rgba(61,43,31,0.16)] lg:min-h-[760px]">
      <div className="relative flex min-h-[620px] flex-col overflow-hidden rounded-[1.45rem] border border-white/10 bg-[#2c1d15] p-5 text-[var(--color-cream)] sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(245,200,66,0.18),transparent_22rem)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/30 to-transparent" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-butter)]">
              Mise Stage
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold">Cooking Stage</h2>
          </div>
          <span className="rounded-full bg-white/10 px-4 py-2 font-mono text-xs">
            {selectedIngredients.length}/8
          </span>
        </div>

        <div className="relative z-10 mt-6 flex flex-1 items-center justify-center">
          <AnimatePresence mode="popLayout">
            {selectedIngredients.length === 0 ? (
              <motion.div
                key="empty-pan"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: "spring", bounce: 0.3 }}
                className="grid max-w-sm place-items-center text-center"
              >
                <div className="relative grid size-64 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
                  <span className="absolute top-7 flex gap-3">
                    {[0, 1, 2].map((item) => (
                      <span
                        key={item}
                        className="h-14 w-2 rounded-full bg-white/20"
                        style={{
                          animation: `steamRise 2.7s ease-in-out ${item * 0.35}s infinite`,
                        }}
                      />
                    ))}
                  </span>
                  <span className="relative h-20 w-44 rounded-b-[4rem] rounded-t-[1.4rem] border-4 border-[var(--color-butter)] bg-[var(--color-terracotta)] shadow-[0_18px_0_rgba(0,0,0,0.22)]">
                    <span className="absolute -right-14 top-7 h-5 w-16 rounded-full bg-[var(--color-butter)]" />
                  </span>
                </div>
                <h3 className="mt-7 font-display text-4xl font-semibold">Add ingredients to begin</h3>
                <p className="mt-3 leading-7 text-white/68">
                  Your pan is warm, your counter is clear, and the stage is waiting.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="selected-stage"
                className="relative grid h-[390px] w-full max-w-xl place-items-center"
              >
                <div className="absolute inset-x-8 bottom-8 h-20 rounded-[50%] bg-black/25 blur-xl" />
                {selectedIngredients.map((ingredient, index) => {
                  const angle = (index / Math.max(selectedIngredients.length, 1)) * Math.PI * 2;
                  const radius = selectedIngredients.length > 4 ? 132 : 104;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * 88;

                  return (
                    <motion.div
                      key={ingredient.id}
                      layoutId={`stage-${ingredient.id}`}
                      initial={{
                        opacity: 0,
                        x: -260,
                        y: 160,
                        scale: 0.72,
                        rotate: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: [x - 36, x + 18, x],
                        y: [y + 96, y - 28, y],
                        scale: 1,
                        rotate: [8, -3, 0],
                      }}
                      exit={{
                        opacity: 0,
                        x: -280,
                        y: 150,
                        scale: 0.65,
                        rotate: -14,
                      }}
                      transition={{ type: "spring", bounce: 0.38, duration: 0.76 }}
                      className="absolute"
                      style={{ zIndex: 10 + index }}
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                          duration: 2.8 + index * 0.16,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="group relative grid min-w-28 place-items-center rounded-3xl border border-white/15 bg-white/92 p-4 text-[var(--color-warm-brown)] shadow-[5px_8px_0_rgba(0,0,0,0.22)]"
                      >
                        <button
                          type="button"
                          onClick={() => deselectIngredient(ingredient.id)}
                          className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full bg-[var(--color-terracotta)] text-white shadow-md"
                          aria-label={`Remove ${ingredient.name}`}
                        >
                          <X className="size-4" strokeWidth={3} />
                        </button>
                        <span className="text-5xl">{ingredient.emoji}</span>
                        <span className="mt-2 font-mono text-xs uppercase tracking-[0.12em]">
                          {ingredient.name}
                        </span>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative z-10 mt-6 space-y-4">
          <motion.button
            type="button"
            whileHover={canGenerate ? { y: -3, scale: 1.015 } : undefined}
            whileTap={canGenerate ? { scale: 0.95 } : undefined}
            disabled={!canGenerate || isGenerating}
            onClick={generateRecipes}
            className={cn(
              "flex h-14 w-full items-center justify-center gap-3 rounded-full px-6 font-semibold shadow-[4px_4px_0_rgba(0,0,0,0.28)]",
              canGenerate
                ? "bg-[var(--color-butter)] text-[var(--color-warm-brown)]"
                : "bg-white/10 text-white/42",
            )}
          >
            {isGenerating ? (
              <span className="size-5 rounded-full bg-[var(--color-warm-brown)]/20 [animation:skeletonPulse_1s_ease-in-out_infinite]" />
            ) : canGenerate ? (
              <Sparkles className="size-5" />
            ) : (
              <ChefHat className="size-5" />
            )}
            {isGenerating ? "Thinking in threes..." : "What can I cook?"}
          </motion.button>
          <AnimatePresence mode="wait">
            {errorMessage ? (
              <motion.p
                key="stage-error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-2xl bg-[var(--color-terracotta)]/18 px-4 py-3 text-center text-sm leading-6 text-white"
              >
                {errorMessage}
              </motion.p>
            ) : (
              <motion.p
                key="stage-hint"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-center text-sm leading-6 text-white/55"
              >
                {activeRecipe
                  ? `${activeRecipe.name} is loaded for the animation system.`
                  : "Pick at least 2 ingredients for three dish ideas."}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {(recipeOptions.length > 0 || isGenerating) && !activeRecipe ? (
            <motion.div
              initial={{ y: "105%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "105%", opacity: 0 }}
              transition={{ type: "spring", bounce: 0.22, duration: 0.68 }}
              className="absolute inset-x-3 bottom-3 z-30 rounded-[1.5rem] border border-white/12 bg-[var(--color-cream)] p-4 text-[var(--color-warm-brown)] shadow-[0_-18px_50px_rgba(0,0,0,0.28)] sm:inset-x-4 sm:bottom-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-terracotta)]">
                    Chef Suggestions
                  </p>
                  <h3 className="mt-1 font-display text-3xl font-semibold">Choose your dish</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setRecipeOptions([])}
                  className="grid size-9 place-items-center rounded-full bg-[var(--color-warm-brown)]/8"
                  aria-label="Close suggestions"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                {isGenerating
                  ? [0, 1, 2].map((item) => (
                      <div
                        key={item}
                        className="h-28 rounded-3xl bg-[var(--color-warm-brown)]/8 [animation:skeletonPulse_1.1s_ease-in-out_infinite]"
                      />
                    ))
                  : recipeOptions.map((recipe, index) => (
                      <motion.button
                        key={recipe.id}
                        type="button"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08, type: "spring", bounce: 0.3 }}
                        whileHover={{ y: -3, scale: 1.01 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveRecipe(recipe)}
                        className="rounded-3xl border border-[var(--color-warm-brown)]/12 bg-white/70 p-4 text-left shadow-[3px_3px_0_rgba(61,43,31,0.1)]"
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-display text-2xl font-semibold leading-none">
                            {recipe.name}
                          </span>
                          <span className="rounded-full bg-[var(--color-butter)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">
                            {recipe.difficulty}
                          </span>
                        </span>
                        <span className="mt-2 block text-sm leading-6 text-[var(--color-warm-brown)]/70">
                          {recipe.description}
                        </span>
                        <span className="mt-3 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-warm-brown)]/62">
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="size-3.5" />
                            {recipe.cookTime} min
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Flame className="size-3.5" />
                            {recipe.cuisine}
                          </span>
                        </span>
                      </motion.button>
                    ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
