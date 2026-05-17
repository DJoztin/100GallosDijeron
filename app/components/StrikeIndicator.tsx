"use client";

import { useGameStore } from "@/app/lib/game-store";

export function StrikeIndicator() {
  const { strikes } = useGameStore();
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold tracking-widest text-white/40 uppercase mr-1">Strikes</span>
      {[0, 1, 2].map((i) => (
        <div key={i} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-black text-xl transition-all duration-300 ${
          i < strikes
            ? "border-red-500 bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.8)] scale-110"
            : "border-white/20 bg-transparent text-white/20"
        }`}>
          {i < strikes ? "✗" : ""}
        </div>
      ))}
    </div>
  );
}
