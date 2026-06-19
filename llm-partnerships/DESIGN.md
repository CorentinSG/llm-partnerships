# Design

## Visual Theme & Atmosphere

LL.M Partnerships should feel like a calm future-facing legal research command center: precise, modern, data-rich, premium, and subtly cinematic. The site is not a marketing reset. It is a comparison product where typography, density, and interaction polish help users trust the information and move faster.

Reference direction:
- Vercel: crisp light surfaces, hairline borders, compact controls, strong focus states.
- Linear: disciplined surface ladder, restrained accent use, product-first hierarchy.
- IBM Carbon: dense comparison ergonomics and serious enterprise clarity.

Avoid decorative glassmorphism, gradient blobs, dark-tech theatrics, and card grids that feel unrelated to the user task.

## Color Palette & Roles

- Canvas: dark-first graphite/navy, with a cold near-white fallback in light mode.
- Surface: `hsl(0 0% 100%)`, primary panels and cards.
- Surface raised: `hsl(214 42% 96%)`, selected or nested panels.
- Ink: `hsl(222 47% 10%)`, headings and primary text.
- Muted ink: `hsl(218 18% 36%)`, body support text.
- Primary violet-blue: `hsl(236 94% 70%)`, primary actions and selected states.
- Accent cyan: `hsl(184 94% 52%)`, focus, live status, futuristic signal details.
- Amber: used only for warnings, estimates, and “to confirm”.
- Success: `hsl(150 58% 34%)`, confirmed reliability.
- Border: `hsl(216 22% 88%)`, hairline separation.

Accent color is scarce. Blue means action or current selection. Amber means cost or caution. Reliability states must use text/icon labels as well as color.

## Typography Rules

Use Space Grotesk as the product UI family for a more premium futuristic voice. Use IBM Plex Mono for micro-labels, status chips, and technical metadata.

- Page H1: 40-56px desktop, 32-36px mobile, weight 600, tight but readable.
- Section title: 22-28px, weight 600.
- Card title: 15-17px, weight 600.
- Body: 14-16px, line-height 1.55.
- Labels/captions: 11-12px, weight 500, no excessive uppercase tracking.
- Data numbers: tabular, weight 600, stable line-height.

Do not use viewport-based font scaling for product controls. Keep labels compact and predictable.

## Component Stylings

### Buttons

Buttons use 10-12px radius, 36-40px height, visible focus rings, and a subtle press transform. Primary buttons are solid blue. Secondary and outline buttons are white or raised-surface with hairline borders. No decorative shadows.

### Cards and Panels

Cards use white surfaces, 12-16px radius, 1px border, and a very soft shadow only when the card is interactive or elevated. Nested information blocks use tinted surfaces or dividers instead of card-inside-card decoration.

### Filters

Filters should feel like a professional search console. Inputs and selects are compact, high contrast, and keyboard visible. Active filters need explicit counts and clear reset affordances.

### Dialogs and Sheets

Dialogs scale/fade from a visible near-final state, centered for modals. Sheets slide from the edge with a short ease-out transition. Overlays should dim without blurring content heavily.

### Maps

Maps are product controls, not illustrations. Keep geography readable, selected states obvious, controls compact, and hover/selection transitions under 200ms.

## Layout Principles

Use a maximum content width of 1200px. The homepage should prioritize:
1. What the directory does and why cost matters.
2. Stats and trust/reliability at a glance.
3. Cost simulator.
4. Search/filter/map/results workspace.

Desktop can be dense. Mobile should collapse into a single-column task flow: intro, stats, simulator, search, map, results, filters through sheet.

## Motion Rules

Motion intensity is high for polish but not theatrical:
- Entry reveal: 220-420ms staggered opacity/translate for grouped content.
- Hover feedback: 140-180ms transform/color/shadow only.
- Press feedback: 100-140ms slight scale or translate.
- Dialog/sheet: 180-240ms ease-out.
- Map points and selected rows: 150-220ms.

Every motion must have a state purpose: reveal hierarchy, selected state, press feedback, panel relation, or loading feedback. Use `prefers-reduced-motion` to remove movement while retaining opacity/color transitions.

## Do's and Don'ts

Do:
- Keep all existing functionality, routes, data behavior, and forms intact.
- Make reliability and source quality visible.
- Use whitespace and dividers before adding more cards.
- Test 375px, 768px, 1024px, and desktop widths.

Don't:
- Add a generic SaaS hero.
- Use decorative gradient blobs or one-note blue surfaces.
- Animate filters so much that repeated use feels slow.
- Hide important legal/cost disclaimers.
- Change labels or form semantics casually.
