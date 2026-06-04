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
const plum = "#6C3E63";

type ArtworkProps = {
  fill?: string;
  accent?: string;
  second?: string;
  detail?: "dots" | "stripes" | "rings" | "seeds" | "crumbs" | "none";
  rotate?: number;
};

const normalizedName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function DetailMarks({ detail = "none", accent = cream }: ArtworkProps) {
  if (detail === "dots") {
    return (
      <>
        <circle cx="48" cy="55" r="4" fill={accent} />
        <circle cx="70" cy="68" r="3.5" fill={accent} />
        <circle cx="57" cy="82" r="3" fill={accent} />
      </>
    );
  }

  if (detail === "stripes") {
    return (
      <>
        <path d="M43 52h34M39 67h42M45 82h28" stroke={accent} strokeLinecap="round" strokeWidth="5" />
      </>
    );
  }

  if (detail === "rings") {
    return (
      <>
        <path d="M43 63c8-13 25-15 35-3M47 75c7 8 21 10 31 0" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="4" />
      </>
    );
  }

  if (detail === "seeds") {
    return (
      <>
        {[44, 54, 64, 74].map((cx, index) => (
          <ellipse key={cx} cx={cx} cy={index % 2 ? 72 : 56} rx="3" ry="5" fill={accent} transform={`rotate(${index * 18 - 20} ${cx} ${index % 2 ? 72 : 56})`} />
        ))}
      </>
    );
  }

  if (detail === "crumbs") {
    return (
      <>
        <circle cx="47" cy="52" r="3" fill={accent} />
        <circle cx="65" cy="46" r="2.5" fill={accent} />
        <circle cx="75" cy="65" r="3.5" fill={accent} />
        <circle cx="54" cy="78" r="2.5" fill={accent} />
      </>
    );
  }

  return null;
}

function CutletArt({ fill = terracotta, accent = butter, second = cream, detail = "stripes" }: ArtworkProps) {
  return (
    <>
      <path d="M24 66c0-24 23-39 51-33 23 5 29 23 16 38-16 20-67 23-67-5Z" fill={fill} stroke={stroke} strokeWidth="5" />
      <path d="M51 49c11-5 28-2 35 7" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="5" />
      <circle cx="43" cy="73" r="7" fill={second} opacity="0.5" />
      <DetailMarks detail={detail} accent={second} />
    </>
  );
}

function FishArt({ fill = "#E88962", accent = butter, detail = "stripes" }: ArtworkProps) {
  return (
    <>
      <path d="M25 62c16-24 48-27 68 0-20 27-52 24-68 0Z" fill={fill} stroke={stroke} strokeWidth="5" />
      <path d="M91 62l20-18v36L91 62Z" fill={accent} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
      <circle cx="44" cy="57" r="4" fill={stroke} />
      <DetailMarks detail={detail} accent={cream} />
    </>
  );
}

function CubeArt({ fill = cream, accent = butter, detail = "none" }: ArtworkProps) {
  return (
    <>
      <path d="M36 43l27-14 27 14v34L63 92 36 77V43Z" fill={fill} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
      <path d="M36 43l27 15 27-15M63 58v34" fill="none" stroke={stroke} strokeLinecap="round" strokeWidth="4" opacity="0.45" />
      <DetailMarks detail={detail} accent={accent} />
    </>
  );
}

function BeanArt({ fill = olive, accent = terracotta, detail = "none" }: ArtworkProps) {
  return (
    <>
      {[36, 54, 72, 88].map((cx, index) => (
        <ellipse
          key={cx}
          cx={cx}
          cy={index % 2 ? 70 : 54}
          rx="13"
          ry="19"
          fill={index % 2 ? fill : accent}
          stroke={stroke}
          strokeWidth="4"
          transform={`rotate(${index * 22 - 18} ${cx} ${index % 2 ? 70 : 54})`}
        />
      ))}
      <DetailMarks detail={detail} accent={cream} />
    </>
  );
}

function LeafArt({ fill = olive, accent = cream, detail = "stripes", rotate = 0 }: ArtworkProps) {
  return (
    <g transform={`rotate(${rotate} 60 62)`}>
      <path d="M60 101C24 76 26 36 59 21c33 16 37 55 1 80Z" fill={fill} stroke={stroke} strokeWidth="5" />
      <path d="M60 31v59M43 53l17 13M78 52L60 68" stroke={accent} strokeLinecap="round" strokeWidth="5" opacity="0.65" />
      <DetailMarks detail={detail} accent={accent} />
    </g>
  );
}

