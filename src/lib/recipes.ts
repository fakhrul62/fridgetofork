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
  match_score?: number | null;
  substitutions?: string[] | null;
  taste_notes?: string[] | null;
  shopping_list?: string[] | null;
  nutrition?: unknown;
}): RecipeOption => ({
  id: recipe.id,
  name: recipe.name,
  description: recipe.description,
  ingredients: recipe.ingredients,
  steps: recipe.steps as RecipeStep[],
  cookTime: recipe.cook_time,
  difficulty: recipe.difficulty,
  cuisine: recipe.cuisine,
  matchScore: recipe.match_score ?? undefined,
  substitutions: recipe.substitutions ?? undefined,
  tasteNotes: recipe.taste_notes ?? undefined,
  shoppingList: recipe.shopping_list ?? undefined,
  nutrition: recipe.nutrition as RecipeOption["nutrition"],
});

export const getExploreRecipes = async () => {
  const admin = createAdminClient();

  if (!admin) {
    return featuredRecipes;
  }

  const { data, error } = await admin
    .from("recipes")
    .select("id,name,description,ingredients,steps,cook_time,difficulty,cuisine,match_score,substitutions,taste_notes,shopping_list,nutrition")
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
    .select("id,name,description,ingredients,steps,cook_time,difficulty,cuisine,match_score,substitutions,taste_notes,shopping_list,nutrition")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return mapRecipeRow(data);
};
