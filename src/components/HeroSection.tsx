"use client";

import React from "react";
import { ArrowRight, ShieldCheck, Sparkles, Droplets, Leaf } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden">
      {/* Background ambient radiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[500px] bg-gradient-to-br from-botanic-moss/20 via-botanic-gold/10 to-transparent rounded-full blur-3xl pointer-events-none ambient-glow-pulse" />

      {/* Content overlay */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-between min-h-[75vh]">
        {/* Top badge */}
        <div className="pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-botanic-gold/40 text-botanic-gold text-xs uppercase tracking-[0.2em] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-botanic-gold" />
            <span>Autumn Botanical Vintage • Micro-Batch Harvest</span>
          </div>
        </div>

        {/* Hero headline & copy */}
        <div className="max-w-xl my-auto py-12 pointer-events-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tight text-botanic-cream leading-[1.08]">
            Pure Liquid <br />
            <span className="italic font-light gold-gradient-text">Vitality.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-botanic-sand/80 font-light leading-relaxed max-w-lg">
            Hydraulically cold-pressed at 36°F without heat or pasteurization.
            Single-origin wild botanicals formulated to restore cellular energy and luminous radiance.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#formulations"
              className="px-7 py-3.5 rounded-full bg-botanic-gold hover:bg-botanic-goldLight text-botanic-dark font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-lg hover:shadow-botanic-gold/20 flex items-center gap-2"
            >
              <span>Explore Formulations</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#box-builder"
              className="px-7 py-3.5 rounded-full glass-panel glass-panel-hover text-botanic-cream hover:text-botanic-gold font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all"
            >
              Curate 6-Pack Ritual
            </a>
          </div>
        </div>

        {/* Bottom luxury metrics / certifications */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-botanic-forest/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-botanic-forest/50 border border-botanic-moss/40 text-botanic-gold">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-botanic-cream">Hydraulic Press</p>
              <p className="text-[11px] text-botanic-sage">15,000 lbs force • Zero Heat</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-botanic-forest/50 border border-botanic-moss/40 text-botanic-gold">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-botanic-cream">100% Biodynamic</p>
              <p className="text-[11px] text-botanic-sage">Heirloom Soil Certified</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-botanic-forest/50 border border-botanic-moss/40 text-botanic-gold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-botanic-cream">Micro-Filtered 36°F</p>
              <p className="text-[11px] text-botanic-sage">Live Enzymes Preserved</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-botanic-forest/50 border border-botanic-moss/40 text-botanic-gold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-botanic-cream">Amber UV Glass</p>
              <p className="text-[11px] text-botanic-sage">Infinitely Recyclable</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
