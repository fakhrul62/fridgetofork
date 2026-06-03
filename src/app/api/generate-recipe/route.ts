import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Json, RecipeStep } from "@/types/database";

const requestSchema = z.object({
  ingredients: z.array(z.string().min(1)).min(2).max(8),
});

const stepSchema = z.object({
  step_number: z.number().int().positive(),
  title: z.string().min(1),
  action: z.string().min(1),
  ingredient_involved: z.string().min(1),
  duration_seconds: z.number().int().min(5).max(900),
  animation_type: z.enum(["chop", "fry", "boil", "stir", "bake", "plate", "rest"]),
});

const recipeSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  cook_time: z.number().int().min(1).max(240),
  difficulty: z.enum(["easy", "medium", "hard"]),
  cuisine: z.string().min(1),
  steps: z.array(stepSchema).min(3).max(8),
});

const responseSchema = z.object({
  recipes: z.array(recipeSchema).length(3),
});

type GeneratedRecipe = z.infer<typeof recipeSchema>;
type SavedGeneratedRecipe = GeneratedRecipe & {
  id: string;
  ingredients: string[];
};

const systemPrompt = `You are a professional chef and recipe writer.
The user has selected ingredients. Return ONLY a valid JSON object with NO markdown,
NO backticks, NO preamble. Format:
{
  "recipes": [
    {
      "name": string,
      "description": string,
      "cook_time": number,
      "difficulty": "easy" | "medium" | "hard",
      "cuisine": string,
      "steps": [
        {
          "step_number": number,
          "title": string,
          "action": string,
          "ingredient_involved": string,
          "duration_seconds": number,
          "animation_type": "chop" | "fry" | "boil" | "stir" | "bake" | "plate" | "rest"
        }
      ]
    }
  ]
}
Return exactly 3 dish options.`;

const fallbackRecipes = (ingredients: string[]): GeneratedRecipe[] => {
  const [first, second, third = "butter"] = ingredients;
  const ingredientList = ingredients.join(", ");

  return [
    {
      name: `${first} Skillet with Golden ${second}`,
      description: `A cozy one-pan dinner where ${ingredientList} turns glossy, savory, and weeknight-friendly.`,
      cook_time: 24,
      difficulty: "easy",
      cuisine: "Modern comfort",
      steps: [
        {
          step_number: 1,
          title: `Prep the ${second}`,
          action: `Chop ${second} into bite-size pieces and keep it close to the pan.`,
          ingredient_involved: second,
          duration_seconds: 20,
          animation_type: "chop",
        },
        {
          step_number: 2,
          title: `Sear the ${first}`,
          action: `Fry ${first} until the edges take on color and the kitchen smells ready.`,
          ingredient_involved: first,
          duration_seconds: 30,
          animation_type: "fry",
        },
        {
          step_number: 3,
          title: "Bring it together",
          action: `Stir in ${ingredientList} until everything is coated and tender.`,
          ingredient_involved: third,
          duration_seconds: 25,
          animation_type: "stir",
        },
        {
          step_number: 4,
          title: "Plate with a little drama",
          action: "Slide the finished skillet onto a warm plate and finish with a glossy spoonful of sauce.",
          ingredient_involved: first,
          duration_seconds: 15,
          animation_type: "plate",
        },
      ],
    },
    {
      name: `${second} Rice Bowl`,
      description: `A bright bowl built from ${ingredientList}, layered for crunch, steam, and comfort.`,
      cook_time: 28,
      difficulty: "easy",
      cuisine: "Kitchen pantry",
      steps: [
        {
          step_number: 1,
          title: "Warm the base",
          action: `Boil or steam the bowl base while ${second} gets ready on the board.`,
          ingredient_involved: second,
          duration_seconds: 28,
          animation_type: "boil",
        },
        {
          step_number: 2,
          title: `Sizzle the ${first}`,
          action: `Drop ${first} into the hot pan and let it sizzle until deeply savory.`,
          ingredient_involved: first,
          duration_seconds: 32,
          animation_type: "fry",
        },
        {
          step_number: 3,
          title: "Rest and gloss",
          action: `Let ${ingredientList} rest together so the flavors settle before plating.`,
          ingredient_involved: third,
          duration_seconds: 20,
          animation_type: "rest",
        },
        {
          step_number: 4,
          title: "Build the bowl",
          action: "Spoon the base into a bowl, tuck the toppings around it, and finish with a warm sauce.",
          ingredient_involved: second,
          duration_seconds: 16,
          animation_type: "plate",
        },
      ],
    },
    {
      name: `Midnight Kitchen ${first} Bake`,
      description: `A playful baked dish where ${ingredientList} gets cozy under a browned top.`,
      cook_time: 36,
      difficulty: "medium",
      cuisine: "Casual bistro",
      steps: [
        {
          step_number: 1,
          title: "Chop the supporting cast",
          action: `Cut ${second} and ${third} small so they melt into the bake.`,
          ingredient_involved: second,
          duration_seconds: 24,
          animation_type: "chop",
        },
        {
          step_number: 2,
          title: "Stir the filling",
          action: `Fold ${ingredientList} together until the mixture looks glossy and even.`,
          ingredient_involved: first,
          duration_seconds: 25,
          animation_type: "stir",
        },
        {
          step_number: 3,
          title: "Bake until bubbling",
          action: "Slide the dish into the oven and bake until the top is golden and the middle is bubbling.",
          ingredient_involved: first,
          duration_seconds: 34,
          animation_type: "bake",
        },
        {
          step_number: 4,
          title: "Plate the first spoonful",
          action: "Scoop generously and let the finished dish sparkle before serving.",
          ingredient_involved: first,
          duration_seconds: 15,
          animation_type: "plate",
        },
      ],
    },
  ];
};

