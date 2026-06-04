"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { IngredientIllustration } from "@/components/visuals/ingredient-illustration";
import { categoryLabels, categoryStyles } from "@/data/ingredients";
import { cn } from "@/lib/utils";
import type { Ingredient } from "@/store/use-kitchen-store";

type IngredientCardProps = {
  ingredient: Ingredient;
  isSelected: boolean;
  onToggle: (ingredient: Ingredient) => void;
};

export function IngredientCard({
  ingredient,
  isSelected,
  onToggle,
}: IngredientCardProps) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 26, scale: 0.86 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -5, rotate: isSelected ? 0 : -1.5 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", bounce: 0.38, duration: 0.58 }}
      onClick={() => onToggle(ingredient)}
      data-cursor="hover"
      className={cn(
        "group relative flex min-h-24 items-center gap-3 rounded-2xl border p-3 text-left text-[var(--color-warm-brown)] shadow-[3px_3px_0_rgba(61,43,31,0.08)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)]",
        "bg-white/68 border-[var(--color-warm-brown)]/12 backdrop-blur",
        isSelected &&
          "border-[var(--color-terracotta)] bg-[#fff2e7] shadow-[0_0_0_3px_rgba(226,113,75,0.14),5px_5px_0_rgba(226,113,75,0.28)]",
      )}
    >
      <span
        className={cn(
          "absolute right-3 top-3 grid size-7 place-items-center rounded-full border bg-white text-[var(--color-terracotta)] opacity-0 shadow-sm",
          isSelected && "opacity-100",
        )}
        aria-hidden="true"
      >
        <Check className="size-4" strokeWidth={3} />
      </span>
      <motion.span
        layoutId={`ingredient-flight-${ingredient.id}`}
        className="w-fit"
      >
        <IngredientIllustration
          name={ingredient.name}
          category={ingredient.category}
          size="sm"
          className="size-14"
        />
      </motion.span>
      <span className="min-w-0 space-y-2">
        <span className="block truncate font-display text-xl font-semibold leading-none text-[var(--color-warm-brown)]">
          {ingredient.name}
        </span>
        <span
          className={cn(
            "inline-flex rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]",
            categoryStyles[ingredient.category],
          )}
        >
          {categoryLabels[ingredient.category]}
        </span>
      </span>
    </motion.button>
  );
}
