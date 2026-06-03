import { NextResponse } from "next/server";

import { ingredients as fallbackIngredients } from "@/data/ingredients";
import { createAdminClient } from "@/lib/supabase/admin";

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

  return NextResponse.json({ ingredients: data });
}
