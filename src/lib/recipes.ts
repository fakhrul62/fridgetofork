import { featuredRecipes } from "@/data/featured-recipes";
import { createAdminClient } from "@/lib/supabase/admin";
import type { RecipeOption } from "@/store/use-kitchen-store";
import type { RecipeStep } from "@/types/database";

const mapRecipeRow = (recipe: {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  steps: unknown;
  cook_time: number;
  difficulty: "easy" | "medium" | "hard";
  cuisine: string;
}): RecipeOption => ({
  id: recipe.id,
  name: recipe.name,
  description: recipe.description,
  ingredients: recipe.ingredients,
  steps: recipe.steps as RecipeStep[],
  cookTime: recipe.cook_time,
  difficulty: recipe.difficulty,
  cuisine: recipe.cuisine,
});

export const getExploreRecipes = async () => {
  const admin = createAdminClient();

  if (!admin) {
    return featuredRecipes;
  }

  const { data, error } = await admin
    .from("recipes")
    .select("id,name,description,ingredients,steps,cook_time,difficulty,cuisine")
    .order("created_at", { ascending: false })
    .limit(24);

  if (error || !data || data.length === 0) {
    return featuredRecipes;
  }

  return data.map(mapRecipeRow);
};

export const getRecipeById = async (id: string) => {
  const sample = featuredRecipes.find((recipe) => recipe.id === id);

  if (sample) {
    return sample;
  }

  const admin = createAdminClient();

  if (!admin) {
    return null;
  }

  const { data, error } = await admin
    .from("recipes")
    .select("id,name,description,ingredients,steps,cook_time,difficulty,cuisine")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return mapRecipeRow(data);
};
