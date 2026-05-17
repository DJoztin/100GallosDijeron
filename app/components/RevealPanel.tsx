"use client";

import { useGameStore } from "@/app/lib/game-store";

export function RevealPanel() {
  const { revealNextAnswer, skipReveal, revealQueue, viewMode } = useGameStore();

  if (viewMode === "players") {
    return (
      <div className="w-full flex justify-center">
        <div className="text-orange-400 font-black text-2xl animate-pulse">📋 Revelando respuestas...</div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="text-center">
        <div className="text-orange-400 font-black text-2xl mb-1">📋 REVELANDO RESPUESTAS</div>
        <div className="text-white/40 text-sm font-bold">{revealQueue.length} pendiente{revealQueue.length !== 1 ? "s" : ""}</div>
      </div>
      <div className="flex gap-4">
        <button onClick={revealNextAnswer} disabled={revealQueue.length === 0}
          className="px-8 py-4 rounded-xl bg-orange-500 text-white font-black text-lg hover:bg-orange-400 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          ▶ Revelar siguiente
        </button>
        <button onClick={skipReveal}
          className="px-6 py-4 rounded-xl border border-white/20 text-white/50 font-bold hover:bg-white/10 transition-all">
          Revelar todas
        </button>
      </div>
    </div>
  );
}
