import { RecipeSuggestionsPage } from "@/components/kitchen/recipe-suggestions-page";

export const metadata = {
  title: "Recipe Suggestions | Fridge to Fork",
  description: "Choose from AI-generated dish ideas based on your selected ingredients.",
};

export default function SuggestionsPage() {
  return <RecipeSuggestionsPage />;
}
