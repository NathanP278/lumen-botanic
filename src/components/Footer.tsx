"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#050C09] border-t border-botanic-forest/80 pt-16 pb-12 text-botanic-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-botanic-forest/50">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-2xl font-serif tracking-[0.25em] text-botanic-cream block">
              LUMEN
            </span>
            <span className="text-[10px] tracking-[0.35em] text-botanic-gold font-sans uppercase block font-semibold">
              Botanic Atelier
            </span>
            <p className="text-xs text-botanic-sage max-w-sm leading-relaxed font-light mt-2">
              Haute botanical cold-press extraction. Micro-crushed in cleanrooms under 15,000 lbs
              of hydraulic force to preserve unadulterated live plant enzymes.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-botanic-gold font-semibold mb-4">
              Formulations
            </p>
            <ul className="space-y-2 text-xs text-botanic-sage">
              <li><a href="#formulations" className="hover:text-botanic-cream transition-colors">Chlorophyll Verdant</a></li>
              <li><a href="#formulations" className="hover:text-botanic-cream transition-colors">Solar Curcumin Gold</a></li>
              <li><a href="#formulations" className="hover:text-botanic-cream transition-colors">Blood Root Elixir</a></li>
              <li><a href="#formulations" className="hover:text-botanic-cream transition-colors">Obsidian Purifier</a></li>
              <li><a href="#box-builder" className="hover:text-botanic-gold transition-colors font-medium">Curate 6-Pack Box</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-botanic-gold font-semibold mb-4">
              Rituals & Quality
            </p>
            <ul className="space-y-2 text-xs text-botanic-sage">
              <li><a href="#philosophy" className="hover:text-botanic-cream transition-colors">Hydraulic Cleanroom</a></li>
              <li><a href="#sustainability" className="hover:text-botanic-cream transition-colors">Biodynamic Farms</a></li>
              <li><a href="#" className="hover:text-botanic-cream transition-colors">Third-Party Heavy Metal Tests</a></li>
              <li><a href="#" className="hover:text-botanic-cream transition-colors">Apothecary Glass Circularity</a></li>
              <li><a href="#" className="hover:text-botanic-cream transition-colors">Cold-Chain Eco Logistics</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-botanic-gold font-semibold">
              The Botanical Gazette
            </p>
            <p className="text-xs text-botanic-sage leading-relaxed">
              Receive private notifications for limited micro-batch solar harvests and seasonal botanicals.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-botanic-gold py-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are on the private harvest list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-4 py-2.5 rounded-lg bg-botanic-forest/40 border border-botanic-forest text-xs text-botanic-cream placeholder:text-botanic-sage/60 focus:outline-none focus:border-botanic-gold transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-md bg-botanic-gold hover:bg-botanic-goldLight text-botanic-dark transition-colors flex items-center justify-center"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Legal and disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-botanic-sage/70">
          <p>© {new Date().getFullYear()} LUMEN Botanic Atelier Inc. All rights reserved.</p>
          <p className="text-center md:text-right max-w-xl">
            *These statements have not been evaluated by the FDA. This raw unpasteurized cold-pressed beverage is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
}
