# Skylight Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. The user's instruction is to proceed directly and make the final art choice.

**Goal:** Deliver an evidence-backed Sky Edition exploration and selected interactive Lab preview.
**Architecture:** Add a sky surface renderer to LivingX without changing existing profiles. Isolate all visual tokens and motion under the Sky Lab routes. Reuse the existing gallery and real project data.
**Tech Stack:** Next static export, React, TypeScript, SVG, CSS, GSAP, Playwright.
**Spec:** docs/superpowers/specs/2026-11-12-sky-edition-design.md

## Global Constraints
No merge, no rewrite, no scroll interception, no new runtime dependency; production homepage preserved. Real desktop/mobile evidence before motion integration. Preserve all project material and reading clarity.

## Review Focus
- Surface projection must remain finite and closed under extreme original spring offsets.
- Touch must keep native vertical scrolling; narrow layout must not overflow.
- Reduced motion / no JS must expose content and links immediately.
- Scroll reversal, resize and route return must not retain a half-hidden gallery.
- Prototype routes must be noindex and clearly separate from production.

### Task 1: Static geometry and A/B art
- [x] Preserve baseline production build and capture exact source/old preview.
- [x] Add sky surface numeric tests for finite, closed geometry, distinct A/B and compact budget; run RED.
- [x] Add src/motion/sky-surface.ts and src/components/sky-x-mark.tsx; bridge via optional LivingX profile. Default geometry unchanged.
- [x] Create static candidate routes and scoped src/app/lab/sky-edition/sky.css.
- [x] Capture actual desktop/mobile candidates, inspect them, write the art decision.

### Task 2: Selected experience
- [x] Only after Task 1 static decision, connect pointer and native scroll motion in src/components/sky-edition.tsx.
- [x] Use original LivingGallery with an optional quieter spatial profile; preserve default behavior.
- [x] Finish airy editorial content preview and navigation identity inside the Lab scope.
- [x] Verify reversal, resize, detail return, touch, keyboard, reduced/no JS.

### Task 3: Evidence and delivery
- [x] Capture old/new hero, interaction, gallery, mobile and desktop comparisons and full browser films.
- [x] Run unit tests, typecheck, build, export checks and targeted browser regressions; inspect recordings as decoded sequences and disclose playback limits.
- [x] Review implementation, fix material findings, document limits and replacement recommendation.
- [x] Commit using API-verified Xuanyi-king identity, push new branch, open Draft PR against 2.3. Leave PRs #1–#4 and live deployments unchanged.
