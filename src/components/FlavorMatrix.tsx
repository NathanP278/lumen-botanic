"use client";

import React, { useState } from "react";
import Image from "next/image";
import { JUICES } from "@/data/juices";
import { JuiceCategory, JuiceItem } from "@/types/juice";
import { useCart } from "@/context/CartContext";
import { Plus, Check, Info, Sparkles, Activity } from "lucide-react";

interface FlavorMatrixProps {
  onAddToBox?: (juice: JuiceItem) => void;
  boxItems?: JuiceItem[];
}

export function FlavorMatrix({ onAddToBox, boxItems = [] }: FlavorMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<JuiceCategory>("All");
  const [expandedNutrition, setExpandedNutrition] = useState<string | null>(null);
  const { addToCart } = useCart();

  const categories: JuiceCategory[] = ["All", "Cleanse", "Detox", "Energy", "Immunity"];

  const filteredJuices =
    selectedCategory === "All"
      ? JUICES
      : JUICES.filter((j) => j.category === selectedCategory);

  return (
    <section id="formulations" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.3em] text-botanic-gold font-medium">
          The Botanical Formulary
        </span>
        <h2 className="mt-3 text-3xl sm:text-5xl font-serif text-botanic-cream">
          Targeted Living Alchemy
        </h2>
        <p className="mt-4 text-sm sm:text-base text-botanic-sage leading-relaxed">
          Each batch is pressed at peak solar harvest, unpasteurized and sealed under nitrogen
          to guarantee maximal cellular enzyme potency.
        </p>

        {/* Category Filters */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3" role="tablist" aria-label="Juice Categories">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-[0.18em] font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-botanic-gold ${
                  isActive
                    ? "bg-botanic-gold text-botanic-dark shadow-md font-bold scale-105"
                    : "glass-panel text-botanic-sand hover:text-botanic-gold hover:border-botanic-gold/40"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Juice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredJuices.map((juice) => {
          const isNutritionOpen = expandedNutrition === juice.id;
          const countInBox = boxItems.filter((i) => i.id === juice.id).length;

          return (
            <article
              key={juice.id}
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between border border-botanic-forest/60 group"
            >
              {/* Image & Badges */}
              <div className="relative h-64 w-full overflow-hidden bg-botanic-dark">
                <Image
                  src={juice.image}
                  alt={juice.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08130E] via-[#08130E]/30 to-transparent" />

                {/* Category tag */}
                <div className="absolute top-4 left-4">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold text-botanic-cream backdrop-blur-md"
                    style={{ backgroundColor: `${juice.color}CC`, border: `1px solid ${juice.accentColor}88` }}
                  >
                    {juice.category}
                  </span>
                </div>

                {/* Price tag */}
                <div className="absolute top-4 right-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-botanic-gold bg-[#08130E]/80 backdrop-blur-md border border-botanic-gold/30">
                    ${juice.price.toFixed(2)}
                  </span>
                </div>

                {/* Floating benefit badges */}
                <div className="absolute bottom-3 left-4 right-4 flex flex-wrap gap-1.5">
                  {juice.benefits.map((b) => (
                    <span
                      key={b}
                      className="text-[10px] uppercase tracking-wider text-botanic-cream/90 bg-[#08130E]/70 px-2 py-0.5 rounded backdrop-blur-sm"
                    >
                      • {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="text-xl font-serif text-botanic-cream group-hover:text-botanic-gold transition-colors">
                    {juice.name}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-botanic-gold/90 font-medium mt-1">
                    {juice.subtitle}
                  </p>
                  <p className="text-xs text-botanic-sand/80 mt-3 leading-relaxed font-light">
                    {juice.description}
                  </p>

                  {/* Ingredient pills */}
                  <div className="mt-4">
                    <span className="text-[10px] uppercase tracking-widest text-botanic-sage font-semibold block mb-2">
                      Active Botanicals
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {juice.ingredients.map((ing) => (
                        <span
                          key={ing}
                          className="px-2 py-0.5 text-[11px] rounded bg-botanic-forest/40 border border-botanic-moss/30 text-botanic-sand/90"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tasting notes */}
                  <div className="mt-3 pt-3 border-t border-botanic-forest/40">
                    <p className="text-[11px] text-botanic-sage italic">
                      Notes: {juice.notes.join(" • ")}
                    </p>
                  </div>
                </div>

                {/* Nutrition Accordion / Drawer */}
                <div>
                  <button
                    onClick={() => setExpandedNutrition(isNutritionOpen ? null : juice.id)}
                    aria-expanded={isNutritionOpen}
                    className="w-full flex items-center justify-between text-xs text-botanic-gold hover:text-botanic-cream py-1 transition-colors"
                  >
                    <span className="flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                      <Activity className="w-3.5 h-3.5" />
                      {isNutritionOpen ? "Hide Micro-Nutritional Profile" : "View Micro-Nutritional Profile"}
                    </span>
                    <Info className="w-3.5 h-3.5" />
                  </button>

                  {isNutritionOpen && (
                    <div className="mt-2 p-3 rounded-lg bg-botanic-dark/90 border border-botanic-moss/40 text-xs grid grid-cols-5 gap-2 text-center animate-fadeIn">
                      <div>
                        <span className="block text-[10px] text-botanic-sage">Calories</span>
                        <span className="font-semibold text-botanic-cream">{juice.nutrition.calories}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-botanic-sage">Sugar</span>
                        <span className="font-semibold text-botanic-cream">{juice.nutrition.sugar}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-botanic-sage">Protein</span>
                        <span className="font-semibold text-botanic-cream">{juice.nutrition.protein}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-botanic-sage">Potassium</span>
                        <span className="font-semibold text-botanic-cream">{juice.nutrition.potassium}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-botanic-sage">Vitamin C</span>
                        <span className="font-semibold text-botanic-gold">{juice.nutrition.vitaminC}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() =>
                      addToCart({
                        id: juice.id,
                        name: juice.name,
                        price: juice.price,
                        image: juice.image,
                      })
                    }
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-botanic-forest/70 hover:bg-botanic-moss border border-botanic-moss/40 text-botanic-cream text-xs font-semibold uppercase tracking-wider transition-all focus:ring-2 focus:ring-botanic-gold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Single Bottle</span>
                  </button>

                  <button
                    onClick={() => onAddToBox && onAddToBox(juice)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all focus:ring-2 focus:ring-botanic-gold ${
                      countInBox > 0
                        ? "bg-botanic-gold text-botanic-dark font-bold hover:bg-botanic-goldLight"
                        : "glass-panel text-botanic-gold hover:bg-botanic-gold/10 border-botanic-gold/40"
                    }`}
                  >
                    {countInBox > 0 ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>In 6-Pack ({countInBox})</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Add to 6-Pack</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
