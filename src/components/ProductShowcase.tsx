"use client";

import React, { useState } from "react";
import { JuiceItem } from "@/types/juice";
import { BottleCanvasWrapper } from "@/components/BottleCanvasWrapper";
import { InteractiveNutritionLabel } from "@/components/InteractiveNutritionLabel";
import {
  RotateCcw,
  Sparkles,
  Maximize2,
  Droplets,
  Layers,
  ThermometerSnowflake,
  Eye,
  Compass,
  ArrowRight,
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

  const handleUserInteract = () => {
    setHasInteracted(true);
  };

  return (
    <section
      id="showcase"
      className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Dynamic Ambient Background Radiant Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[550px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 -z-10 opacity-35"
        style={{
          backgroundColor: activeJuice.colors.primary,
        }}
      />

      {/* Top 4-Product Modern Switcher Tabs */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
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
            Press tabs or drag 3D bottle to inspect
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {allJuices.map((juice, idx) => {
            const isSelected = juice.id === activeJuice.id;
            return (
              <button
                key={juice.id}
                onClick={() => onSelectJuice(juice)}
                className={`relative text-left p-4 rounded-2xl border transition-all duration-300 group overflow-hidden ${
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
                <div
                  className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                  }`}
                  style={{ backgroundColor: juice.colors.accent }}
                />

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

                <h3 className="mt-2 font-bold text-sm sm:text-base text-white font-sans tracking-tight">
                  {juice.name}
                </h3>
                <p className="text-[11px] text-zinc-400 mt-1 truncate">
                  {juice.tagline}
                </p>

                <div className="mt-3 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>{juice.nutrition.caloriesBottle} kcal</span>
                  <span className="font-semibold text-zinc-300">0g Added Sugar</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3-Column Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): Product Dossier & 3D Camera Controls */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl space-y-5">
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
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                {activeJuice.name}
              </h2>
              <p
                className="text-sm font-semibold tracking-wide mt-1 uppercase font-mono"
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
                  <span
                    key={b}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800/80 border border-white/10 text-zinc-200 flex items-center gap-1.5"
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
          </div>

          {/* Interactive 3D Bottle View Controls */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 font-bold">
                <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                <span>3D View Presets</span>
              </span>

              {/* Auto-Rotate Switch */}
              <button
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
              </button>
            </div>

            {/* 4 View Angle Buttons */}
            <div className="grid grid-cols-4 gap-2 text-xs font-mono">
              <button
                onClick={() => setViewPreset("front")}
                className={`py-2 px-1 rounded-xl text-center border transition-all ${
                  viewPreset === "front"
                    ? "bg-white text-zinc-950 font-bold border-white"
                    : "bg-zinc-800/40 border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setViewPreset("label")}
                className={`py-2 px-1 rounded-xl text-center border transition-all ${
                  viewPreset === "label"
                    ? "bg-white text-zinc-950 font-bold border-white"
                    : "bg-zinc-800/40 border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                Label
              </button>
              <button
                onClick={() => setViewPreset("tilt")}
                className={`py-2 px-1 rounded-xl text-center border transition-all ${
                  viewPreset === "tilt"
                    ? "bg-white text-zinc-950 font-bold border-white"
                    : "bg-zinc-800/40 border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                Tilt 35°
              </button>
              <button
                onClick={() => setViewPreset("cap")}
                className={`py-2 px-1 rounded-xl text-center border transition-all ${
                  viewPreset === "cap"
                    ? "bg-white text-zinc-950 font-bold border-white"
                    : "bg-zinc-800/40 border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                Cap
              </button>
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

        {/* Center Column (4 cols): Interactive 3D Canvas Stage */}
        <div className="lg:col-span-4 h-[560px] sm:h-[620px] lg:h-[680px] relative rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/30 to-black/60 overflow-hidden shadow-2xl flex items-center justify-center group">
          {/* Interactive 3D Canvas */}
          <div className="absolute inset-0 z-10">
            <BottleCanvasWrapper
              activeJuice={activeJuice}
              viewPreset={viewPreset}
              isAutoRotate={isAutoRotate}
              onUserInteract={handleUserInteract}
            />
          </div>

          {/* Interactive touch hint overlay (fades after interaction) */}
          {!hasInteracted && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce">
              <div className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[11px] font-mono text-zinc-300 flex items-center gap-2">
                <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Drag to Rotate 3D Model</span>
              </div>
            </div>
          )}

          {/* Floating Live Cold-Chain Tag */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
              <ThermometerSnowflake
                className="w-3 h-3"
                style={{ color: activeJuice.colors.accent }}
              />
              <span>36°F / 2.2°C Cold Extraction</span>
            </div>
          </div>

          {/* Floating Volume Tag */}
          <div className="absolute top-4 right-4 z-20 pointer-events-none">
            <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300">
              350 mL // 11.8 FL OZ
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Interactive Swiss Nutrition HUD */}
        <div id="nutrition" className="lg:col-span-4 w-full">
          <InteractiveNutritionLabel
            juice={activeJuice}
            allJuices={allJuices}
            onSelectJuice={onSelectJuice}
          />
        </div>
      </div>

      {/* Cross-Product Matrix Comparison Bar */}
      <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white font-sans tracking-tight">
              Four-Formulation Comparison Matrix
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Zero synthetic fillers • 100% Raw living botanical cell sap
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 self-start sm:self-auto">
            All 4 Formulations: 0g Added Sugars
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
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
      </div>
    </section>
  );
}