function LongVegetableArt({ fill = olive, accent = cream, detail = "stripes", rotate = -18 }: ArtworkProps) {
  return (
    <g transform={`rotate(${rotate} 60 62)`}>
      <path d="M45 18c23 5 34 25 26 55-4 17-14 30-26 29-13-2-18-18-14-38 4-22 4-41 14-46Z" fill={fill} stroke={stroke} strokeWidth="5" />
      <DetailMarks detail={detail} accent={accent} />
    </g>
  );
}

function BowlArt({ fill = cream, accent = butter, detail = "seeds" }: ArtworkProps) {
  return (
    <>
      <path d="M28 62h64c-3 25-16 38-32 38S31 87 28 62Z" fill={fill} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
      <path d="M33 58c9-12 45-15 57 0" fill={accent} stroke={stroke} strokeWidth="5" />
      <DetailMarks detail={detail} accent={cream} />
    </>
  );
}

function BreadArt({ fill = "#D69A54", accent = cream, detail = "crumbs" }: ArtworkProps) {
  return (
    <>
      <path d="M31 54c0-23 13-34 29-34s29 11 29 34v40H31V54Z" fill={fill} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
      <path d="M43 57c8-8 26-11 37-1" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="5" opacity="0.65" />
      <DetailMarks detail={detail} accent={accent} />
    </>
  );
}

function HerbArt({ fill = olive, accent = "#7E955B", rotate = 0 }: ArtworkProps) {
  return (
    <g transform={`rotate(${rotate} 60 64)`}>
      <path d="M60 100V29" stroke={stroke} strokeLinecap="round" strokeWidth="5" />
      {[35, 49, 63, 77].map((cy, index) => (
        <g key={cy}>
          <path d={`M60 ${cy}c-${18 - index * 2}-13-${29 - index * 2}-10-${34 - index * 2} 3 13 5 24 3 34-3Z`} fill={fill} stroke={stroke} strokeLinejoin="round" strokeWidth="4" />
          <path d={`M60 ${cy}c${18 - index * 2}-13 ${29 - index * 2}-10 ${34 - index * 2} 3-13 5-24 3-34-3Z`} fill={accent} stroke={stroke} strokeLinejoin="round" strokeWidth="4" />
        </g>
      ))}
    </g>
  );
}

function JarArt({ fill = terracotta, accent = butter, detail = "stripes" }: ArtworkProps) {
  return (
    <>
      <path d="M38 36h44l6 62H32l6-62Z" fill={fill} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
      <path d="M35 28h50v17H35V28Z" fill={accent} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
      <path d="M45 61h30v24H45V61Z" fill={cream} stroke={stroke} strokeLinejoin="round" strokeWidth="4" opacity="0.9" />
      <DetailMarks detail={detail} accent={fill} />
    </>
  );
}

function DairyCartonArt({ fill = cream, accent = "#DDE9F4", detail = "none" }: ArtworkProps) {
  return (
    <>
      <path d="M43 28h34l7 17v53H36V45l7-17Z" fill={fill} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
      <path d="M43 28l10-12h24v12M36 52h48" fill="none" stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
      <rect x="45" y="61" width="30" height="21" rx="6" fill={accent} stroke={stroke} strokeWidth="4" />
      <DetailMarks detail={detail} accent={accent} />
    </>
  );
}

