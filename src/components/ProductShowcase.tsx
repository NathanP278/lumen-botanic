"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JuiceItem } from "@/types/juice";
import { BottleCanvasWrapper } from "@/components/BottleCanvasWrapper";
import { InteractiveNutritionLabel } from "@/components/InteractiveNutritionLabel";
import {
  RotateCcw,
  Sparkles,
  Maximize2,
  Droplets,
  ThermometerSnowflake,
  Compass,
  ChevronLeft,
  ChevronRight,
  Sliders,
} from "lucide-react";

interface ProductShowcaseProps {
  activeJuice: JuiceItem;
  allJuices: JuiceItem[];
  onSelectJuice: (juice: JuiceItem) => void;
}

export function ProductShowcase({
  activeJuice,
  allJuices,
  onSelectJuice,
}: ProductShowcaseProps) {
  const [viewPreset, setViewPreset] = useState<"front" | "label" | "tilt" | "cap">("front");
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [rotDegrees, setRotDegrees] = useState(0);

  const currentIndex = allJuices.findIndex((j) => j.id === activeJuice.id);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % allJuices.length;
    onSelectJuice(allJuices[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + allJuices.length) % allJuices.length;
    onSelectJuice(allJuices[prevIdx]);
  };

  const handleUserInteract = () => {
    setHasInteracted(true);
  };

  return (
    <section
      id="showcase"
      className="relative pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Dynamic Ambient Background Radiant Glow */}
      <motion.div
        key={activeJuice.id}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.38, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-1/4 sm:top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[700px] lg:w-[950px] h-[340px] sm:h-[550px] rounded-full blur-[110px] sm:blur-[150px] pointer-events-none -z-10"
        style={{
          backgroundColor: activeJuice.colors.primary,
        }}
      />

      {/* Top 4-Product Modern Switcher Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 sm:mb-10"
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: activeJuice.colors.accent }}
            />
            <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
              Formulation Matrix (4 Active Micro-Batches)
            </span>
          </div>

          <span className="text-xs font-mono text-zinc-400 hidden sm:inline-block">
            Swipe 3D bottle or click tabs to inspect
          </span>
        </div>

        {/* 4-Product Grid with Mobile Horizontal Scroll Support */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {allJuices.map((juice, idx) => {
            const isSelected = juice.id === activeJuice.id;
            return (
              <motion.button
                key={juice.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectJuice(juice)}
                className={`relative text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 group overflow-hidden ${
                  isSelected
                    ? "bg-zinc-900/95 border-white/30 shadow-xl"
                    : "bg-zinc-900/40 border-white/[0.08] hover:bg-zinc-900/70 hover:border-white/20"
                }`}
                style={
                  isSelected
                    ? {
                        boxShadow: `0 10px 30px -10px ${juice.colors.glow}`,
                      }
                    : undefined
                }
              >
                {/* Active Indicator Top Bar */}
                {isSelected && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: juice.colors.accent }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-400">
                    // 0{idx + 1}
                  </span>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase"
                    style={{
                      borderColor: `${juice.colors.accent}40`,
                      color: isSelected ? juice.colors.accent : "#a1a1aa",
                      backgroundColor: `${juice.colors.accent}15`,
                    }}
                  >
                    {juice.category}
                  </span>
                </div>

                <h3 className="mt-1.5 sm:mt-2 font-bold text-xs sm:text-base text-white font-sans tracking-tight">
                  {juice.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 truncate">
                  {juice.tagline}
                </p>

                <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>{juice.nutrition.caloriesBottle} kcal</span>
                  <span className="font-semibold text-zinc-300">0g Added Sugar</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Main 3-Column Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column (4 cols): Product Dossier & 3D Camera Controls */}
        <div className="lg:col-span-4 order-2 lg:order-1 flex flex-col justify-between space-y-5 sm:space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeJuice.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl space-y-4 sm:space-y-5"
            >
              {/* SKU Badge & Category */}
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${activeJuice.colors.accent}20`,
                    color: activeJuice.colors.accent,
                    border: `1px solid ${activeJuice.colors.accent}40`,
                  }}
                >
                  {activeJuice.sku}
                </span>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                  // {activeJuice.category} ELIXIR
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                  {activeJuice.name}
                </h2>
                <p
                  className="text-xs sm:text-sm font-semibold tracking-wide mt-1 uppercase font-mono"
                  style={{ color: activeJuice.colors.accent }}
                >
                  {activeJuice.tagline}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                {activeJuice.description}
              </p>

              {/* Key Benefits Pills */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                  Target Cellular Benefits
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeJuice.benefits.map((b) => (
                    <motion.span
                      key={b}
                      whileHover={{ scale: 1.04 }}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800/80 border border-white/10 text-zinc-200 flex items-center gap-1.5"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: activeJuice.colors.accent }}
                      />
                      <span>{b}</span>
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Tasting Notes */}
              <div className="pt-3 border-t border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-1">
                  Sensory Profile
                </span>
                <p className="text-xs text-zinc-300 font-sans">
                  {activeJuice.tastingNotes.join(" • ")}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Interactive 3D Bottle View Controls */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 font-bold">
                <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                <span>3D View Presets</span>
              </span>

              {/* Auto-Rotate Switch */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono flex items-center gap-1.5 border transition-all ${
                  isAutoRotate
                    ? "border-white/30 text-white bg-zinc-800"
                    : "border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isAutoRotate ? "animate-pulse" : "opacity-40"
                  }`}
                  style={{
                    backgroundColor: isAutoRotate ? activeJuice.colors.accent : "#71717a",
                  }}
                />
                <span>Auto-Spin: {isAutoRotate ? "ON" : "OFF"}</span>
              </motion.button>
            </div>

            {/* 4 View Angle Buttons with Tactile Click Feedback */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-xs font-mono">
              {(["front", "label", "tilt", "cap"] as const).map((preset) => (
                <motion.button
                  key={preset}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setViewPreset(preset)}
                  className={`py-2 px-1 rounded-xl text-center border transition-all capitalize ${
                    viewPreset === preset
                      ? "bg-white text-zinc-950 font-bold border-white shadow-md"
                      : "bg-zinc-800/40 border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  {preset === "tilt" ? "Tilt 35°" : preset}
                </motion.button>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Drag inside bottle to rotate 360°</span>
              </span>
              <span className="text-zinc-400">100% Glass Sealed</span>
            </div>
          </div>
        </div>

        {/* Center Column (4 cols): Interactive 3D Canvas Stage (Optimized for Mobile) */}
        <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col items-center gap-3">
          <div className="w-full h-[400px] sm:h-[500px] lg:h-[640px] relative rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/30 to-black/70 overflow-hidden shadow-2xl flex items-center justify-center group">
            {/* Interactive 3D Canvas */}
            <div className="absolute inset-0 z-10">
              <BottleCanvasWrapper
                activeJuice={activeJuice}
                viewPreset={viewPreset}
                isAutoRotate={isAutoRotate}
                onUserInteract={handleUserInteract}
                onSwipeNext={handleNext}
                onSwipePrev={handlePrev}
                externalRotY={rotDegrees}
                onRotYChange={(deg) => setRotDegrees(Math.round(deg))}
              />
            </div>

            {/* Mobile Previous / Next Touch Buttons Overlay */}
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 z-20 flex justify-between pointer-events-none">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center pointer-events-auto shadow-lg"
                aria-label="Previous formulation"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center pointer-events-auto shadow-lg"
                aria-label="Next formulation"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Interactive touch hint overlay (fades after interaction) */}
            {!hasInteracted && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce">
                <div className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-mono text-zinc-300 flex items-center gap-1.5">
                  <Maximize2 className="w-3 h-3 text-zinc-400" />
                  <span>Swipe or drag bottle to inspect</span>
                </div>
              </div>
            )}

            {/* Floating Live Cold-Chain Tag */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 pointer-events-none">
              <div className="px-2.5 sm:px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
                <ThermometerSnowflake
                  className="w-3 h-3"
                  style={{ color: activeJuice.colors.accent }}
                />
                <span>36°F / 2.2°C Cold Extraction</span>
              </div>
            </div>

            {/* Floating Volume Tag */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 pointer-events-none">
              <div className="px-2.5 sm:px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-mono text-zinc-300">
                350 mL // 11.8 OZ
              </div>
            </div>
          </div>

          {/* Dedicated 360° Touch Scrub Dial / Bar (Mobile-first tactile rotation) */}
          <div className="w-full p-2.5 sm:p-3 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">360° Orbit:</span>
            </div>

            <input
              type="range"
              min="0"
              max="360"
              value={rotDegrees}
              onChange={(e) => {
                const val = Number(e.target.value);
                setRotDegrees(val);
                setIsAutoRotate(false);
                setHasInteracted(true);
              }}
              className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
              aria-label="3D Bottle Rotation Slider"
            />

            <span
              className="font-mono text-xs font-bold w-12 text-right"
              style={{ color: activeJuice.colors.accent }}
            >
              {rotDegrees}°
            </span>
          </div>
        </div>

        {/* Right Column (4 cols): Interactive Swiss Nutrition HUD */}
        <div id="nutrition" className="lg:col-span-4 order-3 w-full">
          <InteractiveNutritionLabel
            juice={activeJuice}
            allJuices={allJuices}
            onSelectJuice={onSelectJuice}
          />
        </div>
      </div>

      {/* Cross-Product Matrix Comparison Bar */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mt-12 sm:mt-16 p-5 sm:p-8 rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-sans tracking-tight">
              Four-Formulation Comparison Matrix
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Zero synthetic fillers • 100% Raw living botanical cell sap
            </p>
          </div>
          <span className="text-[11px] sm:text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 self-start sm:self-auto">
            All 4 Formulations: 0g Added Sugars
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[560px]">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400">
                <th className="pb-3 font-semibold">Code / Name</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Calories</th>
                <th className="pb-3 font-semibold">Potassium</th>
                <th className="pb-3 font-semibold">Vitamin C</th>
                <th className="pb-3 font-semibold">Key Bioactive</th>
                <th className="pb-3 font-semibold text-right">Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {allJuices.map((j) => {
                const isSelected = j.id === activeJuice.id;
                const pot = j.nutrition.nutrients.find((n) => n.id === "potassium");
                const vitC = j.nutrition.nutrients.find((n) => n.id === "vitamin-c");
                const primeBio = j.nutrition.bioactives[0];

                return (
                  <tr
                    key={j.id}
                    onClick={() => onSelectJuice(j)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-zinc-800/70" : "hover:bg-zinc-800/30"
                    }`}
                  >
                    <td className="py-3.5 font-bold text-white flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: j.colors.accent }}
                      />
                      <span>{j.name}</span>
                    </td>
                    <td className="py-3.5 text-zinc-300">{j.category}</td>
                    <td className="py-3.5 text-zinc-200 font-semibold">
                      {j.nutrition.caloriesBottle} kcal
                    </td>
                    <td className="py-3.5 text-zinc-300">{pot?.amountBottle}</td>
                    <td className="py-3.5 font-semibold" style={{ color: j.colors.accent }}>
                      {vitC?.dvPercent}% DV
                    </td>
                    <td className="py-3.5 text-zinc-300 max-w-xs truncate">
                      {primeBio?.name} ({primeBio?.amount})
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectJuice(j);
                        }}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          isSelected
                            ? "bg-white text-zinc-950 shadow-sm"
                            : "bg-zinc-800 text-zinc-300 hover:text-white"
                        }`}
                      >
                        {isSelected ? "Active" : "Inspect"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}
