"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JuiceItem } from "@/types/juice";
import { BottleCanvasWrapper } from "@/components/BottleCanvasWrapper";
import { InteractiveNutritionLabel } from "@/components/InteractiveNutritionLabel";
import {
  RotateCcw,
  Maximize2,
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

  const handleScrubChange = (newDeg: number) => {
    setRotDegrees(newDeg);
    setIsAutoRotate(false);
    setHasInteracted(true);
  };

  // Angle markers for 360 degree dial
  const anglePresets = [
    { label: "Front", deg: 0 },
    { label: "Right", deg: 90 },
    { label: "Label", deg: 180 },
    { label: "Left", deg: 270 },
  ];

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
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: activeJuice.colors.accent }}
            />
            <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase font-medium">
              Formulation Matrix (4 Active Micro-Batches)
            </span>
          </div>

          <span className="text-xs font-mono text-zinc-400 hidden sm:inline-block">
            Swipe 3D bottle or tap cards to switch formulation
          </span>
        </div>

        {/* 4-Product Grid with One-Thumb Fluid Highlight & >=44px Touch Targets */}
        <div
          role="tablist"
          aria-label="Formulation selector matrix"
          className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3"
        >
          {allJuices.map((juice, idx) => {
            const isSelected = juice.id === activeJuice.id;
            return (
              <button
                key={juice.id}
                id={`tab-${juice.id}`}
                type="button"
                role="tab"
                tabIndex={isSelected ? 0 : -1}
                aria-selected={isSelected}
                aria-label={`Select ${juice.name} formula ${juice.category}`}
                onClick={() => onSelectJuice(juice)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    const next = allJuices[(idx + 1) % allJuices.length];
                    onSelectJuice(next);
                    document.getElementById(`tab-${next.id}`)?.focus();
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    const prev = allJuices[(idx - 1 + allJuices.length) % allJuices.length];
                    onSelectJuice(prev);
                    document.getElementById(`tab-${prev.id}`)?.focus();
                  }
                }}
                className={`relative text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 group overflow-hidden min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                  isSelected
                    ? "bg-zinc-950/95 border-white/30 shadow-xl scale-[1.01]"
                    : "bg-zinc-950/40 border-white/[0.08] hover:bg-zinc-950/70 hover:border-white/20"
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
                    // 0{idx + 1} {juice.formulaCode || juice.sku.split("-")[1]}
                  </span>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-medium"
                    style={{
                      borderColor: `${juice.colors.accent}40`,
                      color: isSelected ? juice.colors.accent : "#d4d4d8",
                      backgroundColor: `${juice.colors.accent}15`,
                    }}
                  >
                    {juice.category}
                  </span>
                </div>

                <h3 className="mt-1.5 sm:mt-2 font-bold text-xs sm:text-base text-white font-sans tracking-tight">
                  {juice.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 truncate font-sans">
                  {juice.tagline}
                </p>

                <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span className="text-zinc-300 font-semibold">{juice.nutrition.caloriesBottle} kcal</span>
                  <span className="text-zinc-400">0g Added Sugar</span>
                </div>
              </button>
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
              className="p-5 sm:p-6 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-2xl space-y-4 sm:space-y-5"
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
                <span className="text-xs font-mono text-zinc-300 uppercase tracking-widest font-semibold">
                  // {activeJuice.formulaCode || activeJuice.category} ELIXIR
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-sans">
                  {activeJuice.name}
                </h2>
                <p
                  className="text-xs sm:text-sm font-semibold tracking-wider mt-1 uppercase font-mono"
                  style={{ color: activeJuice.colors.accent }}
                >
                  {activeJuice.tagline}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans">
                {activeJuice.description}
              </p>

              {/* Key Benefits Pills */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                  Target Cellular Benefits
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeJuice.benefits.map((b) => (
                    <span
                      key={b}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900/90 border border-white/10 text-zinc-200 flex items-center gap-1.5"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: activeJuice.colors.accent }}
                      />
                      <span>{b}</span>
                    </span>
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
          <div className="p-4 sm:p-5 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-200 flex items-center gap-1.5 font-bold">
                <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                <span>3D View Presets</span>
              </span>

              {/* Auto-Rotate Switch with >=44px touch target */}
              <button
                type="button"
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-2 border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                  isAutoRotate
                    ? "border-white/30 text-white bg-zinc-900 shadow-sm"
                    : "border-white/10 text-zinc-400 hover:text-white bg-zinc-950/60"
                }`}
                aria-pressed={isAutoRotate}
                aria-label={`Toggle auto-rotation, currently ${isAutoRotate ? "on" : "off"}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAutoRotate ? "animate-pulse" : "opacity-40"
                  }`}
                  style={{
                    backgroundColor: isAutoRotate ? activeJuice.colors.accent : "#71717a",
                  }}
                />
                <span>Auto-Spin: {isAutoRotate ? "ON" : "OFF"}</span>
              </button>
            </div>

            {/* 4 View Angle Buttons with >=44px Touch Targets */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-xs font-mono">
              {(["front", "label", "tilt", "cap"] as const).map((preset) => {
                const isActive = viewPreset === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setViewPreset(preset)}
                    aria-pressed={isActive}
                    aria-label={`Set 3D view to ${preset === "tilt" ? "tilt 35 degrees" : preset}`}
                    className={`min-h-[44px] py-2.5 px-1 rounded-xl text-center border transition-all capitalize font-medium flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                      isActive
                        ? "bg-white text-zinc-950 font-bold border-white shadow-md scale-[1.02]"
                        : "bg-zinc-900/60 border-white/10 text-zinc-300 hover:text-white hover:border-white/25"
                    }`}
                  >
                    {preset === "tilt" ? "Tilt 35°" : preset}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-zinc-400" />
                <span>Drag bottle or scrub dial to rotate 360°</span>
              </span>
              <span className="text-zinc-400">100% Glass Sealed</span>
            </div>
          </div>
        </div>

        {/* Center Column (4 cols): Interactive 3D Canvas Stage */}
        <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col items-center gap-3">
          <div className="w-full h-[420px] sm:h-[500px] lg:h-[640px] relative rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/30 to-black/80 overflow-hidden shadow-2xl flex items-center justify-center group">
            {/* Interactive 3D Canvas */}
            <div
              className="absolute inset-0 z-10 touch-pan-y"
              style={{ touchAction: "pan-y" }}
              role="region"
              aria-label="Interactive 3D bottle stage"
            >
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

            {/* Mobile Previous / Next Touch Buttons Overlay (>=44px touch targets) */}
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 z-20 flex justify-between pointer-events-none">
              <button
                type="button"
                onClick={handlePrev}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 hover:border-white/40 flex items-center justify-center pointer-events-auto shadow-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 active:scale-95"
                aria-label="Previous formulation"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 hover:border-white/40 flex items-center justify-center pointer-events-auto shadow-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 active:scale-95"
                aria-label="Next formulation"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive touch hint overlay (fades after interaction) */}
            {!hasInteracted && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce">
                <div className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-mono text-zinc-300 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Swipe or drag bottle to inspect</span>
                </div>
              </div>
            )}

            {/* Floating Live Cold-Chain Tag */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 pointer-events-none">
              <div className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-mono text-zinc-200 flex items-center gap-1.5">
                <ThermometerSnowflake
                  className="w-3.5 h-3.5"
                  style={{ color: activeJuice.colors.accent }}
                />
                <span>36°F / 2.2°C Cold Extraction</span>
              </div>
            </div>

            {/* Floating Volume Tag */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 pointer-events-none">
              <div className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-mono text-zinc-200">
                350 mL // 11.8 OZ
              </div>
            </div>
          </div>

          {/* Obsidian Tactile 360° Scrub Dial Widget with Angle Markers & Degree Readout */}
          <div className="w-full p-4 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-2xl shadow-xl flex flex-col gap-3">
            {/* Header: Title & Dynamic Degree Readout */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-300 font-mono text-xs">
                <Sliders className="w-4 h-4 text-zinc-400" />
                <span className="font-bold uppercase tracking-wider">360° Scrub Dial</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleScrubChange(0)}
                  className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl border border-white/10 hover:border-white/30 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                  title="Reset to 0° Front"
                  aria-label="Reset bottle rotation to 0 degrees front view"
                >
                  Reset 0°
                </button>
                <span
                  className="font-mono text-sm font-extrabold px-2.5 py-0.5 rounded-md border text-right"
                  style={{
                    backgroundColor: `${activeJuice.colors.accent}15`,
                    borderColor: `${activeJuice.colors.accent}40`,
                    color: activeJuice.colors.accent,
                  }}
                >
                  {rotDegrees}°
                </span>
              </div>
            </div>

            {/* Tactile Tick Marks & Slider Track */}
            <div className="relative flex flex-col gap-1.5">
              {/* Ruler Tick Marks (Every 30 degrees) */}
              <div className="flex justify-between items-end px-1 h-3 pointer-events-none text-zinc-500">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360].map((deg) => {
                  const isMajor = deg % 90 === 0;
                  return (
                    <div key={deg} className="flex flex-col items-center">
                      <div
                        className={`w-0.5 rounded-full transition-colors ${
                          isMajor
                            ? "h-3 bg-zinc-300"
                            : "h-1.5 bg-zinc-600"
                        }`}
                        style={
                          Math.abs(rotDegrees - deg) < 15
                            ? { backgroundColor: activeJuice.colors.accent }
                            : undefined
                        }
                      />
                    </div>
                  );
                })}
              </div>

              {/* Accessible Range Input with Min 44px Touch Target Height */}
              <div className="relative py-1 min-h-[44px] flex items-center">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotDegrees}
                  onChange={(e) => handleScrubChange(Number(e.target.value))}
                  className="scrub-slider w-full h-8 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-lg"
                  role="slider"
                  aria-label="360 degree bottle rotation angle"
                  aria-valuenow={rotDegrees}
                  aria-valuemin={0}
                  aria-valuemax={360}
                />
              </div>

              {/* Angle Markers / Snap Pills with >=44px Touch Targets */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {anglePresets.map((preset) => {
                  const isSnapActive = Math.abs(rotDegrees - preset.deg) < 15;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleScrubChange(preset.deg)}
                      aria-pressed={isSnapActive}
                      aria-label={`Snap bottle rotation to ${preset.label} view at ${preset.deg} degrees`}
                      className={`min-h-[44px] py-2 px-1 rounded-xl text-center border font-mono text-[11px] font-medium transition-all flex flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                        isSnapActive
                          ? "bg-zinc-900 border-white/40 text-white font-bold shadow-sm"
                          : "bg-zinc-950 border-white/10 text-zinc-400 hover:text-white hover:border-white/25"
                      }`}
                      style={
                        isSnapActive
                          ? { color: activeJuice.colors.accent, borderColor: activeJuice.colors.accent }
                          : undefined
                      }
                    >
                      <span>{preset.label}</span>
                      <span className="text-[9px] opacity-70 font-normal">{preset.deg}°</span>
                    </button>
                  );
                })}
              </div>
            </div>
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
        className="mt-12 sm:mt-16 p-5 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-2xl"
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
          <span className="text-[11px] sm:text-xs font-mono px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 self-start sm:self-auto">
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
                    tabIndex={0}
                    role="row"
                    aria-label={`Formula ${j.name} (${j.category}). ${j.nutrition.caloriesBottle} calories. Press Enter to inspect.`}
                    onClick={() => onSelectJuice(j)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectJuice(j);
                      }
                    }}
                    className={`cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-inset ${
                      isSelected ? "bg-zinc-900/80" : "hover:bg-zinc-900/40"
                    }`}
                  >
                    <td className="py-3.5 font-bold text-white flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
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
                        type="button"
                        aria-label={`${isSelected ? "Active formula:" : "Inspect formula:"} ${j.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectJuice(j);
                        }}
                        className={`min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                          isSelected
                            ? "bg-white text-zinc-950 shadow-sm"
                            : "bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800"
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
