"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// Procedural texture for luxury bottle embossed label
function createLabelTexture(): THREE.CanvasTexture | THREE.Texture {
  if (typeof window === "undefined") {
    return new THREE.Texture();
  }
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Elegant dark emerald / charcoal matte label
    ctx.fillStyle = "#0B1D14";
    ctx.fillRect(0, 0, 1024, 512);

    // Gold foil outer and inner border
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, 1024 - 60, 512 - 60);

    ctx.strokeStyle = "#E5C578";
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, 1024 - 90, 512 - 90);

    // Monogram & Title
    ctx.fillStyle = "#FAF7F2";
    ctx.font = "bold 56px 'Playfair Display', Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("LUMEN", 512, 170);

    ctx.fillStyle = "#D4AF37";
    ctx.font = "600 22px 'Plus Jakarta Sans', sans-serif";
    ctx.letterSpacing = "6px";
    ctx.fillText("BOTANIC ATELIER", 512, 220);

    // Divider line
    ctx.beginPath();
    ctx.moveTo(350, 255);
    ctx.lineTo(674, 255);
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Subtitle
    ctx.fillStyle = "#EFE9DF";
    ctx.font = "italic 24px 'Playfair Display', Georgia, serif";
    ctx.fillText("Raw Cold-Pressed Solar Elixir", 512, 300);

    ctx.fillStyle = "#A3B899";
    ctx.font = "600 18px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("NO. 01 • CHLOROPHYLL VERDANT • 350ML", 512, 350);

    ctx.fillStyle = "#8FA89B";
    ctx.font = "500 14px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("15,000 LBS HYDRAULIC • ORGANIC • GLASS SEALED", 512, 420);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 5 Keyframe cinematic choreography poses
interface Pose {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
}

const CINEMATIC_POSES: { t: number; pose: Pose }[] = [
  // 1. Hero
  {
    t: 0.0,
    pose: { x: 1.35, y: 0.1, z: 0.0, rotX: 0.05, rotY: 0.25, rotZ: -0.04, scale: 1.15 },
  },
  // 2. Formulation Matrix
  {
    t: 0.28,
    pose: { x: -1.35, y: -0.15, z: 0.35, rotX: 0.12, rotY: 1.95, rotZ: 0.08, scale: 1.1 },
  },
  // 3. Box Ritual
  {
    t: 0.55,
    pose: { x: 0.0, y: 0.65, z: -0.1, rotX: 0.52, rotY: 3.14, rotZ: 0.0, scale: 0.95 },
  },
  // 4. Hydraulic Ritual Close-Up
  {
    t: 0.78,
    pose: { x: 1.15, y: -0.1, z: 2.0, rotX: -0.18, rotY: 4.85, rotZ: 0.12, scale: 1.25 },
  },
  // 5. Footer Silhouette
  {
    t: 1.0,
    pose: { x: 0.0, y: -0.85, z: 0.0, rotX: 0.0, rotY: 6.28, rotZ: 0.0, scale: 1.05 },
  },
];

function interpolatePose(t: number): Pose {
  const clampedT = Math.min(1, Math.max(0, t));
  for (let i = 0; i < CINEMATIC_POSES.length - 1; i++) {
    const p1 = CINEMATIC_POSES[i];
    const p2 = CINEMATIC_POSES[i + 1];
    if (clampedT >= p1.t && clampedT <= p2.t) {
      const alpha = (clampedT - p1.t) / (p2.t - p1.t);
      // Smooth cubic hermite easing
      const ease = alpha * alpha * (3 - 2 * alpha);
      return {
        x: THREE.MathUtils.lerp(p1.pose.x, p2.pose.x, ease),
        y: THREE.MathUtils.lerp(p1.pose.y, p2.pose.y, ease),
        z: THREE.MathUtils.lerp(p1.pose.z, p2.pose.z, ease),
        rotX: THREE.MathUtils.lerp(p1.pose.rotX, p2.pose.rotX, ease),
        rotY: THREE.MathUtils.lerp(p1.pose.rotY, p2.pose.rotY, ease),
        rotZ: THREE.MathUtils.lerp(p1.pose.rotZ, p2.pose.rotZ, ease),
        scale: THREE.MathUtils.lerp(p1.pose.scale, p2.pose.scale, ease),
      };
    }
  }
  return CINEMATIC_POSES[CINEMATIC_POSES.length - 1].pose;
}

