"use client";

import { useGameStore } from "@/app/lib/game-store";

export function ScoreBoard() {
  const { teams, controllingTeam, roundPoints, roundMultiplier } = useGameStore();

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      {(["A", "B"] as const).map((tid) => {
        const team = teams[tid];
        const isActive = controllingTeam === tid;
        return (
          <div key={tid} className={`flex-1 rounded-2xl p-5 border-2 transition-all duration-500 ${
            isActive
              ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_30px_rgba(251,191,36,0.3)]"
              : "border-white/10 bg-white/5"
          }`}>
            <div className="text-sm font-bold tracking-widest text-white/50 uppercase mb-1">
              {team.name}
              {isActive && <span className="ml-2 text-yellow-400 animate-pulse">● EN TURNO</span>}
            </div>
            <div className="text-6xl font-black text-white tabular-nums">{team.score.toLocaleString()}</div>
          </div>
        );
      })}
      <div className="flex flex-col items-center gap-2 px-6">
        <div className="text-xs font-bold tracking-widest text-white/40 uppercase">Acumulado</div>
        <div className="text-4xl font-black text-yellow-400 tabular-nums">{roundPoints.toLocaleString()}</div>
        <div className="text-xs font-bold text-white/40">×{roundMultiplier}</div>
      </div>
    </div>
  );
}
