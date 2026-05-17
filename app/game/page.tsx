"use client";

import { useGameStore } from "@/app/lib/game-store";
import { ScoreBoard } from "@/app/components/ScoreBoard";
import { StrikeIndicator } from "@/app/components/StrikeIndicator";
import { AnswerBoard } from "@/app/components/AnswerBoard";
import { FaceoffPanel } from "@/app/components/FaceoffPanel";
import { PlayPanel } from "@/app/components/PlayPanel";
import { StealPanel } from "@/app/components/StealPanel";
import { RevealPanel } from "@/app/components/RevealPanel";
import { RoundEndPanel } from "@/app/components/RoundEndPanel";
import { GameControls } from "@/app/components/GameControls";
import { SyncManager } from "@/app/components/SyncManager";
import Image from "next/image";
import { stopIdleMusic, startIdleMusic } from "../lib/sounds";
import { useEffect } from "react";

export default function GamePage() {
  const { phase, startGame, questions, currentQuestionIndex, viewMode } = useGameStore();

  // Idle music — solo en host
  useEffect(() => {
    if (viewMode === "host" && phase === "idle") {
      startIdleMusic();
    } else {
      stopIdleMusic();
    }
    return () => stopIdleMusic();
  }, [phase, viewMode]);
  return (
    <main className="min-h-screen bg-[#060b18] text-white font-sans flex flex-col">
      
      <SyncManager />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size[60px_60px] pointer-events-none" />

      <header className="relative z-10 border-b border-white/5 bg-black/30 backdrop-blur px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
              <Image
                src="/logo_100gallos.webp"
                alt="Logo"
                width={125}
                height={125}
                className="object-contain animate-pulse-scale"
              />
            
            {phase !== "idle" && (
              <div className="text-xs text-white/30 font-bold mt-0.5">
                Ronda {currentQuestionIndex + 1} / {questions.length}
              </div>
            )}
          </div>
          {viewMode === "host" ? (
            <GameControls />
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-bold text-blue-400/70">Vista Jugadores</span>
            </div>
          )}
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 py-6 gap-6">
        {phase === "idle" ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <div className="text-center">
              <Image
                src="/logo_100gallos.webp"
                alt="Logo"
                width={512}
                height={512}
                className="object-contain animate-pulse-scale"
              />
              <p className="text-white/40 font-bold">Family Feud — Edición Mexicana</p>
            </div>
            {viewMode === "host" ? (
              <button
                onClick={startGame}
                className="px-10 py-5 rounded-2xl bg-blue-400 text-white font-black text-2xl hover:bg-blue-300 active:scale-95 transition-all shadow-[0_0_40px_rgba(251,191,36,0.4)]"
              >
                INICIAR JUEGO
              </button>
            ) : (
              <div className="text-white/20 font-bold text-lg animate-pulse">
                Esperando al host...
              </div>
            )}
            {viewMode === "host" && (
              <div className="text-white/20 text-sm font-bold text-center">
                Buzzer: [Q] Equipo A · [P] Equipo B
              </div>
            )}
          </div>
        ) : (
          <>
            <ScoreBoard />
            {(phase === "playing" || phase === "steal") && (
              <div className="flex justify-center">
                <StrikeIndicator />
              </div>
            )}
            <AnswerBoard />
            <div className="mt-auto">
              {phase === "faceoff"  && <FaceoffPanel />}
              {phase === "playing"  && <PlayPanel />}
              {phase === "steal"    && <StealPanel />}
              {phase === "reveal"   && <RevealPanel />}
              {phase === "roundEnd" && <RoundEndPanel />}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
