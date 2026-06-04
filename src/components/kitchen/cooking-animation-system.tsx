"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  ChefHat,
  Hand,
  MoveLeft,
  MoveRight,
  RotateCcw,
  Volume2,
  VolumeX,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { DishArtwork } from "@/components/visuals/dish-artwork";
import { IngredientIllustration } from "@/components/visuals/ingredient-illustration";
import { ingredients } from "@/data/ingredients";
import { cn } from "@/lib/utils";
import { useKitchenStore, type RecipeOption } from "@/store/use-kitchen-store";
import type { AnimationType, RecipeStep } from "@/types/database";
import type { IngredientCategory } from "@/types/database";

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
  const [stepIndex, setStepIndex] = useState(0);
  const [runId, setRunId] = useState(0);
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [interactionState, setInteractionState] = useState({
    stepIndex: 0,
    score: 0,
  });
  const [soundOn, setSoundOn] = useState(false);
  const [soundLevel, setSoundLevel] = useState(0.35);
  const setCurrentStep = useKitchenStore((state) => state.setCurrentStep);
  const setStageStatus = useKitchenStore((state) => state.setStageStatus);
  const setActiveRecipe = useKitchenStore((state) => state.setActiveRecipe);
  const startedSessionRef = useRef(false);
  const completedSessionRef = useRef(false);
  const currentStep = recipe.steps[stepIndex];
  const isComplete = stepIndex >= recipe.steps.length;
  const progress = isComplete ? 100 : (stepIndex / recipe.steps.length) * 100;
  const interactionScore =
    interactionState.stepIndex === stepIndex ? interactionState.score : 0;

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
    if (soundOn) {
      playCookingTone(currentStep.animation_type, soundLevel);
    }
    setCurrentStep({
      index: stepIndex,
      animationType: currentStep.animation_type,
      remainingSeconds: 0,
    });
  }, [
    currentStep,
    recipe.id,
    recipe.steps.length,
    setCurrentStep,
    setStageStatus,
    soundLevel,
    soundOn,
    stepIndex,
  ]);

  const replay = () => {
    setRunId((value) => value + 1);
    setStepIndex(0);
    setInteractionState({ stepIndex: 0, score: 0 });
    completedSessionRef.current = false;
    setStageStatus("cooking");
  };

  const cookAgain = () => {
    setActiveRecipe(null);
    setStageStatus("ready");
  };
  const interactWithStep = () => {
    setInteractionState((state) => ({
      stepIndex,
      score:
        state.stepIndex === stepIndex
          ? Math.min(100, state.score + 18)
          : 18,
    }));

    if (soundOn && currentStep) {
      playCookingTone(currentStep.animation_type, soundLevel);
    }
  };

  const goToPreviousStep = () => {
    setStepIndex((value) => Math.max(0, value - 1));
    setRunId((value) => value + 1);
    setStageStatus("cooking");
  };

  const goToNextStep = () => {
    setStepIndex((value) => Math.min(recipe.steps.length, value + 1));
    setRunId((value) => value + 1);
  };

  const saveRecipe = async () => {
    setIsSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch("/api/save-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId: recipe.id }),
      });
      const payload = (await response.json()) as { error?: string };

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not save this recipe yet.");
      }

      setSaveMessage("Saved to your cookbook.");
    } catch (error) {
      setSaveMessage(
        error instanceof Error ? error.message : "Could not save this recipe yet.",
      );
    } finally {
      setIsSaving(false);
    }
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
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setSoundOn((value) => !value)}
            className="grid size-10 place-items-center rounded-full bg-white/10 text-white"
            aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
          >
            {soundOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </motion.button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={soundLevel}
            onChange={(event) => setSoundLevel(Number(event.target.value))}
            className="hidden w-20 accent-[var(--color-butter)] sm:block"
            aria-label="Sound volume"
          />
          <span className="rounded-full bg-white/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.12em]">
            {recipe.difficulty}
          </span>
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-[var(--color-butter)]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {recipe.steps.map((step, index) => (
          <span
            key={`${step.step_number}-${step.title}`}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em]",
              index < stepIndex
                ? "border-[var(--color-butter)] bg-[var(--color-butter)] text-[var(--color-warm-brown)]"
                : index === stepIndex
                  ? "border-[var(--color-terracotta)] bg-[var(--color-terracotta)] text-white"
                  : "border-white/10 bg-white/8 text-white/52",
            )}
          >
            {step.animation_type}
          </span>
        ))}
      </div>

      <div className="relative my-6 grid flex-1 place-items-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/12">
        <AnimatePresence mode="wait">
          {isComplete ? (
            <CompleteStage key="complete" recipe={recipe} />
          ) : currentStep ? (
            <motion.div
              key={`${currentStep.step_number}-${runId}`}
              initial={{ opacity: 0, y: 26, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -26, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid w-full place-items-center px-4 py-10"
            >
              <AnimationScene step={currentStep} onInteract={interactWithStep} />
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
                The plate is ready. Save it, replay it, or cook again with a new lineup.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <StageButton onClick={replay} icon={RotateCcw} label="Replay" />
              <StageButton onClick={cookAgain} icon={ChefHat} label="Cook Again" />
              <StageButton
                onClick={saveRecipe}
                icon={Bookmark}
                label={isSaving ? "Saving..." : "Save Recipe"}
                muted
              />
            </div>
            {saveMessage ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm text-white/62"
              >
                {saveMessage}
              </motion.p>
            ) : null}
          </motion.div>
        ) : currentStep ? (
          <motion.div
            key={currentStep.step_number}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-4"
          >
            <div className="max-h-[34svh] overflow-y-auto rounded-3xl bg-white/8 p-4 pr-3 sm:max-h-48">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-butter)]">
                  Step {currentStep.step_number} / {stageCopy[currentStep.animation_type]}
                </p>
                <h3 className="mt-1 font-display text-3xl font-semibold">
                  {currentStep.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
                  {currentStep.action}
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-white/62">
                  <Hand className="size-4 text-[var(--color-butter)]" />
                  Cook with it
                </span>
                <span className="font-mono text-xs text-[var(--color-butter)]">
                  {interactionScore}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-[var(--color-butter)]"
                  animate={{ width: `${interactionScore}%` }}
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <StageButton
                onClick={goToPreviousStep}
                icon={MoveLeft}
                label="Previous"
                muted={stepIndex === 0}
                disabled={stepIndex === 0}
              />
              <div className="text-center font-mono text-xs uppercase tracking-[0.14em] text-white/50">
                Step {stepIndex + 1} of {recipe.steps.length}
              </div>
              <StageButton
                onClick={goToNextStep}
                icon={MoveRight}
                label={stepIndex === recipe.steps.length - 1 ? "Finish Dish" : "Next Step"}
              />
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
  disabled?: boolean;
  onClick: () => void;
};

function StageButton({
  icon: Icon,
  label,
  muted = false,
  disabled = false,
  onClick,
}: StageButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-4 font-semibold",
        disabled
          ? "cursor-not-allowed bg-white/8 text-white/28"
          : muted
            ? "bg-white/10 text-white/55"
            : "bg-[var(--color-butter)] text-[var(--color-warm-brown)]",
      )}
    >
      <Icon className="size-4" />
      {label}
    </motion.button>
  );
}

