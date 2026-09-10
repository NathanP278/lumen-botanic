import React from "react";
import Image from "next/image";
import { Droplets, Sun, Sparkles, Sprout } from "lucide-react";

export function PhilosophySection() {
  return (
    <section id="philosophy" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Intro Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
        <div className="relative h-[480px] rounded-3xl overflow-hidden glass-panel border-botanic-forest/80 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80"
            alt="Cold-pressed organic fresh herbs and botanicals"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08130E] via-[#08130E]/20 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <span className="text-xs uppercase tracking-[0.25em] text-botanic-gold font-bold">
              The Extraction Chamber
            </span>
            <p className="mt-2 text-xl font-serif text-botanic-cream">
              3.5 lbs of heirloom botanical matter micro-crushed into every single 350ml elixir.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-botanic-forest/50 text-botanic-gold text-xs uppercase tracking-widest font-semibold">
            <Sun className="w-3.5 h-3.5 text-botanic-gold" />
            <span>The Science of Unaltered Vitality</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif text-botanic-cream leading-tight">
            Blade Friction Destroys. <br />
            <span className="italic gold-gradient-text">Hydraulic Pressure Preserves.</span>
          </h2>

          <p className="text-sm sm:text-base text-botanic-sand/80 leading-relaxed font-light">
            Conventional juicers spin high-velocity steel blades at 15,000 RPM, generating friction heat that
            instantly oxidizes fragile bioflavonoids and denatures live enzymes.
          </p>

          <p className="text-sm sm:text-base text-botanic-sand/80 leading-relaxed font-light">
            LUMEN operates under cold hydraulic presses exerting 15,000 lbs of smooth, steady pressure in a
            temperature-controlled 36°F cleanroom. The result: liquid nectar with unmatched nutrient density and
            living cellular integrity.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl glass-panel border-botanic-forest">
              <span className="block text-3xl font-serif text-botanic-gold font-bold">15,000 lbs</span>
              <span className="text-xs text-botanic-sage uppercase tracking-wider mt-1 block">
                Pure Hydraulic Force
              </span>
            </div>
            <div className="p-4 rounded-xl glass-panel border-botanic-forest">
              <span className="block text-3xl font-serif text-botanic-gold font-bold">36°F</span>
              <span className="text-xs text-botanic-sage uppercase tracking-wider mt-1 block">
                Constant Cold Chamber
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillars */}
      <div id="sustainability" className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl glass-panel glass-panel-hover border-botanic-forest/80 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-botanic-forest/60 flex items-center justify-center text-botanic-gold">
            <Droplets className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif text-botanic-cream">Zero Water Dilution</h3>
          <p className="text-xs sm:text-sm text-botanic-sage leading-relaxed font-light">
            We never dilute with filtered tap water, concentrates, synthetic vitamins, or cane sugars.
            Every drop is 100% pure plant cell sap extracted directly from living roots and greens.
          </p>
        </div>

        <div className="p-8 rounded-2xl glass-panel glass-panel-hover border-botanic-forest/80 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-botanic-forest/60 flex items-center justify-center text-botanic-gold">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif text-botanic-cream">Biodynamic Terroir</h3>
          <p className="text-xs sm:text-sm text-botanic-sage leading-relaxed font-light">
            Sourced exclusively from certified organic regenerative farms that enrich topsoil ecology
            and harvest according to lunar planting cycles for supreme secondary metabolite concentrations.
          </p>
        </div>

        <div className="p-8 rounded-2xl glass-panel glass-panel-hover border-botanic-forest/80 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-botanic-forest/60 flex items-center justify-center text-botanic-gold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif text-botanic-cream">Recyclable Apothecary Glass</h3>
          <p className="text-xs sm:text-sm text-botanic-sage leading-relaxed font-light">
            Bottled exclusively in UV-filtering apothecary glass that shields photosensitive phytonutrients
            and guarantees zero microplastic leaching into your daily ritual.
          </p>
        </div>
      </div>
    </section>
  );
}
