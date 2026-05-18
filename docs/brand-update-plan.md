# WellMed Brand Identity Update Plan

Source: `docs/WellMed_Website_Brand_Guide.pdf` + screenshot

---

## 1. Color Token Changes (`tailwind.config.js`)

### Current → New mapping

| Token | Current | New | Brand Guide Role |
|---|---|---|---|
| `primary` DEFAULT | `#1565C0` | `#0B1F33` | Header / nav background |
| `primary` light | `#1976D2` | `#0F2840` | Slightly lighter shade of header |
| `primary` dark | `#0D47A1` | `#081726` | Footer background (see note below) |
| `secondary` DEFAULT | `#0D47A1` | `#0A73E8` | Links / accents / secondary blue |
| `secondary` light | `#1565C0` | `#2589F5` | Lighter secondary blue |
| `secondary` dark | `#082F6C` | `#075EC0` | Darker secondary blue |
| `accent` DEFAULT | `#F97316` | `#6EDC16` | CTA buttons (Shop Now / Buy Now) |
| `accent` light | `#FB923C` | `#88F030` | Lighter green variant |
| `accent` dark | `#EA580C` | `#57B312` | CTA hover state |
| `topbar` | `#12151F` | `#0B1F33` | Top bar (same as header now) |

**Footer note:** Footer currently uses `bg-primary`. The brand guide specifies footer = `#081726` (slightly darker than the `#0B1F33` header). Two options:
- **Option A (recommended):** Add a `footer` color token (`#081726`) and update `Footer.vue` to use `bg-footer`.
- **Option B:** Use `primary.dark` (`#081726`) and change `Footer.vue` to `bg-primary-dark`.

**Deployment note from guide:** _"Use green sparingly for action buttons only. Keep the header dark to maximize logo visibility."_ — `accent` (green) should only appear on primary CTA buttons and cart badge. Do not apply to general links or decorative elements.

---

## 2. Typography Changes

### Current
- Font: `Public Sans` (single font for everything)
- Loaded via Google Fonts in `nuxt.config.js`
- Applied in `tailwind.config.js` → `fontFamily.sans`
- Applied in `app/assets/css/main.scss` → `font-family: "Public Sans"`

### New (from brand guide)
| Area | Font |
|---|---|
| Headings (h1–h4) | `Poppins` |
| Body / UI text | `Inter` |
| Base size | `16px` |
| H1 | `42px` desktop / `30px` mobile |

### Changes needed
1. **`nuxt.config.js`** — Replace the `Public+Sans` Google Fonts URL with:
   ```
   https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@600;700;800;900&display=swap
   ```
   Update both the `<link>` and the `<noscript>` fallback.

2. **`tailwind.config.js`** — Update `fontFamily`:
   ```js
   fontFamily: {
     sans: ["Inter", "sans-serif"],
     heading: ["Poppins", "sans-serif"],
   }
   ```

3. **`app/assets/css/main.scss`** — Update body font:
   ```scss
   body { font-family: "Inter", sans-serif !important; }
   h1, h2, h3, h4 { font-family: "Poppins", sans-serif; }
   ```

---

## 3. Global Background & Text Color

### Current
- Body background: default white / ad-hoc gray-50 in some layouts
- Body text: Tailwind default (`#111827`)

### New (from brand guide)
- Page background: `#F7FBFF`
- Body text: `#1E293B`

### Changes needed
1. **`tailwind.config.js`** — Add tokens:
   ```js
   colors: {
     "page-bg": "#F7FBFF",
     "text-dark": "#1E293B",
   }
   ```
2. **`app/assets/css/main.scss`** — Set globally:
   ```scss
   body {
     background-color: #F7FBFF;
     color: #1E293B;
   }
   ```
3. **`app.vue` or root layout** — Ensure `<body>` or wrapper has `bg-page-bg` / `text-text-dark` if not covered by SCSS.

---

## 4. Header / Nav Specifications

### Current (`app/components/Nav.vue`)
| Item | Current | Brand Guide |
|---|---|---|
| Main nav height | `h-14` (56px) mobile / `lg:h-[70px]` desktop | 64px mobile / 80px desktop |
| Nav background | `bg-primary` (#1565C0 blue) | `#0B1F33` (dark navy) — handled by token update |
| Category bar | `bg-secondary` | No spec — keep dark or use `#0B1F33` at 80% opacity |
| Menu text | white ✓ | White (#FFFFFF) ✓ |
| Menu hover | `hover:text-accent` (currently orange) | Green (#6EDC16) — handled by accent token update |
| Search button | `bg-accent` (orange) | Green (#6EDC16) — handled by accent token update |
| Sticky | Yes ✓ | Yes ✓ |
| Shadow | None currently | `0 4px 20px rgba(0,0,0,0.08)` — add `shadow` CSS |

### Height fix needed in Nav.vue
```diff
- class="... h-14 lg:h-[70px]"
+ class="... h-16 lg:h-20"
```
(`h-16` = 64px, `h-20` = 80px — matches spec exactly)

### Shadow: add to the main nav bar `<div>`
```
shadow-[0_4px_20px_rgba(0,0,0,0.08)]
```

---

## 5. Button Styles

### Current
- Primary buttons: `bg-accent` (orange), various border-radius (mostly `rounded-xl` = 12px)
- No consistent secondary button style

### New (from brand guide)
| Type | Style |
|---|---|
| Primary | Green bg (#6EDC16), white text, **radius 10px**, padding 14px 24px desktop / 12px 18px mobile |
| Secondary | Blue border (#0A73E8), blue text, white background |
| Hover (primary) | `#57B312` — handled by `accent.dark` token |

### Changes needed
- Primary CTA buttons site-wide: change `rounded-xl` (12px) → `rounded-[10px]` (10px)
- Padding: `px-6 py-3.5` desktop / `px-[18px] py-3` mobile
- Secondary button class to define (currently ad-hoc everywhere)
- Since `accent` token is changing to green, most `bg-accent` buttons automatically update — only radius and padding need touching

---

## 6. Footer

### Current (`app/components/Footer.vue`)
- Uses `bg-primary` for the dark section

### New
- Footer background: `#081726` (darker than header `#0B1F33`)
- With **Option A**: change `bg-primary` → `bg-footer` after adding `footer: "#081726"` token
- With **Option B**: change `bg-primary` → `bg-primary-dark`

---

## 7. Summary: Files to Touch

| File | What Changes |
|---|---|
| `tailwind.config.js` | Color tokens (primary, secondary, accent, topbar) + fontFamily + new tokens (page-bg, text-dark, footer) |
| `nuxt.config.js` | Google Fonts URL → Inter + Poppins |
| `app/assets/css/main.scss` | Font family, body background, body text color, h1–h4 font |
| `app/components/Nav.vue` | Height classes (h-16/h-20), add shadow class |
| `app/components/Footer.vue` | bg color token if Option A chosen |
| Button components site-wide | `rounded-xl` → `rounded-[10px]`, padding adjustment |

Color token changes in `tailwind.config.js` will cascade automatically to all Tailwind classes (`bg-primary`, `bg-accent`, `text-accent`, `hover:bg-accent-dark`, etc.) — no per-component color edits needed for those.

---

## 8. Implementation Order (recommended)

1. `tailwind.config.js` — tokens first, so everything updates at once
2. `nuxt.config.js` — swap font URL
3. `app/assets/css/main.scss` — body/heading font + background/text color
4. `app/components/Nav.vue` — height + shadow
5. `app/components/Footer.vue` — footer bg token
6. Button radius/padding sweep across components
