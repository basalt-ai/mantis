# Pancake Design Kit — Usage Reference

Reference for composing complete web pages using the Pancake design kit.

> If you're an AI assistant building a page: this doc is your full reference. Every component's API, all the tokens you'll need, and the contrast rules to respect are below. The kit is pure HTML + CSS — no JS, no build step.

## Bootstrap a page

Every page must link the kit's three stylesheets and (optionally) include the inline component styles for the components it uses. The simplest setup:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="reset.css">
  <link rel="stylesheet" href="tokens.css">
  <style>
    @layer component {
      /* Paste the @layer component { ... } block from each used <component>.html here */
    }
  </style>
</head>
<body>
  <!-- page content -->
</body>
</html>
```

`style.css` declares cascade layer order and loads the Aeonik Fono font. `reset.css` is a normal-style reset. `tokens.css` exposes all design tokens via CSS custom properties.

## Components

Each component below shows: minimum HTML, available `data-*` attributes for variants, and a usage example.

### Button

```html
<button class="button">Click me</button>
```

| Attribute | Values | Notes |
|---|---|---|
| `data-size` | `sm`, (md = default), `lg` | 40 / 48 / 56px tall |
| `data-variant` | (brand = default), `subtle`, `alternative`, `outline`, `negative`, `ghost` | colors below |

Variant colors:
- **brand** — pink fill (default)
- **subtle** — chrome neutral fill
- **alternative** — purple fill
- **outline** — transparent fill, dark border
- **negative** — red fill
- **ghost** — transparent, fills with weak-branded on hover

```html
<button class="button" data-size="lg">Primary action</button>
<button class="button" data-variant="outline">Cancel</button>
<button class="button" data-variant="negative" data-size="sm">Delete</button>
<button class="button" data-variant="ghost">Quiet action</button>
```

### Input

```html
<input class="input" placeholder="Email">
```

| Attribute | Values | Notes |
|---|---|---|
| `data-size` | `sm`, (md = default), `lg` | 40 / 48 / 56px tall |
| `data-err` | (presence = error) | red border |
| `disabled` | (native HTML attribute) | dims & disables |

```html
<input class="input" data-size="lg" placeholder="Search">
<input class="input" data-err value="not-an-email">
<input class="input" disabled placeholder="Read only">
```

Placeholder color is always `--subtle-text`; text color is `--text`. Focus shows the brand purple border (`--interactive-text`).

### Textarea

Same API as `Input`, but renders as a `<textarea>` element. Identical sizing, error, focus, and disabled behavior.

```html
<textarea class="textarea" placeholder="Your message"></textarea>
```

| Attribute | Values | Notes |
|---|---|---|
| `data-size` | `sm`, (md = default), `lg` | scales padding & radius |
| `data-err` | (presence = error) | red border |
| `disabled` | (native HTML attribute) | dims & disables |

```html
<textarea class="textarea" data-size="lg" placeholder="Long-form input"></textarea>
<textarea class="textarea" data-err>invalid content</textarea>
<textarea class="textarea" disabled placeholder="Read only"></textarea>
```

Height is unconstrained — let it grow with content, or set a `rows` attribute / inline height as needed.

### Toast

A horizontal banner with an icon, body, and close button.

```html
<div class="toast">
  <span class="toast-prefix" aria-hidden="true">
    <!-- 24x24 inline SVG icon, fill="currentColor" -->
  </span>
  <span class="toast-body">Your message here.</span>
  <button class="toast-close" aria-label="Close">
    <!-- 24x24 inline SVG X, fill="currentColor" -->
  </button>
</div>
```

| Attribute | Values |
|---|---|
| `data-variant` | (outline = default), `inverted`, `success`, `warning`, `error` |

Body text is bold (`--font-heavy`) and left-aligned. No size variants.

For icons, inline SVG with `fill="currentColor"` — they pick up the toast's text color (matters for the inverted variant). The kit's `icon-set/icon-cross.svg` works as the close button.

### Badge

A small uppercase label.

```html
<span class="badge">In progress</span>
```

| Attribute | Values |
|---|---|
| `data-variant` | (neutral = default), `inverted`, `brand`, `brand-alt-1`, `brand-alt-2`, `success`, `warning`, `negative` |

Text is auto-uppercased with letter-spacing applied. Use for status indicators, tags, category labels.

### Card

A container with a border. **Has no padding by default** — the consumer is responsible for padding the inner content.

```html
<div class="card">
  <div style="padding: var(--spacing-xl);">
    <!-- content -->
  </div>
