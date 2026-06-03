import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { CustomCursor } from "@/components/custom-cursor";
import { MotionProvider } from "@/components/providers/motion-provider";

import "./globals.css";

const body = Plus_Jakarta_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const mono = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fridge to Fork | Mise en Place",
  description:
    "Pick your ingredients, generate a dish, and watch a playful animated cooking stage bring dinner to life.",
  metadataBase: new URL("https://fridgetofork.vercel.app"),
  openGraph: {
    title: "Fridge to Fork",
    description:
      "An animated mise en place cooking app where your ingredients become a playful recipe stage.",
    siteName: "Fridge to Fork",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${body.variable} ${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <MotionProvider>
          <CustomCursor />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
