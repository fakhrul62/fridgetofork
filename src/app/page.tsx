"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, Sparkles, Utensils } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { Logo } from "@/components/brand/logo";
import { IngredientWorkspace } from "@/components/kitchen/ingredient-workspace";
import { featuredRecipes } from "@/data/featured-recipes";

const floatingIngredients = [
  { emoji: "🍅", label: "Tomato", className: "left-[8%] top-[21%] delay-0" },
  { emoji: "🧄", label: "Garlic", className: "right-[15%] top-[16%] delay-200" },
  { emoji: "🥦", label: "Broccoli", className: "left-[18%] bottom-[16%] delay-500" },
  { emoji: "🧈", label: "Butter", className: "right-[8%] bottom-[24%] delay-700" },
];

const foundationCards = [
  {
    title: "Kitchen State",
    description: "Zustand store is ready for ingredient selection and cooking-stage playback.",
    icon: Utensils,
  },
  {
    title: "Motion System",
    description: "Lenis, GSAP ScrollTrigger, Framer Motion, and the custom cursor are wired globally.",
    icon: Sparkles,
  },
  {
    title: "Data Layer",
    description: "Typed Supabase clients and schema contracts are in place for the next phases.",
    icon: Clock3,
  },
];

const heroHeadline = "What's in your kitchen?";
const howItWorks = [
  ["Pick", "Choose up to 8 ingredients from your fridge, pantry, or wishful thinking."],
  ["Generate", "Get three chef-style ideas shaped around what you already have."],
  ["Cook", "Watch the animated stage chop, sizzle, stir, bake, and plate."],
];

const stats = [
  ["300", "Recipes Generated"],
  ["36", "Ingredients"],
  ["7", "Animation Types"],
  ["100", "Always Free"],
];

