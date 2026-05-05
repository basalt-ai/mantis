# Phase 1 — Repository audit

Inventory for the Pancake landing rebuild. **Stage B** deletes or strips everything listed under **DECOMMISSION** (per `BUILD_SEQUENCE.md`), except where a note says otherwise. **REPLACE** is awareness only — no edits in Phase 1 beyond the agreed Stage B strip.

---

## KEEP — preserve as-is (paths relative to repo root)

| Path | Reason |
|------|--------|
| `package.json` | Project manifest; dependencies evolve in later phases. |
| `package-lock.json` | npm lockfile; reproducible installs. |
| `next.config.mjs` | Next.js config (dev webpack cache, **redirects stay intact** — not part of strip). |
| `tsconfig.json` | TypeScript / `@/*` paths. |
| `postcss.config.mjs` | Tailwind + Autoprefixer pipeline. |
| `.eslintrc.json` | Lint config. |
| `.gitignore` | Ignore rules. |
| `next-env.d.ts` | Next.js TypeScript ambient types. |
| `app/layout.tsx` | Root layout, **Google Tag Manager** (`GTM-M37BB9RG`), `next/font/google`, metadata icons — **GTM `<script>` / `<noscript>` blocks must stay byte-identical** across Phase 1 Stage B. |
| `app/globals.css` | File stays; Stage B strips to Tailwind plumbing only. |
| `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx` | App Router error boundaries / 404. |
| `app/favicon.ico` | App Router favicon asset. |
| `app/signup/page.tsx` | Route file stays; after Stage B it is a **placeholder shell** until Phase 4 visual rebuild. **Do not** change `components/shared/SignupForm.tsx` or API behavior in Stage B. |
| `app/api/signup/route.ts` | Signup API — **sacred** behavior. |
| `app/api/referral/generate/route.ts`, `app/api/referral/invite/route.ts` | Referral APIs — **sacred** behavior. |
| `components/shared/SignupForm.tsx` | Client form + `/api/signup` wiring — **sacred** behavior (not emptied in Stage B). |
| `components/shared/Nav.tsx` | Still used by `app/booked`, `app/booth`; optional reuse when marketing routes return. |
| `components/shared/Footer.tsx` | Still used by `app/booked`. |
| `components/shared/PancakeLogo.tsx` | Used by `Nav`. |
| `components/shared/BasaltOfficialLogo.tsx` | Used by `app/booth/page.tsx`. |
| `components/shared/FlappyBird.tsx` | Used by `app/booked/page.tsx`. |
| `components/metrics/MetricsDashboard.tsx` | Metrics UI; **keep for reuse** when `/build-in-public` is rebuilt (Phase 6). |
| `lib/metrics.ts` | Data layer for build-in-public metrics; **keep for reuse** with `MetricsDashboard`. |
| `lib/copy.ts` | Still imported by `Nav`, `SignupForm`, and optionally other shared components — keep until copy is replaced per route in later phases. |
| `lib/airtable.ts`, `lib/loops.ts` | Backend integration for signup + referral routes. |
| `lib/booth-url.ts` | Booth QR helpers for `app/booth/`. |
| `scripts/predev-cache.mjs`, `scripts/clean-build-cache.mjs` | Dev / cache hygiene used by npm scripts. |
| `app/booth/*`, `app/booked/*` | Auxiliary routes; untouched in Stage B strip unless listed elsewhere. |
| `public/favicon-32x32.png`, `public/apple-touch-icon.png` | Referenced in `app/layout.tsx` `metadata.icons`. |
| `public/basalt-logo.svg` | `BasaltOfficialLogo` / booth. |
| `public/pancake-wordmark.png` | `PancakeLogo` / nav. |

**Not present (no action):** `middleware.ts`, `vercel.json`, `.env*` in repo, project-root `README.md`.

---

## DECOMMISSION — remove in Stage B (delete `git rm` or strip as noted)

| Path | Reason |
|------|--------|
| `tailwind.config.ts` → `theme.extend` | Old design tokens mapped into Tailwind; strip to bare config (keep file + `content` paths). |
| `themes/neo-brutalism.css` | Legacy neo-brutalism tokens + `.brut-border` / `.brut-lift`. **Delete in Stage B.** Remove `theme-neo-brutalism` from `<body>` in `app/layout.tsx`. `/signup` is a placeholder shell until Phase 4 (no dependency on this file). |
| `components/shared/LandingPage.tsx` | OpenClaw-era homepage assembly. |
| `components/shared/Hero.tsx` | Marketing hero (OpenClaw copy). |
| `components/shared/FinalCTA.tsx` | Homepage CTA section. |
| `components/shared/ItLearns.tsx` | Homepage section. |
| `components/shared/OrgChart.tsx` | Homepage org chart. |
| `components/shared/SlackUI.tsx` | Homepage Slack mock + avatars. |
| `components/shared/SafeCompliant.tsx` | Homepage section. |
| `components/shared/StackIntegrations.tsx` | Homepage integrations grid. |
| `components/shared/TalkToHuman.tsx` | Homepage section. |
| `components/shared/GranolaMark.tsx` | Only used by `StackIntegrations`. |
| `components/shared/MantisLogo.tsx` | Orphan — not imported anywhere. |
| `public/ceo-agent-avatar.png`, `public/you-avatar.png` | Used by `SlackUI.tsx` only. |
| `public/granola-icon.png` | Used by `GranolaMark.tsx` only. |
| `public/luma-visual.html`, `public/luma-visual.png` | Luma tooling / asset; not referenced by app TSX. |
| `public/pancake-icon.jpg`, `public/pancake-logo.jpg`, `public/pancake-mark.png` | Unused in TS/TSX — legacy marketing binaries. |
| `scripts/screenshot-luma.sh` | Generates `luma-visual.png`; not part of Next runtime. |

---

## REPLACE — v3 will reintroduce; do not edit beyond Stage B plan in Phase 1

| Path | Reason |
|------|--------|
| `app/page.tsx` | Homepage — rebuild in **Phase 3** from Figma. |
| `app/signup/page.tsx` | **Phase 4** — visual structure + remount `SignupForm`; form fields, validation, `onSubmit`, API routes stay behavior-identical. |
| `app/pricing/page.tsx` | Pricing — rebuild in **Phase 5**. |
| `app/build-in-public/page.tsx` | Build in public — rebuild in **Phase 6** (reuse `lib/metrics.ts` + `MetricsDashboard`). |
| `components/shared/Nav.tsx`, `components/shared/Footer.tsx` | Restyled / restructured as pages ship; keep until replaced. |
| `lib/copy.ts` | Marketing strings superseded by Figma copy over time. |
| `app/layout.tsx` (fonts, metadata, non-GTM layout) | Phase 2 tokens + fonts; **GTM block unchanged**. |
| `app/globals.css` | Becomes token plumbing + Tailwind entry after Phase 2. |
| `tailwind.config.ts` | Token bridge for v3 if still on Tailwind v3. |
| `public/favicon-32x32.png`, `public/apple-touch-icon.png`, `app/favicon.ico` | Likely superseded in Phase 2 from Figma. |
