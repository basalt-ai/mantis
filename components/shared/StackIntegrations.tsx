import type { IconType } from "react-icons";
import { GrLinkedin } from "react-icons/gr";
import {
  SiGithub,
  SiGmail,
  SiNotion,
  SiSlack,
  SiVercel,
  SiX,
} from "react-icons/si";

import { GranolaMark } from "./GranolaMark";
import { stackIntegrations } from "@/lib/copy";

type IntegrationId = (typeof stackIntegrations.integrations)[number]["id"];

const INTEGRATION_ICONS: {
  [K in Exclude<IntegrationId, "granola">]: { Icon: IconType; className: string };
} = {
  github: { Icon: SiGithub, className: "text-black" },
  vercel: { Icon: SiVercel, className: "text-black" },
  gmail: { Icon: SiGmail, className: "text-[#EA4335]" },
  linkedin: { Icon: GrLinkedin, className: "text-[#0A66C2]" },
  x: { Icon: SiX, className: "text-black" },
  notion: { Icon: SiNotion, className: "text-black" },
  slack: { Icon: SiSlack, className: "text-[#4A154B]" },
};

function IntegrationIcon({ id }: { id: IntegrationId }) {
  if (id === "granola") {
    return <GranolaMark />;
  }
  const { Icon, className } = INTEGRATION_ICONS[id];
  return <Icon size={24} className={className} />;
}

export function StackIntegrations() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-3xl font-semibold text-[var(--text)] sm:text-4xl">
          {stackIntegrations.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--text-muted)]">
          {stackIntegrations.subtitle}
        </p>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stackIntegrations.integrations.map((item) => {
            return (
              <li
                key={item.id}
                className="rounded-theme brut-border bg-[var(--surface)] p-5 sm:p-6"
              >
                <div className="flex gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-theme border border-[var(--border-color)] bg-[var(--surface)]"
                    aria-hidden
                  >
                    <IntegrationIcon id={item.id} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--text)]">{item.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="brut-border mt-10 inline-block w-full py-3 text-center font-mono text-sm text-[var(--text-muted)]">
          {stackIntegrations.mcpRow}
        </p>
      </div>
    </section>
  );
}
