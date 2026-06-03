import { ImageResponse } from "next/og";

import { getRecipeById } from "@/lib/recipes";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type OpenGraphImageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FFF8F0",
          color: "#3D2B1F",
          padding: 64,
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 32, letterSpacing: 2, textTransform: "uppercase" }}>
          Fridge to Fork
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 82, lineHeight: 0.92, maxWidth: 880 }}>
            {recipe?.name ?? "Recipe"}
          </div>
          <div style={{ marginTop: 28, fontSize: 30, maxWidth: 900 }}>
            {recipe?.description ?? "A playful animated recipe from your kitchen."}
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 26 }}>
          <span>{recipe?.cookTime ?? 30} min</span>
          <span>·</span>
          <span>{recipe?.difficulty ?? "easy"}</span>
          <span>·</span>
          <span>{recipe?.cuisine ?? "Kitchen"}</span>
        </div>
      </div>
    ),
    size,
  );
}
