# Comprehensive UI & 3D Architecture Audit — LUMEN BOTANICA
**Author**: UI Design Analyst (Explorer)
**Date**: 2026-09-10
**Workspace Root**: `c:\Users\Nathan\Desktop\coding-proj-2`
**Target Milestone**: M1 (UI Design Analysis)

---

## Executive Summary
LUMEN BOTANICA is an interactive cold-pressed botanical application built with Next.js 14, React 18, Tailwind CSS, Framer Motion, and Three.js / React Three Fiber (`@react-three/fiber` + `@react-three/drei`). The codebase is clean, well-architected, and statically compiles with 0 errors (`npm run build` exits with code 0). 

However, this audit reveals critical friction points on mobile devices (375px–430px+):
1. **Mobile 3D Touch Interference & Scroll Locking**: `touch-action: pan-y` is applied on the container, but lack of pointer capture, flawed axis-locking thresholding (`Math.abs(delta) > 7`), and a per-scroll React state setter (`window.scrollY * 0.0018`) cause touch stutter, diagonal drag fighting, and thread contention.
2. **Inertia Physics & Double Dampening**: Friction decay is hardcoded per frame (`0.93`) without delta-time normalization (decaying 2x faster on 120Hz ProMotion displays than 60Hz), while the 3D bottle mesh applies a secondary dampener (`THREE.MathUtils.damp`), producing a sluggish, gummy release rather than a crisp physical momentum glide.
3. **Mobile Viewport Camera Clipping**: On 375px portrait viewports, the bottle's vertical bounding span (4.55 world units) almost completely occupies the camera's visible frustum height (4.58 units at z=5.4, fov=46°), leaving less than 0.3% vertical clearance. Any tilt angle, idle micro-float, or drag immediately causes the cap or shadow to clip outside the canvas boundary.
4. **Touch Target Sizing Violations (< 44px)**: Chevron navigation buttons (`w-9 h-9` = 36px), 350ml/100ml toggles (~26px), view preset buttons (~32px), formula compare buttons (28px), and drawer close buttons (22px) violate WCAG 2.5.5 / 2.5.8 accessibility standards.
5. **HUD Semantics & Swiss Aesthetic**: The interactive nutrition HUD lacks WAI-ARIA tablist/radio roles, while the 360° scrub dial is currently an un-styled HTML `<input type="range">` rather than an obsidian tactile dial.

---

## 1. Codebase Reconnaissance & Architecture Map

### 1.1 Dependency & Build Assessment
- **Framework**: Next.js 14.2.5 (App Router, static prerendering).
- **Core Dependencies**:
  - `three` (`^0.165.0`), `@react-three/fiber` (`^8.16.8`), `@react-three/drei` (`^9.106.0`)
  - `framer-motion` (`^11.2.10`)
  - `lucide-react` (`^0.395.0`)
  - `clsx` (`^2.1.1`), `tailwind-merge` (`^2.3.0`)
  - `tailwindcss` (`^3.4.4`), `postcss` (`^8.4.38`), `autoprefixer` (`^10.4.19`)
- **Compilation Health**: Verified via `npm run build`:
  - Static generation: 4/4 pages successfully prerendered (`/`, `/_not-found`).
  - First load JS shared by all: 87.2 kB (well within performance budget < 120 kB).
  - Exit code: 0, 0 type errors, 0 ESLint warnings.

