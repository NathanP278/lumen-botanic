"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Menu, X, Sparkles } from "lucide-react";

export function Navbar() {
  const { totalCount, openCart, totalPrice } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#08130E]/85 backdrop-blur-md border-b border-botanic-forest/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Monogram */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex flex-col group focus:outline-none focus:ring-2 focus:ring-botanic-gold/50 rounded-sm">
            <span className="text-xl sm:text-2xl font-serif tracking-[0.25em] text-botanic-cream group-hover:text-botanic-gold transition-colors">
              LUMEN
            </span>
            <span className="text-[9px] tracking-[0.35em] text-botanic-gold font-sans uppercase font-medium">
              Botanic Atelier
            </span>
          </a>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
          <a
            href="#formulations"
            className="text-xs uppercase tracking-[0.2em] text-botanic-sand hover:text-botanic-gold transition-colors font-medium py-1"
          >
            Formulations
          </a>
          <a
            href="#box-builder"
            className="text-xs uppercase tracking-[0.2em] text-botanic-sand hover:text-botanic-gold transition-colors font-medium py-1 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-botanic-gold animate-pulse" />
            Curate 6-Pack
          </a>
          <a
            href="#philosophy"
            className="text-xs uppercase tracking-[0.2em] text-botanic-sand hover:text-botanic-gold transition-colors font-medium py-1"
          >
            Hydraulic Ritual
          </a>
          <a
            href="#sustainability"
            className="text-xs uppercase tracking-[0.2em] text-botanic-sand hover:text-botanic-gold transition-colors font-medium py-1"
          >
            Biodynamic
          </a>
        </nav>

        {/* Right: Cart Button & Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            id="cart-trigger-button"
            onClick={openCart}
            aria-label={`Open shopping cart. ${totalCount} items in cart.`}
            className="relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-botanic-emerald/80 border border-botanic-gold/30 hover:border-botanic-gold transition-all text-botanic-cream hover:text-botanic-gold shadow-sm group focus:outline-none focus:ring-2 focus:ring-botanic-gold"
          >
            <ShoppingBag className="w-4 h-4 text-botanic-gold group-hover:scale-110 transition-transform" />
            <span className="text-xs font-sans tracking-wider font-semibold">
              ${totalPrice.toFixed(2)}
            </span>
            {totalCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-botanic-gold text-botanic-dark rounded-full">
                {totalCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-botanic-cream hover:text-botanic-gold focus:outline-none"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#08130E]/98 border-b border-botanic-forest/80 px-6 py-6 space-y-4">
          <a
            href="#formulations"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-[0.2em] text-botanic-cream hover:text-botanic-gold py-2"
          >
            Formulations
          </a>
          <a
            href="#box-builder"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-[0.2em] text-botanic-gold py-2 font-medium"
          >
            Curate 6-Pack Ritual
          </a>
          <a
            href="#philosophy"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-[0.2em] text-botanic-cream hover:text-botanic-gold py-2"
          >
            Hydraulic Ritual
          </a>
          <a
            href="#sustainability"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-[0.2em] text-botanic-cream hover:text-botanic-gold py-2"
          >
            Biodynamic Sourcing
          </a>
        </div>
      )}
    </header>
  );
}