</div>
```

| Attribute | Values |
|---|---|
| `data-variant` | (outline = default), `brand`, `brand-alt-1`, `brand-alt-2` |

Variant colors:
- **outline** — surface bg + neutral stroke
- **brand** — pink (weak surface + branded stroke)
- **brand-alt-1** — purple
- **brand-alt-2** — yellow

Cards use `--radius-lg` (24px). For padded cards without a wrapper, set `--card-padding` directly:

```html
<div class="card" data-variant="brand" style="--card-padding: var(--spacing-xl);">
  Content goes here
</div>
```

### Page Section

A full-width strip with centered content — use it as the top-level layout primitive when composing pages with multiple visually distinct sections.

```html
<section class="page-section">
  <div class="page-section-content">
    <!-- section content here -->
  </div>
</section>
```

| Attribute | Values | Notes |
|---|---|---|
| `data-variant` | (default), `alt` | `alt` swaps bg to `--alt-surface` for alternating section backgrounds |

The outer `.page-section` spans full viewport width and applies the background. `.page-section-content` constrains the content to a centered column.

```html
<body>
  <section class="page-section">
    <div class="page-section-content">
      <h1>Hero</h1>
    </div>
  </section>

  <section class="page-section" data-variant="alt">
    <div class="page-section-content">
      <h2>Features</h2>
    </div>
  </section>
</body>
```

### Pancake

A decorative blob shape with optional centered content.

**Setup**: pages using pancakes must include the SVG sprite once near the top of `<body>`. Copy the entire `<svg class="pancake-sprite">…</svg>` block from `pancake.html`. It defines `<symbol>`s for all 12 shapes.

```html
<div class="pancake">
  <svg class="pancake-shape"><use href="#pancake-top-1"/></svg>
  <div class="pancake-body">Optional content</div>
</div>
```

**Shape selection** — set via `<use href>`. ID format: `#pancake-{style}-{variant}`.
- Styles: `top`, `top-bordered`, `angled`, `flat`
- Variants: `1`, `2`, `3`
- 12 total: `#pancake-top-1`, `#pancake-flat-2`, `#pancake-angled-3`, etc.

**Colors** — set via `data-color`:
- (brand = default) — pink
- `alt-1` — purple
- `alt-2` — yellow
- `elevated` — chrome (light surface + stroke contrast)

Default size is 200×200px. Override via inline width or wrapping container; aspect ratio stays 1:1.

```html
<div class="pancake" data-color="alt-1" style="width: 300px;">
  <svg class="pancake-shape"><use href="#pancake-flat-2"/></svg>
  <div class="pancake-body">Hello</div>
</div>
```

### Pancake Stack

Three pancakes stacked vertically with the middle offset horizontally. Canonical decorative element.

```html
<div class="pancake-stack">
  <div class="pancake" data-color="brand" data-stack-pos="under">
    <svg class="pancake-shape"><use href="#pancake-flat-3"/></svg>
  </div>
  <div class="pancake" data-color="alt-1" data-stack-pos="middle">
    <svg class="pancake-shape"><use href="#pancake-angled-2"/></svg>
  </div>
  <div class="pancake" data-color="alt-2" data-stack-pos="top">
    <svg class="pancake-shape"><use href="#pancake-top-1"/></svg>
  </div>
</div>
```

Each pancake needs `data-stack-pos="top"`, `"middle"`, or `"under"`. Canonical composition: yellow top (top-1), purple middle (angled-2), pink under (flat-3). Other combinations work but the above is the intended look.

Sprite must be present on the page (see Pancake setup).

## Tokens for custom styling

When a need falls outside the existing components, compose with semantic tokens directly. **Never reach for raw `--palette-*` values** — go through the semantic layer.

### Colors

**Text**: `--text`, `--subtle-text`, `--disabled-text`, `--interactive-text`, `--positive-text`, `--warning-text`, `--negative-text`, `--text-on-inverted-surface`

**Strokes** (use for borders): `--stroke`, `--subtle-stroke`, `--strong-stroke`, `--branded-stroke-01..03`, `--positive-stroke`, `--warning-stroke`, `--negative-stroke`

