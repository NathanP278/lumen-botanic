"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductShowcase } from "@/components/ProductShowcase";
import { PhilosophySection } from "@/components/PhilosophySection";
import { Footer } from "@/components/Footer";
import { JUICES } from "@/data/juices";
import { JuiceItem } from "@/types/juice";

export default function HomePage() {
  const [activeJuice, setActiveJuice] = useState<JuiceItem>(JUICES[0]);

  const handleSelectJuice = (juice: JuiceItem) => {
    setActiveJuice(juice);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-[#fafafa] relative overflow-hidden bg-grid-pattern selection:bg-emerald-400 selection:text-black font-sans">
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
