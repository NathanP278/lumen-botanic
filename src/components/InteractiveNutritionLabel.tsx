"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JuiceItem, NutrientItem } from "@/types/juice";
import {
  Info,
  ShieldCheck,
  Zap,
  ChevronRight,
  Activity,
  CheckCircle2,
  X,
  Dna,
  Leaf,
  Layers,
} from "lucide-react";

interface InteractiveNutritionLabelProps {
  juice: JuiceItem;
  allJuices: JuiceItem[];
  onSelectJuice?: (juice: JuiceItem) => void;
}

export function InteractiveNutritionLabel({
  juice,
  allJuices,
  onSelectJuice,
}: InteractiveNutritionLabelProps) {
  const [servingMode, setServingMode] = useState<"bottle" | "100ml">("bottle");
  const [activeTab, setActiveTab] = useState<"facts" | "bioactives" | "extraction">("facts");
  const [selectedNutrient, setSelectedNutrient] = useState<NutrientItem | null>(null);

  // Keyboard accessibility: Dismiss open drawer on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedNutrient) {
        setSelectedNutrient(null);
      }
    },
    [selectedNutrient]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const calories =
    servingMode === "bottle" ? juice.nutrition.caloriesBottle : juice.nutrition.calories100ml;
  const servingText =
    servingMode === "bottle"
      ? juice.nutrition.servingSizeBottle
      : juice.nutrition.servingSize100ml;

  const tabs = [
    { id: "facts" as const, label: "Nutrition Facts", icon: Activity },
    { id: "bioactives" as const, label: "Bioactives", icon: Zap },
    { id: "extraction" as const, label: "Lab & Specs", icon: ShieldCheck },
  ];

  const handleTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentIdx: number
  ) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIdx = (currentIdx + 1) % tabs.length;
      setActiveTab(tabs[nextIdx].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIdx = (currentIdx - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prevIdx].id);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-3.5">
      {/* Accessible Tab Switcher with animated pill indicator and >=44px touch targets */}
      <div
        role="tablist"
        aria-label="Nutrition and science data tabs"
        className="flex items-center justify-between p-1 bg-zinc-950/80 rounded-2xl border border-white/10 text-xs font-mono relative backdrop-blur-xl"
      >
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 min-h-[44px] py-2.5 px-3 rounded-xl font-medium transition-colors text-center flex items-center justify-center gap-1.5 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                isActive ? "text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNutritionTab"
                  className="absolute inset-0 bg-white rounded-xl shadow-md"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <Icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Obsidian Card Container */}
      <motion.div
        key={juice.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl p-5 sm:p-6 bg-[#0c0c0e]/95 border border-white/10 backdrop-blur-2xl relative overflow-hidden transition-shadow duration-500 min-h-[480px]"
        style={{
          boxShadow: `0 0 40px -12px ${juice.colors.glow}, inset 0 1px 0 0 rgba(255, 255, 255, 0.08)`,
        }}
      >
        {/* Glowing top line matching active formulation */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: juice.colors.accent }}
          transition={{ duration: 0.4 }}
        />

        {/* TAB 1: INTERACTIVE NUTRITION FACTS */}
        {activeTab === "facts" && (
          <div
            role="tabpanel"
            id="panel-facts"
            aria-labelledby="tab-facts"
            className="text-zinc-100 font-sans"
          >
            {/* Header: Swiss Typography & SKU Badge */}
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
                  Nutrition Facts
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
                  Micro-filtered single-origin botanical formulation
                </p>
              </div>
              <span
                className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase border shrink-0"
                style={{
                  backgroundColor: `${juice.colors.accent}15`,
                  borderColor: `${juice.colors.accent}40`,
                  color: juice.colors.accent,
                }}
              >
                {juice.formulaCode || juice.sku}
              </span>
            </div>

            {/* Serving Size & Accessible Radiogroup Mode Selector */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block">
                  Serving Reference
                </span>
                <span className="text-xs font-semibold text-zinc-200 truncate block">
                  {servingText}
                </span>
              </div>

              {/* Segmented Toggle 350ml vs 100ml with >=44px Touch Targets & Arrow Key Nav */}
              <div
                role="radiogroup"
                aria-label="Serving size reference"
                className="inline-flex rounded-xl bg-zinc-950 p-1 border border-white/10 text-xs font-mono relative shrink-0"
              >
                <button
                  type="button"
                  role="radio"
                  id="serving-bottle"
                  tabIndex={servingMode === "bottle" ? 0 : -1}
                  aria-checked={servingMode === "bottle"}
                  onClick={() => setServingMode("bottle")}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowUp") {
                      e.preventDefault();
                      setServingMode("100ml");
                      document.getElementById("serving-100ml")?.focus();
                    }
                  }}
                  className={`relative min-h-[44px] px-3.5 py-2.5 rounded-lg transition-colors z-10 flex items-center justify-center font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                    servingMode === "bottle"
                      ? "text-white font-bold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {servingMode === "bottle" && (
                    <motion.div
                      layoutId="servingPill"
                      className="absolute inset-0 bg-zinc-800 rounded-lg border border-white/15"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">Bottle (350ml)</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  id="serving-100ml"
                  tabIndex={servingMode === "100ml" ? 0 : -1}
                  aria-checked={servingMode === "100ml"}
                  onClick={() => setServingMode("100ml")}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowUp") {
                      e.preventDefault();
                      setServingMode("bottle");
                      document.getElementById("serving-bottle")?.focus();
                    }
                  }}
                  className={`relative min-h-[44px] px-3.5 py-2.5 rounded-lg transition-colors z-10 flex items-center justify-center font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                    servingMode === "100ml"
                      ? "text-white font-bold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {servingMode === "100ml" && (
                    <motion.div
                      layoutId="servingPill"
                      className="absolute inset-0 bg-zinc-800 rounded-lg border border-white/15"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">100ml Standard</span>
                </button>
              </div>
            </div>

            {/* Swiss Calories Banner with Thick Rule */}
            <div className="mt-3.5 py-2.5 nutrition-rule-thick border-white flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 block">
                  Amount Per Serving
                </span>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
                  Calories
                </span>
              </div>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={`${servingMode}-${calories}`}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-white font-mono"
                >
                  {calories}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* % Daily Value Guide Header with Medium Rule */}
            <div className="py-2 text-right nutrition-rule-medium border-white/80">
              <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase">
                % Daily Value (% DV)*
              </span>
            </div>

            {/* Interactive Nutrient Rows (>=44px touch targets & WAI-ARIA) */}
            <div className="divide-y divide-white/[0.08] text-xs">
              {juice.nutrition.nutrients.map((n) => {
                const amount = servingMode === "bottle" ? n.amountBottle : n.amount100ml;
                const isSelected = selectedNutrient?.id === n.id;

                return (
                  <div key={n.id}>
                    <button
                      type="button"
                      aria-expanded={isSelected}
                      aria-controls={`mechanism-${n.id}`}
                      aria-label={`${n.name}, ${amount}${n.dvPercent !== null ? `, ${n.dvPercent}% daily value` : ""}. Click to ${isSelected ? "collapse" : "expand"} cellular bio-mechanism.`}
                      onClick={() => setSelectedNutrient(isSelected ? null : n)}
                      className={`w-full text-left py-3 px-2 flex items-center justify-between rounded-xl transition-all min-h-[44px] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                        isSelected
                          ? "bg-zinc-900 border-l-4 shadow-sm"
                          : "hover:bg-zinc-900/60"
                      }`}
                      style={
                        isSelected
                          ? { borderLeftColor: juice.colors.accent }
                          : undefined
                      }
                      title="Tap to inspect cellular bio-mechanism"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`${n.indent ? "pl-3 sm:pl-4" : ""} ${
                            n.bold ? "font-bold text-white" : "text-zinc-300"
                          } group-hover:text-white transition-colors`}
                        >
                          {n.name}
                        </span>
                        <span className="font-mono text-zinc-400 font-normal">
                          {amount}
                        </span>
                        <Info className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline-block" />
                      </div>

                      <div className="flex items-center gap-2">
                        {n.dvPercent !== null ? (
                          <span
                            className={`font-mono font-bold ${
                              n.dvPercent >= 50 ? "text-white" : "text-zinc-300"
                            }`}
                            style={
                              n.dvPercent >= 50
                                ? { color: juice.colors.accent }
                                : undefined
                            }
                          >
                            {n.dvPercent}%
                          </span>
                        ) : (
                          <span className="text-zinc-400 font-mono text-[10px]">—</span>
                        )}
                        <ChevronRight
                          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                            isSelected ? "rotate-90 text-white" : "group-hover:text-zinc-200"
                          }`}
                        />
                      </div>
                    </button>

                    {/* Expandable Cellular Bio-Mechanism Drawer */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          id={`mechanism-${n.id}`}
                          role="region"
                          aria-label={`${n.name} cellular bio-mechanism`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div
                            className="my-2.5 p-4 rounded-2xl border bg-zinc-950/90 relative shadow-inner"
                            style={{ borderColor: `${juice.colors.accent}60` }}
                          >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-white/10">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                                  style={{ backgroundColor: juice.colors.accent }}
                                />
                                <span className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                                  {n.name} Cellular Bio-Mechanism
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setSelectedNutrient(null)}
                                className="text-zinc-400 hover:text-white p-2.5 rounded-xl hover:bg-zinc-900 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                                aria-label="Close nutrient bio-mechanism drawer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Deep-Dive Grid: Botanical Origin, Pathway, Mechanism */}
                            <div className="mt-3 text-xs space-y-2.5">
                              {/* Botanical Origin */}
                              <div className="flex items-start gap-2">
                                <Leaf className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase block">
                                    Botanical Origin
                                  </span>
                                  <span className="text-zinc-200 font-medium leading-relaxed">
                                    {n.source}
                                  </span>
                                </div>
                              </div>

                              {/* Cellular Absorption Pathway */}
                              {n.pathway && (
                                <div className="flex items-start gap-2">
                                  <Dna
                                    className="w-3.5 h-3.5 shrink-0 mt-0.5"
                                    style={{ color: juice.colors.accent }}
                                  />
                                  <div>
                                    <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase block">
                                      Cellular Absorption Pathway
                                    </span>
                                    <span className="text-zinc-200 font-mono text-[11px] leading-relaxed">
                                      {n.pathway}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Biochemical Mechanism */}
                              <div className="flex items-start gap-2">
                                <Layers className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase block">
                                    Biochemical Mechanism
                                  </span>
                                  <span className="text-zinc-300 leading-relaxed block">
                                    {n.mechanism}
                                  </span>
                                </div>
                              </div>

                              {/* Daily Value Progress Gauge */}
                              {n.dvPercent !== null && (
                                <div className="pt-2 border-t border-white/10">
                                  <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1.5">
                                    <span>Daily Value Target (DV)</span>
                                    <span
                                      className="font-bold font-mono"
                                      style={{ color: juice.colors.accent }}
                                    >
                                      {n.dvPercent}% DV
                                    </span>
                                  </div>
                                  <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-white/10">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{
                                        width: `${Math.min(100, n.dvPercent)}%`,
                                      }}
                                      transition={{ duration: 0.6, ease: "easeOut" }}
                                      className="h-full rounded-full"
                                      style={{
                                        backgroundColor: juice.colors.accent,
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Swiss Nutrition Footer Note */}
            <p className="mt-4 text-[10px] text-zinc-400 leading-relaxed font-mono border-t border-white/10 pt-3">
              * The % Daily Value (DV) tells you how much a nutrient in a serving contributes to a
              daily diet of 2,000 calories. Cold-extracted, 0g synthetic additives.
            </p>
          </div>
        )}

        {/* TAB 2: BIOACTIVES & PHYTOCHEMICALS */}
        {activeTab === "bioactives" && (
          <div
            role="tabpanel"
            id="panel-bioactives"
            aria-labelledby="tab-bioactives"
            className="text-zinc-100 font-sans space-y-3.5"
          >
            <div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                Molecular Matrix
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Quantified Bioactive Actives
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 font-sans">
                Active phytonutrients preserved intact under 15,000 PSI cold extraction.
              </p>
            </div>

            <div className="space-y-2.5">
              {juice.nutrition.bioactives.map((b, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -1 }}
                  className="p-3.5 rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white">
                      {b.name}
                    </span>
                    <span
                      className="font-mono font-bold text-xs px-2.5 py-1 rounded-md border"
                      style={{
                        backgroundColor: `${juice.colors.accent}15`,
                        borderColor: `${juice.colors.accent}40`,
                        color: juice.colors.accent,
                      }}
                    >
                      {b.amount}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-zinc-400 space-y-1">
                    <p className="flex items-center gap-1 text-zinc-300">
                      <span className="font-mono text-zinc-400 text-[10px] uppercase">
                        Target:
                      </span>{" "}
                      {b.targetOrgan}
                    </p>
                    <p className="leading-relaxed">{b.mechanism}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Living Enzyme Purity Indicator */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2
                  className="w-5 h-5"
                  style={{ color: juice.colors.accent }}
                />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Living Enzyme Integrity
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Micro-filtered at 36°F (Zero Thermal Degradation)
                  </span>
                </div>
              </div>
              <span
                className="font-mono font-extrabold text-sm"
                style={{ color: juice.colors.accent }}
              >
                {juice.stats.enzymePurity}
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: EXTRACTION & BOTANICAL LAB SPECS */}
        {activeTab === "extraction" && (
          <div
            role="tabpanel"
            id="panel-extraction"
            aria-labelledby="tab-extraction"
            className="text-zinc-100 font-sans space-y-3.5"
          >
            <div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                Extraction Protocol
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Cellular Engineering Specs
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Zero heat, zero pasteurization, zero nitrogen oxidation.
              </p>
            </div>

            {/* 4 Technical Metrics */}
            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                  Hydraulic Force
                </span>
                <span className="font-mono font-extrabold text-base text-white">
                  {juice.stats.coldPressPsi}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5 font-sans">
                  Cellular Wall Burst
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                  Thermal Boundary
                </span>
                <span className="font-mono font-extrabold text-base text-white">
                  {juice.stats.temperature}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5 font-sans">
                  Cold-Chain Guard
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                  Bioactive Purity
                </span>
                <span
                  className="font-mono font-extrabold text-base"
                  style={{ color: juice.colors.accent }}
                >
                  {juice.stats.enzymePurity}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5 font-sans">
                  Active Pectinase
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                  Equilibrium pH
                </span>
                <span className="font-mono font-extrabold text-base text-white">
                  {juice.stats.phLevel}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5 font-sans">
                  Physiologic Safe
                </span>
              </div>
            </div>

            {/* Sourced Botanical Ingredients List */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                Single-Origin Provenance
              </span>
              <div className="divide-y divide-white/[0.08] rounded-2xl bg-zinc-950/50 border border-white/10 overflow-hidden">
                {juice.ingredients.map((ing, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white block">{ing.name}</span>
                      <span className="text-[10px] text-zinc-400 font-sans">{ing.role}</span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 text-right">
                      {ing.origin}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Compare Selector Bar for the 4 Formulations with >=44px touch targets */}
      <div
        role="region"
        aria-label="Quick formulation switcher"
        className="p-3.5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl flex items-center justify-between text-xs"
      >
        <span className="text-zinc-400 font-mono text-[11px] font-medium">
          Compare 4 Formulations:
        </span>
        <div className="flex items-center gap-2">
          {allJuices.map((j) => {
            const isCurrent = j.id === juice.id;
            return (
              <motion.button
                key={j.id}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => onSelectJuice && onSelectJuice(j)}
                aria-label={`Switch to ${j.name} (${j.sku})`}
                aria-pressed={isCurrent}
                className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                  isCurrent
                    ? "text-white shadow-md scale-105"
                    : "border-white/10 text-zinc-400 hover:text-white hover:border-white/30 bg-zinc-900/60"
                }`}
                style={
                  isCurrent
                    ? {
                        backgroundColor: `${j.colors.accent}25`,
                        borderColor: j.colors.accent,
                        boxShadow: `0 0 16px -4px ${j.colors.glow}`,
                      }
                    : undefined
                }
                title={`${j.name} (${j.category})`}
              >
                {j.sku.split("-")[1]}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