**Surfaces** (use for backgrounds): `--surface`, `--alt-surface`, `--elevated-surface`, `--inverted-surface`, `--positive-surface`, `--warning-surface`, `--negative-surface`, `--weak-branded-surface` (pink-10), `--strong-branded-surface` (pink-30), `--alt-{weak|strong}-branded-surface-{01|02}` (purple/yellow equivalents)

### Spacing

`--spacing-xs` (2px) · `--spacing-sm` (4px) · `--spacing-md` (8px) · `--spacing-lg` (12px) · `--spacing-xl` (16px) · `--spacing-xxl` (24px)

### Sizing

**Control heights**: `--control-size-sm` (40), `--control-size-md` (48), `--control-size-lg` (56)
**Radii**: `--radius-sm` (12), `--radius-md` (18), `--radius-lg` (24), `--radius-xl` (32)

### Typography

**Headings**: `--font-size-header-01` (largest) … `--font-size-header-04` (smallest)
**Body**: `--font-size-body-large`, `--font-size-body-regular`, `--font-size-body-small`
**Eyebrow**: `--font-size-eyebrow` (small uppercase labels)
**Weights**: `--font-semibold` (500), `--font-heavy` (600), `--font-bold` (800)

### Custom element example

```html
<section style="
  background: var(--alt-surface);
  padding: var(--spacing-xxl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--subtle-stroke);
">
  <h2 style="font-size: var(--font-size-header-02); font-weight: var(--font-bold); margin-bottom: var(--spacing-lg);">
    Section heading
  </h2>
  <p style="color: var(--subtle-text); font-size: var(--font-size-body-regular);">
    Body copy goes here.
  </p>
</section>
```

## Color contrast rules

When placing foreground content on branded surfaces, contrast must be respected.

**Pink background**:
- Background must be pink-10, pink-20, or pink-30
- Foreground must be pink-40 or chrome-100

**Purple background**:
- Background must be purple-10, purple-20, or purple-30
- Foreground must be chrome-100; unless the element is "big" (e.g. a heading) and the bg is purple-10 — then purple-40 is also acceptable

## Composition patterns

A few common page layouts using only this kit:

### Form

```html
<form style="display: flex; flex-direction: column; gap: var(--spacing-lg); max-width: 480px;">
  <input class="input" placeholder="Email">
  <input class="input" type="password" placeholder="Password">
  <input class="input" data-err placeholder="Confirm password">
  <button class="button">Sign up</button>
</form>
```

### Notification area

```html
<div style="display: flex; flex-direction: column; gap: var(--spacing-md); max-width: 480px;">
  <div class="toast" data-variant="success">
    <span class="toast-prefix" aria-hidden="true"><!-- icon --></span>
    <span class="toast-body">Saved successfully</span>
    <button class="toast-close" aria-label="Close"><!-- × --></button>
  </div>
  <div class="toast" data-variant="warning">
    <!-- ... -->
  </div>
</div>
```

### Hero section with decorative pancake

```html
<section style="display: flex; align-items: center; gap: var(--spacing-xxl); padding: var(--spacing-xxl);">
  <div style="flex: 1;">
    <span class="badge" data-variant="brand">New</span>
    <h1 style="font-size: var(--font-size-header-01); font-weight: var(--font-bold); margin-top: var(--spacing-md);">
      Stack 'em high
    </h1>
    <p style="color: var(--subtle-text); margin-top: var(--spacing-md);">
      Subtitle copy here.
    </p>
    <button class="button" data-size="lg" style="margin-top: var(--spacing-xl);">
      Get started
    </button>
  </div>
  <div class="pancake-stack">
    <!-- 3 stacked pancakes as shown above -->
  </div>
</section>
```

## Quick reference

| What you want | Use |
|---|---|
| Primary action | `<button class="button">` |
| Secondary action | `<button class="button" data-variant="outline">` |
| Destructive action | `<button class="button" data-variant="negative">` |
| Single-line text input | `<input class="input">` |
| Multi-line text input | `<textarea class="textarea">` |
| Validation error | add `data-err` to input/textarea |
| Status banner | `<div class="toast" data-variant="success/warning/error">` |
| Tag / label | `<span class="badge">` |
| Bordered container | `<div class="card">` |
| Top-level page strip | `<section class="page-section">` with `<div class="page-section-content">` inside |
| Decorative shape | `<div class="pancake">` (requires sprite) |
| Hero decoration | `<div class="pancake-stack">` |
| Custom container | inline `style` with semantic tokens (`--surface`, `--spacing-*`, `--radius-*`, etc.) |
