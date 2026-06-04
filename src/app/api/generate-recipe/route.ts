import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Json, RecipeStep } from "@/types/database";

const requestSchema = z.object({
  ingredients: z.array(z.string().min(1)).min(2).max(100),
  count: z.number().int().min(1).max(15).optional(),
  dishName: z.string().min(1).max(120).optional(),
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

const aiStepSchema = z.object({
  step_number: z.coerce.number().int().positive(),
  title: z.string().min(1),
  action: z.string().min(1),
  ingredient_involved: z.string().min(1),
  duration_seconds: z.coerce.number().int().min(5).max(900),
  animation_type: z.preprocess(
    (value) => (typeof value === "string" ? value.toLowerCase().trim() : value),
    z.enum(["chop", "fry", "boil", "stir", "bake", "plate", "rest"]),
  ),
});

const aiRecipeSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  cook_time: z.coerce.number().int().min(1).max(240),
  difficulty: z.preprocess(
    (value) => (typeof value === "string" ? value.toLowerCase().trim() : value),
    z.enum(["easy", "medium", "hard"]),
  ),
  cuisine: z.string().min(1),
  steps: z.array(aiStepSchema).min(3).max(8),
  match_score: z.coerce.number().int().min(0).max(100).optional(),
  substitutions: z.array(z.string()).optional(),
  taste_notes: z.array(z.string()).optional(),
  shopping_list: z.array(z.string()).optional(),
  nutrition: z
    .object({
      calories: z.coerce.number().int().min(0),
      protein: z.coerce.number().int().min(0),
      carbs: z.coerce.number().int().min(0),
      fat: z.coerce.number().int().min(0),
    })
    .optional(),
});

const aiResponseSchema = z.object({
  recipes: z.array(aiRecipeSchema).min(1),
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

const animationTypes = ["chop", "fry", "boil", "stir", "bake", "plate", "rest"] as const;

const buildAiPrompt = (
  ingredients: string[],
  count: number,
  dishName?: string,
  preferences?: z.infer<typeof requestSchema>["preferences"],
) => {
  const needsDetailedSteps = count <= 3;

  return `You are a professional chef and recipe writer for an animated cooking web app.
Return ONLY JSON. No markdown, no preamble.
Make exactly ${count} ${dishName ? `recipe for "${dishName}"` : "different recipe ideas"} from these ingredients: ${ingredients.join(", ")}.
Preferences: ${JSON.stringify(preferences ?? {})}.
Avoid template names like "Skillet with Golden", "Rice Bowl", or "Midnight Kitchen Bake".
${
  needsDetailedSteps
    ? "Write for someone who cannot cook yet. Every step action must be very descriptive and specific: include heat level, pan/pot size when useful, how to prep the ingredient, what to listen/smell/look for, exact doneness cues, what to do immediately after the sub-step, and safety/handling details like rinsing noodles under cold water, reserving pasta water, patting shrimp dry, lowering heat before adding eggs, or resting food before cutting. Each action should be 45-80 words, practical, and written as one clear paragraph. Do not say vague things like \"cook until done\"."
    : "This is only a menu suggestion list. Keep each step action concise, 12-22 words, but still valid for animation preview. Save the detailed beginner instructions for the selected dish later."
}
Use this exact shape:
{"recipes":[{"name":"specific dish","description":"one sentence","cook_time":25,"difficulty":"easy|medium|hard","cuisine":"specific style","match_score":88,"substitutions":["swap"],"taste_notes":["savory"],"shopping_list":["optional extra"],"nutrition":{"calories":520,"protein":30,"carbs":45,"fat":20},"steps":[{"step_number":1,"title":"short","action":"specific instruction","ingredient_involved":"ingredient","duration_seconds":20,"animation_type":"chop"}]}]}
Each recipe needs exactly 4 steps. animation_type must be one of: ${animationTypes.join(", ")}.`;
};

const extractJsonObject = (text: string) => {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("AI did not return JSON.");
  }

  return text.slice(firstBrace, lastBrace + 1);
};

type AiGenerationResult = {
  recipes: GeneratedRecipe[];
  provider: "gemini" | "groq" | "pollinations";
};

const parseAiRecipeText = (text: string): GeneratedRecipe[] => {
  const parsed = JSON.parse(extractJsonObject(text)) as unknown;
  const payload = aiResponseSchema.parse(parsed);

  return payload.recipes;
};

const readGeminiText = async (prompt: string): Promise<string | null> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const models = [
    process.env.GEMINI_MODEL,
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
  ].filter((model, index, list): model is string => Boolean(model) && list.indexOf(model) === index);

  for (const model of models) {
    let response: Response;

    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.8,
            maxOutputTokens: 8192,
            },
          }),
          signal: AbortSignal.timeout(30000),
        },
      );
    } catch (error) {
      console.warn(
        `Gemini recipe generation timed out model=${model} message=${
          error instanceof Error ? error.message : "Unknown fetch error"
        }`,
      );
      continue;
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.warn(
        `Gemini recipe generation failed model=${model} status=${response.status} statusText=${response.statusText} detail=${errorText.slice(0, 180)}`,
      );
      continue;
    }

    const payload = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };
    const text = payload.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    if (text) {
      return text;
    }
  }

  return null;
};

