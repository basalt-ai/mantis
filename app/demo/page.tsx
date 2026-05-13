/**
 * /demo — animated product film (~95s) of the "Out of office, on track"
 * storyboard: a CEO hands GTM execution to Pancake for a 5-day trip and
 * comes home to a moved pipeline. Built in-page (not a video) so it can be
 * iterated, embedded, and reused as the live hero film of the marketing
 * site. Everything renders inside the existing design system.
 */
import type { Metadata } from "next";

import { DemoPlayer } from "@/components/sections/demo/DemoPlayer";

export const metadata: Metadata = {
  title: "Demo — Pancake",
  description:
    "Out of office. On track. Watch a CEO hand GTM execution to Pancake for 5 days.",
};

export default function DemoPage() {
  return (
    <main className="demo-page">
      <DemoPlayer />
    </main>
  );
}
