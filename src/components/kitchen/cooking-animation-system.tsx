"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  ChefHat,
  Clock3,
  RotateCcw,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useKitchenStore, type RecipeOption } from "@/store/use-kitchen-store";
import type { AnimationType, RecipeStep } from "@/types/database";

type CookingAnimationSystemProps = {
  recipe: RecipeOption;
};

const stageCopy: Record<AnimationType, string> = {
  chop: "Chop",
  fry: "Sizzle",
  boil: "Boil",
  stir: "Stir",
  bake: "Bake",
  plate: "Plate",
  rest: "Rest",
};

export function CookingAnimationSystem({ recipe }: CookingAnimationSystemProps) {
  const [playback, setPlayback] = useState({
    stepIndex: 0,
    remainingSeconds: recipe.steps[0]?.duration_seconds ?? 0,
  });
  const [runId, setRunId] = useState(0);
  const setCurrentStep = useKitchenStore((state) => state.setCurrentStep);
  const setStageStatus = useKitchenStore((state) => state.setStageStatus);
  const setActiveRecipe = useKitchenStore((state) => state.setActiveRecipe);
  const startedSessionRef = useRef(false);
  const completedSessionRef = useRef(false);
  const currentStep = recipe.steps[playback.stepIndex];
  const isComplete = playback.stepIndex >= recipe.steps.length;
  const progress = isComplete ? 100 : (playback.stepIndex / recipe.steps.length) * 100;

  useEffect(() => {
    if (startedSessionRef.current) {
      return;
    }

    startedSessionRef.current = true;
    void fetch("/api/cooking-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipeId: recipe.id,
        completed: false,
      }),
    });
  }, [recipe.id]);

  useEffect(() => {
    if (!currentStep) {
      setStageStatus("complete");
      setCurrentStep({
        index: recipe.steps.length,
        animationType: null,
        remainingSeconds: 0,
      });

      if (!completedSessionRef.current) {
        completedSessionRef.current = true;
        void fetch("/api/cooking-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipeId: recipe.id,
            completed: true,
          }),
        });
      }

      return;
    }

    setStageStatus("cooking");
    setCurrentStep({
      index: playback.stepIndex,
      animationType: currentStep.animation_type,
      remainingSeconds: playback.remainingSeconds,
    });
  }, [
    currentStep,
    playback.remainingSeconds,
    playback.stepIndex,
    recipe.id,
    recipe.steps.length,
    setCurrentStep,
    setStageStatus,
  ]);

  useEffect(() => {
    if (!currentStep) {
      return;
    }

    const interval = window.setInterval(() => {
      setPlayback((state) => {
        if (state.remainingSeconds <= 1) {
          window.clearInterval(interval);
          const nextStepIndex = state.stepIndex + 1;
          const nextStep = recipe.steps[nextStepIndex];

          return {
            stepIndex: nextStepIndex,
            remainingSeconds: nextStep?.duration_seconds ?? 0,
          };
        }

        return {
          stepIndex: state.stepIndex,
          remainingSeconds: state.remainingSeconds - 1,
        };
      });
    }, 450);

    return () => window.clearInterval(interval);
  }, [currentStep, recipe.steps, runId]);

  const replay = () => {
    setRunId((value) => value + 1);
    setPlayback({
      stepIndex: 0,
      remainingSeconds: recipe.steps[0]?.duration_seconds ?? 0,
    });
    setStageStatus("cooking");
  };

  const cookAgain = () => {
    setActiveRecipe(null);
    setStageStatus("ready");
  };

  return (
    <div className="relative z-20 flex flex-1 flex-col">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-butter)]">
            Now Cooking
          </p>
          <h2 className="mt-1 font-display text-4xl font-semibold leading-none">
            {recipe.name}
          </h2>
        </div>
        <span className="rounded-full bg-white/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.12em]">
          {recipe.difficulty}
        </span>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-[var(--color-butter)]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>

      <div className="relative my-6 grid flex-1 place-items-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/12">
        <AnimatePresence mode="wait">
          {isComplete ? (
            <CompleteStage key="complete" />
          ) : currentStep ? (
            <motion.div
              key={`${currentStep.step_number}-${runId}`}
              initial={{ opacity: 0, y: 26, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -26, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid w-full place-items-center px-4 py-10"
            >
              <AnimationScene step={currentStep} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {isComplete ? (
          <motion.div
            key="complete-copy"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-4"
          >
            <div className="text-center">
              <p className="font-display text-4xl font-semibold">Dish complete</p>
              <p className="mt-2 text-sm leading-6 text-white/62">
                The plate is ready. Save arrives with auth in Phase 6.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <StageButton onClick={replay} icon={RotateCcw} label="Replay" />
              <StageButton onClick={cookAgain} icon={ChefHat} label="Cook Again" />
              <StageButton onClick={cookAgain} icon={Bookmark} label="Save Recipe" muted />
            </div>
          </motion.div>
        ) : currentStep ? (
          <motion.div
            key={currentStep.step_number}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between gap-4 rounded-3xl bg-white/8 p-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-butter)]">
                Step {currentStep.step_number} · {stageCopy[currentStep.animation_type]}
                </p>
                <h3 className="mt-1 font-display text-3xl font-semibold">
                  {currentStep.title}
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-white/64">
                  {currentStep.action}
                </p>
              </div>
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[var(--color-butter)] text-[var(--color-warm-brown)]">
                <Clock3 className="size-5" />
                <span className="font-mono text-xs">{playback.remainingSeconds}s</span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

type StageButtonProps = {
  icon: LucideIcon;
  label: string;
  muted?: boolean;
  onClick: () => void;
};

function StageButton({ icon: Icon, label, muted = false, onClick }: StageButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-4 font-semibold",
        muted
          ? "bg-white/10 text-white/55"
          : "bg-[var(--color-butter)] text-[var(--color-warm-brown)]",
      )}
    >
      <Icon className="size-4" />
      {label}
    </motion.button>
  );
}

function AnimationScene({ step }: { step: RecipeStep }) {
  const ingredient = step.ingredient_involved;

  return (
    <div className="relative grid min-h-72 w-full max-w-md place-items-center">
      {step.animation_type === "chop" ? <ChopScene ingredient={ingredient} /> : null}
      {step.animation_type === "fry" ? <FryScene ingredient={ingredient} /> : null}
      {step.animation_type === "boil" ? <BoilScene ingredient={ingredient} /> : null}
      {step.animation_type === "stir" ? <StirScene ingredient={ingredient} /> : null}
      {step.animation_type === "bake" ? <BakeScene ingredient={ingredient} /> : null}
      {step.animation_type === "plate" ? <PlateScene ingredient={ingredient} /> : null}
      {step.animation_type === "rest" ? <RestScene ingredient={ingredient} /> : null}
    </div>
  );
}

function IngredientToken({ label }: { label: string }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      className="rounded-3xl border border-[var(--color-warm-brown)]/10 bg-white px-5 py-4 text-center text-[var(--color-warm-brown)] shadow-[5px_7px_0_rgba(0,0,0,0.2)]"
    >
      <span className="font-display text-2xl font-semibold">{label}</span>
    </motion.div>
  );
}