### 1.2 File Tree & Component Map
```
src/
├── app/
│   ├── globals.css                # Obsidian root variables, custom scrollbars, .modern-glass, .bg-grid-pattern
│   ├── layout.tsx                 # Google Fonts (Plus Jakarta Sans, Inter, JetBrains Mono), SEO metadata
│   └── page.tsx                   # Top-level state (activeJuice, scrollYProgress indicator), section layout
├── components/
│   ├── BottleCanvasWrapper.tsx    # Next.js dynamic import wrapper for ThreeBottleCanvas (ssr: false, spinner fallback)
│   ├── ThreeBottleCanvas.tsx      # R3F Canvas, procedural bottle, shaders, lighting, pointer/touch handlers, inertia loop
│   ├── ProductShowcase.tsx        # 4-formula matrix tabs, 3-column layout (Dossier, 3D Canvas, Nutrition HUD), comparison table
│   ├── InteractiveNutritionLabel.tsx # Swiss HUD, 3 tabs (Facts/Bioactives/Lab), 350ml vs 100ml toggle, deep-dive drawers
│   ├── Navbar.tsx                 # Sticky obsidian navbar, live cold-chain telemetry pill, formula switcher
│   ├── PhilosophySection.tsx      # 3 technology pillars (15,000 PSI, 36°F Cleanroom, Pure Glass Seal)
│   └── Footer.tsx                 # Atelier footer, formula index, research dispatch subscription form
├── data/
│   └── juices.ts                  # 4 formulations (Chlorophyll Verdant, Solar Curcumin, Blood Root, Obsidian Purifier)
└── types/
    └── juice.ts                   # TypeScript interfaces (JuiceItem, NutrientItem, BioactiveCompound, DetailedNutrition)
```

---

## 2. 3D Mobile Experience Audit (R1)

### 2.1 Pointer / Touch Event Handling & Scroll Interference
**File**: `src/components/ThreeBottleCanvas.tsx:479-546`

#### Observed Code:
```tsx
const handlePointerMove = (e: React.PointerEvent) => {
  if (!touchStartRef.current) return;
  const deltaX = e.clientX - touchStartRef.current.x;
  const deltaY = e.clientY - touchStartRef.current.y;

  // Axis disambiguation on touch devices
  if (!touchLockedAxisRef.current) {
    if (Math.abs(deltaX) > 7 || Math.abs(deltaY) > 7) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        touchLockedAxisRef.current = "horizontal";
        setIsDragging(true);
      } else {
        touchLockedAxisRef.current = "vertical";
        return; // Let native vertical scroll occur!
      }
    } else {
      return;
    }
  }

  if (touchLockedAxisRef.current === "horizontal") {
    // ... rotates rotY and adjusts rotX ...
  }
};
```

#### Defects Identified:
1. **Absence of Pointer Capture**:
   - `e.currentTarget.setPointerCapture(e.pointerId)` is never invoked. On iOS WebKit and Android Chrome, if the user drags horizontally and their finger leaves the canvas boundary, the browser terminates the gesture via `pointercancel` or abruptly loses track of pointer delta.
   - When `touchLockedAxisRef.current === "horizontal"`, pointer capture should be locked to the container. If locked to `"vertical"`, pointer capture should be explicitly released and events passed through.
2. **Diagonal Gesture Conflict**:
   - In line 526: `setRotX((prev) => Math.max(-0.5, Math.min(0.75, prev + deltaY * 0.005)));`
   - Even though the axis was locked to `"horizontal"`, the code continues to consume `deltaY` to tilt the bottle along X. On mobile browsers with `touch-action: pan-y`, this dual consumption creates conflict: the browser attempts to scroll the page vertically while WebGL tilts the bottle, creating stutter and erratic frame pacing.
3. **Dead-Zone Latch & Ambiguity**:
   - The 7px threshold (`Math.abs(delta) > 7`) delays gesture recognition. During this initial 7px travel, native scrolling is delayed. If the user makes an initial flick, this lag feels unresponsive.
4. **Scroll-Driven State Re-render Overhead**:
   - Lines 404-408:
     ```tsx
     const handleScroll = () => {
       const scrollPos = window.scrollY;
       setScrollRotDelta(scrollPos * 0.0018);
     };
     ```
   - Every scroll event triggers `setScrollRotDelta`, forcing a React component re-render of `ThreeBottleCanvas` at 60-120Hz. On mobile CPU/GPU, this causes frame drops. This value should be stored in a `useRef` and applied directly in `useFrame`, completely bypassing React component re-renders.

### 2.2 Physics, Velocity Tracking & Inertia Momentum Glide
**File**: `src/components/ThreeBottleCanvas.tsx:441-461, 514`

