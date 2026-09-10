"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { JuiceItem } from "@/types/juice";

interface FooterProps {
  allJuices: JuiceItem[];
  onSelectJuice: (juice: JuiceItem) => void;
}

export function Footer({ allJuices, onSelectJuice }: FooterProps) {
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
    <footer className="bg-black border-t border-white/[0.08] pt-16 pb-12 text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/[0.08]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-[-0.04em] text-white">
                LUMEN
              </span>
              <span className="text-zinc-400 font-mono text-xs">//</span>
              <span className="text-xs tracking-[0.2em] text-zinc-400 font-mono uppercase">
                BOTANICA
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed font-sans">
              Precision botanical cold-press formulations. Micro-extracted under 15,000 PSI hydraulic force
              at 36°F to preserve raw living cellular enzymes and maximum phytochemical bioavailability.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>LAB-CERTIFIED BATCH STATUS: ACTIVE</span>
            </div>
          </div>

          {/* Formulations Quick Switch */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white font-mono font-semibold mb-4">
              Formulations
            </p>
            <ul className="space-y-2 text-xs font-mono">
              {allJuices.map((j) => (
                <li key={j.id}>
                  <button
                    onClick={() => {
                      onSelectJuice(j);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: j.colors.accent }}
                    />
                    <span>{j.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white font-mono font-semibold mb-4">
              Science & Labs
            </p>
            <ul className="space-y-2 text-xs font-mono text-zinc-400">
              <li><a href="#technology" className="hover:text-white transition-colors">15,000 PSI Hydraulic</a></li>
              <li><a href="#technology" className="hover:text-white transition-colors">36°F Cold Chain</a></li>
              <li><a href="#nutrition" className="hover:text-white transition-colors">Phytochemical Matrix</a></li>
              <li><a href="#nutrition" className="hover:text-white transition-colors">Interactive Nutrition HUD</a></li>
              <li><span className="text-zinc-400">UV Glass Sealing</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-white font-mono font-semibold">
              Research Dispatch
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Subscribe for laboratory harvest reports and bioactive phytochemical releases.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 py-2 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscribed to research feed.</span>
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
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-white/30 transition-colors font-mono"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-1 top-1 bottom-1 px-3 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-colors flex items-center justify-center font-bold"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Legal and FDA statement */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400 font-mono">
          <p>© {new Date().getFullYear()} LUMEN BOTANICA. All rights reserved.</p>
          <p className="text-center md:text-right max-w-xl text-[10px] leading-relaxed text-zinc-400">
            *These statements have not been evaluated by the FDA. This cold-pressed botanical beverage is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
}
