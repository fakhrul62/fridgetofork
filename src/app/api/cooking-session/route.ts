import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";

const sessionSchema = z.object({
  recipeId: z.string().min(1),
  completed: z.boolean().default(false),
});

export async function POST(request: Request) {
  const parsedRequest = sessionSchema.safeParse(await request.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: "A recipe id is required to track a cooking session." },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();

  if (!supabase || parsedRequest.data.recipeId.startsWith("local-")) {
    return NextResponse.json({
      session: {
        id: `local-session-${Date.now()}`,
        recipeId: parsedRequest.data.recipeId,
        completed: parsedRequest.data.completed,
      },
    });
  }

  const { data, error } = await supabase
    .from("cooking_sessions")
    .insert({
      recipe_id: parsedRequest.data.recipeId,
      completed: parsedRequest.data.completed,
    })
    .select("id,recipe_id,completed")
    .single();

  if (error || !data) {
    return NextResponse.json({
      session: {
        id: `local-session-${Date.now()}`,
        recipeId: parsedRequest.data.recipeId,
        completed: parsedRequest.data.completed,
      },
    });
  }

  return NextResponse.json({
    session: {
      id: data.id,
      recipeId: data.recipe_id,
      completed: data.completed,
    },
  });
}
