"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChefHat, Sparkles, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useKitchenStore } from "@/store/use-kitchen-store";

export function CookingStage() {
  const selectedIngredients = useKitchenStore((state) => state.selectedIngredients);
  const deselectIngredient = useKitchenStore((state) => state.deselectIngredient);
  const canGenerate = selectedIngredients.length >= 2;

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
            disabled={!canGenerate}
            className={cn(
              "flex h-14 w-full items-center justify-center gap-3 rounded-full px-6 font-semibold shadow-[4px_4px_0_rgba(0,0,0,0.28)]",
              canGenerate
                ? "bg-[var(--color-butter)] text-[var(--color-warm-brown)]"
                : "bg-white/10 text-white/42",
            )}
          >
            {canGenerate ? <Sparkles className="size-5" /> : <ChefHat className="size-5" />}
            What can I cook?
          </motion.button>
          <p className="text-center text-sm leading-6 text-white/55">
            Pick at least 2 ingredients. Recipe suggestions arrive in Phase 3.
          </p>
        </div>
      </div>
    </section>
  );
}
