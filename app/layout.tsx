import type { Metadata } from "next";
import { Gloock, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// NOTE: kept the CSS variable name "--font-fraunces" so components using
// font-display don't need to change — only the actual typeface swapped.
// Gloock only ships one weight (400) — it's a bold-by-design display face,
// not a variable-weight one, so font-medium/font-bold classes won't change
// its rendering, only its own inherent shape carries the weight.
const displayFont = Gloock({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400"],
  style: ["normal"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Astera — Decode Yourself",
  description:
    "A calm, precise reading of your chart — written by a real astrologer, delivered as a private report made for you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${inter.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
