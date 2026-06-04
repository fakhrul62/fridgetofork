import { IngredientSelectionPage } from "@/components/kitchen/ingredient-selection-page";

export const metadata = {
  title: "Choose Ingredients | Fridge to Fork",
  description: "Pick every ingredient in your pantry before generating recipe ideas.",
};

export default function IngredientsPage() {
  return <IngredientSelectionPage />;
}
