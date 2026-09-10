# Original User Request

## 2026-09-10T06:03:14Z

Orchestrate a team of subagents following this order: 1. UI design analyst, 2. UI designer, 3. UI design artist, 4. UX interface analyst engineer for desktop and mobile, 5. Backend/systems review, 6. Code cleaner. Redo the entire mobile experience with primary focus on the 3D model on mobile, while executing visual artistry refinement, a11y auditing, and dependency pruning for LUMEN BOTANICA.

Working directory: c:\Users\Nathan\Desktop\coding-proj-2
Integrity mode: development

## Requirements

### R1. Complete Mobile Redo & 3D Model Physics
Redo the entire mobile experience with primary focus on the 3D bottle model on mobile devices. Eliminate all scroll-locking issues, implement natural vertical scroll passthrough with horizontal touch rotation, smooth inertial momentum on release, responsive camera framing tailored for portrait displays, tactile 360° scrub controls, and one-thumb formulation swipe navigation.

### R2. UI Design Analysis & Modern Sleek Aesthetics
Audit visual hierarchy, spacing, contrast, and branding cohesion across desktop and mobile. Enforce the modern minimalist Swiss aesthetic with high-contrast obsidian surfaces, sharp typography, and glowing vibrant accents matching the 4 formulations.

### R3. Visual Artistry, Materials & Caustics
Fine-tune procedural bottle glass transmission, 36°F cold condensation droplets, fluid meniscus ripples, ambient caustics, and studio lighting. Ensure liquid color morphing across formulations is fluid and lifelike.

### R4. Accessibility & UX Interface Engineering
Audit and enforce accessibility standards: minimum 44px touch targets across mobile controls, full ARIA roles/labels for the interactive nutrition HUD, keyboard navigation support, and smooth spring micro-interactions without layout shift.

### R5. Codebase Hygiene & Dependency Pruning
Audit `package.json` and prune unused libraries, remove dead imports or unreferenced utilities, verify clean static compilation with `npm run build`, and commit and push all updates to GitHub `origin/master`.

## Acceptance Criteria

### Mobile 3D Model Experience
- [ ] 3D bottle interaction on mobile is completely fluid (60fps), with zero interference to vertical page scrolling
- [ ] Mobile touch drag features physical inertia momentum glide on release
- [ ] 360° scrub dial and swipe gestures allow effortless 1-thumb formula switching
- [ ] Bottle is centered and proportioned across mobile viewports (375px to 430px+) without clipping

### Visual Artistry & Interactive Nutrition HUD
- [ ] Procedural Swiss label, liquid colors, and caustics dynamically update per product
- [ ] Interactive nutrition facts table supports serving toggles (350ml vs 100ml) and expandable cellular bio-mechanism drawers

### Code Quality & Deployment
- [ ] Package manifest cleaned of unused dependencies
- [ ] `npm run build` succeeds with exit code 0 and zero type/lint errors
- [ ] Changes committed and published to remote GitHub repository `origin/master`
