import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const saveRecipeSchema = z.object({
  recipeId: z.string().uuid(),
});

export async function POST(request: Request) {
  const parsedRequest = saveRecipeSchema.safeParse(await request.json());

  if (!parsedRequest.success) {
    return NextResponse.json({ error: "A saved recipe needs a database recipe id." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in before saving recipes." }, { status: 401 });
  }

  const admin = createAdminClient();

  if (!admin) {
    return NextResponse.json({ error: "Recipe saving is not configured yet." }, { status: 503 });
  }

  const { data, error } = await admin
    .from("saved_recipes")
    .insert({
      user_id: user.id,
      recipe_id: parsedRequest.data.recipeId,
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Could not save that recipe." }, { status: 500 });
  }

  return NextResponse.json({ savedRecipeId: data.id });
}
