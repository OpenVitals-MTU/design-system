---
name: openvitals-design
description: Use this skill to generate well-branded interfaces and assets for OpenVitals (a privacy-first Health Connect dashboard, activity tracker, and manual-entry app for Android), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files. The binding standards live in `docs/` — audit-2 (current findings and backlog; audit-1 is the retained Flutter-era record), iconography (outlined-only, glyph registry), accessibility (floors: 3:1/4.5:1 contrast, 48dp targets, 200% type), components-map (which widgets exist where).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key things to know about OpenVitals:
- Material 3, restrained health-dashboard style: neutral surfaces, one accent per metric, flat cards (depth by surface tone, not shadow), 12px card corners.
- Roboto type (Material default); Material Symbols Outlined icons; no emoji.
- Two palettes: canonical blue/teal static scheme (`:root`) and a warm Material You sample (`[data-theme="warm"]`) matching the reference screenshots. Metric accents are fixed.
- Metric accents are contrast-audited (3:1 minimum against both surfaces). Never brighten one to make it "pop" — that is the exact regression this palette was built to fix.
- Copy is calm and factual, sentence case, addresses "you", numbers-first, honest about data confidence.
- Link `styles.css` for tokens. Components live under `components/` (namespace `OpenVitalsDesignSystem_626946`); full screens under `ui_kits/openvitals-app/`.
- **The app is Kotlin/Jetpack Compose**, in a sibling `openvitals-android` repository. When working on production code the real theme is that repo's `app/src/main/kotlin/tech/mmarca/openvitals/ui/theme/` — `Color.kt`, `Type.kt`, `Theme.kt`, `DesignTokens.kt`, `ReducedMotion.kt` — plus `ui/charts/ChartTokens.kt`. Values there win over values here; scales and component contracts here win over bare numbers there.
  - The app was Flutter/Dart between 2026-07-09 and 2026-08-02; that `mobile-app` checkout is retired and is history, not a reference. Where a rule below still reads as Flutter (`kMinInteractiveDimension`, `MediaQuery.disableAnimations`, `Icons.*_outlined`), the Compose equivalent is named beside it — the DESIGN is unchanged, only the surface it lands on.
