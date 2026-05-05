/**
 * Signup page — copy lifted from `lib/copy.ts` (`signup.*`), redesigned in
 * the phase-3 home design system to match the Pricing page exactly:
 * shared `HomeNav`, centered header on `--surface`, and a single 32 px
 * squircle card hosting the form. The submitted state swaps the form for
 * three stacked cards (success / referral / Discord) inside the same
 * surface frame.
 */
import type { Metadata } from "next";
import Link from "next/link";

import { HomeNav } from "@/components/sections/home/HomeNav";
import { Footer } from "@/components/shared/Footer";
import { SignupForm } from "@/components/shared/SignupForm";
import { H2 } from "@/components/ui/Headings";
import { signup } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Sign up — Pancake",
  description: signup.subtitle,
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <HomeNav />
      <section className="signup-section flex-1" aria-labelledby="signup-heading">
        <div className="signup-section__inner">
          <header className="signup-section__header">
            <Link href="/" className="signup-section__back" prefetch={false}>
              ← Back
            </Link>
            <H2 id="signup-heading" className="heading signup-section__title text-center">
              {signup.title}
            </H2>
          </header>
          <SignupForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
