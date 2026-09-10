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
    ctx.fillStyle = "#0E2419";
    ctx.fillRect(0, 0, 1024, 512);

    // Gold foil border
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
    ctx.letterSpacing = "12px";
    ctx.fillText("LUMEN", 512, 170);

    ctx.fillStyle = "#D4AF37";
    ctx.font = "300 24px 'Plus Jakarta Sans', sans-serif";
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
    ctx.font = "italic 22px 'Playfair Display', Georgia, serif";
    ctx.fillText("Raw Cold-Pressed Solar Elixir", 512, 300);

    ctx.fillStyle = "#A3B899";
    ctx.font = "500 18px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("NO. 01 • CHLOROPHYLL VERDANT • 350ML", 512, 350);

    ctx.fillStyle = "#8FA89B";
    ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("HYDRAULIC CRUSHED • ORGANIC • GLASS RECYCLABLE", 512, 420);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function ProceduralJuiceBottle({ scrollProgress }: { scrollProgress: number }) {
  const bottleGroupRef = useRef<THREE.Group>(null);
  const liquidMeshRef = useRef<THREE.Mesh>(null);
  const labelTexture = useMemo(() => createLabelTexture(), []);

  useFrame((state, delta) => {
    if (!bottleGroupRef.current) return;

    // Smooth scroll reaction
    // Scroll progress is 0 to 1
    const targetY = THREE.MathUtils.lerp(0.15, -0.65, scrollProgress);
    const targetRotY = scrollProgress * Math.PI * 3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    const targetRotX = Math.sin(scrollProgress * Math.PI) * 0.25;
    const targetRotZ = Math.cos(scrollProgress * Math.PI * 1.5) * 0.12;

    bottleGroupRef.current.position.y = THREE.MathUtils.damp(
      bottleGroupRef.current.position.y,
      targetY,
      3,
      delta
    );
    bottleGroupRef.current.rotation.y = THREE.MathUtils.damp(
      bottleGroupRef.current.rotation.y,
      targetRotY,
      3,
      delta
    );
    bottleGroupRef.current.rotation.x = THREE.MathUtils.damp(
      bottleGroupRef.current.rotation.x,
      targetRotX,
      3,
      delta
    );
    bottleGroupRef.current.rotation.z = THREE.MathUtils.damp(
      bottleGroupRef.current.rotation.z,
      targetRotZ,
      3,
      delta
    );

    // Subtle fluid wave motion
    if (liquidMeshRef.current) {
      const liquidMat = liquidMeshRef.current.material as THREE.MeshStandardMaterial;
      if (liquidMat) {
        // Color transition based on scroll
        const t = (Math.sin(scrollProgress * Math.PI * 2) + 1) / 2;
        liquidMat.color.setRGB(
          0.12 + t * 0.45,
          0.38 - t * 0.12,
          0.22 + t * 0.05
        );
      }
    }
  });

  return (
    <group ref={bottleGroupRef} position={[0, 0.15, 0]} scale={[1.15, 1.15, 1.15]}>
      {/* 1. Outer Glass Bottle Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.92, 0.95, 3.2, 48, 1, false]} />
        <meshPhysicalMaterial
          roughness={0.06}
          transmission={0.92}
          thickness={1.2}
          ior={1.52}
          transparent={true}
          opacity={0.88}
          envMapIntensity={1.8}
          color="#FAF7F2"
          attenuationColor="#A7F3D0"
          attenuationDistance={1.4}
        />
      </mesh>

      {/* Glass Bottle Shoulder / Curve to Neck */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.42, 0.92, 0.6, 48]} />
        <meshPhysicalMaterial
          roughness={0.08}
          transmission={0.92}
          thickness={1.1}
          ior={1.52}
          transparent={true}
          opacity={0.85}
          color="#FAF7F2"
        />
      </mesh>

      {/* Glass Bottle Neck */}
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.4, 0.42, 0.5, 48]} />
        <meshPhysicalMaterial
          roughness={0.08}
          transmission={0.9}
          thickness={1.1}
          ior={1.52}
          transparent={true}
          opacity={0.85}
          color="#FAF7F2"
        />
      </mesh>

      {/* 2. Inner Cold-Pressed Liquid Mesh */}
      <mesh ref={liquidMeshRef} position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.86, 0.88, 2.9, 48]} />
        <meshStandardMaterial
          color="#1D4E35"
          roughness={0.25}
          metalness={0.15}
          transparent={true}
          opacity={0.94}
        />
      </mesh>

      {/* Liquid Meniscus / Top Fluid Surface */}
      <mesh position={[0, 1.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.85, 36]} />
        <meshStandardMaterial
          color="#256443"
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* 3. Luxury Embossed Bottle Label */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry
          args={[0.935, 0.935, 1.7, 48, 1, true, -Math.PI / 2.2, Math.PI / 1.1]}
        />
        <meshStandardMaterial
          map={labelTexture}
          roughness={0.35}
          metalness={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4. Brushed Brass / Champagne Gold Bottle Cap */}
      <mesh position={[0, 2.65, 0]} castShadow>
        <cylinderGeometry args={[0.43, 0.43, 0.42, 48]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.22}
          metalness={0.88}
        />
      </mesh>

      {/* Cap Ring / Tamper Seal */}
      <mesh position={[0, 2.42, 0]}>
        <torusGeometry args={[0.42, 0.03, 16, 48]} />
        <meshStandardMaterial
          color="#B8860B"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Dynamic Botanical Halo Sparkles */}
      <points>
        <sphereGeometry args={[2.2, 28, 28]} />
        <pointsMaterial
          size={0.03}
          color="#E5C578"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export function ThreeBottleCanvas() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasWebGL, setHasWebGL] = useState(true);

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

    // Scroll progress handler
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalScroll));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
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
        <ambientLight intensity={1.1} />
        <directionalLight
          position={[4, 6, 4]}
          intensity={2.2}
          color="#FFF8E7"
          castShadow
        />
        <directionalLight
          position={[-4, 3, -2]}
          intensity={1.5}
          color="#38BDF8"
        />
        <spotLight
          position={[0, 8, 2]}
          intensity={2.8}
          angle={0.5}
          penumbra={0.8}
          color="#FDE68A"
        />

        <Float
          speed={1.6}
          rotationIntensity={0.3}
          floatIntensity={0.4}
        >
          <ProceduralJuiceBottle scrollProgress={scrollProgress} />
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
