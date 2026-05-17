"use client";

import { useGameStore } from "@/app/lib/game-store";

export function RoundEndPanel() {
  const { teams, nextRound, questions, currentQuestionIndex, viewMode } = useGameStore();
  const isLastRound = currentQuestionIndex >= questions.length - 1;

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="text-yellow-400 font-black text-4xl mb-2">🎉 FIN DE RONDA</div>
      <div className="flex gap-6 w-full">
        {(["A","B"] as const).map((tid) => (
          <div key={tid} className="flex-1 text-center py-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-white/50 font-bold text-sm tracking-widest uppercase mb-2">{teams[tid].name}</div>
            <div className="text-5xl font-black text-white">{teams[tid].score}</div>
          </div>
        ))}
      </div>
      {isLastRound ? (
        <div className="text-center">
          <div className="text-yellow-400 font-black text-2xl mb-4">🏆 ¡Fin del juego!</div>
          <div className="text-white/50 font-bold">
            Ganador:{" "}
            <span className="text-white font-black">
              {teams["A"].score > teams["B"].score ? teams["A"].name
                : teams["B"].score > teams["A"].score ? teams["B"].name
                : "¡Empate!"}
            </span>
          </div>
        </div>
      ) : viewMode === "host" ? (
        <button onClick={nextRound}
          className="px-8 py-4 rounded-xl bg-yellow-400 text-black font-black text-lg hover:bg-yellow-300 active:scale-95 transition-all">
          SIGUIENTE RONDA →
        </button>
      ) : null}
    </div>
  );
}
