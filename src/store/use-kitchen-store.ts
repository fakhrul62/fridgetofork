import { create } from "zustand";

import type {
  AnimationType,
  Difficulty,
  IngredientCategory,
  RecipeStep,
} from "@/types/database";

export type Ingredient = {
  id: string;
  name: string;
  emoji: string;
  category: IngredientCategory;
};

export type RecipeOption = {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  steps: RecipeStep[];
  cookTime: number;
  difficulty: Difficulty;
  cuisine: string;
  matchScore?: number;
  substitutions?: string[];
  tasteNotes?: string[];
};

export type CookingStageStatus =
  | "idle"
  | "suggesting"
  | "ready"
  | "cooking"
  | "complete"
  | "error";

type CookingStepState = {
  index: number;
  animationType: AnimationType | null;
  remainingSeconds: number;
};

type KitchenState = {
  selectedIngredients: Ingredient[];
  recipeOptions: RecipeOption[];
  activeRecipe: RecipeOption | null;
  stageStatus: CookingStageStatus;
  currentStep: CookingStepState;
  maxIngredients: number;
  selectIngredient: (ingredient: Ingredient) => void;
  deselectIngredient: (ingredientId: string) => void;
  clearIngredients: () => void;
  setRecipeOptions: (recipes: RecipeOption[]) => void;
  setActiveRecipe: (recipe: RecipeOption | null) => void;
  setStageStatus: (status: CookingStageStatus) => void;
  setCurrentStep: (step: CookingStepState) => void;
  resetCooking: () => void;
};

const initialStep: CookingStepState = {
  index: 0,
  animationType: null,
  remainingSeconds: 0,
};

export const useKitchenStore = create<KitchenState>((set, get) => ({
  selectedIngredients: [],
  recipeOptions: [],
  activeRecipe: null,
  stageStatus: "idle",
  currentStep: initialStep,
  maxIngredients: 8,
  selectIngredient: (ingredient) => {
    const { selectedIngredients, maxIngredients } = get();
    const alreadySelected = selectedIngredients.some(
      (item) => item.id === ingredient.id,
    );

    if (alreadySelected || selectedIngredients.length >= maxIngredients) {
      return;
    }

    set({ selectedIngredients: [...selectedIngredients, ingredient] });
  },
  deselectIngredient: (ingredientId) => {
    set((state) => ({
      selectedIngredients: state.selectedIngredients.filter(
        (item) => item.id !== ingredientId,
      ),
    }));
  },
  clearIngredients: () => {
    set({
      selectedIngredients: [],
      recipeOptions: [],
      activeRecipe: null,
      stageStatus: "idle",
      currentStep: initialStep,
    });
  },
  setRecipeOptions: (recipes) => {
    set({ recipeOptions: recipes, stageStatus: recipes.length > 0 ? "ready" : "idle" });
  },
  setActiveRecipe: (recipe) => {
    set({
      activeRecipe: recipe,
      stageStatus: recipe ? "cooking" : "idle",
      currentStep: initialStep,
    });
  },
  setStageStatus: (status) => {
    set({ stageStatus: status });
  },
  setCurrentStep: (step) => {
    set({ currentStep: step });
  },
  resetCooking: () => {
    set({
      activeRecipe: null,
      stageStatus: "idle",
      currentStep: initialStep,
    });
  },
}));