function ChopScene({ ingredient }: { ingredient: string }) {
  return (
    <>
      <motion.div
        animate={{ y: [-70, 16, -70], rotate: [-18, 12, -18] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 h-20 w-8 rounded-b-xl rounded-t-sm bg-[var(--color-butter)] shadow-[0_8px_0_rgba(0,0,0,0.2)]"
      />
      <div className="absolute bottom-12 h-16 w-64 rounded-[50%] bg-[var(--color-butter)]/35" />
      <div className="flex gap-3">
        {[0, 1, 2].map((item) => (
          <motion.span
            key={item}
            animate={{ y: [0, -18, 0], x: [0, item * 10 - 10, 0] }}
            transition={{ duration: 0.75, delay: item * 0.1, repeat: Infinity }}
            className="h-16 w-20 rounded-3xl bg-[var(--color-terracotta)] shadow-[4px_6px_0_rgba(0,0,0,0.2)]"
          />
        ))}
      </div>
      <p className="absolute bottom-2 font-mono text-xs uppercase tracking-[0.18em] text-white/54">
        {ingredient}
      </p>
    </>
  );
}

function FryScene({ ingredient }: { ingredient: string }) {
  return (
    <>
      <div className="absolute top-10 flex gap-4">
        {[0, 1, 2, 3].map((item) => (
          <span
            key={item}
            className="h-16 w-2 rounded-full bg-[var(--color-butter)]"
            style={{ animation: `sizzleWave 0.8s ease-in-out ${item * 0.12}s infinite` }}
          />
        ))}
      </div>
      <motion.div
        initial={{ x: -180 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", bounce: 0.25 }}
        className="relative mt-20 h-24 w-64 rounded-b-[5rem] rounded-t-[1.8rem] border-4 border-[var(--color-butter)] bg-[var(--color-terracotta)] shadow-[0_20px_0_rgba(0,0,0,0.22)]"
      >
        <span className="absolute -right-20 top-8 h-6 w-24 rounded-full bg-[var(--color-butter)]" />
        <motion.span
          animate={{ y: [-80, -8, -24], scale: [0.8, 1, 0.95] }}
          transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 0.4 }}
          className="absolute left-1/2 top-2 -translate-x-1/2"
        >
          <IngredientToken label={ingredient} />
        </motion.span>
      </motion.div>
    </>
  );
}

function BoilScene({ ingredient }: { ingredient: string }) {
  return (
    <div className="relative grid place-items-center">
      <div className="absolute top-5 flex gap-4">
        {[0, 1, 2, 3, 4].map((item) => (
          <span
            key={item}
            className="size-5 rounded-full bg-white/45"
            style={{ animation: `bubbleRise 1.2s ease-in-out ${item * 0.18}s infinite` }}
          />
        ))}
      </div>
      <div className="mt-20 h-36 w-56 rounded-b-[3rem] rounded-t-xl border-4 border-[var(--color-butter)] bg-[var(--color-olive)] shadow-[0_18px_0_rgba(0,0,0,0.24)]">
        <div className="mx-auto mt-4 h-4 w-36 rounded-full bg-white/20" />
        <p className="mt-10 text-center font-display text-3xl font-semibold">{ingredient}</p>
      </div>
    </div>
  );
}

function StirScene({ ingredient }: { ingredient: string }) {
  return (
    <div className="relative grid place-items-center">
      <div className="relative mt-12 grid size-56 place-items-center rounded-full border-4 border-[var(--color-butter)] bg-[var(--color-olive)] shadow-[0_18px_0_rgba(0,0,0,0.24)]">
        <div className="absolute h-28 w-3 origin-bottom rounded-full bg-[var(--color-butter)] [animation:spoonStir_1.2s_linear_infinite]" />
        <IngredientToken label={ingredient} />
      </div>
    </div>
  );
}

function BakeScene({ ingredient }: { ingredient: string }) {
  return (
    <div className="relative grid place-items-center">
      <div className="relative grid h-56 w-72 place-items-center rounded-[2rem] border-4 border-[var(--color-butter)] bg-[var(--color-charcoal)] shadow-[0_18px_0_rgba(0,0,0,0.24)]">
        <span className="absolute inset-8 rounded-2xl bg-[var(--color-terracotta)]/55 [animation:heatShimmer_0.8s_ease-in-out_infinite]" />
        <motion.div
          animate={{ rotateX: [0, -26, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-x-10 bottom-8 h-16 rounded-xl border border-white/15 bg-[var(--color-butter)]/25"
        />
        <p className="relative font-display text-3xl font-semibold">{ingredient}</p>
      </div>
    </div>
  );
}

function PlateScene({ ingredient }: { ingredient: string }) {
  return (
    <div className="relative grid place-items-center">
      <motion.div
        initial={{ x: -180, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.35 }}
        className="grid h-44 w-72 place-items-center rounded-[50%] border-4 border-[var(--color-butter)] bg-white text-[var(--color-warm-brown)] shadow-[0_18px_0_rgba(0,0,0,0.22)]"
      >
        <IngredientToken label={ingredient} />
      </motion.div>
      <SparkleRing />
    </div>
  );
}

function RestScene({ ingredient }: { ingredient: string }) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(245,200,66,0.25)",
          "0 0 0 32px rgba(245,200,66,0)",
          "0 0 0 0 rgba(245,200,66,0.25)",
        ],
      }}
      transition={{ duration: 1.6, repeat: Infinity }}
      className="grid size-64 place-items-center rounded-full bg-[var(--color-butter)]/20"
    >
      <IngredientToken label={ingredient} />
    </motion.div>
  );
}

function CompleteStage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.86 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative grid min-h-72 place-items-center"
    >
      <div className="grid h-48 w-72 place-items-center rounded-[50%] border-4 border-[var(--color-butter)] bg-white text-[var(--color-warm-brown)] shadow-[0_18px_0_rgba(0,0,0,0.24)]">
        <Sparkles className="size-12 text-[var(--color-terracotta)]" />
      </div>
      <SparkleRing />
    </motion.div>
  );
}

function SparkleRing() {
  const sparkles = useMemo(() => Array.from({ length: 14 }, (_, index) => index), []);

  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      {sparkles.map((sparkle) => (
        <span
          key={sparkle}
          className="absolute size-3 rounded-full bg-[var(--color-butter)]"
          style={{
            "--angle": `${sparkle * 25.7}deg`,
            animation: `sparkleBurst 1.1s ease-out ${sparkle * 0.03}s infinite`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