function playCookingTone(animationType: AnimationType, volume: number) {
  const audioWindow = window as Window & {
    webkitAudioContext?: typeof AudioContext;
  };
  const AudioContextClass = window.AudioContext ?? audioWindow.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const frequencies: Record<AnimationType, number> = {
    chop: 260,
    fry: 620,
    boil: 420,
    stir: 330,
    bake: 220,
    plate: 760,
    rest: 180,
  };

  oscillator.frequency.value = frequencies[animationType];
  oscillator.type = animationType === "fry" ? "sawtooth" : "sine";
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12 * volume, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.14);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.15);
}

function AnimationScene({
  step,
  onInteract,
}: {
  step: RecipeStep;
  onInteract: () => void;
}) {
  const ingredient = step.ingredient_involved;

  return (
    <div className="relative grid min-h-80 w-full max-w-lg place-items-center overflow-hidden">
      <div className="absolute inset-x-8 bottom-5 h-16 rounded-[50%] bg-black/20 blur-lg" />
      {step.animation_type === "chop" ? (
        <ChopScene ingredient={ingredient} onInteract={onInteract} />
      ) : null}
      {step.animation_type === "fry" ? (
        <FryScene ingredient={ingredient} onInteract={onInteract} />
      ) : null}
      {step.animation_type === "boil" ? (
        <BoilScene ingredient={ingredient} onInteract={onInteract} />
      ) : null}
      {step.animation_type === "stir" ? (
        <StirScene ingredient={ingredient} onInteract={onInteract} />
      ) : null}
      {step.animation_type === "bake" ? (
        <BakeScene ingredient={ingredient} onInteract={onInteract} />
      ) : null}
      {step.animation_type === "plate" ? (
        <PlateScene ingredient={ingredient} onInteract={onInteract} />
      ) : null}
      {step.animation_type === "rest" ? (
        <RestScene ingredient={ingredient} onInteract={onInteract} />
      ) : null}
    </div>
  );
}

