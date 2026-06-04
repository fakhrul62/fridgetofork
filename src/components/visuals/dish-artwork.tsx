import { IngredientIllustration } from "@/components/visuals/ingredient-illustration";
import { cn } from "@/lib/utils";

type DishArtworkProps = {
  name: string;
  ingredients: string[];
  className?: string;
  compact?: boolean;
};

export function DishArtwork({ name, ingredients, className, compact = false }: DishArtworkProps) {
  const visibleIngredients = ingredients.slice(0, compact ? 3 : 5);

  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden rounded-[1.35rem] border border-[var(--color-warm-brown)]/12 bg-[linear-gradient(135deg,#FFF8F0,#F9E1C8)] shadow-[4px_4px_0_rgba(61,43,31,0.1)]",
        compact ? "h-36" : "h-56",
        className,
      )}
      aria-label={`${name} dish artwork`}
    >
      <div className="absolute -right-8 -top-8 size-28 rounded-full bg-[var(--color-butter)]/40" />
      <div className="absolute -left-10 bottom-2 size-32 rounded-full bg-[var(--color-terracotta)]/14" />
      <div className="relative grid h-28 w-44 place-items-center rounded-[50%] border-4 border-[var(--color-butter)] bg-white shadow-[0_12px_0_rgba(61,43,31,0.14)]">
        <span className="absolute inset-5 rounded-[50%] border border-[var(--color-warm-brown)]/10" />
        <div className="flex flex-wrap items-center justify-center gap-1 px-7">
          {visibleIngredients.map((ingredient, index) => (
            <IngredientIllustration
              key={`${ingredient}-${index}`}
              name={ingredient}
              size="sm"
              className={cn("size-10", index % 2 === 0 ? "-rotate-6" : "rotate-6")}
            />
          ))}
        </div>
      </div>
      <p className="absolute bottom-3 max-w-[85%] truncate rounded-full bg-[var(--color-warm-brown)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-cream)]">
        {name}
      </p>
    </div>
  );
}
