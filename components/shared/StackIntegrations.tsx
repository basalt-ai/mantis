import { stackIntegrations } from "@/lib/copy";

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

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <StackColumn
            title={stackIntegrations.contextColumn.title}
            subtitle={stackIntegrations.contextColumn.subtitle}
            items={stackIntegrations.contextColumn.items}
            accentBg="bg-[#7ec8ff]"
          />
          <StackColumn
            title={stackIntegrations.executionColumn.title}
            subtitle={stackIntegrations.executionColumn.subtitle}
            items={stackIntegrations.executionColumn.items}
            accentBg="bg-[#ff8a9b]"
          />
        </div>

        <p className="brut-border mt-10 inline-block w-full py-3 text-center font-mono text-sm text-[var(--text-muted)]">
          {stackIntegrations.mcpRow}
        </p>
      </div>
    </section>
  );
}

function StackColumn({
  title,
  subtitle,
  items,
  accentBg,
}: {
  title: string;
  subtitle: string;
  items: readonly { readonly name: string; readonly description: string }[];
  accentBg: string;
}) {
  return (
    <div className={`rounded-theme brut-border p-6 sm:p-8 ${accentBg}`}>
      <h3 className="font-display text-xl font-bold text-[var(--text)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{subtitle}</p>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item.name} className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-theme border border-[var(--border-color)] font-mono text-sm font-bold text-[var(--accent)]">
              {item.name.slice(0, 1)}
            </span>
            <div>
              <p className="font-semibold text-[var(--text)]">{item.name}</p>
              <p className="text-sm text-[var(--text-muted)]">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
