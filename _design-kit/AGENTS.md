# Pancake Design Kit

A pure HTML/CSS reference design kit. No JS, no build step. Each component is a self-contained `.html` file that renders standalone in a browser.

## File layout

- `tokens.css` — design tokens (reference + semantic layers)
- `reset.css` — element-level reset
- `style.css` — declares cascade layer order, loads Aeonik Fono fonts, sets default font-family
- `components.css` — currently empty; will eventually consolidate component styles
- `<component>.html` — one file per component, each containing inline `<style>` + variant demos
- `pancake-svgs/` — pancake shape SVGs used by `pancake.html` / `pancake-stack.html`
- `icon-set/` — generic UI icons

## Token system (3 layers)

Cascade layer order (declared in `style.css`): `reference, semantic, reset, component`. Component layer is last so it overrides the reset.

### Reference (`@layer reference` in `tokens.css`)
Raw values. **Do not reference these from components** — go through semantic.
- Color palette: `--palette-{family}-{shade}` (e.g. `--palette-pink-30`). Families: chrome (0–100), pink, purple, yellow, orange, red, green (10–40 each).
- Typography scale: `--font-scale-min-2..9` derived from `--font-size-base` × `--font-size-scale-factor`.
- Spacing scale: `--spacing-{xs|sm|md|lg|xl|xxl}` = 2/4/8/12/16/24px. Components reference these directly — no semantic spacing layer.

### Semantic (`@layer semantic` in `tokens.css`)
Named meanings. **This is what components read.**

- **Text**: `--text`, `--subtle-text`, `--disabled-text`, `--interactive-text`, `--positive-text`, `--warning-text`, `--negative-text`, `--text-on-inverted-surface`
- **Stroke**: `--stroke`, `--subtle-stroke`, `--strong-stroke`, `--branded-stroke-01..03`, `--positive-stroke`, `--warning-stroke`, `--negative-stroke`
- **Surface**: `--surface`, `--alt-surface`, `--elevated-surface`, `--inverted-surface`, `--positive-surface`, `--warning-surface`, `--negative-surface`, `--weak-branded-surface`, `--strong-branded-surface`, `--alt-{weak|strong}-branded-surface-{01|02}`
- **Control sizing**: `--control-size-{sm|md|lg}` = 40/48/56px (used for input/button heights)
- **Radius**: `--radius-{sm|md|lg|xl}` = 12/18/24/32px
- **Font sizes**: `--font-size-header-{01..04}`, `--font-size-body-{large|regular|small}`, `--font-size-eyebrow`
- **Font weights**: `--font-semibold` (500), `--font-heavy` (600), `--font-bold` (800)

### Component (`@layer component`, inside each component's HTML)
Per-component custom properties (e.g. `--button-padding`). Always derived from semantic tokens, never reference or palette values.

## Component conventions

Strict patterns — follow them when adding or modifying components.

1. **Wrap component CSS in `@layer component`** so reset rules don't override class-based styles.

2. **Component tokens declared at top of base rule, then read in property values**:
   ```css
   .button {
     --button-padding: var(--spacing-md) var(--spacing-xl);
     --button-background-color: var(--strong-branded-surface);
     --button-border-color: var(--branded-stroke-01);

     padding: var(--button-padding);
     background-color: var(--button-background-color);
     border: 1px solid var(--button-border-color);
   }
   ```
   Variants override the tokens, not the property values directly.

3. **Variants via `data-*` attributes**, not BEM modifiers:
   - `data-variant="..."` for visual variants (subtle, alternative, outline, negative, etc.)
   - `data-size="sm|md|lg"`
   - Boolean states via attribute presence: `data-err` for error, etc.
   - Native input states use pseudo-classes (`:disabled`, `:focus`)

4. **Borders reference stroke tokens** — even for solid-fill components. Common pattern: pair a `--*-surface` (level 30) with a matching `--*-stroke` (level 20) one shade lighter, giving a subtle highlight rim.

5. **`corner-shape: squircle`** is used on rounded components. It's an experimental Chromium property — the lint warning is expected, leave it.

6. **States are nested with `&`**:
   ```css
   .input {
     /* ... base + tokens ... */

     &:focus {
       --input-border-color: var(--interactive-text);
     }

     &:disabled {
       --input-border-color: var(--subtle-stroke);
       background-color: var(--alt-surface);
       color: var(--disabled-text);
       cursor: not-allowed;
     }
   }
   ```

7. **Each `<component>.html` is self-contained**: links `style.css` / `reset.css` / `tokens.css`, inline `<style>` with the component's `@layer component { ... }` plus demo-only styles, `<body>` shows every variant. If a component composes another (e.g. `pancake-stack` uses `pancake`), duplicate the dependency's CSS inline for now — consolidation into `components.css` is a follow-up pass.

## Color contrast rules

When placing foreground content on branded surfaces, contrast must be respected.

### Pink background
- Background can only be pink-10, pink-20, or pink-30
- Foreground must be pink-40 or chrome-100

### Purple background
- Background can only be purple-10, purple-20, or purple-30
- Foreground must be chrome-100; unless the element is considered "big" (e.g. a heading) and the bg is purple-10 — then purple-40 is also acceptable

## Adding a new component

1. Create or open `<component>.html`
2. In `<head>`: link `style.css`, `reset.css`, `tokens.css`
3. Inside `<style>`: `@layer component { .{component} { ... } }` with token defaults at the top of the base rule
4. Add variant rules below using `[data-variant="..."]` / `[data-size="..."]` selectors that override the tokens
5. Add states inline using nested `&:state { ... }` blocks
6. In `<body>`: one `<section>` per variant axis (sizes, variants, states), each demonstrating every option
