export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type IngredientCategory =
  | "protein"
  | "vegetable"
  | "grain"
  | "aromatic"
  | "dairy"
  | "spice";

export type Difficulty = "easy" | "medium" | "hard";

export type AnimationType =
  | "chop"
  | "fry"
  | "boil"
  | "stir"
  | "bake"
  | "plate"
  | "rest";

export type RecipeStep = {
  step_number: number;
  title: string;
  action: string;
  ingredient_involved: string;
  duration_seconds: number;
  animation_type: AnimationType;
};

export type Database = {
  public: {
    Tables: {
      ingredients: {
        Row: {
          id: string;
          name: string;
          emoji: string;
          category: IngredientCategory;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          emoji: string;
          category: IngredientCategory;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          emoji?: string;
          category?: IngredientCategory;
          created_at?: string;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          id: string;
          name: string;
          description: string;
          ingredients: string[];
          steps: Json;
          cook_time: number;
          difficulty: Difficulty;
          cuisine: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          ingredients: string[];
          steps: Json;
          cook_time: number;
          difficulty: Difficulty;
          cuisine: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          ingredients?: string[];
          steps?: Json;
          cook_time?: number;
          difficulty?: Difficulty;
          cuisine?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      saved_recipes: {
        Row: {
          id: string;
          user_id: string | null;
          recipe_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          recipe_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          recipe_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      cooking_sessions: {
        Row: {
          id: string;
          user_id: string | null;
          recipe_id: string | null;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          recipe_id?: string | null;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          recipe_id?: string | null;
          completed?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
