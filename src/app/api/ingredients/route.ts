import { NextResponse } from "next/server";

import { ingredients as fallbackIngredients } from "@/data/ingredients";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Ingredient } from "@/store/use-kitchen-store";

const mergeIngredients = (remoteIngredients: Ingredient[]) => {
  const localNames = new Set(
    fallbackIngredients.map((ingredient) => ingredient.name.toLowerCase()),
  );
  const remoteOnly = remoteIngredients.filter(
    (ingredient) => !localNames.has(ingredient.name.toLowerCase()),
  );

  return [...fallbackIngredients, ...remoteOnly];
};

export async function GET() {
  const supabase = createAdminClient();

  if (!supabase) {
    return NextResponse.json({ ingredients: fallbackIngredients });
  }

  const { data, error } = await supabase
    .from("ingredients")
    .select("id,name,emoji,category")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data || data.length === 0) {
    return NextResponse.json({ ingredients: fallbackIngredients });
  }

  return NextResponse.json({ ingredients: mergeIngredients(data) });
}
