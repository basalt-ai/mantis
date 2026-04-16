"use client";

import { useState } from "react";
import { signup } from "@/lib/copy";

export function SignupForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "mt-2 w-full rounded-theme border-[3px] border-[var(--border-color)] bg-[var(--surface)] px-4 py-3 font-body text-[var(--text)] placeholder:text-[var(--text-muted)]/80 outline-none transition focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5 focus-visible:shadow-[7px_7px_0_#0a0a0a] disabled:opacity-60";

  return (
    <>
      {submitted ? (
        <div className="mt-10 space-y-6">
          {/* Confirmation */}
          <div className="rounded-theme brut-border bg-[#FFE4EC] p-6">
            <p className="font-display text-xl font-semibold text-[var(--text)]">{signup.successTitle}</p>
            <p className="mt-2 font-body text-[var(--text-muted)]">{signup.successBody}</p>
          </div>

          {/* Referral — primary action */}
          <div className="rounded-theme brut-border bg-[var(--surface)] p-6">
            <p className="font-display text-lg font-semibold text-[var(--text)]">{signup.referralTitle}</p>
            <p className="mt-2 font-body text-sm text-[var(--text-muted)]">{signup.referralBody}</p>
            <button
              className="mt-4 w-full rounded-theme brut-border px-4 py-4 text-base font-semibold !text-black transition hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--accent)" }}
              onClick={() => alert("Referral link coming soon!")}
            >
              {signup.referralCta}
            </button>
          </div>

          {/* Discord — secondary */}
          <div className="rounded-theme border border-[var(--border-color)] bg-[var(--surface)] p-5">
            <p className="font-display text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">{signup.discordLabel}</p>
            <p className="mt-1 font-body text-sm text-[var(--text-muted)]">{signup.discordBody}</p>
            <a
              href={signup.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block font-semibold text-sm underline underline-offset-2"
              style={{ color: "var(--accent)" }}
            >
              {signup.discordCta}
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <label className="block text-sm font-medium text-[var(--text-muted)]">
            Name
            <input
              type="text"
              name="name"
              placeholder="Your name"
              autoComplete="name"
              className={inputClassName}
            />
          </label>
          <label className="block text-sm font-medium text-[var(--text-muted)]">
            Email
            <input
              required
              type="email"
              name="email"
              placeholder={signup.emailPlaceholder}
              autoComplete="email"
              className={inputClassName}
            />
          </label>
          {error && (
            <p className="rounded-theme border-[3px] border-red-600 bg-red-50 p-3 text-sm text-red-900">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-theme brut-border px-4 py-4 text-base font-semibold !text-black transition hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {loading ? "Saving..." : signup.submit}
          </button>
        </form>
      )}
    </>
  );
}
