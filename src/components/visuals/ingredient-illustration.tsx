import { categoryStyles } from "@/data/ingredients";
import { cn } from "@/lib/utils";
import type { IngredientCategory } from "@/types/database";

type IngredientIllustrationProps = {
  name: string;
  category?: IngredientCategory;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "size-12",
  md: "size-20",
  lg: "size-28",
};

const inferCategory = (name: string): IngredientCategory => {
  const normalized = name.toLowerCase();

  if (
    [
      "chicken",
      "salmon",
      "egg",
      "tofu",
      "beef",
      "shrimp",
      "turkey",
      "pork",
      "tuna",
      "cod",
      "lentil",
      "bean",
      "chickpea",
      "tempeh",
      "paneer",
    ].some((item) => normalized.includes(item))
  ) {
    return "protein";
  }

  if (
    [
      "rice",
      "pasta",
      "bread",
      "quinoa",
      "noodle",
      "tortilla",
      "couscous",
      "oat",
      "barley",
      "potato",
      "sweet potato",
      "flour",
      "corn",
    ].some((item) => normalized.includes(item))
  ) {
    return "grain";
  }

  if (
    ["butter", "cheese", "milk", "yogurt", "cream", "parmesan", "mozzarella", "feta", "ghee"].some(
      (item) => normalized.includes(item),
    )
  ) {
    return "dairy";
  }

  if (
    [
      "chili",
      "cumin",
      "paprika",
      "turmeric",
      "pepper",
      "basil",
      "oregano",
      "cinnamon",
      "cardamom",
      "coriander",
      "mustard",
      "garam",
      "bay",
      "thyme",
      "rosemary",
    ].some((item) => normalized.includes(item))
  ) {
    return "spice";
  }

  if (
    [
      "garlic",
      "onion",
      "ginger",
      "scallion",
      "lemon",
      "lime",
      "cilantro",
      "parsley",
      "shallot",
      "mint",
      "dill",
      "lemongrass",
    ].some((item) => normalized.includes(item))
  ) {
    return "aromatic";
  }

  return "vegetable";
};

const stroke = "#3D2B1F";
const cream = "#FFF8F0";
const terracotta = "#E2714B";
const olive = "#6B7C4E";
const butter = "#F5C842";
const leaf = "#4E6737";

const keyForIngredient = (name: string, category: IngredientCategory) => {
  const normalized = name.toLowerCase();

  if (normalized.includes("egg")) return "egg";
  if (normalized.includes("fish") || normalized.includes("salmon") || normalized.includes("tuna") || normalized.includes("cod")) return "fish";
  if (normalized.includes("shrimp")) return "shrimp";
  if (normalized.includes("tofu") || normalized.includes("paneer") || normalized.includes("tempeh")) return "cube";
  if (["chicken", "beef", "pork", "turkey"].some((item) => normalized.includes(item))) return "cutlet";
  if (["lentil", "bean", "chickpea"].some((item) => normalized.includes(item))) return "beans";

  if (normalized.includes("tomato")) return "tomato";
  if (normalized.includes("broccoli") || normalized.includes("cauliflower")) return "broccoli";
  if (normalized.includes("mushroom")) return "mushroom";
  if (normalized.includes("carrot")) return "carrot";
  if (normalized.includes("pepper")) return category === "spice" ? "spice-jar" : "pepper";
  if (normalized.includes("corn")) return "corn";
  if (normalized.includes("potato")) return "potato";
  if (["spinach", "kale", "lettuce", "cabbage", "zucchini", "cucumber", "eggplant", "peas"].some((item) => normalized.includes(item))) return "leafy";

  if (normalized.includes("rice") || normalized.includes("quinoa") || normalized.includes("couscous") || normalized.includes("barley") || normalized.includes("oat")) return "bowl-grain";
  if (normalized.includes("pasta") || normalized.includes("noodle")) return "noodles";
  if (normalized.includes("bread") || normalized.includes("tortilla") || normalized.includes("flour")) return "bread";

  if (normalized.includes("garlic")) return "garlic";
  if (normalized.includes("onion") || normalized.includes("shallot")) return "onion";
  if (normalized.includes("ginger")) return "ginger";
  if (normalized.includes("lemon") || normalized.includes("lime")) return "citrus";
  if (["cilantro", "parsley", "scallion", "mint", "dill", "lemongrass"].some((item) => normalized.includes(item))) return "herb";

  if (normalized.includes("cheese") || normalized.includes("parmesan") || normalized.includes("mozzarella") || normalized.includes("feta")) return "cheese";
  if (normalized.includes("milk") || normalized.includes("cream")) return "milk";
  if (normalized.includes("yogurt")) return "yogurt";
  if (normalized.includes("butter") || normalized.includes("ghee")) return "butter";

  if (normalized.includes("chili")) return "chili";
  return category === "spice" ? "spice-jar" : "tomato";
};

