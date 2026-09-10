"use client";

import dynamic from "next/dynamic";
import React from "react";

const ThreeBottleCanvas = dynamic(
  () => import("@/components/ThreeBottleCanvas").then((mod) => mod.ThreeBottleCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center opacity-40">
        <div className="w-16 h-16 rounded-full border-2 border-botanic-gold border-t-transparent animate-spin" />
      </div>
    ),
  }
);

export function BottleCanvasWrapper() {
  return <ThreeBottleCanvas />;
}
