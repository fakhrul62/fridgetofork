import { categoryStyles } from "@/data/ingredients";
import { cn } from "@/lib/utils";
import type { IngredientCategory } from "@/types/database";

type IngredientIllustrationProps = {
  name: string;
  category?: IngredientCategory;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const categoryPalette: Record<IngredientCategory, { fill: string; accent: string }> = {
  protein: { fill: "#E2714B", accent: "#F5C842" },
  vegetable: { fill: "#6B7C4E", accent: "#F5C842" },
  grain: { fill: "#F5C842", accent: "#C98B56" },
  aromatic: { fill: "#FFF8F0", accent: "#6B7C4E" },
  dairy: { fill: "#F9E8C8", accent: "#F5C842" },
  spice: { fill: "#D84A32", accent: "#F5C842" },
};

const sizes = {
  sm: "size-12",
  md: "size-20",
  lg: "size-28",
};

const inferCategory = (name: string): IngredientCategory => {
  const normalized = name.toLowerCase();

  if (["chicken", "salmon", "eggs", "tofu", "beef", "shrimp"].some((item) => normalized.includes(item))) {
    return "protein";
  }

  if (["rice", "pasta", "bread", "quinoa", "noodles", "tortilla"].some((item) => normalized.includes(item))) {
    return "grain";
  }

  if (["butter", "cheese", "milk", "yogurt", "cream", "parmesan"].some((item) => normalized.includes(item))) {
    return "dairy";
  }

  if (["chili", "cumin", "paprika", "turmeric", "pepper", "basil"].some((item) => normalized.includes(item))) {
    return "spice";
  }

  if (["garlic", "onion", "ginger", "scallion", "lemon", "cilantro"].some((item) => normalized.includes(item))) {
    return "aromatic";
  }

  return "vegetable";
};

export function IngredientIllustration({
  name,
  category,
  size = "md",
  className,
}: IngredientIllustrationProps) {
  const resolvedCategory = category ?? inferCategory(name);
  const palette = categoryPalette[resolvedCategory];
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label={`${name} illustration`}
      className={cn(sizes[size], "drop-shadow-[4px_6px_0_rgba(61,43,31,0.14)]", className)}
    >
      <path
        d="M60 8C34 8 13 28 13 55c0 31 23 56 50 56 25 0 44-22 44-50C107 31 88 8 60 8Z"
        fill={palette.fill}
        stroke="#3D2B1F"
        strokeWidth="5"
      />
      <path
        d="M33 34c10-13 31-17 48-9"
        fill="none"
        stroke="#FFF8F0"
        strokeLinecap="round"
        strokeWidth="7"
        opacity="0.7"
      />
      <path
        d="M72 18c1-8 7-13 15-15 0 10-5 17-14 20"
        fill={palette.accent}
        stroke="#3D2B1F"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <circle cx="82" cy="77" r="13" fill={palette.accent} opacity="0.75" />
      <circle cx="36" cy="67" r="8" fill="#FFF8F0" opacity="0.45" />
      <text
        x="60"
        y="68"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#3D2B1F"
        fontFamily="serif"
        fontSize="28"
        fontWeight="800"
      >
        {initials}
      </text>
    </svg>
  );
}

export function IngredientPill({
  name,
  category,
}: {
  name: string;
  category?: IngredientCategory;
}) {
  const resolvedCategory = category ?? inferCategory(name);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em]",
        categoryStyles[resolvedCategory],
      )}
    >
      <IngredientIllustration name={name} category={resolvedCategory} size="sm" className="size-7" />
      {name}
    </span>
  );
}
