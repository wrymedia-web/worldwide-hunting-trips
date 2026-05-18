# Worldwide Hunting Trips — Brand Kit v1.0

A free marketplace connecting hunters with outfitters worldwide.

## Contents

```
WHT-Brand-Kit/
├── logos/                    14 production SVGs
│   ├── logo-stacked-ink.svg          PRIMARY · stacked lockup (ink on transparent)
│   ├── logo-stacked-bone.svg         stacked, inverted (bone on ink)
│   ├── logo-stacked-blaze-bg.svg     stacked on blaze
│   ├── logo-horizontal-ink.svg       horizontal lockup
│   ├── logo-horizontal-bone.svg      horizontal, inverted
│   ├── logo-icon-ink.svg             mountain icon mark (ink)
│   ├── logo-icon-bone.svg            mountain icon mark (bone, inverted)
│   ├── logo-icon-mono.svg            mountain icon, single-color (no accent dot)
│   ├── logo-wordmark.svg             two-line wordmark only
│   ├── logo-seal.svg                 circular seal/badge
│   ├── logo-seal-inverted.svg        seal, inverted
│   ├── app-icon.svg                  app icon (512x512, rounded square)
│   ├── monogram.svg                  WHT square monogram
│   └── favicon.svg                   simplified 64x64 favicon
├── brand-tokens.css          drop-in CSS custom properties for the palette + type
├── brand-tokens.json         same tokens in JSON for design tooling
└── README.md                 this file

```

## Colors

| Token        | HEX       | Use                                      |
|--------------|-----------|------------------------------------------|
| `--wht-ink`   | #0F0E0B   | text, mark, inverted-block background    |
| `--wht-bone`  | #F1ECDE   | marketing background, mark on dark       |
| `--wht-paper` | #FAF6EB   | app surface background                   |
| `--wht-blaze` | #E85A1E   | accent only (CTAs, the dot in the mark)  |
| `--wht-forest`| #2A332B   | supporting (only when needed)            |
| `--wht-brass` | #B08740   | supporting                               |
| `--wht-stone` | #6B655A   | secondary text, captions                 |
| `--wht-fog`   | #A39B8C   | tertiary text on dark surfaces           |

Rule: ~60% Bone/Paper, 30% Ink, 8% Blaze, 2% supporting. Never exceed 15% Blaze.

## Typography

All four are free on Google Fonts:

- **Anton** — display + wordmark. UPPERCASE, +3% tracking.
- **Zilla Slab** — heritage / feature heads. Title case. 400/600/700.
- **Manrope** — body, UI. Sentence case. 400/500/600/700.
- **JetBrains Mono** — tags, metadata, codes. UPPERCASE, +2px tracking. 500/600.

Load all four with one link:
```html
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Zilla+Slab:wght@400;600;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

## SVG usage notes

- SVGs include an embedded `@font-face` pointing to Google's CDN. When opened standalone (in a browser tab, Figma, Illustrator with internet) the wordmarks render in Anton.
- **For print or offline final delivery:** open each SVG in Figma/Illustrator and convert text to outlines/paths. The brand kit HTML version of the marks is font-dependent; outlined versions are not.
- The icon mark, favicon, and the inner mountain shapes are pure paths and require no fonts.
- All SVGs use `viewBox` correctly and scale cleanly. Don't add fixed `width`/`height` in CSS — let containers control size.

## Clear space & minimum sizes

- Clear space: cap-height of WORLDWIDE on all four sides.
- Minimum stacked lockup: 200px wide.
- Below 200px: switch to icon mark.
- Below 32px: switch to favicon (simplified — no accent baseline rules).

## Don'ts

- Don't recolor outside the sanctioned variants
- Don't stretch, squash, or skew
- Don't rotate
- Don't place on busy or low-contrast backgrounds
- Don't substitute the wordmark typeface
- Don't add effects (shadows, glows, outlines, bevels, gradients)

---
v1.0 · May 2026
