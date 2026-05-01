# BUILD_SEQUENCE.md — Pancake Landing Rebuild

## How to use this document

Each phase below is one branch + one PR + one preview deploy + one Tristan review checkpoint.

For each phase:

1. Open Cursor in **Agent Mode** (not Chat, not Composer — Agent Mode reads AGENTS.md natively).
2. Find the phase's **Prompt** section.
3. Copy everything between the two horizontal rule lines (`---`).
4. Paste into Cursor. Cursor executes the phase.
5. Cursor stops at the end and posts a summary + preview URL.
6. Review the preview deploy.
7. Approve → run the next phase. Reject → reply in chat with what to fix; Cursor iterates in the same branch.

**Do not skip phases.** Phase 1's strip is what makes Phase 2's extraction trustworthy. Phase 2's tokens are what makes Phases 3–6 fast and consistent.

**Before Phase 1:** drop `AGENTS.md` and this `BUILD_SEQUENCE.md` into the repo root and commit on a fresh branch (e.g. `setup/agent-context`). Cursor will read `AGENTS.md` on every prompt automatically.

---

## Phase 1: Audit & Strip

**Branch:** `phase-1-audit-strip`

**Goal:** Document what's actually in the repo, then aggressively delete every trace of the old design system. End with a clean shell.

**This phase has two stages with a stop in the middle.** Cursor stops after Stage A for your review, then resumes Stage B on your green-light.

### Prompt

Copy everything between the two horizontal rules below into Cursor.

---

You are starting Phase 1 of the Pancake landing rebuild. Read `AGENTS.md` fully before doing anything else. Every constraint there applies to this phase and every future phase.

This phase has two stages. Do them in order. **Stop between them for Tristan's review.**

## Stage A — Audit (do this, then stop)

1. Walk the entire repo. Identify the actual stack with evidence:
   - Next.js version (read package.json)
   - App Router vs Pages Router (presence of `app/` vs `pages/` directory)
   - Tailwind version v3 vs v4 (package.json + look for `tailwind.config.*` vs `@theme` directive in CSS)
   - TypeScript usage (tsconfig.json present?)
   - Package manager (pnpm/npm/yarn/bun — check lockfile name)
   - Where Google Analytics is configured (file path + mechanism: `@next/third-parties` / `next/script` / Google Tag Manager)

2. Update the "Stack" section in AGENTS.md to reflect what you actually found. Replace the "(assumed)" notes with confirmed facts.

3. Create `AUDIT.md` at the repo root with three sections. For each item, give the file path and a one-line reason.

   **KEEP** — preserve as-is. Look for:
   - `package.json` (deps will change in Phase 2; the file stays)
   - `next.config.*`, `tsconfig.json`, `vercel.json`, `.env*` files
   - `middleware.ts` (if present)
   - The Google Analytics setup file(s) — list them explicitly
   - The `app/signup/` route and any signup API route(s) — sacred, do not touch
   - The font-loading mechanism file (`next/font` import location)
   - Routing structure (the `app/` skeleton) — files stay, content gets emptied later
   - Project-root README

   **DECOMMISSION** — delete in Stage B. Look for:
   - Tailwind config customizations (theme.extend.colors, .spacing, .fontFamily, .borderRadius, etc.)
   - Custom design tokens in global CSS (custom CSS variables tied to the old design)
   - Old component files (Hero, Features, FeatureCard, anything tied to the current "OpenClaw" homepage)
   - Old image and SVG assets in `/public` (old logos, illustrations, hero assets, agent avatars, screenshots)
   - Old local font files
   - Old MDX/content files with old copy
   - Old utility CSS files unrelated to plumbing

   **REPLACE** — exists in v3 conceptually but with new design. Listed for awareness only. Do not touch in this phase.
   - `app/page.tsx` (homepage)
   - `app/pricing/page.tsx`
   - `app/build-in-public/page.tsx`
   - `app/signup/page.tsx` (visual structure only — form/submit stays untouched)

4. Create `PROGRESS.md` at the repo root with the seven phases listed and unchecked checkboxes.

5. Commit Stage A. Do **not** proceed to Stage B yet.

6. Post in chat:
   - Confirmed stack (5 bullets)
   - Counts: KEEP / DECOMMISSION / REPLACE
   - "Stage A complete. Awaiting your review of `AUDIT.md` before stripping."

**Stop here.** Wait for Tristan's explicit "proceed to Stage B."