#### Observed Code:
```tsx
// Inside handlePointerMove (line 514):
velocityRef.current = step * 0.45;

// Inside useEffect inertia decay loop (lines 441-461):
const updateInertia = () => {
  if (!isDragging && Math.abs(velocityRef.current) > 0.0002) {
    setRotY((prev) => {
      const next = prev + velocityRef.current;
      // ...
      return next;
    });
    velocityRef.current *= 0.93; // smooth friction decay
  }
  animFrameRef.current = requestAnimationFrame(updateInertia);
};
```

#### Defects Identified:
1. **Single-Sample Velocity Flaw**:
   - `velocityRef.current` only records `step * 0.45` from the very last pointer move event. If a user drags rapidly and pauses their finger stationary for 60ms before releasing, `velocityRef.current` still holds the high velocity from the previous move event, causing an unwanted violent spin upon release.
   - True physical inertia requires an exponential moving average (EMA) or a timestamped 3-sample sliding buffer `(x, t)` to calculate instantaneous release velocity `dx / dt`.
2. **Refresh Rate Dependency (Non-Normalized Friction)**:
   - `0.93` friction is applied per `requestAnimationFrame` tick.
   - On a 60Hz screen (standard mobile): after 0.5s (30 frames), remaining velocity = $0.93^{30} \approx 0.113$ (11.3%).
   - On a 120Hz screen (iPhone ProMotion / Samsung Galaxy S23): after 0.5s (60 frames), remaining velocity = $0.93^{60} \approx 0.012$ (1.2%).
   - The bottle stops almost instantaneously on 120Hz screens. The decay factor must be normalized using delta time: `Math.pow(0.93, delta * 60)`.
3. **Double-Damping (React State + Three.js damp)**:
   - In line 444, React state `rotY` decays frame-by-frame.
   - In line 187, `InteractiveJuiceBottle` applies:
     `bottleGroupRef.current.rotation.y = THREE.MathUtils.damp(bottleGroupRef.current.rotation.y, targetRotY, dampSpeed, delta);`
   - Damping an already decaying target creates a rubbery, sluggish response.

### 2.3 Mobile Camera Positioning, FOV, and Aspect Ratio
**File**: `src/components/ThreeBottleCanvas.tsx:576-580`, `src/components/ProductShowcase.tsx:300`

#### Mathematical Frustum Analysis:
- Container dimensions on mobile: `w-full h-[400px]`.
- On iPhone SE / 13 mini (375px screen width, 343px inner container width):
  - Canvas Aspect Ratio: $W / H = 343 / 400 = 0.8575$.
- Camera settings in code: `position: [0, 0.05, 5.4]`, `fov: 46°` (vertical FOV).
- Visible Frustum Height at bottle center ($z=0$):
  $$H_{\text{visible}} = 2 \times \tan\left(\frac{46^\circ}{2}\right) \times 5.4 = 2 \times 0.42447 \times 5.4 \approx 4.584 \text{ world units}$$
- Visible Frustum Width at $z=0$:
  $$W_{\text{visible}} = H_{\text{visible}} \times \text{Aspect} = 4.584 \times 0.8575 \approx 3.931 \text{ world units}$$
- Bottle Geometry Bounding Dimensions:
  - Base to cap: from $y = -1.6$ to $y = 2.86$ $\rightarrow$ raw height $= 4.46$ units.
  - With mobile scale $= 1.02$ $\rightarrow$ scaled height $= 4.46 \times 1.02 = 4.549$ units.
  - Vertical clearance: $4.584 - 4.549 = 0.035$ units total (top + bottom margin $= 0.017$ units, or **0.37%**!).
- **Impact**:
  - The cap and bottom contact shadow clip out of frame whenever the bottle tilts or floats (`idleY = 0.035`).
  - On 375px screens, the bottle occupies 99.2% of the vertical viewport.
- **Specification for Fix**:
  - Increase camera distance to $z = 5.8$ or reduce mobile bottle scale to $0.90 - 0.92$.
  - Adjust vertical FOV to $44^\circ$.
  - At $z = 5.8$, $H_{\text{visible}} = 2 \times \tan(22^\circ) \times 5.8 = 4.686$ units.
  - At scale $0.92$, bottle height $= 4.103$ units $\rightarrow$ clearance $= 0.583$ units (**12.5% safety margin**).

