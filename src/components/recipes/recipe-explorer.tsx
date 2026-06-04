"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";

import { DishArtwork } from "@/components/visuals/dish-artwork";
import { cn } from "@/lib/utils";
import type { RecipeOption } from "@/store/use-kitchen-store";

const filters = ["all", "15-minute", "one-pan", "comfort", "vegetarian", "high protein"] as const;

type RecipeExplorerProps = {
  recipes: RecipeOption[];
};

export function RecipeExplorer({ recipes }: RecipeExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("all");

  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return recipes.filter((recipe) => {
      const searchMatch =
        normalizedQuery.length === 0 ||
        recipe.name.toLowerCase().includes(normalizedQuery) ||
        recipe.description.toLowerCase().includes(normalizedQuery) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(normalizedQuery),
        );
      const filterMatch =
        activeFilter === "all" ||
        (activeFilter === "15-minute" && recipe.cookTime <= 20) ||
        (activeFilter === "one-pan" &&
          `${recipe.name} ${recipe.description}`.toLowerCase().includes("skillet")) ||
        (activeFilter === "comfort" &&
          `${recipe.cuisine} ${recipe.description}`.toLowerCase().includes("comfort")) ||
        (activeFilter === "vegetarian" &&
          !recipe.ingredients.some((ingredient) =>
            ["chicken", "beef", "salmon", "shrimp"].includes(ingredient.toLowerCase()),
          )) ||
        (activeFilter === "high protein" &&
          recipe.ingredients.some((ingredient) =>
            ["chicken", "beef", "salmon", "shrimp", "eggs", "tofu"].includes(
              ingredient.toLowerCase(),
            ),
          ));

      return searchMatch && filterMatch;
    });
  }, [activeFilter, query, recipes]);

  return (
    <>
      <div className="mt-8 grid gap-3 rounded-[1.5rem] border border-[var(--color-warm-brown)]/12 bg-white/50 p-4 shadow-[4px_4px_0_rgba(61,43,31,0.08)] md:grid-cols-[1fr_auto] md:items-center">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search dishes or ingredients"
          className="h-12 rounded-full border border-[var(--color-warm-brown)]/14 bg-white/75 px-4 text-[var(--color-warm-brown)] outline-none focus:border-[var(--color-terracotta)]"
        />
        <div className="flex flex-wrap gap-2 font-mono text-xs uppercase tracking-[0.12em]">
          {filters.map((filter) => (
            <motion.button
              key={filter}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "rounded-full border px-4 py-2",
                activeFilter === filter
                  ? "border-[var(--color-warm-brown)] bg-[var(--color-butter)] text-[var(--color-warm-brown)]"
                  : "border-[var(--color-warm-brown)]/12 bg-white/52 text-[var(--color-warm-brown)]/68",
              )}
            >
              {filter}
            </motion.button>
          ))}
        </div>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredRecipes.map((recipe, index) => (
          <Link
            key={recipe.id}
            href={`/recipe/${recipe.id}`}
            className="group rounded-[1.5rem] border border-[var(--color-warm-brown)]/12 bg-white/58 p-5 shadow-[4px_4px_0_rgba(61,43,31,0.1)] transition-transform hover:-translate-y-1"
          >
            <DishArtwork
              name={recipe.name}
              ingredients={recipe.ingredients}
              compact
              className="mb-5"
            />
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-terracotta)]">
              #{index + 1} · {recipe.cuisine}
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-none">
              {recipe.name}
            </h2>
            <p className="mt-4 leading-7 text-[var(--color-warm-brown)]/68">
              {recipe.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.1em]">
              <span className="rounded-full bg-[var(--color-butter)] px-3 py-1">
                {recipe.cookTime} min
              </span>
              <span className="rounded-full bg-[var(--color-olive)]/16 px-3 py-1">
                {recipe.difficulty}
              </span>
              {typeof recipe.matchScore === "number" ? (
                <span className="rounded-full bg-[var(--color-terracotta)]/14 px-3 py-1">
                  {recipe.matchScore}% match
                </span>
              ) : null}
            </div>
          </Link>
        ))}
      </section>

      {filteredRecipes.length === 0 ? (
        <div className="mt-10 rounded-[1.5rem] border border-dashed border-[var(--color-warm-brown)]/18 bg-white/48 p-10 text-center">
          <p className="font-display text-3xl font-semibold">No dish in that lane yet.</p>
          <p className="mt-2 text-[var(--color-warm-brown)]/65">
            Try another search or clear the filter.
          </p>
        </div>
      ) : null}
    </>
  );
}
