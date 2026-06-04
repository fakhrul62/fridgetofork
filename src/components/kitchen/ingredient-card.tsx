"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { categoryLabels, categoryStyles } from "@/data/ingredients";
import { cn } from "@/lib/utils";
import type { Ingredient } from "@/store/use-kitchen-store";

type IngredientCardProps = {
  ingredient: Ingredient;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (ingredient: Ingredient) => void;
};

export function IngredientCard({
  ingredient,
  isSelected,
  isDisabled,
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
      disabled={isDisabled && !isSelected}
      data-cursor="hover"
      className={cn(
        "group relative flex min-h-36 flex-col justify-between rounded-3xl border p-4 text-left text-[var(--color-warm-brown)] shadow-[4px_4px_0_rgba(61,43,31,0.1)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)]",
        "bg-white/68 border-[var(--color-warm-brown)]/12 backdrop-blur",
        isSelected &&
          "border-[var(--color-terracotta)] bg-[#fff2e7] shadow-[0_0_0_3px_rgba(226,113,75,0.14),5px_5px_0_rgba(226,113,75,0.28)]",
        isDisabled && !isSelected && "cursor-not-allowed opacity-45",
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
        layoutId={`ingredient-emoji-${ingredient.id}`}
        className="text-5xl drop-shadow-sm"
      >
        {ingredient.emoji}
      </motion.span>
      <span className="space-y-3">
        <span className="block font-display text-2xl font-semibold leading-none text-[var(--color-warm-brown)]">
          {ingredient.name}
        </span>
        <span
          className={cn(
            "inline-flex rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em]",
            categoryStyles[ingredient.category],
          )}
        >
          {categoryLabels[ingredient.category]}
        </span>
      </span>
    </motion.button>
  );
}
