import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { getExploreRecipes } from "@/lib/recipes";

export default async function ExplorePage() {
  const recipes = await getExploreRecipes();

  return (
    <main className="grain-overlay min-h-screen px-5 py-8 sm:px-8 lg:px-12">
      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <Link
            href="/"
            className="w-fit rounded-full bg-[var(--color-terracotta)] px-5 py-3 font-semibold text-white shadow-[3px_3px_0_var(--color-warm-brown)]"
          >
            Back to kitchen
          </Link>
        </header>

        <section className="mt-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-olive)]">
              Explore
            </p>
            <h1 className="mt-3 font-display text-6xl font-semibold leading-none">
              Recipe discovery
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-xs uppercase tracking-[0.12em]">
            {["Most cooked", "Newest", "Trending"].map((filter) => (
              <span
                key={filter}
                className="rounded-full border border-[var(--color-warm-brown)]/12 bg-white/52 px-4 py-2"
              >
                {filter}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe, index) => (
            <Link
              key={recipe.id}
              href={`/recipe/${recipe.id}`}
              className="group rounded-[1.5rem] border border-[var(--color-warm-brown)]/12 bg-white/58 p-5 shadow-[4px_4px_0_rgba(61,43,31,0.1)] transition-transform hover:-translate-y-1"
            >
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
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