## Stage B — Strip (only after Tristan approves Stage A)

1. Delete (use `rm` or `git rm` — **not** comment out, **not** rename) every file listed under DECOMMISSION in AUDIT.md.

2. In the Tailwind config file, remove all customizations under `theme.extend` (colors, spacing, fontFamily, borderRadius, etc.). Leave the file with the bare plumbing required for Tailwind to run.

3. In the global CSS file (globals.css or equivalent), remove all custom design tokens and old utility classes. Leave only the Tailwind directives (`@tailwind base/components/utilities` for v3, or `@import "tailwindcss"` for v4) and any required CSS reset.

4. Empty out the page bodies for `/`, `/pricing`, `/build-in-public`. Leave the file shells with a placeholder JSX like `<main className="min-h-screen" />`. Do not delete the route files — only their content.

5. **Do NOT touch `app/signup/`** in any way during this stage. Form, fields, validation, onSubmit, API route — all stays.

6. Confirm the Google Analytics setup files identified in AUDIT.md as KEEP are still present and unmodified.

7. Run the dev server (`next dev`) and confirm the site builds without errors. Pages will appear visually empty — that is the expected outcome of this phase.

8. Commit Stage B. Push the branch. Open a Vercel preview deploy.

9. Update PROGRESS.md — check off Phase 1.

10. Post in chat:
    - Total files deleted (count + brief categories)
    - Confirmation that GA files and `/signup` are untouched
    - Preview URL
    - "Phase 1 complete. Repo is a clean shell. Ready for Phase 2 on your green-light."

**Stop.** Do not start Phase 2.

---

### Acceptance criteria

- [ ] `AUDIT.md` exists at repo root with KEEP / DECOMMISSION / REPLACE sections
- [ ] `AGENTS.md` "Stack" section updated with confirmed facts (no more "assumed")
- [ ] `PROGRESS.md` created with 7 phases
- [ ] Every DECOMMISSION file is actually deleted (verify in `git diff`)
- [ ] `/signup` folder untouched (verify in `git diff`)
- [ ] GA setup files untouched
- [ ] `next dev` runs without errors
- [ ] Preview deploy renders empty pages without crashing

### Stop

Open the preview. Spot check the signup form still works (try submitting). Approve before Phase 2.

---

## Phase 2: Install + Extract Design System

**Branch:** `phase-2-design-system`

**Goal:** Install Figma MCP, install GSAP, extract every token + font + logo + favicon from Figma into the codebase. End with the design system fully in place but no pages yet rebuilt.

### Before pasting

You'll need two URLs from Figma. Open the Figma file:
`https://www.figma.com/design/fr8NgOCTUxsEbrMEJA3YKu/Pancake-Design`

1. Right-click the **design system page** in the left sidebar → "Copy link" → that's the design system URL.
2. The file URL itself is the file URL.

Replace the two `[...]` placeholders in the prompt below before pasting.

### Prompt

---

You are starting Phase 2 of the Pancake landing rebuild. Read `AGENTS.md` and `AUDIT.md` fully before doing anything.

Goal: install required tooling, then extract the Figma design system PERFECTLY into the codebase. Do not rebuild any pages yet — that's Phase 3+.

## Step 1 — Install the Figma MCP

In Cursor's agent chat, run:

```
/add-plugin figma
```

This installs the official remote Figma MCP server (`https://mcp.figma.com/mcp`) plus bundled Agent Skills for design extraction and design system rules. Confirm by typing `#get_design_context` in agent chat — Figma tools should be listed.

If the plugin command fails, fall back to manually adding the MCP server in Cursor Settings → MCP → "Add new global MCP server", URL `https://mcp.figma.com/mcp`. Authenticate with Figma when prompted.

## Step 2 — Install required packages

Use the package manager confirmed in Phase 1.

Install these without asking:
- `gsap`
- `@gsap/react`

Ask Tristan before installing these (decision needed):
- `lenis` — smooth scroll library, optional, premium feel
- Tailwind v4 migration — only if the repo is currently on v3. Ask whether to migrate.

## Step 3 — Extract the design system from Figma

Figma file URL: `[PASTE FIGMA FILE URL HERE]`

Design system page URL: `[PASTE DESIGN SYSTEM PAGE URL HERE]`

Using the Figma MCP, extract from the design system page:
- Every color variable (whatever color space Figma stores)
- Every spacing variable (margins, paddings, gaps)
- Every type scale value (font sizes, line heights, letter spacing)
- Every font family + weight + style
- Every border radius
- Every shadow / blur / effect
- Every reusable component definition (buttons, cards, inputs, nav, footer) — note their structure and variants

