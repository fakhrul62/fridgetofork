"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ChefHat, Clock3, Flame, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { useKitchenStore, type Ingredient, type RecipeOption } from "@/store/use-kitchen-store";

const ingredientStorageKey = "fridge-to-fork-selected-ingredients";
const optionsStorageKey = "fridge-to-fork-recipe-options";
const activeRecipeStorageKey = "fridge-to-fork-active-recipe";

type GenerateRecipeResponse = {
  recipes: RecipeOption[];
  generationSource?: "gemini" | "groq" | "pollinations" | "local";
  error?: string;
};

export function RecipeSuggestionsPage() {
  const router = useRouter();
  const selectedIngredients = useKitchenStore((state) => state.selectedIngredients);
  const selectIngredient = useKitchenStore((state) => state.selectIngredient);
  const clearIngredients = useKitchenStore((state) => state.clearIngredients);
  const recipeOptions = useKitchenStore((state) => state.recipeOptions);
  const setRecipeOptions = useKitchenStore((state) => state.setRecipeOptions);
  const setActiveRecipe = useKitchenStore((state) => state.setActiveRecipe);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [choosingRecipeId, setChoosingRecipeId] = useState("");
  const [generationSource, setGenerationSource] =
    useState<GenerateRecipeResponse["generationSource"]>();

  useEffect(() => {
    const savedIngredients = window.localStorage.getItem(ingredientStorageKey);
    const savedOptions = window.localStorage.getItem(optionsStorageKey);

    if (selectedIngredients.length === 0 && savedIngredients) {
      try {
        const parsed = JSON.parse(savedIngredients) as Ingredient[];
        clearIngredients();
        parsed.forEach((ingredient) => selectIngredient(ingredient));
      } catch {
        window.localStorage.removeItem(ingredientStorageKey);
      }
    }

    if (recipeOptions.length === 0 && savedOptions) {
      try {
        setRecipeOptions(JSON.parse(savedOptions) as RecipeOption[]);
      } catch {
        window.localStorage.removeItem(optionsStorageKey);
      }
    }
  }, [
    clearIngredients,
    recipeOptions.length,
    selectIngredient,
    selectedIngredients.length,
    setRecipeOptions,
  ]);

  const generateSuggestions = async () => {
    if (selectedIngredients.length < 2 || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: selectedIngredients.map((ingredient) => ingredient.name),
          count: 10,
          preferences: {
            mood: "creative",
            timeLimit: 45,
            dietaryStyle: "anything",
            spiceLevel: "gentle",
          },
        }),
      });
      const payload = (await response.json()) as GenerateRecipeResponse;

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not generate dishes yet.");
      }

      setRecipeOptions(payload.recipes);
      setGenerationSource(payload.generationSource ?? "local");
      window.localStorage.setItem(optionsStorageKey, JSON.stringify(payload.recipes));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not generate dishes yet.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (selectedIngredients.length >= 2 && recipeOptions.length === 0 && !isGenerating) {
      const timeoutId = window.setTimeout(() => {
        void generateSuggestions();
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
    // run only when hydration restores ingredients/options
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIngredients.length, recipeOptions.length]);

  const chooseRecipe = async (recipe: RecipeOption) => {
    if (choosingRecipeId) {
      return;
    }

    setChoosingRecipeId(recipe.id);
    setErrorMessage("");

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: selectedIngredients.map((ingredient) => ingredient.name),
          count: 1,
          dishName: recipe.name,
          preferences: {
            mood: `beginner walkthrough for ${recipe.name}`,
            timeLimit: recipe.cookTime,
            dietaryStyle: recipe.cuisine,
            spiceLevel: "gentle",
          },
        }),
      });
      const payload = (await response.json()) as GenerateRecipeResponse;
      const detailedRecipe = response.ok ? payload.recipes[0] : null;
      const nextRecipe = detailedRecipe ?? recipe;

      setActiveRecipe(nextRecipe);
      window.localStorage.setItem(activeRecipeStorageKey, JSON.stringify(nextRecipe));
      router.push("/cook");
    } catch {
      setActiveRecipe(recipe);
      window.localStorage.setItem(activeRecipeStorageKey, JSON.stringify(recipe));
      router.push("/cook");
    } finally {
      setChoosingRecipeId("");
    }
  };

  return (
    <main className="grain-overlay min-h-screen px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Logo />
            <Link
              href="/ingredients"
              className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-olive)]"
            >
              <ArrowLeft className="size-4" />
              Back to pantry
            </Link>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-none text-[var(--color-warm-brown)] sm:text-7xl">
              Choose a dish.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--color-warm-brown)]/72">
              The AI chef is building a bigger menu from your ingredients. Pick one
              and the next page becomes the cooking stage only.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--color-warm-brown)]/12 bg-white/55 p-4 shadow-[4px_4px_0_rgba(61,43,31,0.1)]">
            <p className="font-display text-4xl font-semibold">{recipeOptions.length}</p>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-warm-brown)]/62">
              dishes ready
            </p>
          </div>
        </header>

        <section className="mt-8 rounded-[1.5rem] border border-[var(--color-warm-brown)]/12 bg-white/55 p-4 shadow-[4px_4px_0_rgba(61,43,31,0.1)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-olive)]">
                {generationSource === "gemini" ? "Gemini chef" : "Menu builder"}
              </p>
              <p className="mt-2 text-[var(--color-warm-brown)]/70">
                {selectedIngredients.map((ingredient) => ingredient.name).join(", ")}
              </p>
            </div>
            <motion.button
              type="button"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              disabled={selectedIngredients.length < 2 || isGenerating}
              onClick={generateSuggestions}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-terracotta)] px-5 font-semibold text-white shadow-[3px_3px_0_var(--color-warm-brown)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Sparkles className="size-4" />
              {isGenerating ? "Generating..." : "Regenerate 10 dishes"}
            </motion.button>
          </div>
          {errorMessage ? (
            <p className="mt-4 rounded-2xl bg-[var(--color-terracotta)]/12 px-4 py-3 text-sm text-[var(--color-warm-brown)]">
              {errorMessage}
            </p>
          ) : null}
        </section>

        {selectedIngredients.length < 2 ? (
          <section className="mt-10 rounded-[2rem] border border-dashed border-[var(--color-warm-brown)]/20 bg-white/50 p-8 text-center">
            <ChefHat className="mx-auto size-10 text-[var(--color-terracotta)]" />
            <h2 className="mt-4 font-display text-4xl font-semibold">
              Pick ingredients first.
            </h2>
            <Link
              href="/ingredients"
              className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-butter)] px-5 font-semibold text-[var(--color-warm-brown)]"
            >
              Open pantry
            </Link>
          </section>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isGenerating
            ? Array.from({ length: 10 }, (_, index) => (
                <div
                  key={index}
                  className="h-72 rounded-[1.5rem] bg-white/50 [animation:skeletonPulse_1.1s_ease-in-out_infinite]"
                />
              ))
            : recipeOptions.map((recipe, index) => (
                <motion.button
                  key={`${recipe.id}-${index}`}
                  type="button"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, type: "spring", bounce: 0.28 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => void chooseRecipe(recipe)}
                  disabled={Boolean(choosingRecipeId)}
                  className="flex min-h-72 flex-col rounded-[1.5rem] border border-[var(--color-warm-brown)]/12 bg-white/62 p-5 text-left shadow-[4px_4px_0_rgba(61,43,31,0.1)]"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-display text-3xl font-semibold leading-none">
                      {recipe.name}
                    </span>
                    <span className="rounded-full bg-[var(--color-butter)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">
                      {recipe.difficulty}
                    </span>
                  </span>
                  <span className="mt-3 flex-1 text-sm leading-6 text-[var(--color-warm-brown)]/70">
                    {recipe.description}
                  </span>
                  <span className="mt-4 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-warm-brown)]/62">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="size-3.5" />
                      {recipe.cookTime} min
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Flame className="size-3.5" />
                      {recipe.cuisine}
                    </span>
                  </span>
                  <span className="mt-5 inline-flex h-11 w-fit items-center justify-center rounded-full bg-[var(--color-terracotta)] px-4 font-semibold text-white">
                    {choosingRecipeId === recipe.id ? "Building steps..." : "Cook this"}
                  </span>
                </motion.button>
              ))}
        </div>
      </div>
    </main>
  );
}
