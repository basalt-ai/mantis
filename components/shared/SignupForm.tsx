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
        <p className="mt-10 rounded-theme brut-border bg-[#FFE4EC] p-5 font-body text-[var(--text)]">
          {signup.success}
        </p>
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
            Email (not work email)
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
