"use client";

import { motion } from "framer-motion";
import { Mail, Sparkles } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

import { Logo } from "@/components/brand/logo";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const signInWithMagicLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("sent");
    setMessage("Check your inbox for the kitchen door.");
  };

  const signInWithGoogle = async () => {
    setStatus("loading");
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  return (
    <main className="grain-overlay grid min-h-screen place-items-center px-5 py-10">
      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.25 }}
        className="relative z-10 w-full max-w-xl rounded-[2rem] border border-[var(--color-warm-brown)]/14 bg-white/58 p-6 shadow-[8px_8px_0_rgba(61,43,31,0.12)] backdrop-blur sm:p-8"
      >
        <Logo />
        <div className="mt-10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-olive)]">
            Saved Recipes
          </p>
          <h1 className="mt-3 font-display text-6xl font-semibold leading-none">
            Come back to your kitchen.
          </h1>
          <p className="mt-5 leading-7 text-[var(--color-warm-brown)]/70">
            Sign in with Google or a magic link to keep the dishes you finish.
          </p>
        </div>

        <div className="mt-8 grid gap-3">
          <motion.button
            type="button"
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            onClick={signInWithGoogle}
            className="flex h-14 items-center justify-center gap-3 rounded-full bg-[var(--color-terracotta)] px-6 font-semibold text-white shadow-[4px_4px_0_var(--color-warm-brown)]"
          >
            <Sparkles className="size-5" />
            Continue with Google
          </motion.button>

          <form onSubmit={signInWithMagicLink} className="grid gap-3">
            <label className="relative block">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--color-warm-brown)]/45" />
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-14 w-full rounded-full border border-[var(--color-warm-brown)]/15 bg-white/72 pl-12 pr-4 outline-none shadow-[3px_3px_0_rgba(61,43,31,0.08)] focus:border-[var(--color-terracotta)]"
              />
            </label>
            <motion.button
              type="submit"
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              disabled={status === "loading"}
              className="h-14 rounded-full bg-[var(--color-butter)] px-6 font-semibold text-[var(--color-warm-brown)] shadow-[4px_4px_0_rgba(61,43,31,0.18)]"
            >
              {status === "loading" ? "Sending..." : "Email me a magic link"}
            </motion.button>
          </form>

          {message ? (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-[var(--color-warm-brown)]/8 px-4 py-3 text-center text-sm"
            >
              {message}
            </motion.p>
          ) : null}
        </div>
      </motion.section>
    </main>
  );
}
