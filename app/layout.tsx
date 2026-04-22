import type { Metadata } from "next";
import { DM_Sans, Lato, Space_Grotesk, Space_Mono } from "next/font/google";
import "../themes/neo-brutalism.css";
import "./globals.css";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const lato = Lato({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pancake",
  description: "Let OpenClaw run your autonomous company.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: "var(--bg, #fffef8)" }}>
      <body
        className={`theme-neo-brutalism ${grotesk.variable} ${dmSans.variable} ${lato.variable} ${spaceMono.variable}`}
        style={{
          margin: 0,
          backgroundColor: "var(--bg, #fffef8)",
          color: "var(--text, #0a0a0a)",
          fontFamily: "var(--font-body, ui-sans-serif)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
