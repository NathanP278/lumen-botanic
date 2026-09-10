# Handoff Report — UI Design Analyst

## 1. Observation
- **Codebase Build & Environment**:
  - `package.json` contains Next.js 14.2.5, React 18.3.1, `@react-three/fiber` 8.16.8, `@react-three/drei` 9.106.0, `three` 0.165.0, `framer-motion` 11.2.10, and `tailwindcss` 3.4.4.
  - Executed `npm run build`:
    ```
    ▲ Next.js 14.2.5
    ✓ Compiled successfully
    Linting and checking validity of types ...
    ✓ Generating static pages (4/4)
    Finalizing page optimization ...
    Route (app)                              Size     First Load JS
    ┌ ○ /                                    59.6 kB         147 kB
    └ ○ /_not-found                          871 B          88.1 kB
    + First Load JS shared by all            87.2 kB
    ```
    Build succeeded with exit code 0 and zero lint/type errors.

- **3D Mobile Touch Handling**:
  - `src/components/ThreeBottleCanvas.tsx:494-506`:
    ```tsx
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
    ```
  - `src/components/ThreeBottleCanvas.tsx:526`:
    `setRotX((prev) => Math.max(-0.5, Math.min(0.75, prev + deltaY * 0.005)));`
    Consumes vertical `deltaY` even when `touchLockedAxisRef.current === "horizontal"`.
  - `src/components/ThreeBottleCanvas.tsx:404-408`:
    ```tsx
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setScrollRotDelta(scrollPos * 0.0018);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    ```
    Sets React state `setScrollRotDelta` on every scroll tick.

- **Inertia Physics**:
  - `src/components/ThreeBottleCanvas.tsx:452`:
    `velocityRef.current *= 0.93;`
    Multiplied once per `requestAnimationFrame` tick without delta time. At 60Hz: $0.93^{30} \approx 0.113$ after 0.5s; at 120Hz: $0.93^{60} \approx 0.012$ after 0.5s.
  - `src/components/ThreeBottleCanvas.tsx:187`:
    `bottleGroupRef.current.rotation.y = THREE.MathUtils.damp(bottleGroupRef.current.rotation.y, targetRotY, dampSpeed, delta);`
    Double-damps the rotation already being decayed in React state.

- **Camera Positioning & Viewport Framing**:
  - `src/components/ThreeBottleCanvas.tsx:576-580`:
    `camera={isMobile ? { position: [0, 0.05, 5.4], fov: 46 } : { position: [0, 0.15, 4.9], fov: 41 }}`
  - Bottle geometry bounds: raw height is 4.46 units (cylinder $3.2$ + shoulder $0.6$ + neck $0.5$ + cap $0.42$). Scaled by mobile scale `1.02` = $4.549$ units.
  - Visible frustum height at $z=5.4$ with $\text{fov}=46^\circ$:
    $2 \times \tan(23^\circ) \times 5.4 = 4.584$ units.
  - Margin: $(4.584 - 4.549) / 2 = 0.017$ units ($<0.4\%$). Any tilt or idle float ($0.035$ units) clips cap and base.

- **A11y Touch Target Sizes**:
  - `src/components/ProductShowcase.tsx:321, 330`:
    `className="w-9 h-9 rounded-full ..."` (chevron buttons = 36px x 36px, fails 44px minimum).
  - `src/components/InteractiveNutritionLabel.tsx:126, 144`:
    `servingMode` buttons use `px-2.5 py-1 text-[11px]` (~26px height, fails 44px minimum).
  - `src/components/InteractiveNutritionLabel.tsx:52`:
    Tab buttons use `py-2 px-2` (~36px height, fails 44px minimum).
  - `src/components/InteractiveNutritionLabel.tsx:280`:
    Close drawer button uses `p-1 rounded` with `w-3.5 h-3.5` icon (~22px hit area, fails 44px minimum).
  - `src/components/InteractiveNutritionLabel.tsx:498`:
    Compare buttons use `w-7 h-7` (28px x 28px, fails 44px minimum).

