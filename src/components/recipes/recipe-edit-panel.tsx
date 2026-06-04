"use client";

import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { useState } from "react";

import type { RecipeOption } from "@/store/use-kitchen-store";

type RecipeEditPanelProps = {
  recipe: RecipeOption;
};

const tweaks = [
  "make it spicier",
  "make it faster",
  "use less oil",
  "make it Bengali-inspired",
];

export function RecipeEditPanel({ recipe }: RecipeEditPanelProps) {
  const [preview, setPreview] = useState<RecipeOption | null>(null);
  const [loadingTweak, setLoadingTweak] = useState("");

  const runTweak = async (tweak: string) => {
    setLoadingTweak(tweak);

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: recipe.ingredients.slice(0, 8),
          preferences: {
            mood: tweak,
            timeLimit: tweak.includes("faster") ? 20 : recipe.cookTime,
            spiceLevel: tweak.includes("spicier") ? "bold" : "gentle",
            dietaryStyle: tweak.includes("Bengali") ? "Bengali-inspired" : "anything",
          },
        }),
      });
      const payload = (await response.json()) as { recipes?: RecipeOption[] };

      setPreview(payload.recipes?.[0] ?? null);
    } finally {
      setLoadingTweak("");
    }
  };

  return (
    <section className="rounded-[1.5rem] border border-[var(--color-warm-brown)]/12 bg-white/54 p-5 shadow-[4px_4px_0_rgba(61,43,31,0.1)]">
      <h2 className="font-display text-3xl font-semibold">Edit the recipe</h2>
      <p className="mt-2 leading-7 text-[var(--color-warm-brown)]/65">
        Ask the kitchen to nudge the dish without starting over.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tweaks.map((tweak) => (
          <motion.button
            key={tweak}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => runTweak(tweak)}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-butter)] px-4 py-2 font-mono text-xs uppercase tracking-[0.1em]"
          >
            <Wand2 className="size-4" />
            {loadingTweak === tweak ? "working" : tweak}
          </motion.button>
        ))}
      </div>
      {preview ? (
        <div className="mt-5 rounded-2xl bg-[var(--color-warm-brown)] p-4 text-[var(--color-cream)]">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-butter)]">
            Preview
          </p>
          <h3 className="mt-2 font-display text-3xl font-semibold">{preview.name}</h3>
          <p className="mt-2 leading-7 text-white/72">{preview.description}</p>
        </div>
      ) : null}
    </section>
  );
}
