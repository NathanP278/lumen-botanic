"use client";

import React from "react";
import Image from "next/image";
import { Droplets, ShieldCheck, Zap, Sparkles, Gauge, Snowflake, Disc } from "lucide-react";

export function PhilosophySection() {
  return (
    <section id="technology" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 text-xs font-mono uppercase tracking-widest mb-4">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Extraction Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
          Blade Friction Destroys. <br />
          <span className="text-zinc-400">Hydraulic Force Preserves.</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
          Conventional centrifugal juicers spin steel blades at 15,000 RPM, generating friction heat
          that shears cellular walls and oxidizes delicate bioflavonoids. LUMEN utilizes 15,000 PSI
          hydraulic pressure at a continuous 36°F cold chain.
        </p>
      </div>

      {/* Grid of 3 Core Technology Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-white/20 transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-emerald-400 border border-white/10">
            <Gauge className="w-6 h-6" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-bold text-white font-sans">15,000 PSI Pressure</h3>
            <span className="text-xs font-mono text-emerald-400 font-semibold">HYDRAULIC</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Smooth hydraulic compression gently releases living plant cell sap without shearing or aeration.
            Enzymes remain completely unoxidized, retaining 99.8% biological activity.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-white/20 transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-amber-400 border border-white/10">
            <Snowflake className="w-6 h-6" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-bold text-white font-sans">36°F Cleanroom</h3>
            <span className="text-xs font-mono text-amber-400 font-semibold">COLD-CHAIN</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            From heirloom harvest to nitrogen glass sealing, formulations never exceed 36°F (2.2°C).
            Zero pasteurization, zero HPP pressure heat waves, zero synthetic preservatives.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-white/20 transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-violet-400 border border-white/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-bold text-white font-sans">Pure Glass Seal</h3>
            <span className="text-xs font-mono text-violet-400 font-semibold">100% INERT</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Bottled exclusively in UV-filtering recyclable glass with nitrogen purge.
            Completely free from endocrine disruptors, BPA, phthalates, and microplastic leeching.
          </p>
        </div>
      </div>
    </section>
  );
}
