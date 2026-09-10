"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JuiceItem } from "@/types/juice";
import { Sparkles, Menu, X } from "lucide-react";

interface NavbarProps {
  activeJuice: JuiceItem;
  allJuices: JuiceItem[];
  onSelectJuice: (juice: JuiceItem) => void;
}

export function Navbar({ activeJuice, allJuices, onSelectJuice }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/85 backdrop-blur-xl border-b border-white/[0.08] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Left: Brand Monogram & Live Status */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="#"
            className="flex items-center gap-2 group focus:outline-none"
            aria-label="LUMEN BOTANICA Home"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-[-0.04em] text-white font-sans">
                LUMEN
              </span>
              <span className="text-zinc-400 font-mono text-xs">//</span>
              <span className="text-[11px] sm:text-xs tracking-[0.2em] text-zinc-400 font-mono uppercase">
                BOTANICA
              </span>
            </div>
          </a>

          {/* System Cold-Chain Telemetry Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-[11px] font-mono text-zinc-300">
            <motion.span
              animate={{ scale: [1, 1.25, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: activeJuice.colors.accent }}
            />
            <span>36°F COLD-CHAIN</span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-400">15,000 PSI</span>
          </div>
        </div>

        {/* Center: 4-Product Quick Navigator (Desktop) */}
        <nav
          className="hidden md:flex items-center p-1 rounded-xl bg-zinc-900/80 border border-white/10 relative"
          aria-label="Formulation Switcher"
        >
          {allJuices.map((juice, idx) => {
            const isActive = juice.id === activeJuice.id;
            return (
              <motion.button
                key={juice.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectJuice(juice)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors flex items-center gap-2 z-10 ${
                  isActive ? "text-white font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-zinc-800 rounded-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span
                  className="w-1.5 h-1.5 rounded-full relative z-10 transition-colors"
                  style={{
                    backgroundColor: isActive ? juice.colors.accent : "rgba(255,255,255,0.25)",
                  }}
                />
                <span className="relative z-10">
                  0{idx + 1} {juice.name.split(" ")[0]}
                </span>
              </motion.button>
            );
          })}
        </nav>

        {/* Right: Section Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-6">
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
          <motion.div
            key={activeJuice.sku}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase border inline-flex items-center gap-1.5"
            style={{
              backgroundColor: `${activeJuice.colors.accent}15`,
              borderColor: `${activeJuice.colors.accent}40`,
              color: activeJuice.colors.accent,
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span>{activeJuice.sku}</span>
          </motion.div>

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

      {/* Mobile Menu Dropdown with slide-down animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#09090b]/98 border-b border-white/10 px-5 py-5 space-y-4 overflow-hidden"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block">
              Select Formulation:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {allJuices.map((juice, idx) => (
                <motion.button
                  key={juice.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    onSelectJuice(juice);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-mono transition-all min-h-[48px] ${
                    juice.id === activeJuice.id
                      ? "bg-zinc-800 border-white text-white font-bold shadow-sm"
                      : "bg-zinc-900/60 border-white/10 text-zinc-400"
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
                </motion.button>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5 text-xs font-mono text-zinc-300">
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