const readGroqText = async (prompt: string): Promise<string | null> => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return null;
  }

  const model = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
    signal: AbortSignal.timeout(18000),
  });

  if (!response.ok) {
    console.warn(
      `Groq recipe generation failed status=${response.status} statusText=${response.statusText}`,
    );
    return null;
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  return payload.choices?.[0]?.message?.content?.trim() || null;
};

const readPollinationsText = async (prompt: string): Promise<string | null> => {
  const encodedPrompt = encodeURIComponent(prompt);
  const pollinationsKey = process.env.POLLINATIONS_API_KEY;
  const endpoint = pollinationsKey
    ? `https://gen.pollinations.ai/text/${encodedPrompt}?key=${encodeURIComponent(pollinationsKey)}`
    : `https://text.pollinations.ai/${encodedPrompt}`;
  const response = await fetch(endpoint, {
    headers: {
      Accept: "text/plain, application/json",
    },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    console.warn(
      `Pollinations recipe generation failed status=${response.status} statusText=${response.statusText}`,
    );
    return null;
  }

  return response.text();
};

const generateAiRecipes = async (
  ingredients: string[],
  count: number,
  dishName?: string,
  preferences?: z.infer<typeof requestSchema>["preferences"],
): Promise<AiGenerationResult | null> => {
  const prompt = buildAiPrompt(ingredients, count, dishName, preferences);

  const providers = [
    { name: "gemini" as const, read: readGeminiText },
    { name: "groq" as const, read: readGroqText },
    ...(!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY
      ? [{ name: "pollinations" as const, read: readPollinationsText }]
      : []),
  ];

  for (const provider of providers) {
    try {
      const text = await provider.read(prompt);

      if (!text) {
        continue;
      }

      return {
        provider: provider.name,
        recipes: parseAiRecipeText(text),
      };
    } catch (error) {
      console.warn(
        `${provider.name} recipe generation could not be used: ${
          error instanceof Error ? error.message : "Unknown provider error"
        }`,
      );
      continue;
    }
  }

  return null;
};

const generateRecipeOptions = (
  ingredients: string[],
  count = 3,
  preferences?: z.infer<typeof requestSchema>["preferences"],
): GeneratedRecipe[] => {
  const selected = [...new Set(ingredients.map((ingredient) => ingredient.trim()).filter(Boolean))];
  const [first, second, third = "butter"] = selected;
  const seed = selected.join("|").split("").reduce((total, character) => total + character.charCodeAt(0), 0);
  const styleNames = [
    "Taverna",
    "Sunday Market",
    "Clay Pot",
    "Charred Garden",
    "Butter-Lit",
    "Hearthside",
  ];
  const techniqueNames = [
    "Braise",
    "Toss",
    "Crisp",
    "Supper",
    "Sizzle",
    "Roast",
  ];
  const styleName = styleNames[seed % styleNames.length];
  const secondStyleName = styleNames[(seed + 2) % styleNames.length];
  const thirdStyleName = styleNames[(seed + 4) % styleNames.length];
  const techniqueName = techniqueNames[(seed + selected.length) % techniqueNames.length];
  const secondTechniqueName = techniqueNames[(seed + selected.length + 2) % techniqueNames.length];
  const thirdTechniqueName = techniqueNames[(seed + selected.length + 4) % techniqueNames.length];
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

  const baseRecipes: GeneratedRecipe[] = [
    {
      name: `${styleName} ${first} and ${second} ${techniqueName}`,
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
          action: `Set a cutting board on a steady surface and place a damp towel underneath if it slides. Chop ${prepTarget} into small, even pieces so they cook at the same speed. Keep raw proteins separate from vegetables, wipe the board if juices spread, and line the prepared ingredients beside the stove before heating the pan.`,
          ingredient_involved: second,
          duration_seconds: 20,
          animation_type: "chop",
        },
        {
          step_number: 2,
          title: `Sear the ${first}`,
          action: `Warm a wide skillet over medium heat for 1 minute, then add a thin layer of oil or butter. Add ${first} in one layer so it sizzles instead of steams. Let it sit until the underside colors, then turn gently. If the pan smokes, lower the heat and wait 20 seconds before continuing.`,
          ingredient_involved: first,
          duration_seconds: 30,
          animation_type: "fry",
        },
        {
          step_number: 3,
          title: "Bring it together",
          action: `Add ${finishingCast} in the order of firmest to softest, stirring after each addition. Keep the heat at medium-low so nothing scorches. Scrape the browned bits from the bottom with a spoon, add a splash of water or stock if the pan looks dry, and cook until vegetables are tender but still bright.`,
          ingredient_involved: third,
          duration_seconds: 25,
          animation_type: "stir",
        },
        {
          step_number: 4,
          title: "Plate with a little drama",
          action: "Turn off the heat before plating so the food does not overcook while you arrange it. Taste one small bite and add salt, lemon, or yogurt if it needs balance. Spoon the food onto a warm plate, keep sauce over the top instead of the rim, and let it rest for 1 minute before serving.",
          ingredient_involved: first,
          duration_seconds: 15,
          animation_type: "plate",
        },
      ],
    },
    {
      name: `${secondStyleName} ${second} Pantry ${secondTechniqueName}`,
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
          action: `Cook the grain, noodle, or bowl base first because it can wait while the toppings cook. If boiling noodles, stir during the first minute so they do not stick, taste one strand near the end, then drain and rinse briefly with warm water for saucy bowls or cold water for salad-style bowls.`,
          ingredient_involved: second,
          duration_seconds: 28,
          animation_type: "boil",
        },
        {
          step_number: 2,
          title: `Sizzle the ${first}`,
          action: `Pat ${first} dry if it is wet, because moisture stops browning. Heat a skillet over medium-high until a drop of water flickers, then add oil and ${first}. Spread it out, cook until the edges brown, then turn. If pieces stick, wait a little longer before moving them.`,
          ingredient_involved: first,
          duration_seconds: 32,
          animation_type: "fry",
        },
        {
          step_number: 3,
          title: "Rest and gloss",
          action: `Move the cooked toppings to one side of the pan and lower the heat. Add a spoonful of sauce, yogurt, butter, or stock, then stir gently until everything looks lightly glossy. Let the mixture rest off the heat for 1 minute so juices settle and the sauce clings instead of running.`,
          ingredient_involved: third,
          duration_seconds: 20,
          animation_type: "rest",
        },
        {
          step_number: 4,
          title: "Build the bowl",
          action: "Fluff the base with a fork before serving so it does not clump. Spoon it into the bowl first, then place the toppings in small sections so every bite has contrast. Add the sauce last, starting with less than you think, and keep extra on the side for adjusting.",
          ingredient_involved: second,
          duration_seconds: 16,
          animation_type: "plate",
        },
      ],
    },
    {
      name: `${thirdStyleName} ${first} ${thirdTechniqueName}`,
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
          action: `Cut ${second} and ${third} into small, similar pieces so they soften before the top browns. If either ingredient releases water, pat it dry with a towel first. Put everything in separate piles, preheat the oven if baking, and lightly grease the dish before adding the filling.`,
          ingredient_involved: second,
          duration_seconds: 24,
          animation_type: "chop",
        },
        {
          step_number: 2,
          title: "Stir the filling",
          action: `Use a large bowl so you can mix without spilling. Add the heavier ingredients first, then fold in delicate ones with a spoon instead of smashing them. The filling should look evenly coated but not watery; if it seems loose, add breadcrumbs, cooked rice, or a spoon of yogurt to bind it.`,
          ingredient_involved: first,
          duration_seconds: 25,
          animation_type: "stir",
        },
        {
          step_number: 3,
          title: "Bake until bubbling",
          action: "Place the dish on the middle oven rack so heat surrounds it evenly. Bake until the edges bubble and the top turns golden, then check the center with a spoon; it should be hot and thick, not runny. If the top browns too fast, cover loosely with foil and keep baking.",
          ingredient_involved: first,
          duration_seconds: 34,
          animation_type: "bake",
        },
        {
          step_number: 4,
          title: "Plate the first spoonful",
          action: "Let the bake rest for 5 minutes before scooping, because the filling firms up as it cools slightly. Use a wide spoon to lift from the edge toward the center. Taste before serving and finish with lemon, herbs, yogurt, or oil if it needs freshness or shine.",
          ingredient_involved: first,
          duration_seconds: 15,
          animation_type: "plate",
        },
      ],
    },
  ];

  if (count <= baseRecipes.length) {
    return baseRecipes.slice(0, count);
  }

  return Array.from({ length: count }, (_, index) => {
    const baseRecipe = baseRecipes[index % baseRecipes.length];
    const namePrefix = styleNames[(seed + index) % styleNames.length];
    const technique = techniqueNames[(seed + selected.length + index) % techniqueNames.length];

    return {
      ...baseRecipe,
      name:
        index < baseRecipes.length
          ? baseRecipe.name
          : `${namePrefix} ${featuredIngredients[index % featuredIngredients.length] ?? first} ${technique}`,
      cuisine:
        index < baseRecipes.length
          ? baseRecipe.cuisine
          : ["Bengali-inspired", "Mediterranean", "Weeknight Japanese", "Modern pantry"][
              index % 4
            ],
      match_score:
        typeof baseRecipe.match_score === "number"
          ? Math.max(74, baseRecipe.match_score - index)
          : Math.max(74, matchScore - index),
    };
  });
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

  const { ingredients, count = 3, dishName, preferences } = parsedRequest.data;
  const aiRecipes = await generateAiRecipes(ingredients, count, dishName, preferences);
  const recipes =
    aiRecipes && aiRecipes.recipes.length >= count
      ? aiRecipes.recipes.slice(0, count)
      : [
          ...(aiRecipes?.recipes ?? []),
          ...generateRecipeOptions(ingredients, count, preferences),
        ].slice(0, count);
  const savedRecipes = await saveRecipes(recipes, ingredients);

  return NextResponse.json({
    generationSource: aiRecipes?.provider ?? "local",
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
