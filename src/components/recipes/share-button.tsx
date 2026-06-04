"use client";

import { motion } from "framer-motion";
import { Download, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";

type ShareButtonProps = {
  title: string;
  ingredients?: string[];
};

export function ShareButton({ title, ingredients = [] }: ShareButtonProps) {
  const [label, setLabel] = useState("Share");

  const downloadCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.fillStyle = "#FFF8F0";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#F5C842";
    context.beginPath();
    context.arc(980, 130, 150, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#3D2B1F";
    context.font = "700 78px serif";
    context.fillText(title, 70, 210, 900);
    context.font = "28px monospace";
    context.fillText("Fridge to Fork", 70, 80);
    context.fillText(ingredients.join(" / "), 70, 320, 920);
    context.fillStyle = "#E2714B";
    context.fillRect(70, 500, 520, 12);

    const link = document.createElement("a");
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-card.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const getCurrentUrl = () => window.location.href;

  const copyIngredients = async () => {
    await navigator.clipboard.writeText(ingredients.join(", "));
    setLabel("Ingredients copied");
    window.setTimeout(() => setLabel("Share"), 1400);
  };

  const shareRecipe = async () => {
    const url = getCurrentUrl();

    if (navigator.share) {
      await navigator.share({
        title,
        text: `Cook ${title} with Fridge to Fork.`,
        url,
      });
      return;
    }

    await navigator.clipboard.writeText(url);
    setLabel("Copied");
    window.setTimeout(() => setLabel("Share"), 1400);
  };

  const shareToWhatsApp = () => {
    const url = getCurrentUrl();
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`Cook ${title}: ${url}`)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      <motion.button
        type="button"
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={shareRecipe}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-butter)] px-5 font-semibold text-[var(--color-warm-brown)] shadow-[3px_3px_0_rgba(61,43,31,0.18)]"
      >
        <Share2 className="size-4" />
        {label}
      </motion.button>
      <motion.button
        type="button"
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={downloadCard}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/70 px-5 font-semibold text-[var(--color-warm-brown)] shadow-[3px_3px_0_rgba(61,43,31,0.12)]"
      >
        <Download className="size-4" />
        PNG
      </motion.button>
      <motion.button
        type="button"
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={shareToWhatsApp}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-olive)] px-5 font-semibold text-white shadow-[3px_3px_0_rgba(61,43,31,0.12)]"
      >
        <MessageCircle className="size-4" />
        WhatsApp
      </motion.button>
      <button
        type="button"
        onClick={copyIngredients}
        className="h-12 rounded-full border border-[var(--color-warm-brown)]/12 bg-white/60 px-5 font-semibold"
      >
        Copy ingredients
      </button>
    </div>
  );
}
