import { Logo } from "@/components/brand/logo";
import { RecipeExplorer } from "@/components/recipes/recipe-explorer";
import { getExploreRecipes } from "@/lib/recipes";
import Link from "next/link";

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
          <p className="max-w-md leading-7 text-[var(--color-warm-brown)]/68">
            Search by dish, ingredient, speed, comfort level, or protein style.
          </p>
        </section>

        <RecipeExplorer recipes={recipes} />
      </div>
    </main>
  );
}
