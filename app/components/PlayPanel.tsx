"use client";

import { useState } from "react";
import { useGameStore } from "@/app/lib/game-store";
import { AnswerInput } from "./AnswerInput";

export function PlayPanel() {
  const { submitAnswer, teams, controllingTeam, addStrike, skipReveal, revealAnswerById, currentQuestion, viewMode } = useGameStore();
  const [feedback, setFeedback] = useState<{ type: "hit" | "miss"; text: string } | null>(null);
  const [showManual, setShowManual] = useState(false);

  const handleAnswer = (value: string) => {
    const result = submitAnswer(value);
    if (result.matched && result.answer) {
      setFeedback({ type: "hit", text: `✓ ${result.answer.text} — ${result.answer.points} pts` });
    } else {
      setFeedback({ type: "miss", text: "✗ ¡No está en el tablero!" });
    }
    setTimeout(() => setFeedback(null), 2000);
  };

  const unrevealed = currentQuestion?.answers.filter((a) => !a.revealed) ?? [];

  if (viewMode === "players") {
    return (
      <div className="w-full flex justify-center">
        {controllingTeam && (
          <span className="inline-block px-4 py-2 rounded-full bg-blue-400/10 border border-blue-400/30 text-blue-400 font-bold text-sm tracking-widest">
            {teams[controllingTeam].name} — EN CONTROL
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-5">
      {controllingTeam && (
        <div className="text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-400/10 border border-blue-400/30 text-blue-400 font-bold text-sm tracking-widest">
            {teams[controllingTeam].name} — EN CONTROL
            <span className="ml-2 text-blue-400/50 text-xs">· Vista Host</span>
          </span>
        </div>
      )}
      <AnswerInput onSubmit={handleAnswer} placeholder="Respuesta del equipo..." />
      {feedback && (
        <div className={`text-center py-3 px-5 rounded-xl font-bold text-lg border ${
          feedback.type === "hit" ? "bg-green-500/20 border-green-500/40 text-green-400" : "bg-red-500/20 border-red-500/40 text-red-400"
        }`}>
          {feedback.text}
        </div>
      )}
      <div className="flex gap-3 justify-center flex-wrap">
        <button onClick={addStrike}
          className="px-5 py-2 rounded-xl border border-red-500/40 text-red-400 font-bold text-sm hover:bg-red-500/10 transition-all">
          + Strike manual
        </button>
        <button onClick={() => setShowManual((v) => !v)} disabled={unrevealed.length === 0}
          className="px-5 py-2 rounded-xl border border-blue-500/40 text-blue-400 font-bold text-sm hover:bg-blue-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          🔓 Revelar respuesta
        </button>
        <button onClick={skipReveal}
          className="px-5 py-2 rounded-xl border border-white/20 text-white/40 font-bold text-sm hover:bg-white/10 transition-all">
          Revelar todas
        </button>
      </div>
      {showManual && unrevealed.length > 0 && (
        <div className="bg-blue-950/40 border border-blue-500/20 rounded-xl p-4">
          <div className="text-xs font-bold tracking-widest text-blue-400/60 uppercase mb-3">Selecciona la respuesta correcta</div>
          <div className="flex flex-col gap-2">
            {unrevealed.map((answer) => (
              <button key={answer.id}
                onClick={() => { revealAnswerById(answer.id); setShowManual(false); }}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all text-left group">
                <span className="text-white font-bold group-hover:text-blue-300 transition-colors">{answer.text}</span>
                <span className="text-cyan-400 font-black text-sm ml-4">{answer.points} pts</span>
              </button>
            ))}
          </div>
          <button onClick={() => setShowManual(false)} className="mt-3 text-xs text-white/30 hover:text-white/60 font-bold transition-colors">Cancelar</button>
        </div>
      )}
    </div>
  );
}
