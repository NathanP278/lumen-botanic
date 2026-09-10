"use client";

import React, { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ProductShowcase } from "@/components/ProductShowcase";
import { PhilosophySection } from "@/components/PhilosophySection";
import { Footer } from "@/components/Footer";
import { JUICES } from "@/data/juices";
import { JuiceItem } from "@/types/juice";

export default function HomePage() {
  const [activeJuice, setActiveJuice] = useState<JuiceItem>(JUICES[0]);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleSelectJuice = (juice: JuiceItem) => {
    setActiveJuice(juice);
  };

  return (
    <main className="min-h-screen w-full max-w-full bg-[#09090b] text-[#fafafa] relative overflow-x-hidden bg-grid-pattern selection:bg-emerald-400 selection:text-black font-sans">
      {/* Top Dynamic Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[60] origin-left"
        style={{
          scaleX,
          backgroundColor: activeJuice.colors.accent,
        }}
      />

      {/* Sleek Minimalist Navbar */}
      <Navbar
        activeJuice={activeJuice}
        allJuices={JUICES}
        onSelectJuice={handleSelectJuice}
      />

      {/* Main Interactive Product Showcase & 3D Stage & Interactive Nutrition HUD */}
      <ProductShowcase
        activeJuice={activeJuice}
        allJuices={JUICES}
        onSelectJuice={handleSelectJuice}
      />

      {/* Modern Extraction Tech & Cold Chain Section */}
      <PhilosophySection />

      {/* Minimalist Research Footer */}
      <Footer
        allJuices={JUICES}
        onSelectJuice={handleSelectJuice}
      />
    </main>
  );
}
