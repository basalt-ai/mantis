import type { Metadata } from "next";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { H1, H2, H3, H4 } from "@/components/ui/Headings";
import { Input } from "@/components/ui/Input";
import { PageSection } from "@/components/ui/PageSection";
import { Textarea } from "@/components/ui/Textarea";
import { Toast } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Design kit smoke test — Pancake",
  robots: { index: false, follow: false },
};

function ToastIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" fill="currentColor" />
    </svg>
  );
}

function ToastCloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M19.707 5.70703L13.4141 12L19.707 18.293L18.293 19.707L12 13.4141L5.70703 19.707L4.29297 18.293L10.5859 12L4.29297 5.70703L5.70703 4.29297L12 10.5859L18.293 4.29297L19.707 5.70703Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function KitTestPage() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <PageSection>
        <div style={{ padding: "var(--spacing-xxl) 0", display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
          <H1>Design kit smoke test</H1>
          <p style={{ color: "var(--subtle-text)", maxWidth: "48rem" }}>
            Static preview of ported UI primitives. Token-driven chrome, pink / purple / yellow accents, Aeonik Fono.
          </p>
        </div>
      </PageSection>

      <PageSection variant="alt">
        <div style={{ padding: "var(--spacing-xxl) 0", display: "flex", flexDirection: "column", gap: "var(--spacing-xl)" }}>
          <H2>Button</H2>
          <H3>Sizes</H3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-lg)", alignItems: "center" }}>
            <Button size="sm">Small</Button>
            <Button>Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <H3>Variants</H3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-lg)", alignItems: "center" }}>
            <Button>Brand</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="alternative">Alternative</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="negative">Negative</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <H3>Icon-only (sizes × variants)</H3>
          <p style={{ color: "var(--subtle-text)", fontSize: "var(--font-size-body-small)", marginTop: "calc(-1 * var(--spacing-sm))" }}>
            Square control per size; centered icon. Use <code>aria-label</code> for accessibility.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-lg)", alignItems: "center" }}>
            <Button iconOnly size="sm" variant="brand" aria-label="Approve (sm brand)">
              <CheckIcon size={16} />
            </Button>
            <Button iconOnly variant="brand" aria-label="Approve (md brand)">
              <CheckIcon size={18} />
            </Button>
            <Button iconOnly size="lg" variant="brand" aria-label="Approve (lg brand)">
              <CheckIcon size={22} />
            </Button>
            <Button iconOnly variant="subtle" aria-label="Approve (subtle)">
              <CheckIcon />
            </Button>
            <Button iconOnly variant="alternative" aria-label="Approve (alternative)">
              <CheckIcon />
            </Button>
            <Button iconOnly variant="outline" aria-label="Approve (outline)">
              <CheckIcon />
            </Button>
            <Button iconOnly variant="negative" aria-label="Reject (negative)">
              <ToastCloseIcon />
            </Button>
            <Button iconOnly variant="ghost" aria-label="More (ghost)">
              <CheckIcon />
            </Button>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div style={{ padding: "var(--spacing-xxl) 0", display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
          <H2>Badge</H2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-lg)", alignItems: "center" }}>
            <Badge>Neutral</Badge>
            <Badge variant="inverted">Inverted</Badge>
            <Badge variant="brand">Brand</Badge>
            <Badge variant="brand-alt-1">Brand Alt 1</Badge>
            <Badge variant="brand-alt-2">Brand Alt 2</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="negative">Negative</Badge>
          </div>
        </div>
      </PageSection>

      <PageSection variant="alt">
        <div style={{ padding: "var(--spacing-xxl) 0", display: "flex", flexDirection: "column", gap: "var(--spacing-xl)" }}>
          <H2>Card</H2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "var(--spacing-xl)",
            }}
          >
            <Card>
              <div style={{ padding: "var(--spacing-xl)", display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                <span style={{ fontSize: "var(--font-size-header-04)", fontWeight: "var(--font-heavy)" }}>Outline</span>
                <span style={{ fontSize: "var(--font-size-body-regular)", color: "var(--subtle-text)" }}>Default stroke.</span>
              </div>
            </Card>
            <Card variant="brand">
              <div style={{ padding: "var(--spacing-xl)", display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                <span style={{ fontSize: "var(--font-size-header-04)", fontWeight: "var(--font-heavy)" }}>Brand</span>
                <span style={{ fontSize: "var(--font-size-body-regular)", color: "var(--subtle-text)" }}>Pink surface.</span>
              </div>
            </Card>
            <Card variant="brand-alt-1">
              <div style={{ padding: "var(--spacing-xl)", display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                <span style={{ fontSize: "var(--font-size-header-04)", fontWeight: "var(--font-heavy)" }}>Brand Alt 1</span>
                <span style={{ fontSize: "var(--font-size-body-regular)", color: "var(--subtle-text)" }}>Purple surface.</span>
              </div>
            </Card>
            <Card variant="brand-alt-2">
              <div style={{ padding: "var(--spacing-xl)", display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                <span style={{ fontSize: "var(--font-size-header-04)", fontWeight: "var(--font-heavy)" }}>Brand Alt 2</span>
                <span style={{ fontSize: "var(--font-size-body-regular)", color: "var(--subtle-text)" }}>Yellow surface.</span>
              </div>
            </Card>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div style={{ padding: "var(--spacing-xxl) 0", display: "flex", flexDirection: "column", gap: "var(--spacing-xl)" }}>
          <H2>Input</H2>
          <H3>Sizes</H3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-lg)", alignItems: "center" }}>
            <Input size="sm" placeholder="Small" />
            <Input placeholder="Medium" />
            <Input size="lg" placeholder="Large" />
          </div>
          <H3>States</H3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-lg)", alignItems: "center" }}>
            <Input placeholder="Default" />
            <Input error placeholder="Error" />
            <Input error defaultValue="invalid@" />
            <Input disabled placeholder="Disabled" />
            <Input disabled defaultValue="Disabled with value" />
          </div>
        </div>
      </PageSection>

      <PageSection variant="alt">
        <div style={{ padding: "var(--spacing-xxl) 0", display: "flex", flexDirection: "column", gap: "var(--spacing-xl)" }}>
          <H2>Textarea</H2>
          <H3>Sizes</H3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-lg)", alignItems: "flex-start" }}>
            <Textarea size="sm" placeholder="Small" rows={2} />
            <Textarea placeholder="Medium" rows={2} />
            <Textarea size="lg" placeholder="Large" rows={2} />
          </div>
          <H3>States</H3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-lg)", alignItems: "flex-start" }}>
            <Textarea placeholder="Default" rows={2} />
            <Textarea error placeholder="Error" rows={2} />
            <Textarea error defaultValue="invalid@" rows={2} />
            <Textarea disabled placeholder="Disabled" rows={2} />
            <Textarea disabled defaultValue="Disabled with value" rows={2} />
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div style={{ padding: "var(--spacing-xxl) 0", display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
          <H2>Toast</H2>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)", maxWidth: "480px" }}>
            <Toast>
              <span className="toast-prefix">
                <ToastIcon />
              </span>
              <span className="toast-body">Outline (default)</span>
              <button type="button" className="toast-close" aria-label="Close">
                <ToastCloseIcon />
              </button>
            </Toast>
            <Toast variant="inverted">
              <span className="toast-prefix">
                <ToastIcon />
              </span>
              <span className="toast-body">Inverted</span>
              <button type="button" className="toast-close" aria-label="Close">
                <ToastCloseIcon />
              </button>
            </Toast>
            <Toast variant="success">
              <span className="toast-prefix">
                <ToastIcon />
              </span>
              <span className="toast-body">Success</span>
              <button type="button" className="toast-close" aria-label="Close">
                <ToastCloseIcon />
              </button>
            </Toast>
            <Toast variant="warning">
              <span className="toast-prefix">
                <ToastIcon />
              </span>
              <span className="toast-body">Warning</span>
              <button type="button" className="toast-close" aria-label="Close">
                <ToastCloseIcon />
              </button>
            </Toast>
            <Toast variant="error">
              <span className="toast-prefix">
                <ToastIcon />
              </span>
              <span className="toast-body">Error</span>
              <button type="button" className="toast-close" aria-label="Close">
                <ToastCloseIcon />
              </button>
            </Toast>
          </div>
        </div>
      </PageSection>

      <PageSection variant="alt">
        <div style={{ padding: "var(--spacing-xxl) 0", display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
          <H2>Headings</H2>
          <H1>Heading 1 — The quick brown fox</H1>
          <H2>Heading 2 — The quick brown fox</H2>
          <H3>Heading 3 — The quick brown fox</H3>
          <H4>Heading 4 — The quick brown fox</H4>
        </div>
      </PageSection>

      <PageSection>
        <div style={{ padding: "var(--spacing-xxl) 0" }}>
          <H2>Page section</H2>
          <p style={{ color: "var(--subtle-text)", marginTop: "var(--spacing-md)" }}>
            This block sits inside a default <code>PageSection</code> (surface background). The sections above alternate with{" "}
            <code>variant=&quot;alt&quot;</code>.
          </p>
        </div>
      </PageSection>
    </main>
  );
}