function getIngredientCategory(label: string): IngredientCategory | undefined {
  const normalizedLabel = label.toLowerCase();
  const exactMatch = ingredients.find(
    (ingredient) => ingredient.name.toLowerCase() === normalizedLabel,
  );
  const partialMatch = ingredients.find(
    (ingredient) =>
      normalizedLabel.includes(ingredient.name.toLowerCase()) ||
      ingredient.name.toLowerCase().includes(normalizedLabel),
  );

  return exactMatch?.category ?? partialMatch?.category;
}

function IngredientPiece({
  name,
  label,
  delay = 0,
  small = false,
}: {
  name: string;
  label?: string;
  delay?: number;
  small?: boolean;
}) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0], rotate: [-3, 4, -3] }}
      transition={{ duration: 1.6, delay, repeat: Infinity, ease: "easeInOut" }}
      className={cn(
        "grid place-items-center rounded-2xl border border-[var(--color-warm-brown)]/12 bg-white text-[var(--color-warm-brown)] shadow-[4px_5px_0_rgba(0,0,0,0.18)]",
        small ? "size-12" : "min-w-24 px-4 py-3",
      )}
    >
      <IngredientIllustration
        name={name}
        category={getIngredientCategory(name)}
        size="sm"
        className={small ? "size-10" : "size-16"}
      />
      {label ? (
        <span className="mt-1 max-w-24 text-center font-mono text-[10px] uppercase tracking-[0.1em]">
          {label}
        </span>
      ) : null}
    </motion.div>
  );
}
function StageLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 rounded-full bg-white/12 px-4 py-2 text-center font-mono text-xs uppercase tracking-[0.18em] text-white/82">
      {children}
    </p>
  );
}

function ChopScene({
  ingredient,
  onInteract,
}: {
  ingredient: string;
  onInteract: () => void;
}) {
  return (
    <div className="relative grid w-full place-items-center">
      <div className="relative mt-10 h-48 w-80 rounded-[2rem] border-4 border-[#8b5a36] bg-[#c98b56] shadow-[0_18px_0_rgba(0,0,0,0.22)]">
        <span className="absolute left-5 top-5 size-8 rounded-full border-4 border-[#8b5a36]/35" />
        <motion.button
          type="button"
          onClick={onInteract}
          drag="y"
          dragConstraints={{ top: -64, bottom: 18 }}
          className="absolute left-1/2 top-4 h-28 w-9 origin-bottom rounded-b-xl rounded-t-sm bg-[var(--color-butter)] shadow-[0_9px_0_rgba(0,0,0,0.18)]"
          style={{ animation: "knifeChop 0.72s ease-in-out infinite" }}
          aria-label="Drag or tap knife to chop"
        >
          <span className="absolute -right-5 top-2 h-24 w-5 rounded-full bg-white/85" />
        </motion.button>
        <div className="absolute bottom-9 left-1/2 flex -translate-x-1/2 items-end gap-3">
          {[0, 1, 2, 3].map((item) => (
            <motion.div
              key={item}
              animate={{ y: [0, -10, 0], x: [0, item * 5 - 8, 0] }}
              transition={{ duration: 0.75, delay: item * 0.08, repeat: Infinity }}
            >
              <IngredientPiece name={ingredient} small />
            </motion.div>
          ))}
        </div>
      </div>
      <StageLabel>{ingredient}</StageLabel>
    </div>
  );
}

