"use client";

import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { useState } from "react";

type ShareButtonProps = {
  title: string;
};

export function ShareButton({ title }: ShareButtonProps) {
  const [label, setLabel] = useState("Share");

  const shareRecipe = async () => {
    const url = window.location.href;

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

  return (
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
  );
}
