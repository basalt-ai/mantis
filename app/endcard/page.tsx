import type { Metadata } from "next";

import { EndcardScene } from "./EndcardScene";

export const metadata: Metadata = {
  title: "Pancake",
  robots: { index: false, follow: false },
};

export default function EndcardPage() {
  return <EndcardScene />;
}