Write the tokens into the project:
- **If Tailwind v4**: write all tokens as CSS variables inside an `@theme {}` block in `app/globals.css`.
- **If Tailwind v3**: write CSS variables in `:root {}` in `globals.css`, then reference them in `tailwind.config.*` under `theme.extend`.

**Naming rule:** if Figma calls it `color/brand/500`, the CSS variable is `--color-brand-500`. Do not invent shorter or "cleaner" names. Match Figma exactly.

## Step 4 — Fonts

For each font family identified in the design system:
- Google Fonts → use `next/font/google` in `app/layout.tsx`
- Custom font files → save to `/public/fonts` and use `next/font/local`

Wire the fonts so the body inherits the correct default font-family and weight from tokens.

## Step 5 — Logos and brand assets

Use the Figma MCP to download every logo / brand asset from the design system page. Save to `/public` with semantic names:
- `/public/logo.svg` (full wordmark)
- `/public/logo-mark.svg` (icon-only mark)
- Any additional brand marks identified

## Step 6 — Favicon

Identify the favicon source in Figma. Generate the variants Next.js expects:
- `app/icon.svg` (or `app/icon.png`)
- `app/apple-icon.png`
- `public/favicon.ico` (fallback for older browsers)

If Figma has only one source, ask Tristan whether to generate the variants from it or whether the designer has prepared them separately.

## Step 7 — Base layout

Update `app/layout.tsx`:
- Apply the body font from tokens
- Apply the body background color from tokens
- Apply default text color from tokens
- **Preserve the existing Google Analytics integration EXACTLY as it was at the end of Phase 1.** Do not modify, do not "improve," do not migrate. Verify with `git diff` before committing.
- Add Tailwind directives to the global CSS if not already present

## Step 8 — Set up GSAP

Create `lib/gsap.ts`:

```ts
'use client';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export { gsap, useGSAP, ScrollTrigger };
```

All future GSAP imports must come from `@/lib/gsap`, never from `gsap` directly. This prevents double-registration of plugins across components and keeps animations stable across route changes.

## Step 9 — Verify

