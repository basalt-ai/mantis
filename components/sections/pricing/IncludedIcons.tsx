/**
 * Inline icons for the "Everything your $49 buys" section.
 *
 * Sourcing strategy:
 *   • simple-icons (via `react-icons/si`) — for single-color brand
 *     silhouettes that are the canonical mark (Tux for Linux, Claude
 *     wheat, Chrome wheel, etc.). We colour each with its brand hex
 *     so the icon reads as the real service.
 *   • lucide (via `react-icons/lu`) — for generic stroke icons (CPU,
 *     phone, mail, padlock, search, branch, credit card). They share
 *     a consistent 1.5-stroke language with the rest of the design
 *     system.
 *   • Hand-rolled inline SVG — only where the brand identity REQUIRES
 *     multi-colour (Slack 4-color hashtag, iMessage green bubble).
 *     simple-icons flattens these to monochrome, which loses the
 *     identity, so we keep the exact paths from each brand's press
 *     kit here verbatim.
 */
import {
  SiClaude,
  SiGooglechrome,
  SiLinux,
} from "react-icons/si";
import {
  LuCpu,
  LuCreditCard,
  LuGitBranch,
  LuLock,
  LuMail,
  LuPhone,
  LuSearch,
} from "react-icons/lu";

const ICON_SIZE = 22;

export function IncludedIcon({ name }: { name: string }) {
  switch (name) {
    case "linux":
      // Tux. The Linux mascot, in pure black so it reads cleanly on
      // light surfaces. Simple-icons gives the silhouette which is
      // what most people recognise.
      return <SiLinux color="#000000" size={ICON_SIZE} />;

    case "runtime":
      // CPU/chip. Best generic representation for "the engine that
      // runs your agents" without inventing a logo.
      return <LuCpu size={ICON_SIZE} />;

    case "slack":
      return <SlackMark />;

    case "imessage":
      return <IMessageMark />;

    case "phone":
      return <LuPhone size={ICON_SIZE} />;

    case "mail":
      return <LuMail size={ICON_SIZE} />;

    case "vault":
      // Padlock. "Vault" is the metaphor; the lock icon is the
      // universal visual for "secrets stored, encrypted at rest".
      return <LuLock size={ICON_SIZE} />;

    case "harness":
      // Claude wheat mark in Anthropic orange. The primary brand the
      // harness is built around — the detail line names GPT + Gemini
      // so the user still sees model-agnostic in writing.
      return <SiClaude color="#D97757" size={ICON_SIZE} />;

    case "browser":
      // Chrome wheel in Chrome blue. Single-color silhouette from
      // simple-icons; the iconic shape carries the brand at this size.
      return <SiGooglechrome color="#4285F4" size={ICON_SIZE} />;

    case "search":
      return <LuSearch size={ICON_SIZE} />;

    case "subagents":
      // Git-branch. Reads as "one parent process branches into many"
      // — exactly what sub-agent spawning does.
      return <LuGitBranch size={ICON_SIZE} />;

    case "creditcard":
      return <LuCreditCard size={ICON_SIZE} />;

    default:
      return <span style={{ width: ICON_SIZE, height: ICON_SIZE }} />;
  }
}

/* ─── multi-colour brand marks (kept inline) ────────────────────── */

/**
 * Slack — official 4-colour hashtag. Paths from Slack's brand press
 * kit (the same shapes simple-icons ships, but split across four
 * <path>s so each segment carries its own brand colour).
 */
function SlackMark() {
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
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

/**
 * iMessage — green chat bubble. Apple's iMessage app icon (the
 * teardrop-shaped speech bubble) at the iMessage system green
 * #34C759. simple-icons doesn't carry an iMessage entry so the
 * silhouette is reconstructed from the system glyph here.
 */
function IMessageMark() {
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        fill="#34C759"
        d="M12 1.5C6 1.5 1.5 5.6 1.5 10.7c0 2.9 1.5 5.5 3.9 7.2-.2.7-.7 1.9-1.5 2.9-.2.2 0 .5.3.5 1.8-.1 3.3-.7 4.3-1.2 1.1.3 2.3.5 3.5.5 6 0 10.5-4.1 10.5-9.2C22.5 5.6 18 1.5 12 1.5Z"
      />
    </svg>
  );
}
