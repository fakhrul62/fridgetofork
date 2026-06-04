import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Json, RecipeStep } from "@/types/database";

const requestSchema = z.object({
  ingredients: z.array(z.string().min(1)).min(2).max(100),
  preferences: z
    .object({
      mood: z.string().max(40).optional(),
      timeLimit: z.number().int().min(10).max(90).optional(),
      dietaryStyle: z.string().max(40).optional(),
      spiceLevel: z.string().max(24).optional(),
      avoid: z.string().max(120).optional(),
    })
    .optional(),
});

type GeneratedRecipe = {
  name: string;
  description: string;
  cook_time: number;
  difficulty: "easy" | "medium" | "hard";
  cuisine: string;
  steps: RecipeStep[];
  match_score?: number;
  substitutions?: string[];
  taste_notes?: string[];
  shopping_list?: string[];
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};
type SavedGeneratedRecipe = Omit<
  GeneratedRecipe,
  "ingredients" | "match_score" | "substitutions" | "taste_notes" | "shopping_list" | "nutrition"
> & {
  id: string;
  ingredients: string[];
  match_score?: number | null;
  substitutions?: string[] | null;
  taste_notes?: string[] | null;
  shopping_list?: string[] | null;
  nutrition?: Json | null;
};

const generateRecipeOptions = (
  ingredients: string[],
  preferences?: z.infer<typeof requestSchema>["preferences"],
): GeneratedRecipe[] => {
  const selected = [...new Set(ingredients.map((ingredient) => ingredient.trim()).filter(Boolean))];
  const [first, second, third = "butter"] = selected;
  const featuredIngredients = selected.slice(0, 8);
  const extraCount = Math.max(0, selected.length - featuredIngredients.length);
  const ingredientList =
    extraCount > 0
      ? `${featuredIngredients.join(", ")} and ${extraCount} more`
      : featuredIngredients.join(", ");
  const mood = preferences?.mood ?? "cozy";
  const cuisineHint = preferences?.dietaryStyle ? `${preferences.dietaryStyle} comfort` : "Modern comfort";
  const spiceNote =
    preferences?.spiceLevel === "bold" ? "with a confident warm finish" : "with a balanced finish";
  const matchScore = Math.min(98, 68 + Math.min(selected.length, 8) * 4);
  const prepTarget = featuredIngredients.slice(1, 4).join(", ") || second;
  const finishingCast = featuredIngredients.slice(0, 6).join(", ");

  return [
    {
      name: `${first} Skillet with Golden ${second}`,
      description: `A ${mood} one-pan dinner built around ${ingredientList}, finished glossy, savory, and weeknight-friendly.`,
      cook_time: Math.min(preferences?.timeLimit ?? 24, 32),
      difficulty: "easy",
      cuisine: cuisineHint,
      match_score: matchScore,
      substitutions: [
        `No ${third}? Use olive oil, yogurt, or a splash of stock.`,
        `Need more body? Add rice, pasta, or toasted bread on the side.`,
      ],
      taste_notes: ["Glossy", "Savory", spiceNote],
      shopping_list: ["olive oil", "salt", "fresh herbs"],
      nutrition: { calories: 520, protein: 34, carbs: 38, fat: 24 },
      steps: [
        {
          step_number: 1,
          title: `Prep the supporting ingredients`,
          action: `Chop and organize ${prepTarget} so the crowded pantry lineup cooks evenly.`,
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
          action: `Stir in ${finishingCast} until everything is coated, tender, and balanced.`,
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
      description: `A bright bowl using ${ingredientList}, layered for crunch, steam, and comfort.`,
      cook_time: Math.min(preferences?.timeLimit ?? 28, 38),
      difficulty: "easy",
      cuisine: "Kitchen pantry",
      match_score: Math.min(94, matchScore - 2),
      substitutions: [
        "No rice? Use noodles, bread, quinoa, or a tortilla.",
        `No ${first}? Swap in tofu, eggs, shrimp, or mushrooms.`,
      ],
      taste_notes: ["Layered", "Steamy", "Flexible"],
      shopping_list: ["soy sauce", "sesame oil", "lime"],
      nutrition: { calories: 610, protein: 29, carbs: 72, fat: 20 },
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
          action: `Let the cooked ingredients rest together so the flavors settle before plating.`,
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
      description: `A playful baked dish with ${ingredientList}, tucked under a browned top.`,
      cook_time: Math.min(preferences?.timeLimit ?? 36, 45),
      difficulty: "medium",
      cuisine: "Casual bistro",
      match_score: Math.min(90, matchScore - 6),
      substitutions: [
        "No oven time? Finish it covered in a skillet.",
        "No dairy? Use olive oil, coconut milk, or a spoon of tahini.",
      ],
      taste_notes: ["Bubbly", "Toasty", "Comforting"],
      shopping_list: ["breadcrumbs", "olive oil", "greens"],
      nutrition: { calories: 680, protein: 32, carbs: 48, fat: 34 },
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
          action: `Fold the selected ingredients together until the mixture looks glossy and even.`,
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
        match_score: recipe.match_score ?? null,
        substitutions: recipe.substitutions ?? [],
        taste_notes: recipe.taste_notes ?? [],
        shopping_list: recipe.shopping_list ?? [],
        nutrition: (recipe.nutrition ?? null) as Json,
      })),
    )
    .select("id,name,description,ingredients,steps,cook_time,difficulty,cuisine,match_score,substitutions,taste_notes,shopping_list,nutrition");

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
    match_score: recipe.match_score ?? null,
    substitutions: recipe.substitutions ?? [],
    taste_notes: recipe.taste_notes ?? [],
    shopping_list: recipe.shopping_list ?? [],
    nutrition: recipe.nutrition,
  }));
};

export async function POST(request: Request) {
  const parsedRequest = requestSchema.safeParse(await request.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: "Choose at least 2 ingredients first." },
      { status: 400 },
    );
  }

  const { ingredients, preferences } = parsedRequest.data;
  const recipes = generateRecipeOptions(ingredients, preferences);
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
      matchScore: recipe.match_score ?? Math.min(96, 70 + recipe.ingredients.length * 4),
      substitutions: recipe.substitutions ?? [],
      tasteNotes: recipe.taste_notes ?? [],
      shoppingList: recipe.shopping_list ?? [],
      nutrition:
        recipe.nutrition ??
        {
          calories: 520,
          protein: 28,
          carbs: 46,
          fat: 22,
        },
    })),
  });
}
