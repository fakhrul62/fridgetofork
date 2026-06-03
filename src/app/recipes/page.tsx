import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export default async function SavedRecipesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const admin = createAdminClient();
  const savedRecipes = admin
    ? await admin
        .from("saved_recipes")
        .select("id,recipe_id,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: null };

  const recipeIds = savedRecipes.data
    ?.map((savedRecipe) => savedRecipe.recipe_id)
    .filter((recipeId): recipeId is string => Boolean(recipeId));
  const recipes =
    admin && recipeIds?.length
      ? await admin
          .from("recipes")
          .select("id,name,description,ingredients,cook_time,difficulty,cuisine")
          .in("id", recipeIds)
      : { data: [] };
  const recipeRows = recipes.data ?? [];

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

        <section className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-olive)]">
            Your Cookbook
          </p>
          <h1 className="mt-3 font-display text-6xl font-semibold leading-none">
            Saved recipes
          </h1>
        </section>

        {recipeRows.length === 0 ? (
          <section className="mt-10 grid min-h-96 place-items-center rounded-[2rem] border border-dashed border-[var(--color-warm-brown)]/22 bg-white/45 p-8 text-center">
            <div>
              <div className="mx-auto grid size-24 place-items-center rounded-full bg-[var(--color-butter)] text-5xl">
                👨‍🍳
              </div>
              <h2 className="mt-6 font-display text-4xl font-semibold">Cook something first!</h2>
              <p className="mt-3 max-w-md leading-7 text-[var(--color-warm-brown)]/65">
                Finish a dish on the cooking stage, then save it here for replay.
              </p>
            </div>
          </section>
        ) : (
          <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recipeRows.map((recipe) => (
              <article
                key={recipe.id}
                className="rounded-[1.5rem] border border-[var(--color-warm-brown)]/12 bg-white/58 p-5 shadow-[4px_4px_0_rgba(61,43,31,0.1)]"
              >
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-terracotta)]">
                  {recipe.cuisine} · {recipe.difficulty} · {recipe.cook_time} min
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold">{recipe.name}</h2>
                <p className="mt-3 leading-7 text-[var(--color-warm-brown)]/68">
                  {recipe.description}
                </p>
                <p className="mt-5 font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-warm-brown)]/58">
                  {recipe.ingredients.join(" · ")}
                </p>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
