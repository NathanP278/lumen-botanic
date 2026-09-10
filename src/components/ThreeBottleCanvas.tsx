"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { JuiceItem } from "@/types/juice";

// ============================================================================
// 1. Procedural Swiss Label Texture Generator
// ============================================================================
function createModernLabelTexture(juice: JuiceItem): THREE.CanvasTexture {
  if (typeof window === "undefined") {
    return new THREE.CanvasTexture(document.createElement("canvas"));
  }
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Sleek matte obsidian label base
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
    ctx.fillText(
      `// ${juice.sku}  •  ${(juice.formulaCode || juice.category).toUpperCase()} FORMULA`,
      58,
      68
    );

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

// ============================================================================
// 2. 36°F Cold Condensation Droplets (InstancedMesh - Single Draw Call)
// ============================================================================
const DROPLET_COUNT = 140;

function InstancedCondensationDroplets() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const rCylinder = 0.938;

    // Deterministic pseudo-random seed generator for stable droplet layout
    let seed = 42;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < DROPLET_COUNT; i++) {
      // Angular position around cylindrical glass
      const angle = pseudoRandom() * Math.PI * 2;
      // Vertical distribution along cold liquid zone (-1.3 to +1.4)
      const y = (pseudoRandom() - 0.5) * 2.7;

      const x = Math.cos(angle) * rCylinder;
      const z = Math.sin(angle) * rCylinder;

      dummy.position.set(x, y, z);

      // Orient droplet dome outward along surface normal
      dummy.rotation.set(0, -angle + Math.PI / 2, 0);

      // Droplet radius: varied from micro-mist (0.012) to cold beads (0.038)
      const r = 0.012 + pseudoRandom() * 0.026;
      // Flatten droplet slightly against glass surface normal (contact angle)
      dummy.scale.set(r * 0.6, r, r);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, DROPLET_COUNT]}>
      <sphereGeometry args={[1, 14, 14]} />
      <meshPhysicalMaterial
        roughness={0.02}
        transmission={0.98}
        ior={1.333} // Pure water refractive index
        thickness={0.35}
        color="#ffffff"
        transparent={true}
        opacity={0.94}
        envMapIntensity={2.4}
      />
    </instancedMesh>
  );
}

// ============================================================================
// 3. Ambient Caustics Ground Projection Ring
// ============================================================================
const causticsVertexShader = `
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const causticsFragmentShader = `
  varying vec2 vUv;
  varying vec3 vPos;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uIntensity;

  float causticsPattern(vec2 uv, float time) {
    vec2 p = (uv - 0.5) * 10.0;
    float c = 0.0;
    for (int i = 1; i <= 3; i++) {
      float fi = float(i);
      p += vec2(
        sin(p.y * 1.6 + time * 0.7 + fi) * 0.35,
        cos(p.x * 1.6 + time * 0.7 + fi) * 0.35
      );
      c += 1.0 / length(vec2(
        sin(p.x + time * 0.5),
        cos(p.y + time * 0.5)
      ) * 4.0);
    }
    return clamp(c * 0.16, 0.0, 1.5);
  }

  void main() {
    vec2 centered = vUv - 0.5;
    float dist = length(centered) * 2.0;

    // Ring band concentrated directly beneath glass perimeter
    float ring = smoothstep(0.15, 0.45, dist) * smoothstep(1.0, 0.65, dist);
    float pattern = causticsPattern(vUv, uTime);
    float alpha = ring * pattern * uIntensity;

    gl_FragColor = vec4(uColor * 1.25, alpha * 0.65);
  }
