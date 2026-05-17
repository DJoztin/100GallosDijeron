"use client";

import { useState } from "react";
import { useGameStore } from "@/app/lib/game-store";
import { getOpponentTeam } from "@/app/lib/game-engine";
import { AnswerInput } from "./AnswerInput";

export function StealPanel() {
  const { submitStealAnswer, teams, controllingTeam, roundPoints, viewMode } = useGameStore();
  const [result, setResult] = useState<"success" | "fail" | null>(null);

  if (!controllingTeam) return null;
  const stealingTeam = getOpponentTeam(controllingTeam);

  const handleSteal = (value: string) => {
    const { success } = submitStealAnswer(value);
    setResult(success ? "success" : "fail");
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="text-center">
        <div className="text-red-400 font-black text-3xl mb-1">⚠ OPORTUNIDAD DE ROBO</div>
        <div className="text-white/60 font-bold">
          {teams[stealingTeam].name} puede robar{" "}
          <span className="text-yellow-400 font-black">{roundPoints} puntos</span>
        </div>
        {viewMode === "host" && (
          <div className="text-white/30 text-sm mt-1">Si falla, {teams[controllingTeam].name} conserva los puntos</div>
        )}
      </div>
      <div className="w-full max-w-lg">
        {viewMode === "players" ? (
          <div className="text-white/30 font-bold text-lg text-center animate-pulse">Esperando respuesta...</div>
        ) : result === null ? (
          <AnswerInput onSubmit={handleSteal} label={`${teams[stealingTeam].name} — Una sola oportunidad`} placeholder="Respuesta de robo..." />
        ) : (
          <div className={`text-center py-6 rounded-2xl font-black text-xl border-2 ${
            result === "success" ? "bg-green-500/20 border-green-500/40 text-green-400" : "bg-red-500/20 border-red-500/40 text-red-400"
          }`}>
            {result === "success"
              ? `🎉 ¡ROBO EXITOSO! ${teams[stealingTeam].name} gana los puntos`
              : `✗ Robo fallido. ${teams[controllingTeam!].name} conserva los puntos`}
          </div>
        )}
      </div>
    </div>
  );
}
