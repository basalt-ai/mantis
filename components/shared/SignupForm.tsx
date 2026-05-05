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
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
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

    const ref = new URLSearchParams(window.location.search).get("ref") ?? undefined;

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, ref }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setReferralCode(data.referralCode ?? null);
      setUserEmail(email);
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

  async function handleSendInvite(index: number) {
    if (!referralCode) return;
    const email = referralEmails[index];
    if (!email) return;
    try {
      await fetch("/api/referral/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referrerCode: referralCode, email }),
      });
      setSentIndexes((prev) => new Set(prev).add(index));
    } catch {
      // silently fail
    }
  }

  function handleAddEmail() {
    setReferralEmails((prev) => [...prev, ""]);
  }

  async function handleGenerateLink() {
    if (!userEmail) return;
    try {
      const res = await fetch("/api/referral/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      setReferralLink(data.link);
      setReferralMessage(data.message);
    } catch {
      const link = `https://trypancake.ai/signup?ref=${referralCode}`;
      setReferralLink(link);
      setReferralMessage(
        `Hey! I've been exploring Pancake — an AI platform that helps you build Autonomous Companies: AI handles most of the execution and humans act as board members.\n\nIt's closed to the public, I'm able to get you early access here: ${link}`
      );
    }
  }

  function handleCopy() {
    if (referralMessage) {
      navigator.clipboard.writeText(referralMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (submitted) {
    return (
      <div className="signup-stack">
        <article className="signup-card signup-card--success">
          <p className="signup-card__title">{signup.successTitle}</p>
          <p className="signup-card__body">{signup.successBody}</p>
        </article>

        <article className="signup-card">
          <header className="signup-card__header">
            <p className="signup-card__title">{signup.referralTitle}</p>
            <p className="signup-card__body">{signup.referralBody}</p>
          </header>

          <ul className="signup-referral-list">
            {referralEmails.map((email, i) => (
              <li key={i} className="signup-referral-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(i, e.target.value)}
                  placeholder="friend@company.com"
                  className="input signup-referral-row__input"
                  aria-label={`Friend's email ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleSendInvite(i)}
                  disabled={!email || sentIndexes.has(i)}
                  className="button"
                  data-variant={sentIndexes.has(i) ? "subtle" : undefined}
                >
                  {sentIndexes.has(i) ? "✓ Sent" : "Send →"}
                </button>
              </li>
            ))}
          </ul>

          <button type="button" onClick={handleAddEmail} className="signup-link-button">
            + Add another
          </button>

          <div className="signup-card__divider" />

          {!referralLink ? (
            <button
              type="button"
              onClick={handleGenerateLink}
              className="button w-full"
              data-variant="subtle"
            >
              Generate a referral link & message
            </button>
          ) : (
            <div className="signup-referral-share">
              <p className="signup-referral-share__url">{referralLink}</p>
              <p className="signup-referral-share__message">{referralMessage}</p>
              <button type="button" onClick={handleCopy} className="signup-link-button">
                {copied ? "✓ Copied!" : "Copy message"}
              </button>
            </div>
          )}
        </article>

        <article className="signup-card signup-card--discord">
          <p className="signup-card__eyebrow">{signup.discordLabel}</p>
          <p className="signup-card__body">{signup.discordBody}</p>
          <a
            href={signup.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="signup-link-button"
          >
            {signup.discordCta}
          </a>
        </article>
      </div>
    );
  }

  return (
    <article className="signup-card">
      <p className="signup-card__body signup-card__body--lede">{signup.subtitle}</p>
      <form onSubmit={handleSubmit} className="signup-form">
        <label className="signup-field">
          <span className="signup-field__label">Name</span>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            autoComplete="name"
            className="input"
          />
        </label>
        <label className="signup-field">
          <span className="signup-field__label">Email</span>
          <input
            required
            type="email"
            name="email"
            placeholder={signup.emailPlaceholder}
            autoComplete="email"
            className="input"
          />
        </label>
        {error && <p className="signup-form__error">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="button w-full"
          data-size="lg"
        >
          {loading ? "Saving..." : signup.submit}
        </button>
      </form>
    </article>
  );
}