- **A11y ARIA Attributes**:
  - `InteractiveNutritionLabel.tsx` tabs lack `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, and `role="tabpanel"`.
  - Serving mode toggle lacks `role="radiogroup"`, `role="radio"`, and `aria-checked`.
  - Nutrient rows lack `aria-expanded` and `aria-controls`.

---

## 2. Logic Chain
1. **From Observation 2 to Scroll Conflict**:
   Because `ThreeBottleCanvas.tsx` tilts along X using `deltaY` while `touch-action: pan-y` is set on the container, diagonal finger drags trigger simultaneous browser native scroll and WebGL bottle tilt, producing conflicting motion and stutter.
2. **From Observation 2 to Scroll Dropped Frames**:
   Because `handleScroll` invokes `setScrollRotDelta` on every scroll pixel event, the entire React component subtree re-renders during high-speed vertical scrolling, competing with the browser's compositor thread on mobile CPUs.
3. **From Observation 3 to Inertia Glitch**:
   Because `0.93` is multiplied per frame without delta time, devices with 120Hz displays decay the bottle's velocity 10x faster than 60Hz displays. Because `THREE.MathUtils.damp` dampens the already-decaying `rotY` state, the release feels sluggish rather than physical.
4. **From Observation 4 to Bottle Clipping**:
   Because the camera frustum at $z=5.4$ with $\text{fov}=46^\circ$ provides only 4.584 units of vertical space, while the bottle with mobile scale $1.02$ is 4.549 units, the remaining clearance is 0.035 units (less than 1%). The idle animation alone floats by $\pm 0.035$ units, guaranteeing clipping of the cap or shadow.
5. **From Observation 5 & 6 to A11y Violations**:
   Because chevrons, tabs, and toggles measure 22px–36px in bounding height/width, they fail WCAG 2.5.5 (44px target size). The absence of ARIA attributes prevents screen readers from understanding tab relationships and drawer states.

---

## 3. Caveats
- Production build succeeded with Next.js 14, but runtime browser interactions on physical mobile hardware (iOS Safari vs Android Chrome) should be verified with Chrome DevTools device simulation.
- No source code modifications were performed in this turn (strictly read-only investigation per M1 mandate).

---

## 4. Conclusion
The LUMEN BOTANICA codebase has a solid architectural base with zero compilation errors, but requires focused adjustments across three domains:
1. **Subagent 2 (UI Designer)**: Restructure HUD typography, obsidian surface contrast, segmented 350ml/100ml toggle, and a tactile 360° scrub dial.
2. **Subagent 3 (UI Design Artist)**: Re-engineer 3D mobile touch handling (axis locking, pointer capture, delta-time normalized inertia), reframe mobile camera ($z=5.8, \text{fov}=44^\circ, \text{scale}=0.92$ to eliminate clipping), instanced condensation beads, and formula swipe feedback.
3. **Subagent 4 (UX Interface Analyst Engineer)**: Enforce $\ge 44\text{px}$ touch targets across all mobile interactive elements, implement complete WAI-ARIA roles/states, and keyboard navigation.

---

## 5. Verification Method
1. **Build Verification**:
   Execute: `npm run build`
   Success condition: Exit code 0, 0 TypeScript errors, static pages generated.
2. **Touch & Camera Inspection**:
   - Inspect `src/components/ThreeBottleCanvas.tsx` for camera position `z >= 5.8`, mobile scale `scale <= 0.92`, and `Math.pow(friction, delta * 60)`.
   - Test in Chrome DevTools responsive mode at 375px x 667px (iPhone SE) and 430px x 932px (iPhone 14 Pro Max): ensure $\ge 10\%$ clear margin above cap and below shadow.
3. **A11y Target Inspection**:
   - Inspect `src/components/ProductShowcase.tsx` and `src/components/InteractiveNutritionLabel.tsx` to ensure all buttons satisfy `min-w-[44px] min-h-[44px]`.
