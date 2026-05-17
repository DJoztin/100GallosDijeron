"use client";

import { useState } from "react";
import { useGameStore } from "@/app/lib/game-store";

export function ViewToggle() {
  const { viewMode, setViewMode } = useGameStore();
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        <button onClick={() => setViewMode("host")}
          className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all ${
            viewMode === "host" ? "bg-cyan-400 text-white" : "text-white/40 hover:text-white/70"
          }`}>
          Host
        </button>
        <button onClick={() => setViewMode("players")}
          className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all ${
            viewMode === "players" ? "bg-blue-500 text-white" : "text-white/40 hover:text-white/70"
          }`}>
          Jugadores
        </button>
        <button onClick={() => setShowTip((v) => !v)}
          className="px-2 py-1.5 text-white/30 hover:text-white/60 font-bold text-sm transition-all">
          ?
        </button>
      </div>
      {showTip && (
        <div className="absolute right-0 top-12 z-50 w-72 bg-[#0f1829] border border-white/10 rounded-xl p-4 shadow-2xl">
          <div className="text-xs font-black tracking-widest text-cyan-400/70 uppercase mb-3">Cómo usar dos ventanas</div>
          <ol className="text-xs text-white/60 font-bold space-y-2 list-decimal list-inside">
            <li>Esta ventana queda en modo <span className="text-cyan-400">Host</span></li>
            <li>Abre una nueva ventana con <button onClick={() => { window.open(window.location.href, "_blank"); setShowTip(false); }} className="text-blue-400 underline hover:text-blue-300">clic aquí</button></li>
            <li>En la nueva ventana selecciona <span className="text-blue-400">📺 Jugadores</span></li>
            <li>El estado se sincroniza automáticamente</li>
          </ol>
        </div>
      )}
    </div>
  );
}
