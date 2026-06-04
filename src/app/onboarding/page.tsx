"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/brand/logo";

type PreferenceProfile = {
  dietaryStyle: string;
  spiceLevel: "gentle" | "bold";
  timeLimit: number;
  cuisineLikes: string;
  allergies: string;
};

const defaultProfile: PreferenceProfile = {
  dietaryStyle: "anything",
  spiceLevel: "gentle",
  timeLimit: 30,
  cuisineLikes: "comfort, Bengali-inspired, one-pan",
  allergies: "",
};

function getInitialProfile() {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  const savedProfile = window.localStorage.getItem("fridge-to-fork-preferences");

  if (!savedProfile) {
    return defaultProfile;
  }

  try {
    return JSON.parse(savedProfile) as PreferenceProfile;
  } catch {
    window.localStorage.removeItem("fridge-to-fork-preferences");
    return defaultProfile;
  }
}

export default function OnboardingPage() {
  const [profile, setProfile] = useState<PreferenceProfile>(getInitialProfile);
  const [saved, setSaved] = useState(false);

  const saveProfile = () => {
    window.localStorage.setItem("fridge-to-fork-preferences", JSON.stringify(profile));
    setSaved(true);
  };

  return (
    <main className="grain-overlay min-h-screen px-5 py-8 sm:px-8 lg:px-12">
      <div className="relative z-10 mx-auto max-w-4xl">
        <header className="flex items-center justify-between gap-4">
          <Logo />
          <Link href="/" className="rounded-full bg-[var(--color-terracotta)] px-5 py-3 font-semibold text-white shadow-[3px_3px_0_var(--color-warm-brown)]">
            Kitchen
          </Link>
        </header>
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 rounded-[2rem] border border-[var(--color-warm-brown)]/12 bg-white/58 p-6 shadow-[8px_8px_0_rgba(61,43,31,0.12)] sm:p-8"
        >
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-olive)]">
            Your sous-chef settings
          </p>
          <h1 className="mt-3 font-display text-6xl font-semibold leading-none">
            Teach the kitchen how you like to eat.
          </h1>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.14em]">Diet style</span>
              <select
                value={profile.dietaryStyle}
                onChange={(event) => setProfile({ ...profile, dietaryStyle: event.target.value })}
                className="h-12 rounded-full border border-[var(--color-warm-brown)]/12 bg-white px-4"
              >
                <option>anything</option>
                <option>vegetarian</option>
                <option>high protein</option>
                <option>budget</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.14em]">Heat</span>
              <select
                value={profile.spiceLevel}
                onChange={(event) =>
                  setProfile({ ...profile, spiceLevel: event.target.value as "gentle" | "bold" })
                }
                className="h-12 rounded-full border border-[var(--color-warm-brown)]/12 bg-white px-4"
              >
                <option value="gentle">gentle</option>
                <option value="bold">bold</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.14em]">Default time</span>
              <input
                type="number"
                min={10}
                max={90}
                value={profile.timeLimit}
                onChange={(event) => setProfile({ ...profile, timeLimit: Number(event.target.value) })}
                className="h-12 rounded-full border border-[var(--color-warm-brown)]/12 bg-white px-4"
              />
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.14em]">Cuisine likes</span>
              <input
                value={profile.cuisineLikes}
                onChange={(event) => setProfile({ ...profile, cuisineLikes: event.target.value })}
                className="h-12 rounded-full border border-[var(--color-warm-brown)]/12 bg-white px-4"
              />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="font-mono text-xs uppercase tracking-[0.14em]">Allergies or avoids</span>
              <input
                value={profile.allergies}
                onChange={(event) => setProfile({ ...profile, allergies: event.target.value })}
                placeholder="nuts, dairy, onion..."
                className="h-12 rounded-full border border-[var(--color-warm-brown)]/12 bg-white px-4"
              />
            </label>
          </div>
          <motion.button
            type="button"
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveProfile}
            className="mt-8 h-14 rounded-full bg-[var(--color-butter)] px-8 font-semibold text-[var(--color-warm-brown)] shadow-[4px_4px_0_rgba(61,43,31,0.18)]"
          >
            {saved ? "Saved to the fridge" : "Save preferences"}
          </motion.button>
        </motion.section>
      </div>
    </main>
  );
}
