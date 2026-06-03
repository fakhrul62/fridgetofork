import type { Ingredient } from "@/store/use-kitchen-store";
import type { IngredientCategory } from "@/types/database";

export const categoryLabels: Record<IngredientCategory, string> = {
  protein: "Proteins",
  vegetable: "Vegetables",
  grain: "Grains",
  aromatic: "Aromatics",
  dairy: "Dairy",
  spice: "Spices",
};

export const categoryStyles: Record<IngredientCategory, string> = {
  protein: "bg-[#E2714B]/15 text-[#8E3D27] border-[#E2714B]/30",
  vegetable: "bg-[#6B7C4E]/16 text-[#44502F] border-[#6B7C4E]/30",
  grain: "bg-[#F5C842]/22 text-[#7B5E00] border-[#F5C842]/45",
  aromatic: "bg-[#FFF8F0] text-[#3D2B1F] border-[#3D2B1F]/18",
  dairy: "bg-white text-[#7B5E00] border-[#F5C842]/45",
  spice: "bg-[#E2714B]/20 text-[#8E2F20] border-[#E2714B]/35",
};

export const ingredients: Ingredient[] = [
  { id: "chicken", name: "Chicken", emoji: "🍗", category: "protein" },
  { id: "salmon", name: "Salmon", emoji: "🐟", category: "protein" },
  { id: "egg", name: "Eggs", emoji: "🥚", category: "protein" },
  { id: "tofu", name: "Tofu", emoji: "⬜", category: "protein" },
  { id: "beef", name: "Beef", emoji: "🥩", category: "protein" },
  { id: "shrimp", name: "Shrimp", emoji: "🍤", category: "protein" },
  { id: "tomato", name: "Tomato", emoji: "🍅", category: "vegetable" },
  { id: "broccoli", name: "Broccoli", emoji: "🥦", category: "vegetable" },
  { id: "mushroom", name: "Mushroom", emoji: "🍄", category: "vegetable" },
  { id: "spinach", name: "Spinach", emoji: "🥬", category: "vegetable" },
  { id: "carrot", name: "Carrot", emoji: "🥕", category: "vegetable" },
  { id: "pepper", name: "Bell Pepper", emoji: "🫑", category: "vegetable" },
  { id: "rice", name: "Rice", emoji: "🍚", category: "grain" },
  { id: "pasta", name: "Pasta", emoji: "🍝", category: "grain" },
  { id: "bread", name: "Bread", emoji: "🍞", category: "grain" },
  { id: "quinoa", name: "Quinoa", emoji: "🌾", category: "grain" },
  { id: "noodles", name: "Noodles", emoji: "🍜", category: "grain" },
  { id: "tortilla", name: "Tortilla", emoji: "🫓", category: "grain" },
  { id: "garlic", name: "Garlic", emoji: "🧄", category: "aromatic" },
  { id: "onion", name: "Onion", emoji: "🧅", category: "aromatic" },
  { id: "ginger", name: "Ginger", emoji: "🫚", category: "aromatic" },
  { id: "scallion", name: "Scallion", emoji: "🌿", category: "aromatic" },
  { id: "lemon", name: "Lemon", emoji: "🍋", category: "aromatic" },
  { id: "cilantro", name: "Cilantro", emoji: "🌱", category: "aromatic" },
  { id: "butter", name: "Butter", emoji: "🧈", category: "dairy" },
  { id: "cheese", name: "Cheese", emoji: "🧀", category: "dairy" },
  { id: "milk", name: "Milk", emoji: "🥛", category: "dairy" },
  { id: "yogurt", name: "Yogurt", emoji: "🥣", category: "dairy" },
  { id: "cream", name: "Cream", emoji: "🍶", category: "dairy" },
  { id: "parmesan", name: "Parmesan", emoji: "🧀", category: "dairy" },
  { id: "chili", name: "Chili Flakes", emoji: "🌶️", category: "spice" },
  { id: "cumin", name: "Cumin", emoji: "🟤", category: "spice" },
  { id: "paprika", name: "Paprika", emoji: "🔴", category: "spice" },
  { id: "turmeric", name: "Turmeric", emoji: "🟡", category: "spice" },
  { id: "black-pepper", name: "Black Pepper", emoji: "⚫", category: "spice" },
  { id: "basil", name: "Basil", emoji: "🌿", category: "spice" },
];
