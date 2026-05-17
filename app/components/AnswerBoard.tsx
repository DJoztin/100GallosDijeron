"use client";

import { useGameStore } from "@/app/lib/game-store";

export function AnswerBoard() {
  const { currentQuestion, viewMode } = useGameStore();
  if (!currentQuestion) return null;

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-black text-white leading-tight bg-blue-900/50 border border-blue-500/30 rounded-xl px-6 py-4">
          {currentQuestion.text}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {currentQuestion.answers.map((answer, idx) => {
          const isRevealed = answer.revealed;
          return (
            <div key={answer.id} className={`flex items-center rounded-xl border transition-all duration-700 overflow-hidden ${
              isRevealed
                ? "border-yellow-500/50 bg-gradient-to-r from-yellow-900/40 to-yellow-800/20"
                : "border-white/10 bg-white/5"
            }`}>
              <div className="w-10 h-10 flex items-center justify-center font-black text-white/40 text-sm border-r border-white/10 shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 px-4 py-3 font-bold text-white">
                {isRevealed ? answer.text : viewMode === "host" ? (
                  <span className="text-white/30 italic text-sm">{answer.text}</span>
                ) : ""}
              </div>
              <div className={`w-16 h-full flex items-center justify-center font-black text-xl border-l transition-all duration-700 ${
                isRevealed ? "text-yellow-400 border-yellow-500/30" : "text-white/10 border-white/10"
              }`}>
                {isRevealed ? answer.points : viewMode === "host" ? <span className="text-sm text-white/20">{answer.points}</span> : "?"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