### 2.4 Tactile 360° Scrub Dial & 1-Thumb Formula Swipe
- **Current Scrub Dial** (`ProductShowcase.tsx:373-386`):
  - Standard `<input type="range" min="0" max="360">`.
  - Hit area is narrow (~20px thumb), stops at hard stops (0° and 360°) with no continuous wrapping or rotational dial ergonomics.
  - Solution: Bespoke tactile horizontal scrub strip with tick marks at 0°, 90°, 180°, 270°, infinite wrapping (`rotDeg % 360`), and snap targets.
- **Current Formula Swipe** (`ThreeBottleCanvas.tsx:534-542`):
  - Rigid threshold: `dt < 250 && Math.abs(totalDx) > 60` on `pointerup`.
  - Zero drag displacement feedback: during the swipe, the bottle only rotates on Y rather than displaying a carousel translation or color pre-fade.
  - Solution: Provide directional translation feedback ($\pm 20\text{px}$) during horizontal flick and trigger formula transition with haptic-like spring physics.

---

## 3. Visual Artistry & Swiss Aesthetic Audit (R2 & R3)

### 3.1 Typography & Obsidian Surface Hierarchy
- **Font Stack**:
  - Headings & Branding: `Plus Jakarta Sans` (weights 300 to 800) with `-0.04em` tracking.
  - Data / Technical HUD: `JetBrains Mono` is loaded in `layout.tsx`, but missing from `tailwind.config.ts` `mono` family array (`ui-monospace, SFMono-Regular...`). Must add `"JetBrains Mono"` to lead the mono font list.
- **Obsidian Color Palette**:
  - Root: `#09090b` (obsidian black).
  - Cards: `bg-zinc-900/60` (`#18181b` at 60% opacity) with `backdrop-blur-xl`.
  - Borders: `border-white/10` hairline rules.
  - Contrast check: Text at `text-[10px] text-zinc-400` on `#09090b` has a contrast ratio of ~6.3:1 (passes AA), but `text-zinc-500` in badges drops below 4.5:1. Must elevate secondary captions to `#d4d4d8` (zinc-300).

### 3.2 4 Formulation Color Palettes
| Formulation | ID / SKU | Category | Primary (Liquid) | Accent (Glow/Tag) | Contrast Text | Visual Identity |
|:---|:---|:---|:---|:---|:---|:---|
| **Verdant** | `LB-01-VLD` | Cleanse | `#10B981` (Emerald) | `#4ADE80` (Neon) | `#052e16` | Living Chlorophyll, alkaline, fresh |
| **Sol** | `LB-02-GLD` | Immunity | `#F59E0B` (Amber) | `#FBBF24` (Gold) | `#451a03` | Solar Curcumin, warm rhizome, radiant |
| **Aura** | `LB-03-RBY` | Energy | `#F43F5E` (Ruby) | `#FB7185` (Rose) | `#4c0519` | Blood Root, beetroot nitric, visceral |
| **Void** | `LB-04-BLK` | Detox | `#8B5CF6` (Violet) | `#A855F7` (Ultraviolet) | `#2e1065` | Obsidian Purifier, steam carbon, mineral |

*Audit Finding on "Void"*: Currently `#8B5CF6` gives a purple liquid appearance. The product represents steam-activated coconut carbon in volcanic mineral spring water. Enhancing the body material with a smoky carbon obsidian undertone and bright ultraviolet rim/accent highlights aligns with the luxury aesthetic.

### 3.3 Shaders, Materials, Condensation & Caustics
1. **Bottle Glass Transmission**:
   - Current: `roughness={0.03}`, `transmission={0.97}`, `thickness={1.4}`, `ior={1.52}`.
   - Glass formulation is physically accurate for soda-lime glass ($n = 1.52$).
   - Improvement: Enable chromatic dispersion (`dispersion: 0.015` in Three.js) or specular chromatic fringe on shoulder geometry for photorealistic luxury studio glass.