function IngredientArt({ name, category }: { name: string; category: IngredientCategory }) {
  const key = keyForIngredient(name, category);

  switch (key) {
    case "egg":
      return (
        <>
          <ellipse cx="60" cy="64" rx="34" ry="42" fill={cream} stroke={stroke} strokeWidth="5" />
          <circle cx="63" cy="69" r="14" fill={butter} stroke={stroke} strokeWidth="4" />
        </>
      );
    case "fish":
      return (
        <>
          <path d="M25 62c16-24 48-27 68 0-20 27-52 24-68 0Z" fill="#E88962" stroke={stroke} strokeWidth="5" />
          <path d="M91 62l20-18v36L91 62Z" fill={butter} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <circle cx="44" cy="57" r="4" fill={stroke} />
          <path d="M61 43c5 12 5 26 0 38" fill="none" stroke={cream} strokeLinecap="round" strokeWidth="4" />
        </>
      );
    case "shrimp":
      return (
        <>
          <path d="M82 37c-27 0-48 15-48 35 0 15 13 25 29 21 17-4 23-19 12-31" fill="none" stroke={terracotta} strokeLinecap="round" strokeWidth="17" />
          <path d="M42 40l-16-8M43 47l-18 2" stroke={stroke} strokeLinecap="round" strokeWidth="4" />
          <circle cx="80" cy="38" r="4" fill={stroke} />
        </>
      );
    case "cube":
      return (
        <>
          <path d="M36 43l27-14 27 14v34L63 92 36 77V43Z" fill={cream} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <path d="M36 43l27 15 27-15M63 58v34" fill="none" stroke={stroke} strokeLinecap="round" strokeWidth="4" opacity="0.5" />
        </>
      );
    case "cutlet":
      return (
        <>
          <path d="M24 65c0-24 23-39 51-33 23 5 29 23 16 38-16 20-67 23-67-5Z" fill={terracotta} stroke={stroke} strokeWidth="5" />
          <path d="M50 49c11-5 29-2 36 7" fill="none" stroke={butter} strokeLinecap="round" strokeWidth="5" />
          <circle cx="44" cy="72" r="7" fill={cream} opacity="0.45" />
        </>
      );
    case "beans":
      return (
        <>
          {[36, 54, 72, 88].map((cx, index) => (
            <ellipse key={cx} cx={cx} cy={index % 2 ? 70 : 54} rx="13" ry="19" fill={index % 2 ? olive : terracotta} stroke={stroke} strokeWidth="4" transform={`rotate(${index * 22 - 18} ${cx} ${index % 2 ? 70 : 54})`} />
          ))}
        </>
      );
    case "tomato":
      return (
        <>
          <circle cx="60" cy="65" r="34" fill={terracotta} stroke={stroke} strokeWidth="5" />
          <path d="M60 28l7 18 17-8-11 16 18 4-19 5 9 17-17-10-10 17-1-20-19 1 16-11-14-13 19 4 5-20Z" fill={leaf} stroke={stroke} strokeLinejoin="round" strokeWidth="4" />
          <circle cx="49" cy="57" r="7" fill={cream} opacity="0.45" />
        </>
      );
    case "broccoli":
      return (
        <>
          <path d="M54 61c-9 14-12 25-13 37h38c-3-15-7-27-15-39" fill="#D8E0B8" stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <circle cx="39" cy="48" r="18" fill={olive} stroke={stroke} strokeWidth="5" />
          <circle cx="61" cy="36" r="21" fill="#78935A" stroke={stroke} strokeWidth="5" />
          <circle cx="82" cy="51" r="18" fill={olive} stroke={stroke} strokeWidth="5" />
        </>
      );
    case "mushroom":
      return (
        <>
          <path d="M28 60c4-27 26-39 50-31 15 5 24 17 25 31H28Z" fill={terracotta} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <path d="M49 60h29l7 37H42l7-37Z" fill={cream} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <circle cx="51" cy="45" r="5" fill={cream} />
          <circle cx="76" cy="42" r="6" fill={cream} />
        </>
      );
    case "carrot":
      return (
        <>
          <path d="M58 35c21 8 31 17 31 17S70 87 39 99c-4-34 5-51 19-64Z" fill={terracotta} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <path d="M55 34c-2-17 9-25 9-25 4 13 2 22-9 25Zm8 3c9-13 22-12 22-12-5 12-12 17-22 12Z" fill={leaf} stroke={stroke} strokeLinejoin="round" strokeWidth="4" />
          <path d="M56 56l16 5M48 72l14 5" stroke={butter} strokeLinecap="round" strokeWidth="4" />
        </>
      );
    case "pepper":
      return (
        <>
          <path d="M57 33c-28 3-35 26-24 49 7 15 23 21 37 13 15 8 31-3 31-25 0-23-15-38-44-37Z" fill={butter} stroke={stroke} strokeWidth="5" />
          <path d="M61 34c-2-11 6-17 15-18-2 11-6 18-15 18Z" fill={leaf} stroke={stroke} strokeWidth="4" />
          <path d="M70 45c7 15 6 32-1 47" fill="none" stroke={stroke} strokeLinecap="round" strokeWidth="4" opacity="0.28" />
        </>
      );
    case "corn":
      return (
        <>
          <path d="M62 23c24 20 24 52 0 76-24-24-24-56 0-76Z" fill={butter} stroke={stroke} strokeWidth="5" />
          <path d="M36 61c4 22 13 35 26 42M88 61c-4 22-13 35-26 42" fill="none" stroke={leaf} strokeLinecap="round" strokeWidth="8" />
          <path d="M50 44h24M47 58h30M49 72h25" stroke="#C98B56" strokeLinecap="round" strokeWidth="3" />
        </>
      );
    case "potato":
      return (
        <>
          <path d="M33 63c0-23 17-38 39-32 23 6 32 26 20 47-11 19-37 25-52 11-6-6-7-15-7-26Z" fill="#C98B56" stroke={stroke} strokeWidth="5" />
          <circle cx="54" cy="55" r="3" fill={stroke} opacity="0.35" />
          <circle cx="72" cy="73" r="3" fill={stroke} opacity="0.35" />
          <circle cx="45" cy="78" r="3" fill={stroke} opacity="0.35" />
        </>
      );
    case "leafy":
      return (
        <>
          <path d="M60 101C24 76 26 36 59 21c33 16 37 55 1 80Z" fill={olive} stroke={stroke} strokeWidth="5" />
          <path d="M60 31v59M43 53l17 13M78 52L60 68" stroke={cream} strokeLinecap="round" strokeWidth="5" opacity="0.65" />
        </>
      );
    case "bowl-grain":
      return (
        <>
          <path d="M28 62h64c-3 25-16 38-32 38S31 87 28 62Z" fill={cream} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <path d="M33 58c9-12 45-15 57 0" fill={butter} stroke={stroke} strokeWidth="5" />
          {[42, 54, 66, 78].map((cx) => (
            <ellipse key={cx} cx={cx} cy="53" rx="5" ry="8" fill={cream} stroke={stroke} strokeWidth="2" transform={`rotate(${cx - 60} ${cx} 53)`} />
          ))}
        </>
      );
    case "noodles":
      return (
        <>
          <path d="M28 72h64c-4 20-16 30-32 30S32 92 28 72Z" fill={cream} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <path d="M38 58c8-12 15 12 24 0s15 12 24 0" fill="none" stroke={butter} strokeLinecap="round" strokeWidth="7" />
          <path d="M44 43l37-19M52 47l38-19" stroke={stroke} strokeLinecap="round" strokeWidth="4" />
        </>
      );
    case "bread":
      return (
        <>
          <path d="M31 54c0-23 13-34 29-34s29 11 29 34v40H31V54Z" fill="#D69A54" stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <path d="M43 57c8-8 26-11 37-1" fill="none" stroke={cream} strokeLinecap="round" strokeWidth="5" opacity="0.6" />
        </>
      );
    case "garlic":
      return (
        <>
          <path d="M60 28c-23 12-34 33-25 56 5 13 17 21 25 11 8 10 20 2 25-11 9-23-2-44-25-56Z" fill={cream} stroke={stroke} strokeWidth="5" />
          <path d="M60 28c-3-10 1-17 9-23M60 36v57M46 50c8 9 8 28 0 39M74 50c-8 9-8 28 0 39" fill="none" stroke={stroke} strokeLinecap="round" strokeWidth="4" opacity="0.45" />
        </>
      );
    case "onion":
      return (
        <>
          <path d="M60 21c-25 20-33 49-17 69 10 12 24 12 34 0 16-20 8-49-17-69Z" fill="#D7B0D7" stroke={stroke} strokeWidth="5" />
          <path d="M60 22c-2-10 2-16 10-20M60 36c-12 14-13 34 0 50M60 36c12 14 13 34 0 50" fill="none" stroke={cream} strokeLinecap="round" strokeWidth="4" opacity="0.65" />
        </>
      );
    case "ginger":
      return (
        <>
          <path d="M31 70c11-18 24-17 33-10 5-16 23-22 35-9-10 15-24 17-35 11-3 17-18 27-33 8Z" fill="#D6A85F" stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <circle cx="51" cy="69" r="4" fill={cream} opacity="0.5" />
          <circle cx="78" cy="55" r="4" fill={cream} opacity="0.5" />
        </>
      );
    case "citrus":
      return (
        <>
          <circle cx="58" cy="63" r="34" fill={butter} stroke={stroke} strokeWidth="5" />
          <path d="M58 31v64M26 63h64M35 40l46 46M81 40L35 86" stroke={cream} strokeLinecap="round" strokeWidth="4" opacity="0.7" />
          <path d="M70 27c4-10 12-15 22-15-1 13-9 19-22 15Z" fill={leaf} stroke={stroke} strokeWidth="4" />
        </>
      );
    case "herb":
      return (
        <>
          <path d="M60 100V29" stroke={stroke} strokeLinecap="round" strokeWidth="5" />
          {[35, 49, 63, 77].map((cy, index) => (
            <g key={cy}>
              <path d={`M60 ${cy}c-${18 - index * 2}-13-${29 - index * 2}-10-${34 - index * 2} 3 13 5 24 3 34-3Z`} fill={olive} stroke={stroke} strokeLinejoin="round" strokeWidth="4" />
              <path d={`M60 ${cy}c${18 - index * 2}-13 ${29 - index * 2}-10 ${34 - index * 2} 3-13 5-24 3-34-3Z`} fill="#7E955B" stroke={stroke} strokeLinejoin="round" strokeWidth="4" />
            </g>
          ))}
        </>
      );
    case "cheese":
      return (
        <>
          <path d="M28 78l61-40 4 50H28V78Z" fill={butter} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <circle cx="55" cy="76" r="7" fill={cream} stroke={stroke} strokeWidth="3" />
          <circle cx="76" cy="62" r="5" fill={cream} stroke={stroke} strokeWidth="3" />
        </>
      );
    case "milk":
      return (
        <>
          <path d="M43 28h34l7 17v53H36V45l7-17Z" fill={cream} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <path d="M43 28l10-12h24v12M36 52h48" fill="none" stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <rect x="45" y="61" width="30" height="21" rx="6" fill="#DDE9F4" stroke={stroke} strokeWidth="4" />
        </>
      );
    case "yogurt":
      return (
        <>
          <path d="M38 48h44l-6 50H44L38 48Z" fill={cream} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <path d="M34 42h52v13H34V42Z" fill={butter} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <circle cx="60" cy="73" r="9" fill={terracotta} />
        </>
      );
    case "butter":
      return (
        <>
          <path d="M27 64l47-24 20 15-46 26-21-17Z" fill={butter} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <path d="M48 81v18l46-27V55M27 64v18l21 17" fill="#E8B932" stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
        </>
      );
    case "chili":
      return (
        <>
          <path d="M39 37c31 6 48 22 43 45-3 16-17 22-29 15 16-11 15-28-14-60Z" fill={terracotta} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <path d="M42 36c-8-6-15-5-21 2" fill="none" stroke={leaf} strokeLinecap="round" strokeWidth="7" />
        </>
      );
    default:
      return (
        <>
          <path d="M38 36h44l6 62H32l6-62Z" fill={terracotta} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <path d="M35 28h50v17H35V28Z" fill={butter} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <path d="M47 63h26" stroke={cream} strokeLinecap="round" strokeWidth="6" />
          <circle cx="60" cy="80" r="8" fill={butter} />
        </>
      );
  }
}

export function IngredientIllustration({
  name,
  category,
  size = "md",
  className,
}: IngredientIllustrationProps) {
  const resolvedCategory = category ?? inferCategory(name);

  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label={`${name} illustration`}
      className={cn(sizes[size], "drop-shadow-[4px_6px_0_rgba(61,43,31,0.14)]", className)}
    >
      <IngredientArt name={name} category={resolvedCategory} />
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