// Procedural Condensation Beads (Cold-chain 36°F tactile detail)
function CondensationDroplets() {
  const count = 38;
  const positions = useMemo(() => {
    const pos: [number, number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2.8;
      const r = 0.94;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const radius = 0.02 + Math.random() * 0.035;
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
            roughness={0.05}
            transmission={0.96}
            ior={1.4}
            color="#FFFFFF"
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

function ProceduralJuiceBottle({
  scrollProgress,
  isMobile,
}: {
  scrollProgress: number;
  isMobile: boolean;
}) {
  const bottleGroupRef = useRef<THREE.Group>(null);
  const liquidMeshRef = useRef<THREE.Mesh>(null);
  const meniscusRef = useRef<THREE.Mesh>(null);
  const labelTexture = useMemo(() => createLabelTexture(), []);

  useFrame((state, delta) => {
    if (!bottleGroupRef.current) return;

    // Evaluate current pose from 5 cinematic keyframes
    const target = interpolatePose(scrollProgress);

    // Mobile adjustments: reduce X offset and scale down
    const posX = isMobile ? target.x * 0.25 : target.x;
    const posY = target.y;
    const posZ = target.z;
    const baseScale = isMobile ? target.scale * 0.72 : target.scale;

    // Organic subtle floating micro-bobbing
    const idleRotY = Math.sin(state.clock.elapsedTime * 0.7) * 0.04;
    const idleY = Math.cos(state.clock.elapsedTime * 1.2) * 0.03;

    bottleGroupRef.current.position.x = THREE.MathUtils.damp(
      bottleGroupRef.current.position.x,
      posX,
      4,
      delta
    );
    bottleGroupRef.current.position.y = THREE.MathUtils.damp(
      bottleGroupRef.current.position.y,
      posY + idleY,
      4,
      delta
    );
    bottleGroupRef.current.position.z = THREE.MathUtils.damp(
      bottleGroupRef.current.position.z,
      posZ,
      4,
      delta
    );

    bottleGroupRef.current.rotation.x = THREE.MathUtils.damp(
      bottleGroupRef.current.rotation.x,
      target.rotX,
      4,
      delta
    );
    bottleGroupRef.current.rotation.y = THREE.MathUtils.damp(
      bottleGroupRef.current.rotation.y,
      target.rotY + idleRotY,
      4,
      delta
    );
    bottleGroupRef.current.rotation.z = THREE.MathUtils.damp(
      bottleGroupRef.current.rotation.z,
      target.rotZ,
      4,
      delta
    );

    bottleGroupRef.current.scale.set(baseScale, baseScale, baseScale);

    // Dynamic fluid oscillation and chromatic color morphing
    const elapsed = state.clock.elapsedTime;
    if (liquidMeshRef.current) {
      const liquidMat = liquidMeshRef.current.material as THREE.MeshStandardMaterial;
      if (liquidMat) {
        // Fluid color spectrum transition based on scroll
        // Cleanse Green (0) -> Curcumin Gold (0.3) -> Ruby Beet (0.6) -> Obsidian Purple (0.8)
        const p = scrollProgress;
        let r = 0.11;
        let g = 0.35;
        let b = 0.22;

        if (p < 0.35) {
          const k = p / 0.35;
          r = THREE.MathUtils.lerp(0.11, 0.85, k);
          g = THREE.MathUtils.lerp(0.35, 0.48, k);
          b = THREE.MathUtils.lerp(0.22, 0.05, k);
        } else if (p < 0.7) {
          const k = (p - 0.35) / 0.35;
          r = THREE.MathUtils.lerp(0.85, 0.65, k);
          g = THREE.MathUtils.lerp(0.48, 0.08, k);
          b = THREE.MathUtils.lerp(0.05, 0.22, k);
        } else {
          const k = (p - 0.7) / 0.3;
          r = THREE.MathUtils.lerp(0.65, 0.25, k);
          g = THREE.MathUtils.lerp(0.08, 0.12, k);
          b = THREE.MathUtils.lerp(0.22, 0.45, k);
        }

        liquidMat.color.setRGB(r, g, b);

        // Meniscus tilt and wave ripple
        if (meniscusRef.current) {
          const meniscusMat = meniscusRef.current.material as THREE.MeshStandardMaterial;
          meniscusMat.color.setRGB(r * 1.15, g * 1.15, b * 1.15);
          meniscusRef.current.position.y = 1.37 + Math.sin(elapsed * 2.8) * 0.02;
          meniscusRef.current.rotation.x = -Math.PI / 2 + Math.sin(elapsed * 2.0) * 0.03;
        }
      }
    }
  });

  return (
    <group ref={bottleGroupRef} position={[1.35, 0.1, 0]} scale={[1.15, 1.15, 1.15]}>
      {/* 1. Outer Glass Bottle Body with Chromatic Aberration & High Transmission */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.92, 0.95, 3.2, 48, 1, false]} />
        <meshPhysicalMaterial
          roughness={0.04}
          transmission={0.96}
          thickness={1.3}
          ior={1.54}
          transparent={true}
          opacity={0.92}
          envMapIntensity={2.2}
          color="#FAF7F2"
          attenuationColor="#A7F3D0"
          attenuationDistance={1.8}
        />
      </mesh>

      {/* Glass Bottle Shoulder / Curve to Neck */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.42, 0.92, 0.6, 48]} />
        <meshPhysicalMaterial
          roughness={0.06}
          transmission={0.95}
          thickness={1.2}
          ior={1.54}
          transparent={true}
          opacity={0.9}
          color="#FAF7F2"
        />
      </mesh>

      {/* Glass Bottle Neck */}
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.4, 0.42, 0.5, 48]} />
        <meshPhysicalMaterial
          roughness={0.06}
          transmission={0.94}
          thickness={1.2}
          ior={1.54}
          transparent={true}
          opacity={0.9}
          color="#FAF7F2"
        />
      </mesh>

      {/* 2. Tactile 36°F Condensation Water Droplets */}
      <CondensationDroplets />

      {/* 3. Inner Living Cold-Pressed Liquid Mesh */}
      <mesh ref={liquidMeshRef} position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.86, 0.88, 2.9, 48]} />
        <meshStandardMaterial
          color="#1D4E35"
          roughness={0.22}
          metalness={0.12}
          transparent={true}
          opacity={0.95}
        />
      </mesh>

      {/* Fluid Meniscus / Top Liquid Surface with dynamic ripple */}
      <mesh ref={meniscusRef} position={[0, 1.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.85, 36]} />
        <meshStandardMaterial
          color="#256443"
          roughness={0.08}
          metalness={0.2}
        />
      </mesh>

      {/* 4. Luxury Embossed Bottle Foil Label */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry
          args={[0.938, 0.938, 1.72, 48, 1, true, -Math.PI / 2.2, Math.PI / 1.1]}
        />
        <meshStandardMaterial
          map={labelTexture}
          roughness={0.3}
          metalness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 5. Brushed Brass / Champagne Gold Bottle Cap */}
      <mesh position={[0, 2.65, 0]} castShadow>
        <cylinderGeometry args={[0.43, 0.43, 0.42, 48]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.18}
          metalness={0.92}
        />
      </mesh>

      {/* Cap Ring / Tamper Seal */}
      <mesh position={[0, 2.42, 0]}>
        <torusGeometry args={[0.42, 0.03, 16, 48]} />
        <meshStandardMaterial
          color="#B8860B"
          roughness={0.25}
          metalness={0.85}
        />
      </mesh>

      {/* Botanical Caustic Halos */}
      <points>
        <sphereGeometry args={[2.4, 32, 32]} />
        <pointsMaterial
          size={0.025}
          color="#E5C578"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export function ThreeBottleCanvas() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }

    // Viewport resize & scroll progress handler
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalScroll));
        setScrollProgress(progress);
      }
    };

    handleResize();
    handleScroll();

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-botanic-emerald/20 backdrop-blur-sm">
        <div className="text-center p-6">
          <p className="font-serif text-xl text-botanic-gold">LUMEN No. 01 Chlorophyll</p>
          <p className="text-xs text-botanic-sage mt-2">Cold-pressed botanical elixir</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.4, 5.2], fov: 42 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        className="w-full h-full"
      >
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[4, 7, 4]}
          intensity={2.4}
          color="#FFF8E7"
          castShadow
        />
        <directionalLight
          position={[-4, 3, -2]}
          intensity={1.6}
          color="#38BDF8"
        />
        <spotLight
          position={[0, 8, 2]}
          intensity={3.0}
          angle={0.5}
          penumbra={0.8}
          color="#FDE68A"
        />

        <Float
          speed={1.5}
          rotationIntensity={0.25}
          floatIntensity={0.35}
        >
          <ProceduralJuiceBottle
            scrollProgress={scrollProgress}
            isMobile={isMobile}
          />
        </Float>

        <ContactShadows
          position={[0, -2.4, 0]}
          opacity={0.45}
          scale={7}
          blur={2.4}
          far={4}
          color="#030A06"
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
