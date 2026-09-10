"use client";

import React from "react";
import Image from "next/image";
import { JuiceItem } from "@/types/juice";
import { useCart } from "@/context/CartContext";
import { Sparkles, Trash2, Plus, ShoppingBag, CheckCircle2 } from "lucide-react";
import { JUICES } from "@/data/juices";

interface BoxBuilderProps {
  boxItems: JuiceItem[];
  onRemoveFromBox: (index: number) => void;
  onClearBox: () => void;
  onAutoFill: () => void;
}

export function BoxBuilder({
  boxItems,
  onRemoveFromBox,
  onClearBox,
  onAutoFill,
}: BoxBuilderProps) {
  const { addToCart } = useCart();
  const maxSlots = 6;
  const slotsRemaining = maxSlots - boxItems.length;

  // Single price sum vs bundle special
  const regularSum = boxItems.reduce((acc, item) => acc + item.price, 0);
  const bundlePrice = 72.0; // flat luxury bundle pricing
  const isFull = boxItems.length === maxSlots;

  const handleAddBoxToCart = () => {
    if (!isFull) return;

    const packItemNames = boxItems.map((item) => item.name);
    addToCart({
      id: `custom-6pack-${Date.now()}`,
      name: "Curated 6-Pack Ritual Box",
      price: bundlePrice,
      image: boxItems[0]?.image || JUICES[0].image,
      isPack: true,
      packItems: packItemNames,
    });
    onClearBox();
  };

  return (
    <section id="box-builder" className="py-20 bg-botanic-emerald/40 border-y border-botanic-forest/60 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-botanic-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-botanic-forest/60 border border-botanic-gold/30 text-botanic-gold text-xs uppercase tracking-widest font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-botanic-gold" />
              <span>Bespoke Formulation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-botanic-cream">
              Curate Your 6-Pack Ritual Box
            </h2>
            <p className="text-sm text-botanic-sage mt-2 max-w-xl">
              Select 6 cold-pressed botanicals tailored to your circadian rhythm.
              Includes vacuum-sealed eco-thermal cold packaging and next-morning sunrise delivery.
            </p>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-3">
            {boxItems.length < maxSlots && (
              <button
                onClick={onAutoFill}
                className="px-4 py-2 rounded-full glass-panel border-botanic-gold/40 text-botanic-gold hover:bg-botanic-gold hover:text-botanic-dark text-xs uppercase tracking-wider font-semibold transition-all"
              >
                Auto-Fill Curated Selection
              </button>
            )}
            {boxItems.length > 0 && (
              <button
                onClick={onClearBox}
                className="px-3 py-2 rounded-full text-xs text-botanic-sage hover:text-red-400 flex items-center gap-1.5 transition-colors"
                aria-label="Clear all juices from box"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Box</span>
              </button>
            )}
          </div>
        </div>

        {/* 6-Slot Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-12">
          {Array.from({ length: maxSlots }).map((_, index) => {
            const item = boxItems[index];

            if (item) {
              return (
                <div
                  key={`${item.id}-${index}`}
                  className="relative group rounded-xl p-3 bg-botanic-forest/80 border border-botanic-gold/40 flex flex-col items-center justify-between min-h-[220px] transition-all duration-300 hover:border-botanic-gold shadow-lg"
                >
                  <button
                    onClick={() => onRemoveFromBox(index)}
                    aria-label={`Remove ${item.name} from slot ${index + 1}`}
                    className="absolute -top-2 -right-2 p-1.5 rounded-full bg-botanic-dark border border-botanic-gold/40 text-botanic-cream hover:text-red-400 shadow-md transition-colors z-10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="relative w-20 h-28 my-2 rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="text-center w-full mt-1">
                    <p className="text-[10px] uppercase font-bold text-botanic-gold truncate">
                      {`Slot 0${index + 1}`}
                    </p>
                    <p className="text-xs font-serif text-botanic-cream truncate" title={item.name}>
                      {item.name.replace(/^\d+\s*/, "")}
                    </p>
                    <span className="text-[10px] text-botanic-sage block mt-0.5">
                      {item.category}
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <a
                key={`empty-${index}`}
                href="#formulations"
                className="group rounded-xl p-4 border-2 border-dashed border-botanic-forest/70 hover:border-botanic-gold/60 flex flex-col items-center justify-center min-h-[220px] transition-all duration-300 bg-botanic-dark/40 hover:bg-botanic-forest/20 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-botanic-forest/50 group-hover:bg-botanic-gold/20 flex items-center justify-center text-botanic-sage group-hover:text-botanic-gold transition-colors mb-3">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono uppercase text-botanic-sage group-hover:text-botanic-gold transition-colors">
                  {`Slot 0${index + 1}`}
                </span>
                <span className="text-[11px] text-botanic-sand/50 mt-1">Select Formulation</span>
              </a>
            );
          })}
        </div>

        {/* Pricing Summary & Checkout Bar */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-botanic-gold/30">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="text-2xl sm:text-3xl font-serif text-botanic-cream font-bold">
                $72.00
              </span>
              {boxItems.length > 0 && (
                <span className="text-sm line-through text-botanic-sage">
                  ${(regularSum > 72 ? regularSum : 82.5).toFixed(2)}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-botanic-gold/20 text-botanic-gold text-xs font-bold uppercase tracking-wider border border-botanic-gold/30">
                Save 15% VIP
              </span>
            </div>
            <p className="text-xs text-botanic-sage flex items-center justify-center md:justify-start gap-1.5 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-botanic-gold" />
              <span>Complimentary 100% Recyclable Cold-Chain Thermal Insulation</span>
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-botanic-sand">
                {isFull
                  ? "Box Ritual Complete (6/6)"
                  : `${slotsRemaining} more bottle${slotsRemaining === 1 ? "" : "s"} required`}
              </p>
              <div className="w-36 h-1.5 bg-botanic-dark rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-botanic-gold transition-all duration-300"
                  style={{ width: `${(boxItems.length / maxSlots) * 100}%` }}
                />
              </div>
            </div>

            <button
              id="box-builder-add-button"
              disabled={!isFull}
              onClick={handleAddBoxToCart}
              className={`w-full md:w-auto px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 ${
                isFull
                  ? "bg-botanic-gold hover:bg-botanic-goldLight text-botanic-dark shadow-xl hover:shadow-botanic-gold/25 cursor-pointer"
                  : "bg-botanic-forest/40 text-botanic-sand/40 border border-botanic-forest/60 cursor-not-allowed"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isFull ? "Add 6-Pack To Cart ($72.00)" : `Add ${boxItems.length}/6 Bottles`}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
