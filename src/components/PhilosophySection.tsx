"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gauge, Snowflake, ShieldCheck, Zap } from "lucide-react";

export function PhilosophySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="technology" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Intro Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 text-xs font-mono uppercase tracking-widest mb-4">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Extraction Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
          Blade Friction Destroys. <br />
          <span className="text-zinc-400">Hydraulic Force Preserves.</span>
        </h2>
        <p className="mt-4 text-xs sm:text-base text-zinc-400 leading-relaxed font-sans max-w-2xl mx-auto">
          Conventional centrifugal juicers spin steel blades at 15,000 RPM, generating friction heat
          that shears cellular walls and oxidizes delicate bioflavonoids. LUMEN utilizes 15,000 PSI
          hydraulic pressure at a continuous 36°F cold chain.
        </p>
      </motion.div>

      {/* Grid of 3 Core Technology Pillars with Staggered Scroll Animations */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="p-6 sm:p-8 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 transition-all space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-emerald-400 border border-white/10">
            <Gauge className="w-6 h-6" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-white font-sans">15,000 PSI Pressure</h3>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
              HYDRAULIC
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Smooth hydraulic compression gently releases living plant cell sap without shearing or aeration.
            Enzymes remain completely unoxidized, retaining 99.8% biological activity.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="p-6 sm:p-8 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-amber-400 border border-white/10">
            <Snowflake className="w-6 h-6" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-white font-sans">36°F Cleanroom</h3>
            <span className="text-[10px] font-mono text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
              COLD-CHAIN
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            From heirloom harvest to nitrogen glass sealing, formulations never exceed 36°F (2.2°C).
            Zero pasteurization, zero HPP pressure heat waves, zero synthetic preservatives.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="p-6 sm:p-8 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-violet-400 border border-white/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-white font-sans">Pure Glass Seal</h3>
            <span className="text-[10px] font-mono text-violet-400 font-semibold px-2 py-0.5 rounded bg-violet-950/60 border border-violet-800/40">
              100% INERT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Bottled exclusively in UV-filtering recyclable glass with nitrogen purge.
            Completely free from endocrine disruptors, BPA, phthalates, and microplastic leeching.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
