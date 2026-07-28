# Iteration 1 — audit

> **Date:** 2026-07-28 · **Scope:** this design system vs. the shipping Flutter
> app (`mobile-app`, sibling checkout) vs. Material 3 and WCAG 2.2.
> Every count below was measured against the source on the date above, with the
> command noted where it isn't obvious. Nothing here is guessed — this system
> has been burned once by asserting things nobody had measured.

## How to read the dispositions

- **Fixed** — corrected in this iteration, both sides where both were wrong.
- **Standard written** — the rule now exists; migrating the app to it is
  backlog, not something to do silently in one sweep.
- **Decision needed** — changing it repaints the app; the call is the owner's.

---

## Findings

### F1 — Touch target was the iOS number in an Android app · **high · fixed**

`--ov-icon-button-size: 44px /* min touch target */` and the app's
`Metrics.minTouchTarget = 44`. 44pt is the **iOS HIG** floor; Material (and
Flutter itself, `kMinInteractiveDimension`) say **48dp**, and WCAG 2.5.8 sets an
absolute floor of 24px. OpenVitals is Android-only. Both tokens now read 48 and
the CSS token is renamed `--ov-min-touch-target` (nothing consumed the old name
— verified before renaming). Visual containers may stay smaller (40dp icon
button, 24dp glyph) so long as the hit area pads out to 48.

### F2 — Two icon systems, and neither is followed · **high · standard written**

This system specified *Material Symbols Outlined, weight 500, FILL 0*. The app
ships the **classic Material Icons font** via Flutter's `Icons` class — a
different typeface — and uses it inconsistently: of **516** icon references,
**238 (46%)** are outlined-intent (`_outlined`/`_outline`/`_border`) and **278
(54%)** are filled/base. The same glyph appears in both styles:
`Icons.favorite` (16×, across 5 files) beside `Icons.favorite_border` (21×).

One usage is *correct* and exempt: the nav bar's filled-when-selected pairing
(`app_routes.dart` — outlined idle, filled selected) is the Material 3 pattern.

The standard is now [iconography.md](iconography.md): outlined-only chrome,
filled reserved for selected/active states, one glyph per metric. Migration of
the ~200 stray filled uses is backlog — mechanical, per-screen, low risk.

### F3 — The copy standard contradicts itself, and the app violates it · **medium · partly fixed**

The readme's sentence-case rule cited *"Daily Readiness"* as an example — which
is title case. Fixed here. The app's own English catalog carries at least nine
first-party title-case strings: *Daily Readiness, Body Energy, Recovery Mode,
Add Marker, Data Importers* among them. **Exemption:** Garmin's feature names
(*Body Battery, Sleep Coach, Training Readiness, Intensity Minutes, Stress
Level*) are third-party product terms and keep their casing. Fixing the
first-party strings is l10n churn across 5 catalogs — backlog, one commit.

### F4 — Typography silently deviates from Material 3 · **medium · resolved**

Two deviations from Flutter's M3 defaults (`Typography.material2021`), neither
previously documented:

1. **Weights** — headlines/titles are heavier (headlineLarge w700 vs M3 w400,
   titleLarge w600 vs w400). This is the brand: numbers-first, big bold
   numerals. **Now documented as deliberate. Keep.**
2. **Tracking** — body and title styles omit M3's letter-spacing (bodyLarge
   +0.5, bodyMedium +0.25, bodySmall +0.4, titleMedium +0.15, titleSmall +0.1;
   the label styles *do* carry theirs). Ported verbatim from the Compose app,
   never decided. **Resolved 2026-07-28: M3 tracking adopted** — the owner chose
   the industry pattern over the accidental port. Chart goldens were unaffected
   (painters pin their own label styles); screens re-render with the tracking.

### F5 — Token discipline: excellent at the theme layer, absent at call sites · **medium · standard written**

The good news first, because it's the strongest thing in this codebase: exactly
**4** `fontSize:` literals and **2** `letterSpacing:` outside the theme in the
entire app. Type discipline is essentially perfect.

