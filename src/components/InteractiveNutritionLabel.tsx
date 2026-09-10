"use client";

import React, { useState } from "react";
import { JuiceItem, NutrientItem } from "@/types/juice";
import {
  Sparkles,
  Info,
  ShieldCheck,
  Zap,
  Leaf,
  ChevronRight,
  Activity,
  CheckCircle2,
  X,
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

  const calories =
    servingMode === "bottle" ? juice.nutrition.caloriesBottle : juice.nutrition.calories100ml;
  const servingText =
    servingMode === "bottle"
      ? juice.nutrition.servingSizeBottle
      : juice.nutrition.servingSize100ml;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between p-1 bg-zinc-900/80 rounded-xl border border-white/10 text-xs font-mono">
        <button
          onClick={() => setActiveTab("facts")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
            activeTab === "facts"
              ? "bg-white text-zinc-950 font-bold shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Nutrition Facts</span>
        </button>
        <button
          onClick={() => setActiveTab("bioactives")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
            activeTab === "bioactives"
              ? "bg-white text-zinc-950 font-bold shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Bioactives</span>
        </button>
        <button
          onClick={() => setActiveTab("extraction")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
            activeTab === "extraction"
              ? "bg-white text-zinc-950 font-bold shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Lab & Specs</span>
        </button>
      </div>

      {/* Main Card Container */}
      <div
        className="rounded-2xl p-6 bg-[#0c0c0e]/90 border border-white/10 backdrop-blur-xl relative overflow-hidden transition-all duration-300"
        style={{
          boxShadow: `0 0 35px -10px ${juice.colors.glow}`,
        }}
      >
        {/* Glowing top line matching active juice */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: juice.colors.accent }}
        />

        {/* TAB 1: INTERACTIVE NUTRITION FACTS */}
        {activeTab === "facts" && (
          <div className="text-zinc-100 font-sans">
            {/* Header */}
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight text-white uppercase font-sans">
                  Nutrition Facts
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Micro-filtered single-origin botanical formulation
                </p>
              </div>
              <span
                className="px-2.5 py-1 rounded text-[11px] font-mono font-bold tracking-wider uppercase border"
                style={{
                  backgroundColor: `${juice.colors.accent}15`,
                  borderColor: `${juice.colors.accent}40`,
                  color: juice.colors.accent,
                }}
              >
                {juice.sku}
              </span>
            </div>

            {/* Serving Size & Interactive Mode Selector */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block">
                  Serving Size
                </span>
                <span className="text-xs font-semibold text-zinc-200">{servingText}</span>
              </div>

              {/* Toggle 350ml vs 100ml */}
              <div className="inline-flex rounded-lg bg-zinc-900 p-0.5 border border-white/10 text-[11px] font-mono">
                <button
                  onClick={() => setServingMode("bottle")}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    servingMode === "bottle"
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Bottle (350ml)
                </button>
                <button
                  onClick={() => setServingMode("100ml")}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    servingMode === "100ml"
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  100ml
                </button>
              </div>
            </div>

            {/* Calories Banner */}
            <div className="mt-3 py-3 border-y-8 border-white/90 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 block">
                  Amount Per Serving
                </span>
                <span className="text-3xl font-extrabold tracking-tight text-white">
                  Calories
                </span>
              </div>
              <span className="text-4xl font-extrabold tracking-tighter text-white font-mono">
                {calories}
              </span>
            </div>

            {/* % Daily Value Guide Header */}
            <div className="py-2 text-right border-b border-white/15">
              <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase">
                % Daily Value (% DV)*
              </span>
            </div>

            {/* Interactive Nutrient Rows */}
            <div className="divide-y divide-white/[0.08] text-xs">
              {juice.nutrition.nutrients.map((n) => {
                const amount = servingMode === "bottle" ? n.amountBottle : n.amount100ml;
                const isSelected = selectedNutrient?.id === n.id;

                return (
                  <button
                    key={n.id}
                    onClick={() =>
                      setSelectedNutrient(isSelected ? null : n)
                    }
                    className={`w-full text-left py-2 px-1.5 flex items-center justify-between rounded transition-all group ${
                      isSelected
                        ? "bg-zinc-800/90 border-l-2"
                        : "hover:bg-zinc-800/40"
                    }`}
                    style={
                      isSelected
                        ? { borderLeftColor: juice.colors.accent }
                        : undefined
                    }
                    title="Click to inspect cellular bio-mechanism"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`${n.indent ? "pl-4" : ""} ${
                          n.bold ? "font-bold text-white" : "text-zinc-300"
                        } group-hover:text-white transition-colors`}
                      >
                        {n.name}
                      </span>
                      <span className="font-mono text-zinc-400 font-normal">
                        {amount}
                      </span>
                      <Info className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="flex items-center gap-1">
                      {n.dvPercent !== null ? (
                        <span
                          className={`font-mono font-bold ${
                            n.dvPercent >= 50
                              ? "text-white"
                              : "text-zinc-300"
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
                        className={`w-3 h-3 text-zinc-400 transition-transform ${
                          isSelected ? "rotate-90 text-white" : ""
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Nutrient Deep-Dive Drawer */}
            {selectedNutrient && (
              <div
                className="mt-4 p-3.5 rounded-xl border bg-zinc-900/90 animate-fadeIn relative"
                style={{ borderColor: `${juice.colors.accent}50` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: juice.colors.accent }}
                    />
                    <span className="font-bold text-xs text-white uppercase tracking-wider">
                      {selectedNutrient.name} Deep Dive
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedNutrient(null)}
                    className="text-zinc-400 hover:text-white p-0.5"
                    aria-label="Close nutrient details"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-2 text-[11px] space-y-1.5">
                  <div>
                    <span className="text-zinc-400 font-mono block">Plant Source:</span>
                    <span className="text-zinc-200 font-medium">{selectedNutrient.source}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-mono block">Cellular Mechanism:</span>
                    <span className="text-zinc-300 leading-relaxed block">
                      {selectedNutrient.mechanism}
                    </span>
                  </div>
                  {selectedNutrient.dvPercent !== null && (
                    <div className="pt-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                        <span>Daily Value Target</span>
                        <span style={{ color: juice.colors.accent }}>
                          {selectedNutrient.dvPercent}% DV
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, selectedNutrient.dvPercent)}%`,
                            backgroundColor: juice.colors.accent,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Micro-Nutrient Footer Note */}
            <p className="mt-4 text-[10px] text-zinc-400 leading-relaxed font-mono border-t border-white/10 pt-3">
              * The % Daily Value (DV) tells you how much a nutrient in a serving contributes to a
              daily diet of 2,000 calories. Cold-extracted, 0g synthetic additives.
            </p>
          </div>
        )}

        {/* TAB 2: BIOACTIVES & PHYTOCHEMICALS */}
        {activeTab === "bioactives" && (
          <div className="text-zinc-100 font-sans space-y-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                Molecular Matrix
              </span>
              <h3 className="text-xl font-bold tracking-tight text-white">
                Quantified Bioactive Actives
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Active phytonutrients preserved intact under 15,000 PSI cold extraction.
              </p>
            </div>

            <div className="space-y-3">
              {juice.nutrition.bioactives.map((b, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-zinc-900/70 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white">
                      {b.name}
                    </span>
                    <span
                      className="font-mono font-bold text-xs px-2 py-0.5 rounded border"
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
                      <span className="font-mono text-zinc-400 text-[10px] uppercase">Target:</span>{" "}
                      {b.targetOrgan}
                    </p>
                    <p className="leading-relaxed">{b.mechanism}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Living Enzyme Purity Indicator */}
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/10 flex items-center justify-between">
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
          <div className="text-zinc-100 font-sans space-y-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                Extraction Protocol
              </span>
              <h3 className="text-xl font-bold tracking-tight text-white">
                Cellular Engineering Specs
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Zero heat, zero pasteurization, zero nitrogen oxidation.
              </p>
            </div>

            {/* 4 Technical Metrics */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                  Hydraulic Force
                </span>
                <span className="font-mono font-extrabold text-base text-white">
                  {juice.stats.coldPressPsi}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Cellular Wall Burst</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                  Thermal Boundary
                </span>
                <span className="font-mono font-extrabold text-base text-white">
                  {juice.stats.temperature}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Cold-Chain Guard</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                  Bioactive Purity
                </span>
                <span
                  className="font-mono font-extrabold text-base"
                  style={{ color: juice.colors.accent }}
                >
                  {juice.stats.enzymePurity}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Active Pectinase</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                  Equilibrium pH
                </span>
                <span className="font-mono font-extrabold text-base text-white">
                  {juice.stats.phLevel}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Physiologic Safe</span>
              </div>
            </div>

            {/* Sourced Botanical Ingredients List */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                Single-Origin Provenance
              </span>
              <div className="divide-y divide-white/[0.08] rounded-xl bg-zinc-900/40 border border-white/10 overflow-hidden">
                {juice.ingredients.map((ing, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-white block">{ing.name}</span>
                      <span className="text-[10px] text-zinc-400">{ing.role}</span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400">{ing.origin}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Compare Selector Bar for the 4 Products */}
      <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center justify-between text-xs">
        <span className="text-zinc-400 font-mono text-[11px]">Compare 4 Formulations:</span>
        <div className="flex items-center gap-1.5">
          {allJuices.map((j) => (
            <button
              key={j.id}
              onClick={() => onSelectJuice && onSelectJuice(j)}
              className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center border ${
                j.id === juice.id
                  ? "border-white text-white shadow-sm scale-110"
                  : "border-white/10 text-zinc-400 hover:text-white hover:border-white/30"
              }`}
              style={
                j.id === juice.id
                  ? { backgroundColor: `${j.colors.accent}30`, borderColor: j.colors.accent }
                  : undefined
              }
              title={j.name}
            >
              {j.sku.split("-")[1]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
