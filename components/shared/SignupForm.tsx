"use client";

import { useState } from "react";
import { signup } from "@/lib/copy";

export function SignupForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Referral state
  const [referralEmails, setReferralEmails] = useState(["", ""]);
  const [sentIndexes, setSentIndexes] = useState<Set<number>>(new Set());
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [referralMessage, setReferralMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  function handleEmailChange(index: number, value: string) {
    setReferralEmails((prev) => prev.map((e, i) => (i === index ? value : e)));
  }

  function handleSendInvite(index: number) {
    // TODO: wire to /api/referral/invite
    setSentIndexes((prev) => new Set(prev).add(index));
  }

  function handleAddEmail() {
    setReferralEmails((prev) => [...prev, ""]);
  }

  function handleGenerateLink() {
    // TODO: wire to /api/referral/generate — for now use placeholder
    const link = `https://trypancake.ai?ref=PLACEHOLDER`;
    const message = `Hey! I've been exploring Pancake — an AI platform that helps you build Autonomous Companies: AI handles most of the execution and humans act as board members.\n\nIt's closed to the public, I'm able to get you early access here: ${link}`;
    setReferralLink(link);
    setReferralMessage(message);
  }

  function handleCopy() {
    if (referralMessage) {
      navigator.clipboard.writeText(referralMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
          <div className="rounded-theme brut-border bg-[var(--surface)] p-6 space-y-4">
            <div>
              <p className="font-display text-lg font-semibold text-[var(--text)]">{signup.referralTitle}</p>
              <p className="mt-1 font-body text-sm text-[var(--text-muted)]">{signup.referralBody}</p>
            </div>

            {/* Email invite rows */}
            <div className="space-y-3">
              {referralEmails.map((email, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(i, e.target.value)}
                    placeholder="friend@company.com"
                    className="flex-1 rounded-theme border-[2px] border-[var(--border-color)] bg-[var(--bg)] px-3 py-2.5 font-body text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]/60 outline-none transition focus-visible:shadow-[4px_4px_0_#0a0a0a]"
                  />
                  <button
                    onClick={() => handleSendInvite(i)}
                    disabled={!email || sentIndexes.has(i)}
                    className="shrink-0 rounded-theme border-[2px] border-[var(--border-color)] px-3 py-2.5 text-sm font-semibold !text-black transition hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                    style={{ backgroundColor: sentIndexes.has(i) ? "#d4f4dd" : "var(--accent)" }}
                  >
                    {sentIndexes.has(i) ? "✓ Sent" : "Send →"}
                  </button>
                </div>
              ))}
            </div>

            {/* Add more */}
            <button
              onClick={handleAddEmail}
              className="flex items-center gap-1.5 text-sm font-semibold underline underline-offset-2"
              style={{ color: "var(--accent)" }}
            >
              <span className="text-lg leading-none">+</span> Add another
            </button>

            {/* Divider */}
            <div className="border-t border-[var(--border-color)] pt-4">
              {!referralLink ? (
                <button
                  onClick={handleGenerateLink}
                  className="w-full rounded-theme brut-border px-4 py-3 text-sm font-semibold !text-black transition hover:-translate-x-0.5 hover:-translate-y-0.5"
                  style={{ backgroundColor: "var(--bg)" }}
                >
                  🔗 Generate a referral link + message
                </button>
              ) : (
                <div className="space-y-3">
                  {/* Link display */}
                  <div className="flex items-center gap-2 rounded-theme border-[2px] border-[var(--border-color)] bg-[var(--bg)] px-3 py-2.5">
                    <span className="flex-1 truncate font-mono text-xs text-[var(--text-muted)]">{referralLink}</span>
                  </div>
                  {/* Copyable message */}
                  <div className="relative rounded-theme border-[2px] border-[var(--border-color)] bg-[var(--bg)] p-3">
                    <p className="font-body text-xs text-[var(--text-muted)] whitespace-pre-wrap leading-relaxed">{referralMessage}</p>
                    <button
                      onClick={handleCopy}
                      className="mt-3 flex items-center gap-1.5 text-xs font-semibold underline underline-offset-2"
                      style={{ color: "var(--accent)" }}
                    >
                      {copied ? "✓ Copied!" : "📋 Copy message"}
                    </button>
                  </div>
                </div>
              )}
            </div>
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