function FryScene({
  ingredient,
  onInteract,
}: {
  ingredient: string;
  onInteract: () => void;
}) {
  return (
    <div className="relative grid w-full place-items-center">
      <div className="absolute top-5 flex gap-4">
        {[0, 1, 2, 3, 4].map((item) => (
          <span
            key={item}
            className="h-16 w-2 rounded-full bg-[var(--color-butter)]"
            style={{ animation: `sizzleWave 0.78s ease-in-out ${item * 0.1}s infinite` }}
          />
        ))}
      </div>
      <motion.div
        initial={{ x: -160 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", bounce: 0.26 }}
        drag="x"
        dragConstraints={{ left: -34, right: 34 }}
        onDragEnd={onInteract}
        onClick={onInteract}
        className="relative mt-20 h-32 w-80"
        style={{ animation: "panToss 1.25s ease-in-out infinite" }}
        role="button"
        tabIndex={0}
      >
        <div className="absolute inset-x-5 bottom-0 h-24 rounded-b-[5rem] rounded-t-[2rem] border-4 border-[var(--color-butter)] bg-[var(--color-terracotta)] shadow-[0_20px_0_rgba(0,0,0,0.24)]">
          <span className="absolute -right-20 top-8 h-6 w-28 rounded-full bg-[var(--color-butter)] shadow-[0_5px_0_rgba(0,0,0,0.18)]" />
          <span className="absolute left-1/2 top-7 h-6 w-40 -translate-x-1/2 rounded-full bg-white/16 [animation:oilShine_1.1s_ease-in-out_infinite]" />
          {[0, 1, 2, 3].map((item) => (
            <motion.div
              key={item}
              animate={{
                x: [item * 26 - 42, item * 22 - 30, item * 26 - 42],
                y: [-4, -28 - item * 2, -4],
                rotate: [0, 24, 0],
              }}
              transition={{ duration: 0.9, delay: item * 0.08, repeat: Infinity }}
              className="absolute left-1/2 top-3"
            >
              <IngredientPiece name={ingredient} small />
            </motion.div>
          ))}
        </div>
      </motion.div>
      <StageLabel>Frying {ingredient}</StageLabel>
    </div>
  );
}

function BoilScene({
  ingredient,
  onInteract,
}: {
  ingredient: string;
  onInteract: () => void;
}) {
  return (
    <div className="relative grid place-items-center">
      <motion.div
        className="absolute top-6 h-8 w-48 rounded-full border-4 border-[var(--color-butter)] bg-white/15"
        style={{ animation: "potLidRattle 0.58s ease-in-out infinite" }}
      />
      <div className="absolute top-14 flex gap-4">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <motion.button
            type="button"
            onClick={onInteract}
            key={item}
            className="size-5 rounded-full border border-white/40 bg-white/35"
            style={{ animation: `bubbleRise 1.2s ease-in-out ${item * 0.18}s infinite` }}
            aria-label="Tap bubble"
          />
        ))}
      </div>
      <div className="mt-24 h-40 w-64 rounded-b-[3.25rem] rounded-t-2xl border-4 border-[var(--color-butter)] bg-[var(--color-olive)] shadow-[0_18px_0_rgba(0,0,0,0.24)]">
        <div className="mx-auto mt-5 h-5 w-44 rounded-full bg-white/22" />
        <div className="mt-8 flex justify-center gap-3">
          {[0, 1, 2].map((item) => (
            <IngredientPiece key={item} name={ingredient} small delay={item * 0.12} />
          ))}
        </div>
      </div>
      <StageLabel>Simmering {ingredient}</StageLabel>
    </div>
  );
}