export default function Home() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".hero-char", {
        yPercent: 115,
        opacity: 0,
        rotate: 4,
        duration: 0.72,
        ease: "power4.out",
        stagger: 0.018,
      });

      ScrollTrigger.batch(".scroll-card", {
        start: "top 82%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { y: 34, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.65,
              ease: "power3.out",
              stagger: 0.08,
            },
          );
        },
        once: true,
      });

      gsap.utils.toArray<HTMLElement>(".section-wipe").forEach((heading) => {
        gsap.fromTo(
          heading,
          { y: 34, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 84%",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".stat-number").forEach((stat) => {
        const target = Number(stat.dataset.target ?? "0");
        const counter = { value: 0 };

        gsap.to(counter, {
          value: target,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stat,
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            stat.textContent = `${Math.round(counter.value)}`;
          },
        });
      });

      gsap.from(".footer-word", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".footer-words",
          start: "top 88%",
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="grain-overlay min-h-screen overflow-hidden">
      <section className="relative flex min-h-screen items-center px-5 py-6 sm:px-8 lg:px-12">
        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <Logo />
            <div className="space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.55 }}
                className="w-fit rounded-full border border-[var(--color-warm-brown)]/20 bg-white/45 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-olive)] shadow-[2px_2px_0_rgba(61,43,31,0.18)]"
              >
                Everything in its place. Everything in its time.
              </motion.p>
              <h1 className="max-w-4xl overflow-hidden font-display text-6xl font-semibold leading-[0.9] tracking-normal text-[var(--color-warm-brown)] sm:text-7xl lg:text-8xl">
                {heroHeadline.split("").map((char, index) => (
                  <span
                    key={`${char}-${index}`}
                    className="hero-char inline-block"
                    aria-hidden="true"
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
                <span className="sr-only">{heroHeadline}</span>
              </h1>
              <p className="max-w-xl text-lg leading-8 text-[var(--color-warm-brown)]/78 sm:text-xl">
                Pick your ingredients. We&apos;ll handle the rest with a warm,
                animated mise en place that turns fridge leftovers into dinner.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <motion.a
                href="#kitchen"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[var(--color-terracotta)] px-7 font-semibold text-white shadow-[0_12px_30px_rgba(226,113,75,0.28),4px_4px_0_var(--color-warm-brown)]"
              >
                Start Cooking
                <ArrowRight className="size-5" aria-hidden="true" />
              </motion.a>
              <motion.button
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document.getElementById("foundation")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-14 rounded-full border border-[var(--color-warm-brown)]/25 bg-white/55 px-7 font-semibold text-[var(--color-warm-brown)] shadow-[4px_4px_0_rgba(61,43,31,0.12)] backdrop-blur"
              >
                View Foundation
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32, rotate: 1 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ delay: 0.18, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[560px] overflow-hidden rounded-[2rem] border border-[var(--color-warm-brown)] bg-[var(--color-warm-brown)] p-5 shadow-[12px_12px_0_rgba(61,43,31,0.18)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,200,66,0.2),transparent_28rem)]" />
            <div className="relative flex h-full min-h-[520px] flex-col justify-between overflow-hidden rounded-[1.45rem] border border-white/10 bg-[#2d1f17] p-6 text-[var(--color-cream)]">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[var(--color-butter)] px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-warm-brown)]">
                  Cooking Stage
                </span>
                <span className="font-mono text-xs text-white/55">Phase 01</span>
              </div>

              <div className="relative mx-auto grid size-72 place-items-center rounded-full border border-white/10 bg-black/10 shadow-[inset_0_0_70px_rgba(245,200,66,0.12)]">
                <div className="absolute top-6 flex gap-3">
                  {[0, 1, 2].map((item) => (
                    <span
                      key={item}
                      className="h-16 w-2 rounded-full bg-white/20"
                      style={{
                        animation: `steamRise 2.6s ease-in-out ${item * 0.35}s infinite`,
                      }}
                    />
                  ))}
                </div>
                <div className="relative h-24 w-48 rounded-b-[5rem] rounded-t-[1.75rem] border-4 border-[var(--color-butter)] bg-[var(--color-terracotta)] shadow-[0_18px_0_rgba(0,0,0,0.18)]">
                  <div className="absolute -right-16 top-8 h-5 w-20 rounded-full bg-[var(--color-butter)]" />
                  <div className="absolute left-1/2 top-4 h-5 w-28 -translate-x-1/2 rounded-full bg-white/20" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {["Select", "Generate", "Cook"].map((label, index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + index * 0.08, type: "spring", bounce: 0.35 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                  >
                    <span className="font-mono text-xs text-[var(--color-butter)]">
                      0{index + 1}
                    </span>
                    <p className="mt-2 font-display text-2xl">{label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {floatingIngredients.map((ingredient, index) => (
          <motion.div
            key={ingredient.label}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 + index * 0.12, type: "spring", bounce: 0.5 }}
            className={`absolute hidden size-20 place-items-center rounded-3xl border border-[var(--color-warm-brown)]/15 bg-white/60 text-4xl shadow-[5px_5px_0_rgba(61,43,31,0.12)] backdrop-blur lg:grid ${ingredient.className}`}
            style={{ animation: `floatIngredient ${4 + index * 0.4}s ease-in-out infinite` }}
            aria-label={ingredient.label}
          >
            {ingredient.emoji}
          </motion.div>
        ))}
      </section>

      <section className="relative z-10 px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="section-wipe font-display text-5xl font-semibold leading-none">
            Pick. Generate. Cook.
          </h2>
          <div className="relative mt-8 grid gap-4 md:grid-cols-3">
            <svg
              className="absolute left-8 right-8 top-10 hidden h-8 w-[calc(100%-4rem)] md:block"
              viewBox="0 0 900 40"
              fill="none"
              aria-hidden="true"
            >
              <motion.path
                d="M10 20 C220 0 330 40 450 20 C610 -4 710 44 890 20"
                stroke="#E2714B"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </svg>
            {howItWorks.map(([title, description], index) => (
              <article
                key={title}
                className="scroll-card rounded-[1.5rem] border border-[var(--color-warm-brown)]/12 bg-white/52 p-6 opacity-0 shadow-[4px_4px_0_rgba(61,43,31,0.1)] backdrop-blur"
              >
                <span className="grid size-12 place-items-center rounded-full bg-[var(--color-butter)] font-mono text-sm font-semibold">
                  0{index + 1}
                </span>
                <h3 className="mt-8 font-display text-4xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-[var(--color-warm-brown)]/68">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <IngredientWorkspace />

      <section className="relative z-10 px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="section-wipe max-w-2xl font-display text-5xl font-semibold leading-none">
              Featured recipes from the warm shelf
            </h2>
            <Link
              href="/explore"
              className="w-fit rounded-full bg-[var(--color-terracotta)] px-5 py-3 font-semibold text-white shadow-[3px_3px_0_var(--color-warm-brown)]"
            >
              Explore all
            </Link>
          </div>
          <div className="mt-8 columns-1 gap-4 md:columns-2 xl:columns-3">
            {featuredRecipes.map((recipe, index) => (
              <Link
                key={recipe.id}
                href={`/recipe/${recipe.id}`}
                className="scroll-card mb-4 block break-inside-avoid rounded-[1.5rem] border border-[var(--color-warm-brown)]/12 bg-white/58 p-5 opacity-0 shadow-[4px_4px_0_rgba(61,43,31,0.1)]"
                style={{ minHeight: `${260 + index * 34}px` }}
              >
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-olive)]">
                  {recipe.cuisine} · {recipe.cookTime} min
                </p>
                <h3 className="mt-5 font-display text-4xl font-semibold leading-none">
                  {recipe.name}
                </h3>
                <p className="mt-4 leading-7 text-[var(--color-warm-brown)]/68">
                  {recipe.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {stats.map(([value, label]) => (
            <article
              key={label}
              className="scroll-card rounded-[1.5rem] border border-[var(--color-warm-brown)]/12 bg-[var(--color-butter)]/42 p-6 opacity-0 shadow-[4px_4px_0_rgba(61,43,31,0.1)]"
            >
              <p
                className="stat-number font-display text-6xl font-semibold"
                data-target={value}
              >
                0
              </p>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em]">{label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[var(--color-charcoal)] p-8 text-[var(--color-cream)] shadow-[8px_8px_0_rgba(61,43,31,0.16)] sm:p-12">
          <div className="relative">
            <div className="absolute right-0 top-0 text-7xl opacity-20 [animation:orbitKitchen_6s_linear_infinite]">
              🥕
            </div>
            <h2 className="section-wipe max-w-3xl font-display text-6xl font-semibold leading-none">
              Your next favourite meal is 3 ingredients away.
            </h2>
            <motion.a
              href="#kitchen"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[var(--color-butter)] px-7 font-semibold text-[var(--color-warm-brown)]"
            >
              Start Cooking
              <ArrowRight className="size-5" />
            </motion.a>
          </div>
        </div>
      </section>

      <section id="foundation" className="relative z-10 px-5 pb-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {foundationCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08, type: "spring", bounce: 0.28 }}
                className="rounded-3xl border border-[var(--color-warm-brown)]/15 bg-white/50 p-6 shadow-[4px_4px_0_rgba(61,43,31,0.1)] backdrop-blur"
              >
                <Icon className="mb-7 size-7 text-[var(--color-terracotta)]" strokeWidth={2.3} />
                <h2 className="font-display text-3xl font-semibold">{card.title}</h2>
                <p className="mt-3 leading-7 text-[var(--color-warm-brown)]/72">{card.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <footer className="relative z-10 border-t border-[var(--color-warm-brown)]/12 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <p className="footer-words flex flex-wrap gap-x-2 font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-warm-brown)]/62">
            {"Made with pan heat and Framer Motion".split(" ").map((word, index) => (
              <span key={`${word}-${index}`} className="footer-word inline-block">
                {word}
              </span>
            ))}
          </p>
        </div>
      </footer>
    </main>
  );
}
