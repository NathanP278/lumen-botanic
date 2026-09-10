"use client";

import dynamic from "next/dynamic";
import React from "react";
import { JuiceItem } from "@/types/juice";

const ThreeBottleCanvas = dynamic(
  () => import("@/components/ThreeBottleCanvas").then((mod) => mod.ThreeBottleCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400">
          Loading 3D Canvas Engine...
        </span>
      </div>
    ),
  }
);

interface BottleCanvasWrapperProps {
  activeJuice: JuiceItem;
  viewPreset: "front" | "label" | "tilt" | "cap";
  isAutoRotate: boolean;
  onUserInteract?: () => void;
  onSwipeNext?: () => void;
  onSwipePrev?: () => void;
  externalRotY?: number;
  onRotYChange?: (deg: number) => void;
}

export function BottleCanvasWrapper(props: BottleCanvasWrapperProps) {
  return <ThreeBottleCanvas {...props} />;
}
