/**
 * Inline SVG icons for the "Everything your $49 buys" section.
 *
 * Two flavours:
 *   • BRANDED — Slack, iMessage, Chrome (browser), and the multi-disc
 *     Harness icon use real brand colours. These read instantly as the
 *     services they represent.
 *   • STROKE — generic features (Linux env, runtime, phone, mail, vault,
 *     search, sub-agents, credit-card) use Lucide-style 1.6-weight
 *     stroke icons that inherit `currentColor`, so they pick up
 *     `var(--text)` and feel like one family.
 *
 * Each component returns a <svg> with a fixed 24×24 viewBox; the
 * parent CSS controls render size. No external icon dependency.
 */

type IconKey =
  | "linux"
  | "runtime"
  | "slack"
  | "imessage"
  | "phone"
  | "mail"
  | "vault"
  | "harness"
  | "browser"
  | "search"
  | "subagents"
  | "creditcard";

export function IncludedIcon({ name }: { name: string }) {
  const Component = ICONS[name as IconKey] ?? Fallback;
  return <Component />;
}

const STROKE_PROPS = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ─── BRANDED ───────────────────────────────────────────────────── */

function IconSlack() {
  // Official 4-colour Slack hashtag mark.
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fill="#E01E5A"
        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
      />
      <path
        fill="#36C5F0"
        d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
      />
      <path
        fill="#2EB67D"
        d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
      />
      <path
        fill="#ECB22E"
        d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
      />
    </svg>
  );
}

function IconIMessage() {
  // iMessage green chat bubble — the iconic teardrop shape with a
  // small tail in the bottom-left so it reads as a message, not a
  // generic dialog.
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fill="#34C759"
        d="M12 1.5C6 1.5 1.5 5.6 1.5 10.7c0 2.9 1.5 5.5 3.9 7.2-.2.7-.7 1.9-1.5 2.9-.2.2 0 .5.3.5 1.8-.1 3.3-.7 4.3-1.2 1.1.3 2.3.5 3.5.5 6 0 10.5-4.1 10.5-9.2C22.5 5.6 18 1.5 12 1.5Z"
      />
    </svg>
  );
}

function IconBrowser() {
  // Chrome wedge logo (red / yellow / green segments + blue centre).
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#fff" />
      <path
        fill="#EA4335"
        d="M12 1c4 0 7.4 2.1 9.3 5.3l-4.8 2.8A5.6 5.6 0 0 0 12 6.4H6.4L3.1 5.8A11 11 0 0 1 12 1Z"
      />
      <path
        fill="#FBBC04"
        d="M21.3 6.3a11 11 0 0 1 1.2 8.1l-5.5-.4a5.6 5.6 0 0 0 0-4l4.3-3.7Z"
      />
      <path
        fill="#34A853"
        d="M22.5 14.4A11 11 0 0 1 12 23l3-5.4a5.6 5.6 0 0 0 4.5-2.6l3 -.6Z"
      />
      <path
        fill="#4285F4"
        d="M12 23A11 11 0 0 1 1.5 14.4l3.6-.6A5.6 5.6 0 0 0 12 17.6L15 23Z"
      />
      <circle cx="12" cy="12" r="4.6" fill="#4285F4" />
      <circle cx="12" cy="12" r="4.6" fill="none" stroke="#fff" strokeWidth="1.2" />
    </svg>
  );
}

function IconHarness() {
  // Three overlapping discs in Claude / OpenAI / Gemini brand colours
  // — visually signals "Claude, GPT, Gemini — model-agnostic" without
  // needing all three logos rendered at thumbnail size.
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="6" fill="#D97757" />
      <circle cx="15" cy="11" r="6" fill="#10A37F" opacity="0.92" />
      <circle cx="12" cy="16" r="6" fill="#4285F4" opacity="0.92" />
    </svg>
  );
}

/* ─── STROKE (currentColor) ─────────────────────────────────────── */

function IconLinux() {
  // Server / box-stack — represents the always-on Linux machine.
  return (
    <svg {...STROKE_PROPS} aria-hidden>
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
      <line x1="7" y1="17" x2="7.01" y2="17" />
      <line x1="11" y1="7" x2="13" y2="7" />
      <line x1="11" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function IconRuntime() {
  // CPU/chip — the runtime engine that runs the agents.
  return (
    <svg {...STROKE_PROPS} aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 2v2M15 2v2M9 20v2M15 20v2M20 9h2M20 15h2M2 9h2M2 15h2" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg {...STROKE_PROPS} aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg {...STROKE_PROPS} aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,7 12,13 22,7" />
    </svg>
  );
}

function IconVault() {
  // Padlock — represents the secret vault.
  return (
    <svg {...STROKE_PROPS} aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg {...STROKE_PROPS} aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconSubAgents() {
  // 1 parent node → 2 child nodes — represents agents spawning
  // sub-agents. Edges connect parent (top) to children (bottom).
  return (
    <svg {...STROKE_PROPS} aria-hidden>
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5" cy="18" r="2.5" />
      <circle cx="19" cy="18" r="2.5" />
      <path d="M12 7.5 7 15.5M12 7.5l5 8" />
    </svg>
  );
}

function IconCreditCard() {
  return (
    <svg {...STROKE_PROPS} aria-hidden>
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function Fallback() {
  // Last-resort dot — should never render in practice, but guards
  // against typos in the data → component mapping.
  return (
    <svg {...STROKE_PROPS} aria-hidden>
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const ICONS: Record<IconKey, () => JSX.Element> = {
  linux: IconLinux,
  runtime: IconRuntime,
  slack: IconSlack,
  imessage: IconIMessage,
  phone: IconPhone,
  mail: IconMail,
  vault: IconVault,
  harness: IconHarness,
  browser: IconBrowser,
  search: IconSearch,
  subagents: IconSubAgents,
  creditcard: IconCreditCard,
};
