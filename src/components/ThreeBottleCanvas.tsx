"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { JuiceItem } from "@/types/juice";

function createModernLabelTexture(juice: JuiceItem): THREE.CanvasTexture {
  if (typeof window === "undefined") {
    return new THREE.CanvasTexture(document.createElement("canvas"));
  }
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Sleek matte obsidian label
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, 1024, 512);

    // Minimalist hairline perimeter
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, 1024 - 36, 512 - 36);

    // Modern corner registration marks (Swiss tech minimalist)
    const drawCorner = (x: number, y: number, dx: number, dy: number) => {
      ctx.strokeStyle = juice.colors.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y + dy * 16);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dx * 16, y);
      ctx.stroke();
    };
    drawCorner(24, 24, 1, 1);
    drawCorner(1000, 24, -1, 1);
    drawCorner(24, 488, 1, -1);
    drawCorner(1000, 488, -1, -1);

    // Vibrant accent vertical tag
    ctx.fillStyle = juice.colors.accent;
    ctx.fillRect(40, 44, 5, 80);

    // Header metadata
    ctx.fillStyle = juice.colors.accent;
    ctx.font = "700 18px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`// ${juice.sku}  •  ${juice.category.toUpperCase()} FORMULA`, 58, 68);

    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    ctx.font = "500 15px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("HYDRAULIC COLD-PRESS  •  36°F RAW LIVING CELLULAR EXTRACT", 58, 100);

    // Brandmark
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 68px 'Plus Jakarta Sans', sans-serif";
    ctx.letterSpacing = "-1px";
    ctx.fillText("LUMEN", 58, 204);

    // Product Name
    ctx.fillStyle = "#fafafa";
    ctx.font = "700 32px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(juice.name.toUpperCase(), 58, 260);

    // Tagline
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "500 20px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(juice.tagline, 58, 300);

    // Divider line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(58, 335);
    ctx.lineTo(966, 335);
    ctx.stroke();

    // Stats Grid
    ctx.fillStyle = juice.colors.accent;
    ctx.font = "700 17px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(`${juice.stats.coldPressPsi}`, 58, 375);
    ctx.fillText(`${juice.stats.enzymePurity} ENZYMES`, 360, 375);
    ctx.fillText(`${juice.stats.phLevel}`, 670, 375);

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "500 13px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("ZERO HEAT RETAINED", 58, 404);
    ctx.fillText("MICRO-FILTERED 36°F", 360, 404);
    ctx.fillText("OPTIMAL CELLULAR PH", 670, 404);

    // Clean barcode graphic
    const barcodeX = 840;
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    const widths = [3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2];
    let curX = barcodeX;
    for (const w of widths) {
      ctx.fillRect(curX, 150, w, 75);
      curX += w + 2;
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "600 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText("350 ML // 11.8 OZ", barcodeX + 38, 245);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Procedural tactile condensation beads for cold-chain realism
function CondensationDroplets() {
  const count = 36;
  const positions = useMemo(() => {
    const pos: [number, number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2.8;
      const r = 0.94;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const radius = 0.02 + Math.random() * 0.032;
      pos.push([x, y, z, radius]);
    }
    return pos;
  }, []);

  return (
    <group>
      {positions.map(([x, y, z, r], idx) => (
        <mesh key={idx} position={[x, y, z]}>
          <sphereGeometry args={[r, 12, 12]} />
          <meshPhysicalMaterial
            roughness={0.04}
            transmission={0.96}
            ior={1.4}
            color="#FFFFFF"
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

interface BottleProps {
  activeJuice: JuiceItem;
  targetRotY: number;
  targetRotX: number;
  scale: number;
  offsetY?: number;
  isDragging: boolean;
}

function InteractiveJuiceBottle({
  activeJuice,
  targetRotY,
  targetRotX,
  scale,
  offsetY = 0,
  isDragging,
}: BottleProps) {
  const bottleGroupRef = useRef<THREE.Group>(null);
  const liquidMeshRef = useRef<THREE.Mesh>(null);
  const meniscusRef = useRef<THREE.Mesh>(null);

  // Dynamic texture generated per product
  const labelTexture = useMemo(() => {
    return createModernLabelTexture(activeJuice);
  }, [activeJuice]);

  // Target liquid RGB
  const targetRgb = useMemo(() => {
    const col = new THREE.Color(activeJuice.colors.primary);
    return { r: col.r, g: col.g, b: col.b };
  }, [activeJuice.colors.primary]);

  useFrame((state, delta) => {
    if (!bottleGroupRef.current) return;

    // Smooth rotation dampening (snappier during touch drag, silky during release)
    const dampSpeed = isDragging ? 12 : 6;
    bottleGroupRef.current.rotation.y = THREE.MathUtils.damp(
      bottleGroupRef.current.rotation.y,
      targetRotY,
      dampSpeed,
      delta
    );
    bottleGroupRef.current.rotation.x = THREE.MathUtils.damp(
      bottleGroupRef.current.rotation.x,
      targetRotX,
      dampSpeed,
      delta
    );

    // Gentle micro-float when idle
    const idleY = isDragging ? 0 : Math.sin(state.clock.elapsedTime * 1.4) * 0.035;
    bottleGroupRef.current.position.y = THREE.MathUtils.damp(
      bottleGroupRef.current.position.y,
      offsetY + idleY,
      5,
      delta
    );

    // Liquid color smooth transition
    if (liquidMeshRef.current) {
      const liquidMat = liquidMeshRef.current.material as THREE.MeshStandardMaterial;
      if (liquidMat) {
        liquidMat.color.r = THREE.MathUtils.damp(liquidMat.color.r, targetRgb.r, 5, delta);
        liquidMat.color.g = THREE.MathUtils.damp(liquidMat.color.g, targetRgb.g, 5, delta);
        liquidMat.color.b = THREE.MathUtils.damp(liquidMat.color.b, targetRgb.b, 5, delta);
      }
    }

    // Meniscus liquid ripple with agitation from drag speed
    if (meniscusRef.current) {
      const elapsed = state.clock.elapsedTime;
      const meniscusMat = meniscusRef.current.material as THREE.MeshStandardMaterial;
      if (meniscusMat) {
        meniscusMat.color.r = THREE.MathUtils.damp(meniscusMat.color.r, targetRgb.r * 1.1, 5, delta);
        meniscusMat.color.g = THREE.MathUtils.damp(meniscusMat.color.g, targetRgb.g * 1.1, 5, delta);
        meniscusMat.color.b = THREE.MathUtils.damp(meniscusMat.color.b, targetRgb.b * 1.1, 5, delta);
        meniscusRef.current.position.y = 1.37 + Math.sin(elapsed * 2.8) * 0.02;
        meniscusRef.current.rotation.x = -Math.PI / 2 + Math.sin(elapsed * 2.0) * 0.03;
      }
    }
  });

  return (
    <group ref={bottleGroupRef} scale={[scale, scale, scale]}>
      {/* 1. Outer Glass Body with High Transmission and Crisp Specular */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.92, 0.95, 3.2, 48, 1, false]} />
        <meshPhysicalMaterial
          roughness={0.03}
          transmission={0.97}
          thickness={1.4}
          ior={1.52}
          transparent={true}
          opacity={0.92}
          envMapIntensity={2.5}
          color="#ffffff"
          attenuationColor={activeJuice.colors.accent}
          attenuationDistance={2.2}
        />
      </mesh>

      {/* Glass Bottle Shoulder */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.42, 0.92, 0.6, 48]} />
        <meshPhysicalMaterial
          roughness={0.04}
          transmission={0.96}
          thickness={1.3}
          ior={1.52}
          transparent={true}
          opacity={0.9}
          color="#ffffff"
        />
      </mesh>

      {/* Glass Bottle Neck */}
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.4, 0.42, 0.5, 48]} />
        <meshPhysicalMaterial
          roughness={0.05}
          transmission={0.95}
          thickness={1.3}
          ior={1.52}
          transparent={true}
          opacity={0.9}
          color="#ffffff"
        />
      </mesh>

      {/* 2. Tactile 36°F Condensation Beads */}
      <CondensationDroplets />

      {/* 3. Inner Living Cold-Pressed Liquid Mesh */}
      <mesh ref={liquidMeshRef} position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.86, 0.88, 2.9, 48]} />
        <meshStandardMaterial
          color={activeJuice.colors.primary}
          roughness={0.25}
          metalness={0.15}
          transparent={true}
          opacity={0.95}
        />
      </mesh>

      {/* Fluid Meniscus Top */}
      <mesh ref={meniscusRef} position={[0, 1.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.85, 36]} />
        <meshStandardMaterial
          color={activeJuice.colors.primary}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* 4. Modern Procedural Swiss Embossed Label */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry
          args={[0.938, 0.938, 1.72, 48, 1, true, -Math.PI / 2.2, Math.PI / 1.1]}
        />
        <meshStandardMaterial
          map={labelTexture}
          roughness={0.25}
          metalness={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 5. Sleek Precision Matte Titanium/Obsidian Cap */}
      <mesh position={[0, 2.65, 0]} castShadow>
        <cylinderGeometry args={[0.43, 0.43, 0.42, 48]} />
        <meshStandardMaterial
          color="#18181b"
          roughness={0.22}
          metalness={0.9}
        />
      </mesh>

      {/* Tamper Seal Ring */}
      <mesh position={[0, 2.42, 0]}>
        <torusGeometry args={[0.42, 0.03, 16, 48]} />
        <meshStandardMaterial
          color={activeJuice.colors.accent}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Vibrant Ambient Photon Particles */}
      <points>
        <sphereGeometry args={[2.5, 32, 32]} />
        <pointsMaterial
          size={0.022}
          color={activeJuice.colors.accent}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

interface ThreeBottleCanvasProps {
  activeJuice: JuiceItem;
  viewPreset: "front" | "label" | "tilt" | "cap";
  isAutoRotate: boolean;
  onUserInteract?: () => void;
  onSwipeNext?: () => void;
  onSwipePrev?: () => void;
  externalRotY?: number;
  onRotYChange?: (deg: number) => void;
}

export function ThreeBottleCanvas({
  activeJuice,
  viewPreset,
  isAutoRotate,
  onUserInteract,
  onSwipeNext,
  onSwipePrev,
  externalRotY,
  onRotYChange,
}: ThreeBottleCanvasProps) {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Drag interaction state
  const [isDragging, setIsDragging] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchLockedAxisRef = useRef<"horizontal" | "vertical" | null>(null);
  const velocityRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(0.04);
  const [scrollRotDelta, setScrollRotDelta] = useState(0);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    // Scroll-driven rotation linkage
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setScrollRotDelta(scrollPos * 0.0018);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Update target rotation when preset changes
  useEffect(() => {
    if (viewPreset === "front") {
      setRotY(0);
      setRotX(0.04);
    } else if (viewPreset === "label") {
      setRotY(0.25);
      setRotX(0.0);
    } else if (viewPreset === "tilt") {
      setRotY(0.85);
      setRotX(0.24);
    } else if (viewPreset === "cap") {
      setRotY(0.4);
      setRotX(0.72);
    }
  }, [viewPreset]);

  // Sync external scrub dial if provided
  useEffect(() => {
    if (externalRotY !== undefined) {
      setRotY((externalRotY * Math.PI) / 180);
    }
  }, [externalRotY]);

  // Inertia momentum decay loop
  useEffect(() => {
    const updateInertia = () => {
      if (!isDragging && Math.abs(velocityRef.current) > 0.0002) {
        setRotY((prev) => {
          const next = prev + velocityRef.current;
          if (onRotYChange) {
            const deg = ((next * 180) / Math.PI) % 360;
            onRotYChange(deg < 0 ? deg + 360 : deg);
          }
          return next;
        });
        velocityRef.current *= 0.93; // smooth friction decay
      }
      animFrameRef.current = requestAnimationFrame(updateInertia);
    };

    animFrameRef.current = requestAnimationFrame(updateInertia);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDragging, onRotYChange]);

  // Auto-rotation when active and user is not touching
  useEffect(() => {
    if (!isAutoRotate || isDragging) return;
    const interval = setInterval(() => {
      setRotY((prev) => {
        const next = prev + 0.009;
        if (onRotYChange) {
          const deg = ((next * 180) / Math.PI) % 360;
          onRotYChange(deg < 0 ? deg + 360 : deg);
        }
        return next;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [isAutoRotate, isDragging, onRotYChange]);

  // Pointer / Touch Handlers optimized for mobile without blocking page scroll
  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    touchLockedAxisRef.current = null;
    velocityRef.current = 0;
    if (onUserInteract) onUserInteract();
  };

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
      const now = performance.now();
      const dt = Math.max(1, now - touchStartRef.current.time);
      const sensitivity = isMobile ? 0.012 : 0.009;
      const step = deltaX * sensitivity;

      velocityRef.current = step * 0.45; // Store velocity for inertia

      setRotY((prev) => {
        const next = prev + step;
        if (onRotYChange) {
          const deg = ((next * 180) / Math.PI) % 360;
          onRotYChange(deg < 0 ? deg + 360 : deg);
        }
        return next;
      });

      // Subtle vertical tilt response
      setRotX((prev) => Math.max(-0.5, Math.min(0.75, prev + deltaY * 0.005)));

      touchStartRef.current = { x: e.clientX, y: e.clientY, time: now };
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (touchStartRef.current && isDragging) {
      // Swipe gesture check (quick flick)
      const now = performance.now();
      const dt = now - touchStartRef.current.time;
      const totalDx = e.clientX - touchStartRef.current.x;
      if (dt < 250 && Math.abs(totalDx) > 60) {
        if (totalDx < 0 && onSwipeNext) onSwipeNext();
        if (totalDx > 0 && onSwipePrev) onSwipePrev();
      }
    }
    setIsDragging(false);
    touchStartRef.current = null;
    touchLockedAxisRef.current = null;
  };

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950/40 rounded-3xl border border-white/10">
        <div className="text-center p-6">
          <p className="font-sans font-bold text-xl text-white">{activeJuice.name}</p>
          <p className="text-xs text-zinc-400 mt-2">Interactive 3D preview requires WebGL</p>
        </div>
      </div>
    );
  }

  // Final combined rotation including smooth scroll reactive offset
  const finalRotY = rotY + scrollRotDelta;
  const finalRotX = rotX;

  return (
    <div
      className={`w-full h-full relative select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{ touchAction: "pan-y" }} // Crucial for smooth mobile vertical page scroll!
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas
        camera={
          isMobile
            ? { position: [0, 0.05, 5.4], fov: 46 }
            : { position: [0, 0.15, 4.9], fov: 41 }
        }
        dpr={isMobile ? [1, 1.5] : [1, 2]} // High performance 60fps on mobile screens
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        className="w-full h-full"
      >
        <ambientLight intensity={1.5} />

        {/* Dynamic Studio Key Light */}
        <directionalLight
          position={[4, 6, 4]}
          intensity={2.8}
          color="#ffffff"
          castShadow
        />

        {/* Dynamic Colorful Rim Light matching active juice */}
        <directionalLight
          position={[-4, 2, -2]}
          intensity={2.2}
          color={activeJuice.colors.accent}
        />

        {/* Top Rim Spotlight */}
        <spotLight
          position={[0, 7, 2]}
          intensity={3.2}
          angle={0.55}
          penumbra={0.8}
          color="#ffffff"
        />

        <Float
          speed={isDragging ? 0 : 1.6}
          rotationIntensity={isDragging ? 0 : 0.15}
          floatIntensity={isDragging ? 0 : 0.25}
        >
          <InteractiveJuiceBottle
            activeJuice={activeJuice}
            targetRotY={finalRotY}
            targetRotX={finalRotX}
            scale={isMobile ? 1.02 : 1.28}
            offsetY={isMobile ? -0.08 : 0}
            isDragging={isDragging}
          />
        </Float>

        <ContactShadows
          position={[0, isMobile ? -2.0 : -2.3, 0]}
          opacity={0.55}
          scale={isMobile ? 5.5 : 6.5}
          blur={2.6}
          far={3.8}
          color="#000000"
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
