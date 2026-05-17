"use client";

import { useState } from "react";
import { useGameStore } from "@/app/lib/game-store";
import { ViewToggle } from "./ViewToggle";
import { QuestionBankManager } from "./QuestionBankManager";

export function GameControls() {
  const { setMultiplier, roundMultiplier, resetGame } = useGameStore();
  const [showBank, setShowBank] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        <ViewToggle />
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-widest text-white/40 uppercase">Mult.</span>
          {([1, 2, 3] as const).map((m) => (
            <button key={m} onClick={() => setMultiplier(m)}
              className={`w-9 h-9 rounded-lg font-black text-sm transition-all ${
                roundMultiplier === m ? "bg-yellow-400 text-black" : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}>
              ×{m}
            </button>
          ))}
        </div>
        <button onClick={() => setShowBank(true)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 font-bold text-sm hover:bg-white/10 hover:text-white transition-all">
          📋 Preguntas
        </button>
        <button onClick={resetGame}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 font-bold text-sm hover:bg-white/10 transition-all">
          ↺ Reiniciar
        </button>
      </div>
      {showBank && <QuestionBankManager onClose={() => setShowBank(false)} />}
    </>
  );
}
