"use client";

import { useState } from "react";
import Link from "next/link";
import { signup } from "@/lib/copy";

export default function SignupPage() {
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

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 px-4 py-16 text-zinc-100">
      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="text-sm text-teal-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-8 text-2xl font-semibold">{signup.title}</h1>
        <p className="mt-2 text-zinc-400">{signup.subtitle}</p>

        {submitted ? (
          <p className="mt-8 rounded-lg border border-teal-500/40 bg-teal-500/10 p-4 text-teal-200">
            {signup.success}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block text-sm text-zinc-400">
              Name
              <input
                type="text"
                name="name"
                placeholder="Your name"
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none ring-teal-500 focus:ring-2"
              />
            </label>
            <label className="block text-sm text-zinc-400">
              Work email
              <input
                required
                type="email"
                name="email"
                placeholder={signup.emailPlaceholder}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none ring-teal-500 focus:ring-2"
              />
            </label>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-teal-500 py-2.5 font-semibold text-zinc-950 hover:bg-teal-400 disabled:opacity-60"
            >
              {loading ? "Saving..." : signup.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
