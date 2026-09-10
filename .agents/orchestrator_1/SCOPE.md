# SCOPE — LUMEN BOTANICA Redo & Refinement

## Architecture
- Framework/Stack: Modern web application (React/Next.js/Vite with Three.js / WebGL shaders / CSS modules or Tailwind).
- Core Modules:
  1. 3D Canvas / Bottle Viewer (Three.js, custom materials, cold condensation droplets, meniscus ripples, ambient caustics, camera framing, touch gestures, inertia glide, 360° scrub dial, 1-thumb formula swipe).
  2. Modern Swiss UI Layer (Obsidian surfaces, typography, 4 formulation palettes: Void/Aura/Verdant/Sol, responsive HUD, serving size toggles 350ml vs 100ml, expandable cellular bio-mechanism drawers).
  3. A11y & UX (>=44px touch targets, ARIA roles/labels, keyboard navigation, zero layout shift spring micro-interactions, vertical scroll passthrough).
  4. Build & Dependencies (package.json pruning, dead imports removal, zero lint/type errors, git commit & push to origin/master).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Mobile 3D Physics | 60fps, vertical scroll passthrough, horizontal touch rotation, inertia glide | M3 | R1 |
| 2 | Mobile Camera & Framing | Responsive portrait display framing (375px-430px+) without clipping | M3 | R1 |
| 3 | 360° Scrub Controls & Swipe | Scrub dial, 1-thumb formula swipe switching | M3 | R1 |
| 4 | UI Aesthetic & Hierarchy | Modern minimalist Swiss aesthetic, obsidian surfaces, glowing accents | M2 | R2 |
| 5 | Visual Artistry & Shaders | Procedural glass transmission, 36°F condensation, meniscus, caustics, morphing | M3 | R3 |
| 6 | A11y & Touch Targets | Minimum 44px touch targets, ARIA roles/labels, keyboard nav, layout stability | M4 | R4 |
| 7 | Interactive HUD & Drawers | 350ml vs 100ml toggle, expandable cellular bio-mechanism drawers | M2/M4 | R4 |
| 8 | Dependency Pruning & Hygiene | Audit package.json, remove unused libs & dead imports, build verify, git push | M5/M6 | R5 |

## Milestones
| # | Name | Agent Role | Expected Output | Status |
|---|------|------------|-----------------|--------|
| 1 | UI Design Analysis | UI design analyst (Explorer) | Comprehensive UI/UX/3D code audit report | IN_PROGRESS |
| 2 | UI Designer | UI designer (Worker) | Obsidian surfaces, Swiss typography, HUD structure & drawers | PLANNED |
| 3 | UI Design Artist | UI design artist (Worker) | 3D physics, glass shaders, caustics, touch inertia, scrub dial | PLANNED |
| 4 | UX Interface Analyst Engineer | UX engineer (Worker/Reviewer) | A11y audit, 44px touch targets, ARIA, keyboard nav, scroll passthrough | PLANNED |
| 5 | Backend/Systems Review | Systems reviewer (Reviewer/Auditor) | Performance review, integrity audit, build check | PLANNED |
| 6 | Code Cleaner | Code cleaner (Worker) | Pruned package.json, clean imports, npm run build, git push | PLANNED |