Spacing and shape are not: **563** `SizedBox` literals, **481** `EdgeInsets`,
**71** hand-written alphas (12+ distinct values), stray radii (20, 10, 4, 2)
and ~90 off-scale spacing values (2, 6, 10, 14, 20, 28). The named scales exist
(`design_tokens.dart`: `Spacing`, `Radii`, `Emphasis`, `Metrics`); migration is
per-screen backlog. Rule for all new code: **no bare numbers for spacing,
radius, or alpha.**

### F6 — Motion was one sentence of prose · **medium · fixed**

"~120ms ease" in the readme was the entire motion spec. Measured reality:
`lib/ui/` uses exactly four durations — 120, 300, 550, 1200ms. These are now
`tokens/motion.css` (`press` / `standard` / `reveal` / `ambient`) with M3
curves and a **reduced-motion policy** that did not exist anywhere: honor
`prefers-reduced-motion` / Flutter's `MediaQuery.disableAnimations`; reveals
drop to zero.

### F7 — Stock `Colors.*` leaking past the scheme · **low · standard written**

23× `Colors.white`, 7× `Colors.black`, plus one `redAccent` and one `orange` in
widget code. Some are legitimate (scrims over imagery/maps, AMOLED-adjacent
surfaces); `redAccent`/`orange` are not. Rule: every colour resolves from the
`ColorScheme`, `AppColors`, or `ChartTokens`; raw `Colors.*` requires a comment
saying why the scheme is wrong there.

### F8 — Component inventories have drifted apart · **medium · mapped**

This system describes 30 React components; the app has grown past them
(`StepBar`, `StepDots`, `StepHero`, `InstructionSteps`, `OpenVitalsSurface`,
`PermissionCallout` are absent here) and never built others (`DetailRow`,
`SectionHeader` exist here but are inline patterns in Flutter; all form
controls are stock Material, correctly). Full mapping with per-row status:
[components-map.md](components-map.md).

### F9 — 1.8 MB of byte-identical duplicate assets · **low · fixed**

`uploads/` was an exact copy of `assets/` (md5-verified), referenced by
nothing. Deleted. The repository halved.

### F10 — Degenerate radius scale · **info · documented**

`sm` and `md` are both 12px (the app draws one card corner). Kept as two names
so they *can* diverge without touching 21 components — documented in
`tokens/shape.css`, restated here so nobody "fixes" the duplication.

### F11 — Emphasis tints vs. Material state layers · **info · documented**

`Emphasis` (wash 12 / subtle 22 / disabled 38 / fill 55 / strong 80) is a
**tint ladder for static content**. M3 *state layers* (hover 8 / focus 10 /
press 10 / drag 16, disabled content 38) are a different system that Flutter's
Material widgets already apply. They share only the 38% disabled value. Do not
merge them; do not hand-build state layers with `Emphasis`.

### F12 — Fixed metric accents under dynamic colour · **info · rule stated**

Material You re-tints the chrome from the wallpaper while the 17 metric accents
stay fixed — so a green wallpaper can make `primary` collide with the steps
accent. The existing rule already contains this: **accents appear only on data
(icons, strokes, small indicators), never on interactive chrome.** Now stated
in [accessibility.md](accessibility.md) as load-bearing, not stylistic.

### F13 — This repository is not under version control · **high · decision needed**

The rot documented in the readme — seventeen accents falling an accessibility
pass behind — happened precisely because this content lived outside the tools
that track change. It is currently a bare directory again. `git init` plus a
remote is a five-minute fix and the single highest-leverage governance act
available to this system.

---

## What the app already gets right

Worth recording so nobody "fixes" these: nav bar 80dp and small top bar 64dp
(both exactly M3); flat cards with tonal depth, no shadows; nav icon pairing
outlined→filled on selection; contrast-audited accent palette (worst case
3.09:1 against both surfaces); 200% text-scale sweep test in CI; decorative
elements excluded from semantics (`StepDots`, the wordmark).

## Backlog, in priority order

1. Icon style migration (~200 filled → outlined; F2)
2. First-party title-case strings → sentence case, 5 catalogs (F3)
3. Spacing/radius/alpha literal migration, per-screen with golden cover (F5)
4. `Colors.white`/`black` audit — annotate or resolve from scheme (F7)
5. Chart semantics: charts are currently visual-only; each needs a semantic
   summary label (see accessibility.md)
6. ~~Typography tracking decision (F4.2)~~ — **done**, adopted 2026-07-28