function SpecificIngredientArt({ name }: { name: string }) {
  switch (normalizedName(name)) {
    case "chicken":
      return <CutletArt fill="#E98A63" accent={butter} detail="stripes" />;
    case "beef":
      return <CutletArt fill="#9E3D2F" accent="#F9B28F" second="#F8C8B6" detail="rings" />;
    case "turkey":
      return <CutletArt fill="#D97A58" accent={cream} second={butter} detail="dots" />;
    case "pork":
      return <CutletArt fill="#D98A88" accent="#F7C1B3" second={cream} detail="stripes" />;
    case "salmon":
      return <FishArt fill="#F07B59" accent="#F5A05A" detail="stripes" />;
    case "tuna":
      return <FishArt fill="#B84A5A" accent="#7DA6B8" detail="rings" />;
    case "cod":
      return <FishArt fill="#F2E7D2" accent="#9EB7A3" detail="dots" />;
    case "shrimp":
      return null;
    case "eggs":
      return null;
    case "tofu":
      return <CubeArt fill={cream} accent={olive} detail="dots" />;
    case "tempeh":
      return <CubeArt fill="#D4A968" accent={cream} detail="crumbs" />;
    case "paneer":
      return <CubeArt fill="#FFF0C8" accent={terracotta} detail="stripes" />;
    case "lentils":
      return <BeanArt fill="#B8793A" accent="#7B4B2A" detail="dots" />;
    case "black-beans":
      return <BeanArt fill="#2B2628" accent="#4A3D45" detail="dots" />;
    case "chickpeas":
      return <BeanArt fill="#E0B66E" accent="#F0D08A" detail="rings" />;
    case "spinach":
      return <LeafArt fill="#4F7E47" detail="stripes" rotate={-8} />;
    case "kale":
      return <LeafArt fill="#355F37" accent="#9FCB79" detail="dots" rotate={8} />;
    case "lettuce":
      return <LeafArt fill="#8CAF5F" accent={cream} detail="rings" rotate={-4} />;
    case "cabbage":
      return <LeafArt fill="#A8B972" accent="#EAF0C2" detail="rings" rotate={12} />;
    case "zucchini":
      return <LongVegetableArt fill="#597A39" accent="#B6D283" detail="stripes" rotate={-24} />;
    case "cucumber":
      return <LongVegetableArt fill="#6F974D" accent="#D7E8B7" detail="dots" rotate={20} />;
    case "eggplant":
      return <LongVegetableArt fill={plum} accent="#B986B2" detail="stripes" rotate={-18} />;
    case "green-beans":
      return <LongVegetableArt fill="#57823F" accent="#C5DC95" detail="none" rotate={34} />;
    case "asparagus":
      return <LongVegetableArt fill="#6B8C48" accent={butter} detail="dots" rotate={8} />;
    case "celery":
      return <LongVegetableArt fill="#9BBE64" accent={cream} detail="stripes" rotate={-8} />;
    case "beetroot":
      return (
        <>
          <circle cx="60" cy="69" r="31" fill="#8C2548" stroke={stroke} strokeWidth="5" />
          <path d="M54 39c-14-16-9-28-9-28 11 5 18 13 19 25 8-12 19-16 29-15-4 13-14 21-29 22" fill={leaf} stroke={stroke} strokeLinejoin="round" strokeWidth="4" />
          <path d="M46 66c8-8 22-10 32-2" fill="none" stroke="#E7A6B6" strokeLinecap="round" strokeWidth="5" />
        </>
      );
    case "peas":
      return (
        <>
          <path d="M25 63c26-23 52-26 78-5-22 25-52 29-78 5Z" fill="#79A955" stroke={stroke} strokeWidth="5" />
          {[45, 60, 75].map((cx) => <circle key={cx} cx={cx} cy="61" r="9" fill="#B6D96A" stroke={stroke} strokeWidth="3" />)}
        </>
      );
    case "cauliflower":
      return (
        <>
          <path d="M54 61c-9 14-12 25-13 37h38c-3-15-7-27-15-39" fill="#D8E0B8" stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <circle cx="39" cy="48" r="18" fill="#F0EBD8" stroke={stroke} strokeWidth="5" />
          <circle cx="61" cy="36" r="21" fill={cream} stroke={stroke} strokeWidth="5" />
          <circle cx="82" cy="51" r="18" fill="#F0EBD8" stroke={stroke} strokeWidth="5" />
        </>
      );
    case "rice":
      return <BowlArt fill={cream} accent={butter} detail="seeds" />;
    case "quinoa":
      return <BowlArt fill={cream} accent="#D7A94A" detail="dots" />;
    case "couscous":
      return <BowlArt fill={cream} accent="#E2BF78" detail="crumbs" />;
    case "oats":
      return <BowlArt fill={cream} accent="#CBA66D" detail="rings" />;
    case "barley":
      return <BowlArt fill={cream} accent="#B88D4F" detail="stripes" />;
    case "bread":
      return <BreadArt fill="#D69A54" detail="crumbs" />;
    case "pasta":
      return (
        <>
          <path d="M28 72h64c-4 20-16 30-32 30S32 92 28 72Z" fill={cream} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          {[42, 60, 78].map((cx, index) => (
            <path
              key={cx}
              d="M0 0l17 9-17 9 5-9-5-9Zm34 0l-17 9 17 9-5-9 5-9Z"
              fill={butter}
              stroke={stroke}
              strokeLinejoin="round"
              strokeWidth="3"
              transform={`translate(${cx - 17} ${48 + index * 9}) rotate(${index * 18 - 14} 17 9)`}
            />
          ))}
        </>
      );
    case "tortilla":
      return <BreadArt fill="#E7C680" accent="#B88543" detail="dots" />;
    case "flour":
      return <DairyCartonArt fill="#F3E4C7" accent={cream} detail="crumbs" />;
    case "polenta":
      return <BowlArt fill={cream} accent="#F1C34A" detail="stripes" />;
    case "ramen":
      return (
        <>
          <path d="M28 72h64c-4 20-16 30-32 30S32 92 28 72Z" fill={cream} stroke={stroke} strokeLinejoin="round" strokeWidth="5" />
          <path d="M36 55c9-14 17 14 27 0s17 14 27 0" fill="none" stroke={butter} strokeLinecap="round" strokeWidth="7" />
          <circle cx="77" cy="68" r="8" fill={terracotta} stroke={stroke} strokeWidth="3" />
        </>
      );
    case "sweet-potato":
      return <LongVegetableArt fill="#C66B3D" accent="#F7B06A" detail="dots" rotate={32} />;
    case "lime":
      return (
        <>
          <circle cx="58" cy="63" r="34" fill="#90B74D" stroke={stroke} strokeWidth="5" />
          <path d="M58 31v64M26 63h64M35 40l46 46M81 40L35 86" stroke={cream} strokeLinecap="round" strokeWidth="4" opacity="0.75" />
        </>
      );
    case "scallion":
      return <HerbArt fill="#78A852" accent="#D9E9A2" rotate={-18} />;
    case "cilantro":
      return <HerbArt fill="#5F924D" accent="#A7C96F" rotate={8} />;
    case "parsley":
      return <HerbArt fill="#4C7F3F" accent="#7FAB5D" rotate={-4} />;
    case "mint":
      return <HerbArt fill="#6BA55C" accent="#B5D98A" rotate={16} />;
    case "dill":
      return <HerbArt fill="#6B8F42" accent="#C1D681" rotate={-28} />;
    case "lemongrass":
      return <LongVegetableArt fill="#B8BE67" accent={cream} detail="stripes" rotate={-32} />;
    case "shallot":
      return (
        <>
          <path d="M60 25c-19 17-27 43-14 63 8 13 21 16 32 4 18-20 10-49-18-67Z" fill="#B66B8C" stroke={stroke} strokeWidth="5" />
          <path d="M60 29c-8 15-9 37 0 55M72 42c5 13 4 27-2 39" fill="none" stroke={cream} strokeLinecap="round" strokeWidth="4" opacity="0.65" />
        </>
      );
    case "mozzarella":
      return <DairyCartonArt fill={cream} accent="#BFDDE8" detail="dots" />;
    case "feta":
      return <CubeArt fill="#F7F0DA" accent="#94AFC8" detail="crumbs" />;
    case "ghee":
      return <JarArt fill={butter} accent="#D99A3A" detail="rings" />;
    case "sour-cream":
      return <DairyCartonArt fill={cream} accent="#D8E7EF" detail="rings" />;
    case "parmesan":
      return <BreadArt fill={butter} accent={cream} detail="crumbs" />;
    case "cream":
      return <DairyCartonArt fill={cream} accent="#F1DDAE" detail="rings" />;
    case "chili-flakes":
      return <JarArt fill="#C93C2E" accent={butter} detail="crumbs" />;
    case "cumin":
      return <JarArt fill="#A56A35" accent="#E3B969" detail="seeds" />;
    case "paprika":
      return <JarArt fill="#D84A32" accent="#F0A24A" detail="dots" />;
    case "turmeric":
      return <JarArt fill="#D5A51E" accent={cream} detail="stripes" />;
    case "black-pepper":
      return <JarArt fill="#2A2927" accent="#C6A66B" detail="dots" />;
    case "basil":
      return <HerbArt fill="#4B853E" accent="#94BD67" rotate={-10} />;
    case "oregano":
      return <HerbArt fill="#6B7C4E" accent="#A7A66D" rotate={20} />;
    case "cinnamon":
      return (
        <>
          <path d="M40 30c10 8 11 49 1 60" fill="none" stroke="#9B5C35" strokeLinecap="round" strokeWidth="16" />
          <path d="M75 28c10 10 10 50 0 64" fill="none" stroke="#C2793E" strokeLinecap="round" strokeWidth="16" />
          <path d="M35 42h53M35 78h53" stroke={stroke} strokeLinecap="round" strokeWidth="4" />
        </>
      );
    case "cardamom":
      return <BeanArt fill="#93A86A" accent="#CBD89C" detail="stripes" />;
    case "coriander":
      return <BeanArt fill="#C7A45E" accent="#E0C178" detail="dots" />;
    case "mustard-seeds":
      return <BeanArt fill="#D1A72B" accent="#7A4F20" detail="dots" />;
    case "garam-masala":
      return <JarArt fill="#8C4A2F" accent="#D8A85A" detail="rings" />;
    case "bay-leaf":
      return <LeafArt fill="#7C8A4F" accent="#D7D58F" detail="stripes" rotate={30} />;
    case "thyme":
      return <HerbArt fill="#738B57" accent="#B7C28B" rotate={-20} />;
    case "rosemary":
      return <HerbArt fill="#4D6F56" accent="#8FAE88" rotate={28} />;
    default:
      return null;
  }
}

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
  const exact = SpecificIngredientArt({ name });
  const key = keyForIngredient(name, category);

  if (exact) {
    return exact;
  }

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
