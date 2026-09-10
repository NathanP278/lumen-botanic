"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FlavorMatrix } from "@/components/FlavorMatrix";
import { BoxBuilder } from "@/components/BoxBuilder";
import { PhilosophySection } from "@/components/PhilosophySection";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { BottleCanvasWrapper } from "@/components/BottleCanvasWrapper";
import { JuiceItem } from "@/types/juice";
import { JUICES } from "@/data/juices";

export default function HomePage() {
  const [boxItems, setBoxItems] = useState<JuiceItem[]>([]);

  // Add juice to 6-pack box
  const handleAddToBox = (juice: JuiceItem) => {
    if (boxItems.length < 6) {
      setBoxItems((prev) => [...prev, juice]);
    }
  };

  // Remove slot from 6-pack
  const handleRemoveFromBox = (index: number) => {
    setBoxItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Clear 6-pack
  const handleClearBox = () => {
    setBoxItems([]);
  };

  // Auto-fill remaining with best-sellers
  const handleAutoFill = () => {
    setBoxItems((prev) => {
      const needed = 6 - prev.length;
      if (needed <= 0) return prev;
      const fillers = JUICES.slice(0, needed);
      return [...prev, ...fillers];
    });
  };

  return (
    <main className="min-h-screen bg-[#08130E] text-[#FAF7F2] relative selection:bg-botanic-gold selection:text-botanic-dark">
      {/* Top Navigation */}
      <Navbar />

      {/* Persistent Full-Viewport 3D Bottle Stage */}
      <div className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden">
        <BottleCanvasWrapper />
      </div>

      {/* Hero Section */}
      <div className="relative z-20">
        <HeroSection />
      </div>

      {/* Flavor Discovery Matrix */}
      <div className="relative z-20">
        <FlavorMatrix onAddToBox={handleAddToBox} boxItems={boxItems} />
      </div>

      {/* Curated 6-Pack Box Builder */}
      <div className="relative z-20">
        <BoxBuilder
          boxItems={boxItems}
          onRemoveFromBox={handleRemoveFromBox}
          onClearBox={handleClearBox}
          onAutoFill={handleAutoFill}
        />
      </div>

      {/* Philosophy & Sourcing Ritual */}
      <div className="relative z-20">
        <PhilosophySection />
      </div>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>

      {/* Sliding Luxury Cart Drawer */}
      <CartDrawer />
    </main>
  );
}
