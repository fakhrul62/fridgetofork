"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { IngredientCard } from "@/components/kitchen/ingredient-card";
import { categoryLabels, ingredients as fallbackIngredients } from "@/data/ingredients";
import { cn } from "@/lib/utils";
import { useKitchenStore, type Ingredient } from "@/store/use-kitchen-store";
import type { IngredientCategory } from "@/types/database";

const categories = Object.keys(categoryLabels) as IngredientCategory[];
const storageKey = "fridge-to-fork-selected-ingredients";

export function IngredientSelectionPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<IngredientCategory | "all">("all");
  const [availableIngredients, setAvailableIngredients] =
    useState<Ingredient[]>(fallbackIngredients);
  const selectedIngredients = useKitchenStore((state) => state.selectedIngredients);
  const selectIngredient = useKitchenStore((state) => state.selectIngredient);
  const deselectIngredient = useKitchenStore((state) => state.deselectIngredient);
  const clearIngredients = useKitchenStore((state) => state.clearIngredients);

  const selectedIds = useMemo(
    () => new Set(selectedIngredients.map((ingredient) => ingredient.id)),
    [selectedIngredients],
  );

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);

    if (saved && selectedIngredients.length === 0) {
      try {
        const parsed = JSON.parse(saved) as Ingredient[];
        parsed.forEach((ingredient) => selectIngredient(ingredient));
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
  }, [selectIngredient, selectedIngredients.length]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(selectedIngredients));
  }, [selectedIngredients]);

  useEffect(() => {
    let isMounted = true;

    const loadIngredients = async () => {
      try {
        const response = await fetch("/api/ingredients");
        const payload = (await response.json()) as { ingredients?: Ingredient[] };

        if (isMounted && response.ok && payload.ingredients?.length) {
          setAvailableIngredients(payload.ingredients);
        }
      } catch {
        if (isMounted) {
          setAvailableIngredients(fallbackIngredients);
        }
      }
    };

    void loadIngredients();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredIngredients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return availableIngredients.filter((ingredient) => {
      const matchesCategory =
        activeCategory === "all" || ingredient.category === activeCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        ingredient.name.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, availableIngredients, query]);

  const groupedIngredients = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          items: filteredIngredients.filter((ingredient) => ingredient.category === category),
        }))
        .filter((group) => group.items.length > 0),
    [filteredIngredients],
  );

  const toggleIngredient = (ingredient: Ingredient) => {
    if (selectedIds.has(ingredient.id)) {
      deselectIngredient(ingredient.id);
      return;
    }

    selectIngredient(ingredient);
  };

  const continueToSuggestions = () => {
    window.localStorage.setItem(storageKey, JSON.stringify(selectedIngredients));
    router.push("/suggestions");
  };

  return (
    <main className="grain-overlay min-h-screen px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Logo />
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-olive)]">
              Full pantry
            </p>
            <h1 className="mt-2 max-w-4xl font-display text-5xl font-semibold leading-none text-[var(--color-warm-brown)] sm:text-7xl">
              Pick every ingredient you have.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--color-warm-brown)]/72">
              No compressed drawer, no tiny scroll box. Choose as many as you want, then
              the kitchen will build a full list of dish ideas.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--color-warm-brown)]/12 bg-white/55 p-4 shadow-[4px_4px_0_rgba(61,43,31,0.1)]">
            <p className="font-display text-4xl font-semibold">{selectedIngredients.length}</p>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-warm-brown)]/62">
              selected
            </p>
          </div>
        </header>

        <section className="sticky top-0 z-30 mt-8 rounded-[1.5rem] border border-[var(--color-warm-brown)]/12 bg-[var(--color-cream)]/92 p-3 shadow-[0_10px_34px_rgba(61,43,31,0.12)] backdrop-blur">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--color-warm-brown)]/45" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search all ingredients"
                className="h-14 w-full rounded-full border border-[var(--color-warm-brown)]/15 bg-white pl-12 pr-12 text-[var(--color-warm-brown)] outline-none placeholder:text-[var(--color-warm-brown)]/42 focus:border-[var(--color-terracotta)]"
              />
              <AnimatePresence>
                {query.length > 0 ? (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-[var(--color-cream)] text-[var(--color-warm-brown)]"
                    aria-label="Clear search"
                  >
                    <X className="size-4" />
                  </motion.button>
                ) : null}
              </AnimatePresence>
            </label>
            <motion.button
              type="button"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              disabled={selectedIngredients.length < 2}
              onClick={continueToSuggestions}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--color-terracotta)] px-6 font-semibold text-white shadow-[4px_4px_0_var(--color-warm-brown)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              What can I cook?
              <ArrowRight className="size-5" />
            </motion.button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {(["all", ...categories] as const).map((category) => (
              <motion.button
                key={category}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.12em]",
                  activeCategory === category
                    ? "border-[var(--color-warm-brown)] bg-[var(--color-butter)] text-[var(--color-warm-brown)]"
                    : "border-[var(--color-warm-brown)]/12 bg-white/70 text-[var(--color-warm-brown)]/62",
                )}
              >
                {category === "all" ? "All" : categoryLabels[category]}
              </motion.button>
            ))}
          </div>
        </section>

        <div className="mt-8 space-y-10">
          {groupedIngredients.map((group) => (
            <section key={group.category}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-display text-4xl font-semibold">
                  {categoryLabels[group.category]}
                </h2>
                <span className="rounded-full bg-white/70 px-3 py-1 font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-warm-brown)]/62">
                  {group.items.length}
                </span>
              </div>
              <motion.div
                layout
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                <AnimatePresence mode="popLayout">
                  {group.items.map((ingredient) => (
                    <IngredientCard
                      key={ingredient.id}
                      ingredient={ingredient}
                      isSelected={selectedIds.has(ingredient.id)}
                      onToggle={toggleIngredient}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            disabled={selectedIngredients.length < 2}
            onClick={continueToSuggestions}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--color-terracotta)] px-6 font-semibold text-white shadow-[4px_4px_0_var(--color-warm-brown)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            What can I cook?
            <ArrowRight className="size-5" />
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearIngredients}
            className="h-14 rounded-full border border-[var(--color-warm-brown)]/18 bg-white/70 px-6 font-semibold text-[var(--color-warm-brown)]"
          >
            Clear selection
          </motion.button>
        </div>
      </div>
    </main>
  );
}
