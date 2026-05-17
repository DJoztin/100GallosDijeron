"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/app/lib/game-store";
import { TeamId } from "@/app/lib/types";
import { Sounds } from "@/app/lib/sounds";

export function FaceoffPanel() {
  const {
    buzzerPress, submitFaceoffAnswer, teams,
    faceoffState, faceoffBuzzedTeam, faceoffAnswers, faceoffStrike, viewMode,
  } = useGameStore();

  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [feedback, setFeedback] = useState<{ type: "hit" | "miss"; text: string } | null>(null);
  const [showStrike, setShowStrike] = useState(false);

  useEffect(() => {
    if (faceoffStrike) {
      setShowStrike(true);
      setTimeout(() => setShowStrike(false), 1500);
    }
  }, [faceoffStrike]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "q" || e.key === "Q") && faceoffState === "waiting") { buzzerPress("A"); Sounds.buzzer(); }
      if ((e.key === "p" || e.key === "P") && faceoffState === "waiting") { buzzerPress("B"); Sounds.buzzer(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [faceoffState, buzzerPress]);

  const handleAnswer = (team: TeamId, input: string) => {
    if (!input.trim()) return;
    const result = submitFaceoffAnswer(team, input.trim());
    setFeedback({
      type: result.matched ? "hit" : "miss",
      text: result.matched ? `✓ ${input.trim()} — ${result.points} pts` : "✗ No encontrada",
    });
    if (team === "A") setInputA(""); else setInputB("");
    setTimeout(() => setFeedback(null), 2000);
  };

  const isCounter = faceoffState === "team_a_answered" || faceoffState === "team_b_answered";
  const activeTeam: TeamId | null =
    faceoffState === "team_a_buzzed" ? "A" :
    faceoffState === "team_b_buzzed" ? "B" :
    faceoffState === "team_a_answered" ? "B" :
    faceoffState === "team_b_answered" ? "A" : null;

  if (viewMode === "players") {
    return (
      <div className="w-full flex flex-col items-center gap-6">
        <div className="text-sm font-bold tracking-widest text-white/40 uppercase">Cara a Cara</div>
        {faceoffState === "waiting" && (
          <div className="flex gap-8 w-full">
            {(["A","B"] as TeamId[]).map((tid) => (
              <div key={tid} className="flex-1 rounded-2xl border-2 border-white/10 bg-white/5 py-10 flex flex-col items-center gap-2">
                <div className="text-4xl mb-1">{tid === "A" ? "🔴" : "🔵"}</div>
                <div className="font-black text-2xl text-white">{teams[tid].name}</div>
              </div>
            ))}
          </div>
        )}
        {activeTeam && faceoffState !== "waiting" && faceoffState !== "done" && (
          <div className={`inline-block px-6 py-3 rounded-full font-black text-xl border-2 animate-pulse ${
            activeTeam === "A" ? "border-red-500/50 text-red-300 bg-red-500/10" : "border-blue-500/50 text-blue-300 bg-blue-500/10"
          }`}>
            {isCounter ? "⚡ Contrarrespuesta — " : "🔔 "}{teams[activeTeam].name}
          </div>
        )}
        {showStrike && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-8 py-3 text-red-400 font-black text-2xl animate-bounce">
            ✗ STRIKE
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="text-sm font-bold tracking-widest text-white/40 uppercase">
        Cara a Cara — <span className="text-yellow-400/60">Vista Host</span>
      </div>

      {showStrike && (
        <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-8 py-3 text-red-400 font-black text-2xl animate-bounce">
          ✗ STRIKE
        </div>
      )}

      {faceoffAnswers.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-3">
          {faceoffAnswers.map((entry, i) => (
            <div key={i} className={`px-4 py-3 rounded-xl border text-sm font-bold ${
              entry.points > 0 ? "bg-green-900/20 border-green-500/30 text-green-300" : "bg-red-900/20 border-red-500/20 text-red-300/70"
            }`}>
              <div className="text-xs text-white/40 uppercase tracking-widest mb-1">{teams[entry.teamId].name}</div>
              <div>"{entry.inputText}"</div>
              {entry.points > 0 && <div className="text-yellow-400 font-black mt-1">{entry.points} pts</div>}
            </div>
          ))}
        </div>
      )}

      {faceoffState === "waiting" && (
        <div className="flex gap-6 w-full">
          {(["A","B"] as TeamId[]).map((tid) => (
            <button key={tid}
              onClick={() => { buzzerPress(tid); Sounds.buzzer(); }}
              className="flex-1 rounded-2xl border-2 border-white/20 bg-white/5 py-8 flex flex-col items-center gap-2 hover:bg-white/10 active:scale-95 transition-all">
              <div className="text-3xl">{tid === "A" ? "🔴" : "🔵"}</div>
              <div className="font-black text-xl text-white">{teams[tid].name}</div>
              <div className="text-xs text-white/30 font-bold tracking-widest">[{tid === "A" ? "Q" : "P"}]</div>
            </button>
          ))}
        </div>
      )}

      {(faceoffState === "team_a_buzzed" || faceoffState === "team_b_buzzed") && faceoffBuzzedTeam && (
        <div className="w-full flex flex-col gap-3">
          <div className="text-center">
            <span className={`inline-block px-4 py-2 rounded-full font-black text-lg border-2 ${
              faceoffBuzzedTeam === "A" ? "border-red-500/40 text-red-300 bg-red-500/10" : "border-blue-500/40 text-blue-300 bg-blue-500/10"
            }`}>
              🔔 {teams[faceoffBuzzedTeam].name} — ¡Di tu respuesta!
            </span>
          </div>
          <div className="flex gap-3 max-w-lg mx-auto w-full">
            <input autoFocus type="text"
              value={faceoffBuzzedTeam === "A" ? inputA : inputB}
              onChange={(e) => faceoffBuzzedTeam === "A" ? setInputA(e.target.value) : setInputB(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnswer(faceoffBuzzedTeam, faceoffBuzzedTeam === "A" ? inputA : inputB)}
              placeholder={`Respuesta de ${teams[faceoffBuzzedTeam].name}...`}
              className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 font-bold text-lg outline-none focus:border-yellow-400/50 transition-all"
            />
            <button onClick={() => handleAnswer(faceoffBuzzedTeam, faceoffBuzzedTeam === "A" ? inputA : inputB)}
              className="px-5 py-3 rounded-xl bg-yellow-400 text-black font-black hover:bg-yellow-300 active:scale-95 transition-all">
              OK
            </button>
          </div>
        </div>
      )}

      {isCounter && (() => {
        const counter: TeamId = faceoffState === "team_a_answered" ? "B" : "A";
        const first = faceoffAnswers[0];
        return (
          <div className="w-full flex flex-col gap-3">
            <div className="text-center space-y-1">
              <div className="text-white/40 text-sm font-bold">
                {teams[first.teamId].name}: "{first.inputText}" —{" "}
                <span style={{ color: first.points > 0 ? "#4ade80" : "#f87171" }}>
                  {first.points > 0 ? `${first.points} pts` : "Sin puntos"}
                </span>
              </div>
              <span className={`inline-block px-4 py-2 rounded-full font-black text-lg border-2 ${
                counter === "A" ? "border-red-500/40 text-red-300 bg-red-500/10" : "border-blue-500/40 text-blue-300 bg-blue-500/10"
              }`}>
                {teams[counter].name} — ¡Contrarrespuesta!
              </span>
            </div>
            <div className="flex gap-3 max-w-lg mx-auto w-full">
              <input autoFocus type="text"
                value={counter === "A" ? inputA : inputB}
                onChange={(e) => counter === "A" ? setInputA(e.target.value) : setInputB(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnswer(counter, counter === "A" ? inputA : inputB)}
                placeholder={`Respuesta de ${teams[counter].name}...`}
                className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 font-bold text-lg outline-none focus:border-yellow-400/50 transition-all"
              />
              <button onClick={() => handleAnswer(counter, counter === "A" ? inputA : inputB)}
                className="px-5 py-3 rounded-xl bg-yellow-400 text-black font-black hover:bg-yellow-300 active:scale-95 transition-all">
                OK
              </button>
            </div>
          </div>
        );
      })()}

      {feedback && (
        <div className={`text-center py-3 px-6 rounded-xl font-bold text-lg border ${
          feedback.type === "hit" ? "bg-green-500/20 border-green-500/40 text-green-400" : "bg-red-500/20 border-red-500/40 text-red-400"
        }`}>
          {feedback.text}
        </div>
      )}
    </div>
  );
}
