"use client";

import React, { useState } from "react";
import { JuiceItem } from "@/types/juice";
import { Sparkles, Compass, Shield, Activity, Menu, X } from "lucide-react";

interface NavbarProps {
  activeJuice: JuiceItem;
  allJuices: JuiceItem[];
  onSelectJuice: (juice: JuiceItem) => void;
}

export function Navbar({ activeJuice, allJuices, onSelectJuice }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.08] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Monogram & Live Status */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="flex items-center gap-2 group focus:outline-none"
            aria-label="LUMEN BOTANICA Home"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-extrabold tracking-[-0.04em] text-white font-sans">
                LUMEN
              </span>
              <span className="text-zinc-400 font-mono text-xs">//</span>
              <span className="text-xs tracking-[0.2em] text-zinc-400 font-mono uppercase">
                BOTANICA
              </span>
            </div>
          </a>

          {/* System Cold-Chain Telemetry Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-[11px] font-mono text-zinc-300">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: activeJuice.colors.accent }}
            />
            <span>36°F COLD-CHAIN</span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-400">15,000 PSI</span>
          </div>
        </div>

        {/* Center: 4-Product Quick Navigator */}
        <nav
          className="hidden md:flex items-center p-1 rounded-xl bg-zinc-900/80 border border-white/10"
          aria-label="Formulation Switcher"
        >
          {allJuices.map((juice, idx) => {
            const isActive = juice.id === activeJuice.id;
            return (
              <button
                key={juice.id}
                onClick={() => onSelectJuice(juice)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? "bg-zinc-800 text-white font-bold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{
                    backgroundColor: isActive ? juice.colors.accent : "rgba(255,255,255,0.2)",
                  }}
                />
                <span>
                  0{idx + 1} {juice.name.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right: Section Navigation Links */}
        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-mono uppercase tracking-wider text-zinc-400">
            <a href="#showcase" className="hover:text-white transition-colors">
              Studio
            </a>
            <a href="#nutrition" className="hover:text-white transition-colors">
              Nutrition HUD
            </a>
            <a href="#technology" className="hover:text-white transition-colors">
              Extraction Tech
            </a>
          </nav>

          {/* Active Formula Indicator Badge */}
          <div
            className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase border hidden sm:inline-flex items-center gap-1.5"
            style={{
              backgroundColor: `${activeJuice.colors.accent}15`,
              borderColor: `${activeJuice.colors.accent}40`,
              color: activeJuice.colors.accent,
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span>{activeJuice.sku}</span>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#09090b]/98 border-b border-white/10 px-6 py-6 space-y-4">
          <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block">
            Select Formulation:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {allJuices.map((juice, idx) => (
              <button
                key={juice.id}
                onClick={() => {
                  onSelectJuice(juice);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all ${
                  juice.id === activeJuice.id
                    ? "bg-zinc-800 border-white text-white font-bold"
                    : "bg-zinc-900/50 border-white/10 text-zinc-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: juice.colors.accent }}
                  />
                  <span>
                    0{idx + 1} {juice.name}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 block mt-1">{juice.category}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2 text-xs font-mono text-zinc-300">
            <a
              href="#showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Interactive 3D Studio
            </a>
            <a
              href="#nutrition"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Interactive Nutrition HUD
            </a>
            <a
              href="#technology"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              15,000 PSI Hydraulic Tech
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
