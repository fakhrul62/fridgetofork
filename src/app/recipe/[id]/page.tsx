import Link from "next/link";
import { notFound } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { RecipeReplay } from "@/components/recipes/recipe-replay";
import { ShareButton } from "@/components/recipes/share-button";
import { getRecipeById } from "@/lib/recipes";

type RecipePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="grain-overlay min-h-screen px-5 py-8 sm:px-8 lg:px-12">
      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <div className="flex flex-wrap gap-3">
            <ShareButton title={recipe.name} />
            <Link
              href="/explore"
              className="rounded-full bg-[var(--color-terracotta)] px-5 py-3 font-semibold text-white shadow-[3px_3px_0_var(--color-warm-brown)]"
            >
              Explore
            </Link>
          </div>
        </header>

        <section className="mt-14 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="space-y-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-olive)]">
                {recipe.cuisine} · {recipe.difficulty} · {recipe.cookTime} min
              </p>
              <h1 className="mt-4 font-display text-6xl font-semibold leading-none">
                {recipe.name}
              </h1>
              <p className="mt-6 text-lg leading-8 text-[var(--color-warm-brown)]/70">
                {recipe.description}
              </p>
            </div>

            <section className="rounded-[1.5rem] border border-[var(--color-warm-brown)]/12 bg-white/54 p-5 shadow-[4px_4px_0_rgba(61,43,31,0.1)]">
              <h2 className="font-display text-3xl font-semibold">Ingredients</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {recipe.ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="rounded-full bg-[var(--color-butter)]/55 px-3 py-2 font-mono text-xs uppercase tracking-[0.1em]"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </section>

            {(recipe.tasteNotes?.length || recipe.substitutions?.length) ? (
              <section className="rounded-[1.5rem] border border-[var(--color-warm-brown)]/12 bg-white/54 p-5 shadow-[4px_4px_0_rgba(61,43,31,0.1)]">
                <h2 className="font-display text-3xl font-semibold">Chef notes</h2>
                {recipe.tasteNotes?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {recipe.tasteNotes.map((note) => (
                      <span
                        key={note}
                        className="rounded-full bg-[var(--color-butter)]/55 px-3 py-2 font-mono text-xs uppercase tracking-[0.1em]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                ) : null}
                {recipe.substitutions?.length ? (
                  <ul className="mt-4 space-y-2 text-[var(--color-warm-brown)]/70">
                    {recipe.substitutions.map((substitution) => (
                      <li key={substitution}>Smart swap: {substitution}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ) : null}

            <section className="rounded-[1.5rem] border border-[var(--color-warm-brown)]/12 bg-white/54 p-5 shadow-[4px_4px_0_rgba(61,43,31,0.1)]">
              <h2 className="font-display text-3xl font-semibold">Steps</h2>
              <ol className="mt-4 space-y-4">
                {recipe.steps.map((step) => (
                  <li key={step.step_number} className="leading-7">
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-terracotta)]">
                      {step.step_number}. {step.animation_type}
                    </span>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-[var(--color-warm-brown)]/68">{step.action}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <RecipeReplay recipe={recipe} />
        </section>
      </div>
    </main>
  );
}
