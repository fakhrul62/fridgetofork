create extension if not exists "pgcrypto";

create table if not exists public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  emoji text not null,
  category text not null check (category in ('protein', 'vegetable', 'grain', 'aromatic', 'dairy', 'spice')),
  created_at timestamptz not null default now()
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  ingredients text[] not null,
  steps jsonb not null,
  cook_time integer not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  cuisine text not null,
  match_score integer,
  substitutions text[],
  taste_notes text[],
  shopping_list text[],
  nutrition jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  recipe_id uuid references public.recipes,
  favorite boolean not null default false,
  cooked_count integer not null default 0,
  notes text,
  rating integer check (rating between 1 and 5),
  tags text[],
  created_at timestamptz not null default now()
);

create table if not exists public.cooking_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  recipe_id uuid references public.recipes,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.recipes add column if not exists match_score integer;
alter table public.recipes add column if not exists substitutions text[];
alter table public.recipes add column if not exists taste_notes text[];
alter table public.recipes add column if not exists shopping_list text[];
alter table public.recipes add column if not exists nutrition jsonb;

alter table public.saved_recipes add column if not exists favorite boolean not null default false;
alter table public.saved_recipes add column if not exists cooked_count integer not null default 0;
alter table public.saved_recipes add column if not exists notes text;
alter table public.saved_recipes add column if not exists rating integer;
alter table public.saved_recipes add column if not exists tags text[];

create unique index if not exists ingredients_name_unique on public.ingredients (lower(name));
create index if not exists recipes_created_at_idx on public.recipes (created_at desc);
create index if not exists saved_recipes_user_id_idx on public.saved_recipes (user_id);
create index if not exists cooking_sessions_recipe_id_idx on public.cooking_sessions (recipe_id);

alter table public.ingredients enable row level security;
alter table public.recipes enable row level security;
alter table public.saved_recipes enable row level security;
alter table public.cooking_sessions enable row level security;

drop policy if exists "Ingredients are public readable" on public.ingredients;
create policy "Ingredients are public readable"
  on public.ingredients for select
  using (true);

drop policy if exists "Recipes are public readable" on public.recipes;
create policy "Recipes are public readable"
  on public.recipes for select
  using (true);

drop policy if exists "Users read their saved recipes" on public.saved_recipes;
create policy "Users read their saved recipes"
  on public.saved_recipes for select
  using (auth.uid() = user_id);

drop policy if exists "Users write their saved recipes" on public.saved_recipes;
create policy "Users write their saved recipes"
  on public.saved_recipes for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users read their cooking sessions" on public.cooking_sessions;
create policy "Users read their cooking sessions"
  on public.cooking_sessions for select
  using (auth.uid() = user_id or user_id is null);

drop policy if exists "Users write their cooking sessions" on public.cooking_sessions;
create policy "Users write their cooking sessions"
  on public.cooking_sessions for insert
  with check (auth.uid() = user_id or user_id is null);

insert into public.ingredients (name, emoji, category)
values
  ('Chicken', '🍗', 'protein'),
  ('Salmon', '🐟', 'protein'),
  ('Eggs', '🥚', 'protein'),
  ('Tofu', '⬜', 'protein'),
  ('Beef', '🥩', 'protein'),
  ('Shrimp', '🍤', 'protein'),
  ('Tomato', '🍅', 'vegetable'),
  ('Broccoli', '🥦', 'vegetable'),
  ('Mushroom', '🍄', 'vegetable'),
  ('Spinach', '🥬', 'vegetable'),
  ('Carrot', '🥕', 'vegetable'),
  ('Bell Pepper', '🫑', 'vegetable'),
  ('Rice', '🍚', 'grain'),
  ('Pasta', '🍝', 'grain'),
  ('Bread', '🍞', 'grain'),
  ('Quinoa', '🌾', 'grain'),
  ('Noodles', '🍜', 'grain'),
  ('Tortilla', '🫓', 'grain'),
  ('Garlic', '🧄', 'aromatic'),
  ('Onion', '🧅', 'aromatic'),
  ('Ginger', '🫚', 'aromatic'),
  ('Scallion', '🌿', 'aromatic'),
  ('Lemon', '🍋', 'aromatic'),
  ('Cilantro', '🌱', 'aromatic'),
  ('Butter', '🧈', 'dairy'),
  ('Cheese', '🧀', 'dairy'),
  ('Milk', '🥛', 'dairy'),
  ('Yogurt', '🥣', 'dairy'),
  ('Cream', '🍶', 'dairy'),
  ('Parmesan', '🧀', 'dairy'),
  ('Chili Flakes', '🌶️', 'spice'),
  ('Cumin', '🟤', 'spice'),
  ('Paprika', '🔴', 'spice'),
  ('Turmeric', '🟡', 'spice'),
  ('Black Pepper', '⚫', 'spice'),
  ('Basil', '🌿', 'spice')
on conflict ((lower(name))) do nothing;