- Run `next dev`. The site should still build without errors.
- Pages will still be empty (correct — Phase 2 doesn't build pages).
- The base layout should reflect the new fonts and background color.
- Open the design system page in Figma side-by-side with the preview. Visually verify base styling matches.

## Constraints

- Branch: `phase-2-design-system`
- Multiple commits acceptable (suggested: one for MCP+packages, one for tokens, one for fonts+logos+favicon, one for GSAP setup)
- Push, open Vercel preview, paste preview URL in chat
- Do NOT rebuild any pages — that's Phase 3+

## Output to Tristan

- Confirm Figma MCP installed and working
- List installed packages (and any flagged for confirmation)
- Token summary (e.g. "12 colors, 6 spacing values, 7 type sizes, 4 radii, 3 shadows extracted")
- Fonts loaded
- Logo + favicon paths
- Confirm GA integration unchanged (paste git diff of GA file)
- Preview URL
- "Phase 2 complete. Design system in place. Ready for Phase 3 on your green-light."

**Stop.** Do not start rebuilding pages.

---

### Acceptance criteria

- [ ] Figma MCP installed; `#get_design_context` lists tools in Cursor
- [ ] `gsap` and `@gsap/react` installed
- [ ] Tokens written into `@theme` block (v4) or `tailwind.config` + `:root` (v3)
- [ ] Token names match Figma variable names exactly
- [ ] Fonts loaded via `next/font`, applied to body
- [ ] Logos and favicon present in `/public` or `/app`
- [ ] `lib/gsap.ts` created
- [ ] GA integration unchanged (verify in `git diff`)
- [ ] Preview renders with new fonts + background color

### Stop

Open the design system page in Figma and the preview side-by-side. Spot check 3–5 colors, fonts, and spacing values — they should be identical. Approve before Phase 3.

---

## Phase 3: Rebuild Homepage

**Branch:** `phase-3-homepage`

**Goal:** Recode the v3 homepage 1:1 with Figma, including animations.

### Before pasting

In Figma, select the v3 homepage frame, right-click → "Copy link to selection." That's the URL you paste into the prompt.

### Prompt

---

Phase 3: rebuild the homepage. Read `AGENTS.md` and `AUDIT.md` before starting. Treat the design system from Phase 2 as the only source of styling truth — never reach for hardcoded values, never reference anything from the (deleted) old design system.

## Inputs

v3 homepage frame URL in Figma: `[PASTE V3 HOMEPAGE FRAME URL HERE]`

## Approach

1. Use the Figma MCP to read the homepage frame.

2. Identify every section in the design (hero, feature blocks, social proof, CTA, footer, etc.). List them in chat **before** building. Wait for Tristan's "go" if the section list is unexpectedly long (more than 8 sections) — otherwise proceed.

3. For each section, in order:
   - Read the Figma node via MCP
   - Build the section as a self-contained component in `components/sections/[SectionName].tsx`
   - Use ONLY Tailwind classes that resolve to design tokens. No hex codes, no `px` values in JSX/CSS, no font weights as raw numbers.
   - Mobile-first responsive: build the mobile breakpoint first, then layer up to desktop.
   - If the section has motion in Figma (Smart Animate, prototype interactions, design notes about animation), implement with GSAP from `@/lib/gsap`. Use the `useGSAP` hook with a ref-bound scope. Use ScrollTrigger for scroll-driven motion, GSAP timelines for orchestrated reveals.
   - Copy comes from Figma verbatim. Do not improve.
   - Commit the section.

4. After all sections are built, assemble them in `app/page.tsx` in the order shown in Figma.

5. Verify at four breakpoints by resizing the browser: 375 (mobile), 768 (tablet), 1024 (laptop), 1440 (desktop). Each should match the corresponding Figma frame.

## Animation rules

- Use `@/lib/gsap` for all GSAP imports. Never import `gsap` or `ScrollTrigger` directly.
- Wrap GSAP code in `useGSAP(() => { ... }, { scope: ref })` with a ref-bound scope. This ensures cleanup.
- For scroll-triggered animations, use `ScrollTrigger` with `start`/`end` values matching Figma's intent. If unclear, ask Tristan before guessing.
- After all animations are wired, call `ScrollTrigger.refresh()` once on initial load to align triggers with final layout.
- Respect `prefers-reduced-motion`: gate non-essential animations behind a `matchMedia` check.

## Constraints

- Branch: `phase-3-homepage`
- Commit per section (descriptive commit messages: "feat(home): hero section", "feat(home): hero animations", etc.)
- Do not touch other routes, AGENTS.md, AUDIT.md, `/signup`, GA, or `lib/gsap.ts` (unless adding a new GSAP plugin import — flag if so, do not install without asking)
- Push at the end of the page, open Vercel preview, paste URL in chat

## Output to Tristan

- Section list (order, names) — posted before build started
- Animations implemented (one line per)
- Preview URL
- Notes on any Figma ambiguities resolved or open questions
- "Phase 3 complete. Ready for Phase 4 on your green-light."

**Stop.** Do not start Phase 4.

---

### Acceptance criteria

- [ ] Every section visible in v3 Figma homepage frame is present on `/`
- [ ] Section order top-to-bottom matches Figma
- [ ] Visual fidelity at 375 / 768 / 1024 / 1440 matches Figma frames
- [ ] All styling resolves through design tokens (no hex / no `px` / no raw font weights in JSX)
- [ ] Animations match Figma motion specs
- [ ] `prefers-reduced-motion` respected for non-essential motion
- [ ] No console errors, no hydration warnings
- [ ] GA integration still untouched (`git diff`)
- [ ] `/signup` untouched (`git diff`)

### Stop

Open the preview side-by-side with Figma. Resize the browser through the four breakpoints. Approve before Phase 4.

---

## Phase 4: Rebuild /pricing

**Branch:** `phase-4-pricing`

**Goal:** Same as Phase 3, applied to `/pricing`.

### Prompt

---

Phase 4: rebuild `/pricing`. Read `AGENTS.md` and `AUDIT.md`. Apply the same approach as Phase 3 — section by section, design tokens only, mobile-first, GSAP via `@/lib/gsap`, copy from Figma verbatim.

## Inputs

v3 `/pricing` frame URL in Figma: `[PASTE V3 PRICING FRAME URL HERE]`

## Approach

Same as Phase 3 (sections → `components/sections/pricing/[Name].tsx`, assemble in `app/pricing/page.tsx`).

If pricing has interactive elements (toggle monthly/annual, plan comparison, FAQ accordion), implement with React state. Keep it simple — `useState` and Tailwind. No new dependencies unless explicitly required by the design.

## Constraints + Output

Same as Phase 3. Branch `phase-4-pricing`. Commit per section. Push, preview, post URL.

**Stop.** Do not start Phase 5.

---

### Acceptance criteria

Same as Phase 3, applied to `/pricing`. Plus:
- [ ] Interactive elements (if any) work as Figma's prototype intends

### Stop

Review preview against Figma. Approve before Phase 5.

---

## Phase 5: Rebuild /build-in-public

**Branch:** `phase-5-build-in-public`

**Goal:** Same as Phases 3–4, applied to `/build-in-public`.

### Prompt

---

Phase 5: rebuild `/build-in-public`. Same approach as Phases 3–4.

## Inputs

v3 `/build-in-public` frame URL in Figma: `[PASTE V3 BUILD-IN-PUBLIC FRAME URL HERE]`

## Approach + Constraints + Output

Same as Phases 3–4. Branch `phase-5-build-in-public`. Push, preview, post URL.

**Stop.** Do not start Phase 6.

---

### Acceptance criteria

Same as Phase 3, applied to `/build-in-public`.

### Stop

Review preview. Approve before Phase 6.

---

## Phase 6: Rebuild /signup (visual only)

**Branch:** `phase-6-signup-visual`

**Goal:** Visually refresh `/signup` to match v3 Figma. **Form behavior must remain byte-identical.**

This phase is the highest-risk one. The signup form is wired to product. Cursor changes ONLY the visual structure — never the form fields, validation, or submit handler.

### Prompt

---

Phase 6: visually refresh `/signup`. **CRITICAL: this is visual only.** The form's field list, names, types, validation, onSubmit handler, and any signup API route MUST remain byte-identical.

Read `AGENTS.md` fully. Re-read the "Hard rules" section about `/signup`. Read `AUDIT.md` to identify all files in the signup behavior layer.

## Inputs

v3 `/signup` frame URL in Figma: `[PASTE V3 SIGNUP FRAME URL HERE]`

## Approach

1. Open `app/signup/page.tsx` and any related files identified in AUDIT.md as KEEP for signup.

2. Identify the **behavior layer** — these MUST stay unchanged:
   - The `<form>` element's `action` / `onSubmit`
   - Every `<input>`, `<textarea>`, `<select>` element's `name`, `type`, `required`, `value`, `onChange`
   - Any client-side validation logic
   - Any API route the form posts to (`app/api/signup/...` or similar)
   - Any imported submit handler

3. Restructure the **presentation layer** — wrappers, layout, headings, decorative copy, decorative elements, button styling, spacing — to match the v3 Figma frame.

4. Apply design tokens for all styling.

5. Field labels (text content of `<label>` elements) — these are copy. Update if Figma has new label copy. Do NOT change the `htmlFor` attribute or the `<input>` `name` attribute.

6. After the rebuild, run `git diff` against the start of this branch and inspect the form's behavior layer carefully. Confirm zero behavioral changes. **Paste the relevant diff in chat for Tristan to verify before pushing.**

7. Manually test: load the preview, fill in valid test data, submit. Verify the request hits the same backend endpoint with the same payload structure (open the Network tab in browser dev tools).

## Constraints

- Branch: `phase-6-signup-visual`
- No new form-handling libraries
- No changes to API routes
- No changes to environment variables

## Output to Tristan

- Preview URL
- `git diff` of the form behavior layer (the part that should be unchanged) — paste it in chat so Tristan can verify
- Network request screenshot or description (request URL + payload structure) confirming submission still works
- "Phase 6 complete. `/signup` form behavior verified unchanged. Ready for Phase 7."

**Stop.**

---

### Acceptance criteria

- [ ] `/signup` looks like v3 Figma at all four breakpoints
- [ ] Form fields' `name` / `type` / `value` / `onChange` wiring unchanged (verified via `git diff`)
- [ ] `onSubmit` handler unchanged (verified via `git diff`)
- [ ] Submitting the form on preview hits the same backend endpoint with the same payload
- [ ] No new dependencies added

### Stop

**Manually submit the signup form on the preview deploy.** Approve only if it submits correctly and lands in the same place as before.

---

## Phase 7: Final Pass

**Branch:** `phase-7-final`

**Goal:** Verify GA still fires, set meta tags + OG image, perf check, prep for prod.

### Prompt

---

Phase 7: final pass before shipping to prod. Read `AGENTS.md`.

## Tasks

### 1. Verify Google Analytics

- Open the existing GA configuration file(s) per `AUDIT.md`.
- Confirm the integration is still untouched. Run `git diff main..HEAD` filtered to those file paths — output should be empty.
- Push the preview deploy. Open it in browser dev tools → Network tab → filter by "google-analytics" or "analytics".
- Navigate between pages: `/`, `/pricing`, `/build-in-public`, `/signup`.
- Confirm GA pageview events fire on each navigation.
- Report findings in chat. **If something is broken, FLAG it — do not silently "fix" GA. Tristan decides.**

### 2. Meta tags

For each route's `page.tsx`, add Next.js `metadata` (or `generateMetadata`) with:
- `title`
- `description`
- `openGraph`: `{ title, description, images, url, siteName, type }`
- `twitter`: `{ card, title, description, images }`

If Figma has a "Meta / SEO" frame with copy for each page, use that copy verbatim. If not, ask Tristan for the copy before guessing.

### 3. OG image

If Figma has a designed OG image (1200×630), use the Figma MCP to download it. Save to `/public/og.png`. Reference in `metadata.openGraph.images`.

If Figma does not have one, ask Tristan whether to generate a default (e.g. a screenshot of the homepage hero) or skip for v1.

### 4. Favicon final check

Verify favicon variants are correctly referenced in metadata and visible in browser tabs across the four routes.

### 5. Perf check

- Run a Lighthouse audit against the preview deploy (Chrome DevTools → Lighthouse → Mobile + Desktop).
- Targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- If any score is below target, FLAG specific issues with file references. **Do not over-engineer fixes.** Surface for Tristan to decide which to address before ship.

### 6. Final preview

Push, open preview, post URL.

## Output to Tristan

- GA verification result (pageviews fire / something broken — be specific with what you saw in the Network tab)
- Meta tags applied per route (or list of routes still needing copy)
- OG image (path or "needs design")
- Lighthouse summary: 4 scores × 2 (mobile + desktop)
- List of any flagged perf / a11y issues
- Preview URL
- "Phase 7 complete. Ready to ship to prod when you approve."

**Stop. Do not push to `main` / production.**

---

### Acceptance criteria

- [ ] GA pageview events fire on every route navigation (verified in Network tab)
- [ ] Meta + OG tags present on every route
- [ ] OG image renders correctly in social preview tools (test with opengraph.xyz or similar)
- [ ] Lighthouse mobile + desktop scores meet targets, or specific issues flagged
- [ ] Preview deploy is production-ready

### Stop

Final review. Manually QA all four routes on the preview. When approved, ship to prod (next section).

---

## After Phase 7 — Shipping to prod

The Vercel project for `getpancake.ai` is already configured. To ship:

1. On GitHub (or your remote), open the PR for `phase-7-final` and merge to `main`.
2. Vercel auto-deploys `main` to production.
3. Watch the deploy log. If it fails, roll back via Vercel's "Promote previous deployment" before debugging.
4. Once live, verify:
   - All four routes render
   - GA shows real-time activity in the GA dashboard
   - Signup form actually submits (test once)
   - Favicon shows in browser tab
   - OG image renders on a Twitter/LinkedIn preview test

If anything is broken, the previous production deployment can be promoted from Vercel's deployments tab in seconds. No DNS change needed.

---

## Files Cursor maintains across phases

- `AGENTS.md` — project rules, updated only in Phase 1 (Stack section)
- `BUILD_SEQUENCE.md` — this file, never modified by Cursor
- `AUDIT.md` — created in Phase 1, referenced throughout
- `PROGRESS.md` — created in Phase 1, checkbox updated at end of each phase
- `tokens.css` / `@theme` block — written in Phase 2
- `lib/gsap.ts` — written in Phase 2

---

## If something goes wrong mid-phase

- Cursor produces something off → reply in the same Cursor chat with the specific correction. Cursor iterates on the same branch.
- Cursor goes off-script (touches forbidden files, ignores AGENTS.md) → tell it: "you violated [rule X in AGENTS.md], revert and re-read AGENTS.md before continuing."
- Cursor hits a build error it can't fix in 2–3 attempts → ask it to summarize the error and what it tried; bring the summary back here for diagnosis.
- A phase is taking too long / context drifting → end the chat, start a new Cursor session, paste the same phase prompt again. Cursor re-reads AGENTS.md fresh.