`;

interface CausticsGroundProps {
  accentColor: string;
  positionY: number;
}

function CausticsGround({ accentColor, positionY }: CausticsGroundProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const targetColRef = useRef(new THREE.Color(accentColor));
  const currColRef = useRef(new THREE.Color(accentColor));

  useEffect(() => {
    targetColRef.current.set(accentColor);
  }, [accentColor]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(accentColor) },
      uIntensity: { value: 1.0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    currColRef.current.lerp(targetColRef.current, delta * 5.0);
    matRef.current.uniforms.uColor.value.copy(currColRef.current);
  });

  return (
    <mesh position={[0, positionY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.2, 2.2, 48]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={causticsVertexShader}
        fragmentShader={causticsFragmentShader}
        uniforms={uniforms}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ============================================================================
// 4. Interactive 3D Juice Bottle Model & Shaders
// ============================================================================
interface BottleSceneProps {
  activeJuice: JuiceItem;
  currentRotYRef: React.MutableRefObject<number>;
  currentRotXRef: React.MutableRefObject<number>;
  rotVelocityRef: React.MutableRefObject<number>;
  scrollOffsetRef: React.MutableRefObject<number>;
  isDraggingRef: React.MutableRefObject<boolean>;
  scale: number;
  offsetY: number;
}

function InteractiveJuiceBottle({
  activeJuice,
  currentRotYRef,
  currentRotXRef,
  rotVelocityRef,
  scrollOffsetRef,
  isDraggingRef,
  scale,
  offsetY,
}: BottleSceneProps) {
  const bottleGroupRef = useRef<THREE.Group>(null);
  const liquidMeshRef = useRef<THREE.Mesh>(null);
  const meniscusRef = useRef<THREE.Mesh>(null);
  const outerGlassRef = useRef<THREE.Mesh>(null);
  const tamperSealRef = useRef<THREE.Mesh>(null);
  const sloshTiltRef = useRef(0);

  // Dynamic label texture generated per product
  const labelTexture = useMemo(() => {
    return createModernLabelTexture(activeJuice);
  }, [activeJuice]);

  useEffect(() => {
    return () => {
      labelTexture.dispose();
    };
  }, [labelTexture]);

  // Color lerping targets for fluid formulation transitions
  const targetPrimaryRef = useRef(new THREE.Color(activeJuice.colors.primary));
  const currentPrimaryRef = useRef(new THREE.Color(activeJuice.colors.primary));
  const targetAccentRef = useRef(new THREE.Color(activeJuice.colors.accent));
  const currentAccentRef = useRef(new THREE.Color(activeJuice.colors.accent));

  useEffect(() => {
    targetPrimaryRef.current.set(activeJuice.colors.primary);
    targetAccentRef.current.set(activeJuice.colors.accent);
  }, [activeJuice.colors.primary, activeJuice.colors.accent]);

  useFrame((state, delta) => {
    if (!bottleGroupRef.current) return;

    // Apply rotation directly from physics refs with ZERO double-damping!
    bottleGroupRef.current.rotation.y =
      currentRotYRef.current + scrollOffsetRef.current;
    bottleGroupRef.current.rotation.x = currentRotXRef.current;

    // Gentle living micro-float when idle
    const isDrag = isDraggingRef.current;
    const idleY = isDrag ? 0 : Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    bottleGroupRef.current.position.y = offsetY + idleY;

    // Fluid liquid color morphing across formula switches
    currentPrimaryRef.current.lerp(targetPrimaryRef.current, delta * 5.0);
    currentAccentRef.current.lerp(targetAccentRef.current, delta * 5.0);

    // Inner liquid material
    if (liquidMeshRef.current) {
      const mat = liquidMeshRef.current.material as THREE.MeshStandardMaterial;
      if (mat) mat.color.copy(currentPrimaryRef.current);
    }

    // Outer glass attenuation color matching formulation
    if (outerGlassRef.current) {
      const mat = outerGlassRef.current.material as THREE.MeshPhysicalMaterial;
      if (mat) mat.attenuationColor.copy(currentAccentRef.current);
    }

    // Tamper seal ring
    if (tamperSealRef.current) {
      const mat = tamperSealRef.current.material as THREE.MeshStandardMaterial;
      if (mat) mat.color.copy(currentAccentRef.current);
    }

    // Dynamic meniscus ripple & centrifugal sloshing
    if (meniscusRef.current) {
      const v = rotVelocityRef.current;
      sloshTiltRef.current = THREE.MathUtils.damp(
        sloshTiltRef.current,
        -v * 0.02,
        6.0,
        delta
      );

      const elapsed = state.clock.elapsedTime;
      meniscusRef.current.rotation.x =
        -Math.PI / 2 + sloshTiltRef.current + Math.sin(elapsed * 2.8) * 0.015;
      meniscusRef.current.rotation.y = Math.cos(elapsed * 2.0) * 0.012;
      meniscusRef.current.position.y = 1.255 + Math.sin(elapsed * 3.2) * 0.008;

      const mat = meniscusRef.current.material as THREE.MeshPhysicalMaterial;
      if (mat) mat.color.copy(currentPrimaryRef.current);
    }
  });

  return (
    <group ref={bottleGroupRef} scale={[scale, scale, scale]}>
      {/* 1. Outer Glass Body with High Transmission, Dispersion & Crisp Specular */}
      <mesh ref={outerGlassRef} position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.92, 0.94, 3.1, 64, 1, false]} />
        <meshPhysicalMaterial
          roughness={0.02}
          transmission={0.98}
          thickness={1.5}
          ior={1.51}
          dispersion={0.035} // Chromatic dispersion prism effect
          transparent={true}
          opacity={0.92}
          envMapIntensity={2.5}
          color="#ffffff"
          attenuationColor={activeJuice.colors.accent}
          attenuationDistance={2.8}
        />
      </mesh>

      {/* Luxury Heavy Solid Glass Bottom Puck (Apothecary Base) */}
      <mesh position={[0, -1.42, 0]}>
        <cylinderGeometry args={[0.93, 0.94, 0.28, 64]} />
        <meshPhysicalMaterial
          roughness={0.03}
          transmission={0.97}
          thickness={1.6}
          ior={1.52}
          transparent={true}
          opacity={0.94}
          color="#ffffff"
        />
      </mesh>

      {/* Glass Bottle Shoulder Transition */}
      <mesh position={[0, 1.84, 0]}>
        <cylinderGeometry args={[0.42, 0.92, 0.58, 64]} />
        <meshPhysicalMaterial
          roughness={0.03}
          transmission={0.97}
          thickness={1.4}
          ior={1.51}
          transparent={true}
          opacity={0.91}
          color="#ffffff"
        />
      </mesh>

      {/* Glass Bottle Polished Neck */}
      <mesh position={[0, 2.355, 0]}>
        <cylinderGeometry args={[0.4, 0.42, 0.45, 64]} />
        <meshPhysicalMaterial
          roughness={0.04}
          transmission={0.96}
          thickness={1.3}
          ior={1.51}
          transparent={true}
          opacity={0.9}
          color="#ffffff"
        />
      </mesh>

      {/* 2. Tactile 36°F Cold Condensation Beads (140 beads in 1 draw call) */}
      <InstancedCondensationDroplets />

      {/* 3. Inner Living Cold-Pressed Liquid Mesh */}
      <mesh ref={liquidMeshRef} position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.85, 0.87, 2.75, 64]} />
        <meshStandardMaterial
          color={activeJuice.colors.primary}
          roughness={0.22}
          metalness={0.12}
          transparent={true}
          opacity={0.95}
        />
      </mesh>

      {/* Dynamic Fluid Meniscus Top with Wave Ripples */}
      <mesh
        ref={meniscusRef}
        position={[0, 1.255, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.85, 48]} />
        <meshPhysicalMaterial
          color={activeJuice.colors.primary}
          roughness={0.06}
          transmission={0.65}
          ior={1.35}
          metalness={0.08}
          transparent={true}
          opacity={0.96}
        />
      </mesh>

      {/* 4. Modern Procedural Swiss Embossed Label */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry
          args={[0.932, 0.932, 1.75, 64, 1, true, -Math.PI / 2.2, Math.PI / 1.1]}
        />
        <meshStandardMaterial
          map={labelTexture}
          roughness={0.24}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 5. Sleek Precision Matte Titanium/Obsidian Cap */}
      <mesh position={[0, 2.74, 0]} castShadow>
        <cylinderGeometry args={[0.43, 0.43, 0.38, 64]} />
        <meshStandardMaterial
          color="#18181b"
          roughness={0.2}
          metalness={0.92}
        />
      </mesh>

      {/* Precision Cap Knurled Grip Ring */}
      <mesh position={[0, 2.74, 0]}>
        <torusGeometry args={[0.432, 0.015, 16, 64]} />
        <meshStandardMaterial
          color="#27272a"
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>

      {/* Tamper Seal Ring in Active Formula Accent Color */}
      <mesh ref={tamperSealRef} position={[0, 2.54, 0]}>
        <torusGeometry args={[0.425, 0.024, 16, 64]} />
        <meshStandardMaterial
          color={activeJuice.colors.accent}
          roughness={0.28}
          metalness={0.75}
        />
      </mesh>

      {/* Vibrant Ambient Photon Particles */}
      <points>
        <sphereGeometry args={[2.5, 32, 32]} />
        <pointsMaterial
          size={0.022}
          color={activeJuice.colors.accent}
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// ============================================================================
// 5. Main Canvas Scene Controller
// ============================================================================
interface SceneControllerProps {
  activeJuice: JuiceItem;
  viewPreset: "front" | "label" | "tilt" | "cap";
  isAutoRotate: boolean;
  externalRotY?: number;
  onRotYChange?: (deg: number) => void;
  isMobile: boolean;
  currentRotYRef: React.MutableRefObject<number>;
  currentRotXRef: React.MutableRefObject<number>;
  rotVelocityRef: React.MutableRefObject<number>;
  scrollOffsetRef: React.MutableRefObject<number>;
  isDraggingRef: React.MutableRefObject<boolean>;
  lastReportedDegRef: React.MutableRefObject<number>;
  presetTargetRotYRef: React.MutableRefObject<number>;
  presetTargetRotXRef: React.MutableRefObject<number>;
  isPresetTransitionRef: React.MutableRefObject<boolean>;
}

function SceneController({
  activeJuice,
  viewPreset,
  isAutoRotate,
  externalRotY,
  onRotYChange,
  isMobile,
  currentRotYRef,
  currentRotXRef,
  rotVelocityRef,
  scrollOffsetRef,
  isDraggingRef,
  lastReportedDegRef,
  presetTargetRotYRef,
  presetTargetRotXRef,
  isPresetTransitionRef,
}: SceneControllerProps) {
  // Sync view presets
  useEffect(() => {
    isPresetTransitionRef.current = true;
    rotVelocityRef.current = 0;
    if (viewPreset === "front") {
      presetTargetRotYRef.current = 0;
      presetTargetRotXRef.current = 0.04;
    } else if (viewPreset === "label") {
      presetTargetRotYRef.current = 0.35;
      presetTargetRotXRef.current = 0.0;
    } else if (viewPreset === "tilt") {
      presetTargetRotYRef.current = 0.85;
      presetTargetRotXRef.current = 0.25;
    } else if (viewPreset === "cap") {
      presetTargetRotYRef.current = 0.4;
      presetTargetRotXRef.current = 0.72;
    }
  }, [viewPreset, isPresetTransitionRef, rotVelocityRef, presetTargetRotYRef, presetTargetRotXRef]);

  // Sync external scrub dial (prevent echo loops)
  useEffect(() => {
    if (externalRotY !== undefined) {
      const rounded = Math.round(externalRotY);
      if (rounded !== lastReportedDegRef.current) {
        currentRotYRef.current = (externalRotY * Math.PI) / 180;
        rotVelocityRef.current = 0;
        isPresetTransitionRef.current = false;
        lastReportedDegRef.current = rounded;
      }
    }
  }, [externalRotY, currentRotYRef, rotVelocityRef, isPresetTransitionRef, lastReportedDegRef]);

  // Dynamic rim light color morphing
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const targetRimColorRef = useRef(new THREE.Color(activeJuice.colors.accent));
  const currRimColorRef = useRef(new THREE.Color(activeJuice.colors.accent));

  useEffect(() => {
    targetRimColorRef.current.set(activeJuice.colors.accent);
  }, [activeJuice.colors.accent]);

  // Inertia momentum decay & animation in useFrame
  useFrame((state, delta) => {
    // 1. Physical inertia momentum decay with delta-time normalized exponential friction
    if (!isDraggingRef.current) {
      if (Math.abs(rotVelocityRef.current) > 0.0001) {
        // Friction factor 0.935 normalized to 60Hz and 120Hz ProMotion displays
        const friction = 0.935;
        const decayFactor = Math.pow(friction, delta * 60.0);
        currentRotYRef.current += rotVelocityRef.current * delta;
        rotVelocityRef.current *= decayFactor;

        if (Math.abs(rotVelocityRef.current) <= 0.0001) {
          rotVelocityRef.current = 0;
        }

        // Real-time scrub dial sync during momentum glide
        const deg = Math.round(
          (((currentRotYRef.current * 180) / Math.PI) % 360 + 360) % 360
        );
        if (deg !== lastReportedDegRef.current) {
          lastReportedDegRef.current = deg;
          if (onRotYChange) onRotYChange(deg);
        }
      } else if (isPresetTransitionRef.current) {
        // Smooth transition to target camera view preset
        currentRotYRef.current = THREE.MathUtils.damp(
          currentRotYRef.current,
          presetTargetRotYRef.current,
          7.0,
          delta
        );
        currentRotXRef.current = THREE.MathUtils.damp(
          currentRotXRef.current,
          presetTargetRotXRef.current,
          7.0,
          delta
        );

        if (
          Math.abs(currentRotYRef.current - presetTargetRotYRef.current) < 0.002 &&
          Math.abs(currentRotXRef.current - presetTargetRotXRef.current) < 0.002
        ) {
          isPresetTransitionRef.current = false;
        }

        const deg = Math.round(
          (((currentRotYRef.current * 180) / Math.PI) % 360 + 360) % 360
        );
        if (deg !== lastReportedDegRef.current) {
          lastReportedDegRef.current = deg;
          if (onRotYChange) onRotYChange(deg);
        }
      } else if (isAutoRotate) {
        // Gentle auto-rotation
        currentRotYRef.current += 0.45 * delta;
        const deg = Math.round(
          (((currentRotYRef.current * 180) / Math.PI) % 360 + 360) % 360
        );
        if (deg !== lastReportedDegRef.current) {
          lastReportedDegRef.current = deg;
          if (onRotYChange) onRotYChange(deg);
        }
      }
    }

    // Morph studio rim light color
    if (rimLightRef.current) {
      currRimColorRef.current.lerp(targetRimColorRef.current, delta * 5.0);
      rimLightRef.current.color.copy(currRimColorRef.current);
    }
  });

  // Responsive Mobile Camera & Model Framing:
  // Calibrated to guarantee >15% margin padding across 375px (iPhone SE), 390px (iPhone 14), and 430px (iPhone 14 Pro Max)
  const mobileScale = 0.88;
  const desktopScale = 1.08;
  const scale = isMobile ? mobileScale : desktopScale;
  const offsetY = isMobile ? -0.6 : -0.62;
  const shadowY = isMobile ? -1.95 : -2.25;

  return (
    <>
      <ambientLight intensity={1.3} />

      {/* Studio Key Light: High directional light with crisp shadows */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={2.8}
        color="#ffffff"
        castShadow
      />

      {/* Dynamic Colorful Rim Light: Back-left catch light matching formulation */}
      <directionalLight
        ref={rimLightRef}
        position={[-4.5, 2.5, -2.5]}
        intensity={3.2}
        color={activeJuice.colors.accent}
      />

      {/* Crisp White Silhouette Rim Light: Back-right glass edge outline */}
      <directionalLight
        position={[3.5, 2.0, -3.5]}
        intensity={2.0}
        color="#ffffff"
      />

      {/* Top Cap Spotlight: Narrow penumbra for titanium reflections */}
      <spotLight
        position={[0, 7.5, 1.8]}
        intensity={3.4}
        angle={0.45}
        penumbra={0.75}
        color="#ffffff"
      />

      {/* Interactive Bottle Model */}
      <Float
        speed={isDraggingRef.current ? 0 : 1.5}
        rotationIntensity={isDraggingRef.current ? 0 : 0.08}
        floatIntensity={isDraggingRef.current ? 0 : 0.15}
      >
        <InteractiveJuiceBottle
          activeJuice={activeJuice}
          currentRotYRef={currentRotYRef}
          currentRotXRef={currentRotXRef}
          rotVelocityRef={rotVelocityRef}
          scrollOffsetRef={scrollOffsetRef}
          isDraggingRef={isDraggingRef}
          scale={scale}
          offsetY={offsetY}
        />
      </Float>

      {/* Ambient Caustics Ground Projection Ring */}
      <CausticsGround
        accentColor={activeJuice.colors.accent}
        positionY={shadowY + 0.01}
      />

      {/* Soft Obsidian Ground Contact Shadow */}
      <ContactShadows
        position={[0, shadowY, 0]}
        opacity={0.6}
        scale={isMobile ? 5.2 : 6.2}
        blur={2.5}
        far={3.8}
        color="#000000"
      />

      <Environment preset="city" />
    </>
  );
}

// ============================================================================
// 6. Main ThreeBottleCanvas Export Component
// ============================================================================
export interface ThreeBottleCanvasProps {
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
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Rotation and momentum physics refs (no double damping, zero scroll re-renders)
  const currentRotYRef = useRef(0);
  const currentRotXRef = useRef(0.04);
  const rotVelocityRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastReportedDegRef = useRef(-1);

  // View preset transition targets
  const presetTargetRotYRef = useRef(0);
  const presetTargetRotXRef = useRef(0.04);
  const isPresetTransitionRef = useRef(false);

  // Pointer & Touch gesture tracking buffer
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(
    null
  );
  const touchLockedAxisRef = useRef<"horizontal" | "vertical" | null>(null);
  const trackingBufferRef = useRef<{ x: number; time: number }[]>([]);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    // Sample scroll position via passive ref WITHOUT triggering React re-renders!
    const handleScroll = () => {
      scrollOffsetRef.current = window.scrollY * 0.0014;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Pointer / Touch Handlers:
  // - Zero scroll interference (vertical pass-through)
  // - Clean horizontal lock
  // - Release velocity tracking buffer
  // - One-thumb swipe flick navigation
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      touchStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        time: performance.now(),
      };
      touchLockedAxisRef.current = null;
      trackingBufferRef.current = [{ x: e.clientX, time: performance.now() }];
      rotVelocityRef.current = 0; // Cancel ongoing inertia when touched
      isPresetTransitionRef.current = false;

      if (onUserInteract) onUserInteract();
    },
    [onUserInteract]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!touchStartRef.current) return;

      const deltaX = e.clientX - touchStartRef.current.x;
      const deltaY = e.clientY - touchStartRef.current.y;

      // Axis disambiguation deadband: lock axis cleanly
      if (!touchLockedAxisRef.current) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        if (absX > 6 || absY > 6) {
          if (absX > absY * 1.25) {
            // Horizontal dominance: lock bottle rotation gesture
            touchLockedAxisRef.current = "horizontal";
            isDraggingRef.current = true;
            setIsDraggingState(true);
            try {
              (e.currentTarget as HTMLElement)?.setPointerCapture?.(e.pointerId);
            } catch {}
          } else {
            // Vertical dominance: surrender completely to native vertical page scroll!
            touchLockedAxisRef.current = "vertical";
            isDraggingRef.current = false;
            return;
          }
        } else {
          return;
        }
      }

      if (touchLockedAxisRef.current === "vertical") {
        // Native vertical scroll pass-through
        return;
      }

      if (touchLockedAxisRef.current === "horizontal") {
        const now = performance.now();
        const buffer = trackingBufferRef.current;
        const lastPoint =
          buffer.length > 0 ? buffer[buffer.length - 1] : { x: e.clientX, time: now };
        const stepX = e.clientX - lastPoint.x;

        // Apply rotation step (Y-axis only! Never touch deltaY for X-tilt during touch!)
        const sensitivity = isMobile ? 0.0075 : 0.0055;
        currentRotYRef.current += stepX * sensitivity;

        // Store in tracking buffer for true release velocity
        buffer.push({ x: e.clientX, time: now });
        while (buffer.length > 0 && now - buffer[0].time > 100) {
          buffer.shift();
        }

        // Sync scrub dial real-time (throttled to degree changes)
        const deg = Math.round(
          (((currentRotYRef.current * 180) / Math.PI) % 360 + 360) % 360
        );
        if (deg !== lastReportedDegRef.current) {
          lastReportedDegRef.current = deg;
          if (onRotYChange) onRotYChange(deg);
        }
      }
    },
    [isMobile, onRotYChange]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (touchStartRef.current && isDraggingRef.current) {
        try {
          (e.currentTarget as HTMLElement)?.releasePointerCapture?.(e.pointerId);
        } catch {}

        const now = performance.now();
        const totalDt = now - touchStartRef.current.time;
        const totalDx = e.clientX - touchStartRef.current.x;

        // 1. One-thumb quick horizontal swipe flick navigation
        if (totalDt < 280 && Math.abs(totalDx) > 50) {
          if (totalDx < 0 && onSwipeNext) onSwipeNext();
          if (totalDx > 0 && onSwipePrev) onSwipePrev();
        }

        // 2. Physical inertia momentum release velocity from tracking buffer
        const buffer = trackingBufferRef.current;
        if (buffer.length >= 2) {
          const oldest = buffer[0];
          const newest = buffer[buffer.length - 1];
          const dt = (newest.time - oldest.time) / 1000; // seconds
          if (dt > 0.015) {
            const dx = newest.x - oldest.x;
            const sensitivity = isMobile ? 0.0075 : 0.0055;
            const vel = (dx / dt) * sensitivity;
            // Clamp release velocity to prevent disorienting spins
            rotVelocityRef.current = Math.max(-16, Math.min(16, vel));
          }
        }
      }

      isDraggingRef.current = false;
      setIsDraggingState(false);
      touchStartRef.current = null;
      touchLockedAxisRef.current = null;
      trackingBufferRef.current = [];
    },
    [isMobile, onSwipeNext, onSwipePrev]
  );

  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement)?.releasePointerCapture?.(e.pointerId);
    } catch {}
    isDraggingRef.current = false;
    setIsDraggingState(false);
    touchStartRef.current = null;
    touchLockedAxisRef.current = null;
    trackingBufferRef.current = [];
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950/40 rounded-3xl border border-white/10">
        <div className="text-center p-6">
          <p className="font-sans font-bold text-xl text-white">
            {activeJuice.name}
          </p>
          <p className="text-xs text-zinc-400 mt-2">
            Interactive 3D preview requires WebGL
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full relative select-none touch-pan-y ${
        isDraggingState ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{ touchAction: "pan-y" }} // Crucial for native mobile vertical scroll pass-through!
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerCancel}
    >
      <Canvas
        camera={
          isMobile
            ? { position: [0, 0.06, 5.85], fov: 44 }
            : { position: [0, 0.08, 5.6], fov: 44 }
        }
        dpr={isMobile ? [1, 1.5] : [1, 2]} // High performance 60fps on mobile
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        className="w-full h-full"
      >
        <SceneController
          activeJuice={activeJuice}
          viewPreset={viewPreset}
          isAutoRotate={isAutoRotate}
          externalRotY={externalRotY}
          onRotYChange={onRotYChange}
          isMobile={isMobile}
          currentRotYRef={currentRotYRef}
          currentRotXRef={currentRotXRef}
          rotVelocityRef={rotVelocityRef}
          scrollOffsetRef={scrollOffsetRef}
          isDraggingRef={isDraggingRef}
          lastReportedDegRef={lastReportedDegRef}
          presetTargetRotYRef={presetTargetRotYRef}
          presetTargetRotXRef={presetTargetRotXRef}
          isPresetTransitionRef={isPresetTransitionRef}
        />
      </Canvas>
    </div>
  );
}