2. **36°F Condensation Beads**:
   - Current: 36 individual `<mesh>` instances inside a map loop with individual `meshPhysicalMaterial`.
   - **Performance Issue**: 36 separate draw calls for complex transmission materials create a GPU fill-rate hotspot on mobile devices.
   - Improvement: Convert to an `InstancedMesh` with 40-50 beads varying between $r=0.015$ and $r=0.04$, reducing 36 draw calls to 1 single instanced draw call.
3. **Fluid Meniscus Ripples**:
   - Current: 2D flat disc with simple sine wave oscillation.
   - Improvement: Modulate ripple frequency and tilt by touch drag velocity (`velocityRef.current`) so the liquid ripples dynamically in response to finger agitation.
4. **Ambient Caustics**:
   - Current: Pure black `ContactShadows` (`color="#000000"`).
   - Improvement: Add an additive caustic projection disc beneath the bottle that matches `activeJuice.colors.accent` at 30% opacity, simulating light passing through cold liquid glass onto the obsidian stage.

---

## 4. Interactive HUD & Accessibility Audit (R4)

### 4.1 Touch Target Sizing (WCAG 2.5.5 / 2.5.8 >= 44px)
Every interactive element was measured for mobile compliance:

| Component | Element | Current Dimensions | WCAG Status | Required Fix |
|:---|:---|:---|:---|:---|
| `ProductShowcase.tsx` | Previous/Next Chevrons | 36px x 36px (`w-9 h-9`) | **FAIL** (<44px) | Change to `w-11 h-11` (44px) with 44px bounding box |
| `ProductShowcase.tsx` | View Preset Buttons (x4) | ~32px height (`py-2`) | **FAIL** (<44px) | Set `min-h-[44px]` and `py-2.5` |
| `ProductShowcase.tsx` | Auto-Spin Button | ~24px height (`py-1`) | **FAIL** (<44px) | Increase padding to `py-2.5 px-3.5` (`min-h-[44px]`) |
| `ProductShowcase.tsx` | 360° Orbit Range Slider | ~20px thumb height | **FAIL** (<44px) | Wrap in 48px touch-target track container |
| `InteractiveNutritionLabel.tsx` | Tab Switcher Buttons (x3) | ~36px height (`py-2`) | **FAIL** (<44px) | Set `min-h-[44px]` with `py-3` |
| `InteractiveNutritionLabel.tsx` | 350ml vs 100ml Toggle | ~26px height (`py-1`) | **FAIL** (<44px) | Expand button padding to `py-2.5 px-3` (`min-h-[44px]`) |
| `InteractiveNutritionLabel.tsx` | Nutrient Item Rows | `min-h-[44px]` | **PASS** (>=44px) | Maintain current compliant sizing |
| `InteractiveNutritionLabel.tsx` | Close Drawer `<X>` Button | ~22px x 22px | **FAIL** (<44px) | Add `p-3` hit area to achieve 44px x 44px |
| `InteractiveNutritionLabel.tsx` | Formulation Compare Chips | 28px x 28px (`w-7 h-7`) | **FAIL** (<44px) | Change to `w-11 h-11` or add transparent hit padding |

### 4.2 ARIA Roles, States, and Landmark Semantics
1. **Nutrition Tab Switcher**:
   - Container missing `role="tablist"` and `aria-label="Nutrition information tabs"`.
   - Buttons missing `role="tab"`, `aria-selected={activeTab === tab.id}`, and `aria-controls={`panel-${tab.id}`}`.
   - Tab panels missing `role="tabpanel"`, `id={`panel-${tab.id}`}`, and `aria-labelledby={`tab-${tab.id}`}`.
2. **Serving Size Mode Toggle**:
   - Container missing `role="radiogroup"` and `aria-label="Serving size"`.
   - Buttons missing `role="radio"` and `aria-checked={servingMode === "bottle"}`.