const extractClaudeText = (message: Anthropic.Messages.Message) =>
  message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

const normalizeClaudePayload = (rawText: string) => {
  const parsed: unknown = JSON.parse(rawText);
  const recipesValue =
    Array.isArray(parsed) || (typeof parsed === "object" && parsed !== null && "name" in parsed)
      ? { recipes: Array.isArray(parsed) ? parsed : [parsed, parsed, parsed] }
      : parsed;

  return responseSchema.parse(recipesValue);
};

const saveRecipes = async (
  recipes: GeneratedRecipe[],
  ingredients: string[],
): Promise<SavedGeneratedRecipe[]> => {
  const supabase = createAdminClient();

  if (!supabase) {
    return recipes.map((recipe, index) => ({
      id: `local-${Date.now()}-${index}`,
      ingredients,
      ...recipe,
    }));
  }

  const { data, error } = await supabase
    .from("recipes")
    .insert(
      recipes.map((recipe) => ({
        name: recipe.name,
        description: recipe.description,
        ingredients,
        steps: recipe.steps as unknown as Json,
        cook_time: recipe.cook_time,
        difficulty: recipe.difficulty,
        cuisine: recipe.cuisine,
      })),
    )
    .select("id,name,description,ingredients,steps,cook_time,difficulty,cuisine");

  if (error || !data) {
    return recipes.map((recipe, index) => ({
      id: `local-${Date.now()}-${index}`,
      ingredients,
      ...recipe,
    }));
  }

  return data.map((recipe) => ({
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    ingredients: recipe.ingredients,
    steps: recipe.steps as unknown as RecipeStep[],
    cook_time: recipe.cook_time,
    difficulty: recipe.difficulty,
    cuisine: recipe.cuisine,
  }));
};

export async function POST(request: Request) {
  const parsedRequest = requestSchema.safeParse(await request.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: "Choose between 2 and 8 ingredients first." },
      { status: 400 },
    );
  }

  const { ingredients } = parsedRequest.data;
  let recipes = fallbackRecipes(ingredients);

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2400,
        temperature: 0.8,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Selected ingredients: ${ingredients.join(", ")}`,
          },
        ],
      });

      const payload = normalizeClaudePayload(extractClaudeText(message));
      recipes = payload.recipes;
    } catch {
      recipes = fallbackRecipes(ingredients);
    }
  }

  const savedRecipes = await saveRecipes(recipes, ingredients);

  return NextResponse.json({
    recipes: savedRecipes.map((recipe) => ({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      cookTime: recipe.cook_time,
      difficulty: recipe.difficulty,
      cuisine: recipe.cuisine,
    })),
  });
}
