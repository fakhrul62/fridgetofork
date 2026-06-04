"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Refrigerator, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useEffect } from "react";

import { IngredientCard } from "@/components/kitchen/ingredient-card";
import { CookingStage } from "@/components/kitchen/cooking-stage";
import { categoryLabels, ingredients as fallbackIngredients } from "@/data/ingredients";
import { cn } from "@/lib/utils";
import { useKitchenStore, type Ingredient } from "@/store/use-kitchen-store";
import type { IngredientCategory } from "@/types/database";

const categories = Object.keys(categoryLabels) as IngredientCategory[];

export function IngredientWorkspace() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<IngredientCategory | "all">("all");
  const [availableIngredients, setAvailableIngredients] =
    useState<Ingredient[]>(fallbackIngredients);
  const [mobileView, setMobileView] = useState<"pantry" | "stage">("pantry");
  const selectedIngredients = useKitchenStore((state) => state.selectedIngredients);
  const activeRecipe = useKitchenStore((state) => state.activeRecipe);
  const stageStatus = useKitchenStore((state) => state.stageStatus);
  const selectIngredient = useKitchenStore((state) => state.selectIngredient);
  const deselectIngredient = useKitchenStore((state) => state.deselectIngredient);
  const clearIngredients = useKitchenStore((state) => state.clearIngredients);

  const selectedIds = useMemo(
    () => new Set(selectedIngredients.map((ingredient) => ingredient.id)),
    [selectedIngredients],
  );

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

  const toggleIngredient = (ingredient: Ingredient) => {
    if (selectedIds.has(ingredient.id)) {
      deselectIngredient(ingredient.id);
      return;
    }

    selectIngredient(ingredient);
  };

  const isCookingFocus =
    Boolean(activeRecipe) && (stageStatus === "cooking" || stageStatus === "complete");

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

  const savePantry = () => {
    window.localStorage.setItem("fridge-to-fork-pantry", JSON.stringify(selectedIngredients));
  };
  const loadPantry = () => {
    const savedPantry = window.localStorage.getItem("fridge-to-fork-pantry");

    if (!savedPantry) {
      return;
    }

    try {
      const parsed = JSON.parse(savedPantry) as Ingredient[];
      clearIngredients();
      parsed.forEach((ingredient) => selectIngredient(ingredient));
    } catch {
      window.localStorage.removeItem("fridge-to-fork-pantry");
    }
  };
  const dailyChallenge = availableIngredients
    .slice()
    .sort((first, second) => first.id.localeCompare(second.id))
    .filter((_, index) => [2, 7, 12, 20].includes(index))
    .map((ingredient) => ingredient.name)
    .join(" + ");

  return (
    <section
      id="kitchen"
      className={cn(
        "relative z-10 px-5 sm:px-8 lg:px-12",
        isCookingFocus ? "py-4 lg:py-5" : "py-4 lg:py-6",
      )}
    >
      <div
        className={cn(
          "mx-auto h-[calc(100svh-2rem)] max-w-7xl lg:h-[calc(100svh-3rem)]",
          isCookingFocus
            ? "flex justify-center"
            : "lg:grid lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,0.98fr)] lg:items-stretch lg:gap-5",
        )}
      >
        {!isCookingFocus ? (
          <div className="sticky top-2 z-30 mb-4 grid grid-cols-2 gap-2 rounded-full border border-[var(--color-warm-brown)]/12 bg-[var(--color-cream)]/90 p-1 shadow-[0_10px_30px_rgba(61,43,31,0.12)] backdrop-blur lg:hidden">
            {(["pantry", "stage"] as const).map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => setMobileView(view)}
                className={cn(
                  "h-11 rounded-full font-mono text-xs uppercase tracking-[0.12em]",
                  mobileView === view
                    ? "bg-[var(--color-butter)] text-[var(--color-warm-brown)]"
                    : "text-[var(--color-warm-brown)]/56",
                )}
              >
                {view}
              </button>
            ))}
          </div>
        ) : null}
        {!isCookingFocus ? (
          <div
            className={cn(
              "flex h-[calc(100svh-7.5rem)] flex-col overflow-hidden rounded-[2rem] border border-[var(--color-warm-brown)]/12 bg-white/42 p-4 shadow-[7px_7px_0_rgba(61,43,31,0.1)] backdrop-blur sm:p-5 lg:h-full",
              mobileView === "stage" && "hidden lg:block",
            )}
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-olive)]">
                  Ingredient Grid
                </p>
                <h2 className="mt-2 font-display text-5xl font-semibold leading-none">
                  Choose your lineup
                </h2>
              </div>
              <span className="w-fit rounded-full bg-[var(--color-warm-brown)] px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-cream)]">
                {selectedIngredients.length} selected
              </span>
            </div>

            <div className="mt-4 grid shrink-0 gap-3">
              <div className="grid gap-3 rounded-3xl border border-[var(--color-warm-brown)]/10 bg-white/45 p-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                <div>
                  <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-olive)]">
                    <CalendarDays className="size-4" />
                    Daily fridge challenge
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold leading-none">
                    {dailyChallenge}
                  </p>
                </div>
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={savePantry}
                  disabled={selectedIngredients.length === 0}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--color-butter)] px-4 font-semibold text-[var(--color-warm-brown)] disabled:opacity-45"
                >
                  <Refrigerator className="size-4" />
                  Save Pantry
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={loadPantry}
                  className="h-11 rounded-full border border-[var(--color-warm-brown)]/15 bg-white/70 px-4 font-semibold text-[var(--color-warm-brown)]"
                >
                  Load Pantry
                </motion.button>
              </div>
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--color-warm-brown)]/45" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search ingredients"
                  className="h-14 w-full rounded-full border border-[var(--color-warm-brown)]/15 bg-white/72 pl-12 pr-12 text-[var(--color-warm-brown)] outline-none shadow-[3px_3px_0_rgba(61,43,31,0.08)] placeholder:text-[var(--color-warm-brown)]/42 focus:border-[var(--color-terracotta)]"
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

              <div className="flex gap-2 overflow-x-auto pb-1">
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
                        : "border-[var(--color-warm-brown)]/12 bg-white/58 text-[var(--color-warm-brown)]/62",
                    )}
                  >
                    {category === "all" ? "All" : categoryLabels[category]}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mt-4 min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
              {groupedIngredients.map((group) => (
                <section key={group.category}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-olive)]">
                      {categoryLabels[group.category]}
                    </h3>
                    <span className="rounded-full bg-white/65 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-warm-brown)]/55">
                      {group.items.length}
                    </span>
                  </div>
                  <motion.div
                    layout
                    className="grid grid-cols-2 gap-2 xl:grid-cols-3"
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

            {filteredIngredients.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-3xl border border-dashed border-[var(--color-warm-brown)]/18 bg-white/45 p-8 text-center"
              >
                <p className="font-display text-3xl">No ingredient found</p>
                <p className="mt-2 text-[var(--color-warm-brown)]/65">
                  Try another pantry word or switch categories.
                </p>
              </motion.div>
            ) : null}
          </div>
        ) : null}

        <div
          className={cn(
            isCookingFocus ? "w-full" : mobileView === "pantry" && "hidden lg:block",
          )}
        >
          <CookingStage isFocusMode={isCookingFocus} />
        </div>
      </div>
      {!isCookingFocus ? (
        <div className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between rounded-full border border-[var(--color-warm-brown)]/12 bg-[var(--color-warm-brown)] px-4 py-3 text-[var(--color-cream)] shadow-[0_12px_40px_rgba(61,43,31,0.24)] lg:hidden">
          <span className="font-mono text-xs uppercase tracking-[0.12em]">
            {selectedIngredients.length} picked
          </span>
          <button
            type="button"
            onClick={() => setMobileView("stage")}
            className="rounded-full bg-[var(--color-butter)] px-4 py-2 font-semibold text-[var(--color-warm-brown)]"
          >
            Open stage
          </button>
        </div>
      ) : null}
    </section>
  );
}
