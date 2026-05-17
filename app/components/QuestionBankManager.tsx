"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Question } from "@/app/lib/types";
import {
  loadQuestionBank,
  saveQuestionBank,
  resetQuestionBank,
  createQuestion,
} from "@/app/lib/question-bank";

interface DraftAnswer { text: string; points: number }
const emptyAnswers = (): DraftAnswer[] =>
  Array.from({ length: 5 }, () => ({ text: "", points: 0 }));

export function QuestionBankManager({ onClose }: { onClose: () => void }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editing, setEditing] = useState<string | null>(null); // question id or "new"
  const [draftText, setDraftText] = useState("");
  const [draftAnswers, setDraftAnswers] = useState<DraftAnswer[]>(emptyAnswers());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setQuestions(loadQuestionBank());
  }, []);

  const save = (qs: Question[]) => {
    saveQuestionBank(qs);
    setQuestions(qs);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const startNew = () => {
    setEditing("new");
    setDraftText("");
    setDraftAnswers(emptyAnswers());
  };

  const startEdit = (q: Question) => {
    setEditing(q.id);
    setDraftText(q.text);
    setDraftAnswers(
      q.answers.map((a) => ({ text: a.text, points: a.points }))
    );
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraftText("");
    setDraftAnswers(emptyAnswers());
  };

  const commitEdit = () => {
    const validAnswers = draftAnswers.filter((a) => a.text.trim() && a.points > 0);
    if (!draftText.trim() || validAnswers.length < 2) return;

    if (editing === "new") {
      const newQ = createQuestion(draftText.trim(), validAnswers);
      save([...questions, newQ]);
    } else {
      const updated = questions.map((q) => {
        if (q.id !== editing) return q;
        return {
          ...q,
          text: draftText.trim(),
          answers: validAnswers.map((a, i) => ({
            id: `${q.id}-${i + 1}`,
            text: a.text.trim(),
            points: a.points,
            revealed: false,
          })),
        };
      });
      save(updated);
    }
    cancelEdit();
  };

  const deleteQuestion = (id: string) => {
    save(questions.filter((q) => q.id !== id));
  };

  const moveQuestion = (id: string, dir: -1 | 1) => {
    const idx = questions.findIndex((q) => q.id === id);
    if (idx < 0) return;
    const next = idx + dir;
    if (next < 0 || next >= questions.length) return;
    const qs = [...questions];
    [qs[idx], qs[next]] = [qs[next], qs[idx]];
    save(qs);
  };

  const handleReset = () => {
    if (!confirm("¿Restaurar preguntas originales?")) return;
    resetQuestionBank();
    setQuestions(loadQuestionBank());
  };

  const updateAnswer = (i: number, field: keyof DraftAnswer, value: string | number) => {
    setDraftAnswers((prev) => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a));
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="w-full max-w-3xl bg-[#0a1220] border border-white/10 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <div className="font-black text-white text-xl">📋 Banco de Preguntas</div>
            <div className="text-xs text-white/40 font-bold mt-0.5">
              {questions.length} pregunta{questions.length !== 1 ? "s" : ""} guardadas
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-green-400 text-sm font-bold animate-pulse">✓ Guardado</span>
            )}
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-white/30 font-bold text-xs hover:bg-white/5 transition-all"
            >
              Restaurar originales
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all"
            >
              Cerrar ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Formulario de nueva/editar pregunta */}
          {editing !== null && (
            <div className="bg-blue-950/40 border border-blue-500/20 rounded-xl p-5 space-y-4">
              <div className="text-sm font-black tracking-widest text-blue-400/70 uppercase">
                {editing === "new" ? "Nueva Pregunta" : "Editar Pregunta"}
              </div>

              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1 block">
                  Pregunta
                </label>
                <input
                  autoFocus
                  type="text"
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder="Nombra algo que..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold outline-none focus:border-blue-400/50 transition-all placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 block">
                  Respuestas (de mayor a menor puntaje)
                </label>
                <div className="space-y-2">
                  {draftAnswers.map((a, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="text-white/20 font-black text-sm w-5 text-right shrink-0">{i + 1}</span>
                      <input
                        type="text"
                        value={a.text}
                        onChange={(e) => updateAnswer(i, "text", e.target.value)}
                        placeholder={`Respuesta ${i + 1}`}
                        className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white font-bold text-sm outline-none focus:border-blue-400/40 transition-all placeholder:text-white/15"
                      />
                      <input
                        type="number"
                        value={a.points || ""}
                        onChange={(e) => updateAnswer(i, "points", parseInt(e.target.value) || 0)}
                        placeholder="Pts"
                        min={0}
                        max={100}
                        className="w-16 px-2 py-2 rounded-lg bg-white/10 border border-white/10 text-yellow-400 font-black text-sm text-center outline-none focus:border-yellow-400/40 transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-xs text-white/20 font-bold mt-2">
                  Total puntos: {draftAnswers.reduce((s, a) => s + (a.points || 0), 0)}
                  {" "}(recomendado: sumar ~100)
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={commitEdit}
                  disabled={!draftText.trim() || draftAnswers.filter(a => a.text && a.points > 0).length < 2}
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 text-black font-black hover:bg-yellow-300 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {editing === "new" ? "Agregar" : "Guardar cambios"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 font-bold hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Lista de preguntas */}
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white/3 border border-white/8 rounded-xl p-4 hover:border-white/15 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 shrink-0 mt-0.5">
                  <button
                    onClick={() => moveQuestion(q.id, -1)}
                    disabled={idx === 0}
                    className="text-white/20 hover:text-white/60 disabled:opacity-10 transition-colors text-xs font-black"
                  >▲</button>
                  <button
                    onClick={() => moveQuestion(q.id, 1)}
                    disabled={idx === questions.length - 1}
                    className="text-white/20 hover:text-white/60 disabled:opacity-10 transition-colors text-xs font-black"
                  >▼</button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black text-white/20 shrink-0">#{idx + 1}</span>
                    <div className="font-bold text-white text-sm truncate">{q.text}</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {q.answers.map((a) => (
                      <span
                        key={a.id}
                        className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/8 text-white/50 font-bold"
                      >
                        {a.text}
                        <span className="text-yellow-400/70 ml-1">{a.points}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(q)}
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-white/40 font-bold text-xs hover:bg-white/10 hover:text-white transition-all"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/50 font-bold text-xs hover:bg-red-500/10 hover:text-red-400 transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Botón agregar */}
          {editing === null && (
            <button
              onClick={startNew}
              className="w-full py-3 rounded-xl border-2 border-dashed border-white/10 text-white/30 font-bold hover:border-yellow-400/30 hover:text-yellow-400/60 transition-all"
            >
              + Agregar pregunta
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