function StirScene({
  ingredient,
  onInteract,
}: {
  ingredient: string;
  onInteract: () => void;
}) {
  return (
    <div className="relative grid place-items-center">
      <div className="relative mt-12 grid size-64 place-items-center rounded-full border-4 border-[var(--color-butter)] bg-[var(--color-olive)] shadow-[0_18px_0_rgba(0,0,0,0.24)]">
        <div className="absolute inset-8 rounded-full bg-[#f0b44b]/60 shadow-[inset_0_0_28px_rgba(61,43,31,0.22)]" />
        <motion.button
          type="button"
          drag
          dragConstraints={{ left: -56, right: 56, top: -56, bottom: 56 }}
          onDrag={onInteract}
          onClick={onInteract}
          className="absolute h-32 w-3 origin-bottom rounded-full bg-[var(--color-butter)] shadow-[0_4px_0_rgba(0,0,0,0.18)] [animation:spoonStir_1.05s_linear_infinite]"
          aria-label="Drag spoon to stir"
        />
        {[0, 1, 2, 3].map((item) => (
          <motion.div
            key={item}
            animate={{ rotate: [item * 90, item * 90 + 360] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            className="absolute"
          >
            <div className="translate-x-16">
              <IngredientPiece name={ingredient} small />
            </div>
          </motion.div>
        ))}
      </div>
      <StageLabel>Stirring {ingredient}</StageLabel>
    </div>
  );
}

function BakeScene({
  ingredient,
  onInteract,
}: {
  ingredient: string;
  onInteract: () => void;
}) {
  return (
    <div className="relative grid place-items-center">
      <div className="relative grid h-60 w-80 place-items-center rounded-[2rem] border-4 border-[var(--color-butter)] bg-[var(--color-charcoal)] shadow-[0_18px_0_rgba(0,0,0,0.24)]">
        <span className="absolute inset-8 rounded-2xl bg-[var(--color-terracotta)]/60 [animation:ovenGlow_1s_ease-in-out_infinite]" />
        <span className="absolute left-8 top-8 size-4 rounded-full bg-[var(--color-butter)]" />
        <span className="absolute left-8 top-16 size-4 rounded-full bg-[var(--color-terracotta)]" />
        <motion.button
          type="button"
          animate={{ rotateX: [0, -22, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          onClick={onInteract}
          className="absolute inset-x-12 bottom-10 flex h-20 items-center justify-center gap-3 rounded-xl border border-white/15 bg-[var(--color-butter)]/28"
          aria-label="Tap oven tray"
        >
          {[0, 1, 2].map((item) => (
            <IngredientPiece key={item} name={ingredient} small delay={item * 0.1} />
          ))}
        </motion.button>
      </div>
      <StageLabel>Baking {ingredient}</StageLabel>
    </div>
  );
}

function PlateScene({
  ingredient,
  onInteract,
}: {
  ingredient: string;
  onInteract: () => void;
}) {
  return (
    <div className="relative grid place-items-center">
      <motion.div
        initial={{ x: -180, opacity: 0, rotate: -6 }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.35 }}
        drag="x"
        dragConstraints={{ left: -80, right: 80 }}
        onDragEnd={onInteract}
        onClick={onInteract}
        className="relative grid h-48 w-80 place-items-center rounded-[50%] border-4 border-[var(--color-butter)] bg-white text-[var(--color-warm-brown)] shadow-[0_18px_0_rgba(0,0,0,0.22)]"
        role="button"
        tabIndex={0}
      >
        <span className="absolute inset-8 rounded-[50%] border border-[var(--color-warm-brown)]/10" />
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2, 3].map((item) => (
            <IngredientPiece key={item} name={ingredient} small delay={item * 0.08} />
          ))}
        </div>
      </motion.div>
      <SparkleRing />
      <StageLabel>Plating {ingredient}</StageLabel>
    </div>
  );
}

function RestScene({
  ingredient,
  onInteract,
}: {
  ingredient: string;
  onInteract: () => void;
}) {
  return (
    <div className="relative grid place-items-center">
      <motion.div
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(245,200,66,0.25)",
            "0 0 0 34px rgba(245,200,66,0)",
            "0 0 0 0 rgba(245,200,66,0.25)",
          ],
        }}
        transition={{ duration: 1.6, repeat: Infinity }}
        onClick={onInteract}
        className="grid size-64 place-items-center rounded-full bg-[var(--color-butter)]/20"
        role="button"
        tabIndex={0}
      >
        <div className="grid size-44 place-items-center rounded-[50%] border-4 border-[var(--color-butter)] bg-white">
          <IngredientPiece name={ingredient} label={ingredient} />
        </div>
      </motion.div>
      <StageLabel>Resting</StageLabel>
    </div>
  );
}

function CompleteStage({ recipe }: { recipe: RecipeOption }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.86 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative grid min-h-72 place-items-center text-center"
    >
      <DishArtwork
        name={recipe.name}
        ingredients={recipe.ingredients}
        className="h-64 w-full max-w-sm"
      />
      <SparkleRing />
      <div className="mt-8 max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-butter)]">
          Final plate
        </p>
        <h3 className="mt-2 font-display text-3xl font-semibold">{recipe.name}</h3>
        {recipe.tasteNotes?.length ? (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {recipe.tasteNotes.map((note) => (
              <span
                key={note}
                className="rounded-full bg-[var(--color-butter)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-warm-brown)]"
              >
                {note}
              </span>
            ))}
          </div>
        ) : null}
        {recipe.substitutions?.[0] ? (
          <p className="mt-3 text-sm leading-6 text-white/68">
            Smart swap: {recipe.substitutions[0]}
          </p>
        ) : null}
      </div>
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