3. **Expandable Bio-Mechanism Drawers**:
   - Row buttons missing `aria-expanded={isSelected}` and `aria-controls={`mechanism-${n.id}`}`.
   - Drawer container missing `id={`mechanism-${n.id}`}` and `role="region"`.
4. **Interactive 3D Canvas Stage**:
   - Canvas wrapper missing `role="region"` and `aria-label="Interactive 3D bottle viewer"`.

### 4.3 Keyboard Navigation & Focus Ring Standards
- Ensure all interactive buttons have explicit `focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none`.
- Enable Arrow Left / Arrow Right cycling across nutrition tabs and serving size toggles.
- Enable `Escape` key listener to dismiss open nutrient deep-dive drawers and mobile navigation drawer.

---

## 5. Actionable Roadmap & Work Distribution

### 5.1 Subagent 2: UI Designer (Layout, Obsidian HUD, Swiss Typography)
- **Target Files**:
  - `src/components/InteractiveNutritionLabel.tsx`
  - `src/components/ProductShowcase.tsx`
  - `tailwind.config.ts`
- **Deliverables**:
  1. Restructure Nutrition HUD with strict Swiss grid lines (`.nutrition-rule-thick`, `.nutrition-rule-thin`), high-contrast typography, and expandable cellular bio-mechanism drawers.
  2. Implement obsidian segmented toggle for serving size (350ml vs 100ml) with smooth layout spring animation.
  3. Replace native range slider with an obsidian tactile scrub bar / dial featuring tick marks and degree indicators.
  4. Integrate `JetBrains Mono` into font configuration and calibrate contrast ratios to exceed WCAG AA standards.

### 5.2 Subagent 3: UI Design Artist (3D Shaders, Physics, Mobile Viewport Framing)
- **Target Files**:
  - `src/components/ThreeBottleCanvas.tsx`
  - `src/components/BottleCanvasWrapper.tsx`
- **Deliverables**:
  1. Overhaul pointer/touch event handling:
     - Implement clean axis disambiguation: horizontal touch initiates rotation, vertical touch seamlessly passes through to window scroll.
     - Add `setPointerCapture` during horizontal drag.
     - Move scroll-driven rotation calculation to `useFrame` using refs, eliminating React component re-renders.
  2. Normalize inertia momentum decay using delta time (`Math.pow(0.93, delta * 60)`) and 3-point velocity history buffer to ensure natural momentum release on both 60Hz and 120Hz mobile devices.
  3. Reframe mobile camera ($z = 5.8$, $\text{fov} = 44^\circ$, bottle scale $= 0.92$) to eliminate bottle cap and shadow clipping across 375px to 430px+ screens.
  4. Upgrade visual shaders:
     - Convert condensation droplets to `InstancedMesh` for 60fps mobile rendering.
     - Couple meniscus ripples to drag velocity.
     - Add colored caustics ring matching the active formulation.
  5. Implement 1-thumb formula swipe gesture with physical translation feedback.

### 5.3 Subagent 4: UX Interface Analyst Engineer (A11y, Touch Targets, Micro-Interactions)
- **Target Files**:
  - `src/components/InteractiveNutritionLabel.tsx`
  - `src/components/ProductShowcase.tsx`
  - `src/components/Navbar.tsx`
- **Deliverables**:
  1. Enforce minimum 44px x 44px touch targets across all mobile buttons, tabs, chevrons, and toggles.
  2. Inject complete WAI-ARIA tablist, radiogroup, disclosure, and region attributes.
  3. Implement keyboard arrow navigation and Escape key dismissal for drawers.
  4. Verify zero Cumulative Layout Shift (CLS < 0.05) and spring micro-interaction stability.

---

## 6. Verification & Invalidation Criteria
- **Independent Verification Commands**:
  - Build check: `npm run build` (must compile with 0 errors).
  - Runtime check: Verify DOM structure and responsive viewport at 375px width in Chrome DevTools.
- **Invalidation Conditions**:
  - Vertical page scrolling is blocked or delayed when touching the 3D bottle on mobile.
  - The bottle cap or base shadow clips outside the canvas box on a 375px width viewport.
  - Any interactive button has a touch bounding box smaller than 44px.
