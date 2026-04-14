import Link from "next/link";
import { Nav } from "@/components/shared/Nav";
import { SignupForm } from "@/components/shared/SignupForm";
import { hero, signup } from "@/lib/copy";

export default function SignupPage() {
  return (
    <main className="min-h-screen theme-neo-brutalism bg-bg text-ink">
      <Nav showCta={false} />
      <div className="mx-auto max-w-md px-4 pb-20 pt-[calc(4.5rem+2.5rem)] sm:px-6">
        <Link
          href="/"
          className="inline-flex text-sm font-semibold transition hover:opacity-80"
          style={{ color: hero.autonomousAccent }}
        >
          ← Back
        </Link>
        <h1 className="font-display mt-10 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          {signup.title}
        </h1>
        <p className="mt-4 text-lg font-light leading-snug text-[var(--text-muted)]">{signup.subtitle}</p>
        <SignupForm />
      </div>
    </main>
  );
}
