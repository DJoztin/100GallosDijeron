/**
 * Banco de preguntas persistente en localStorage.
 * Permite agregar, editar y eliminar preguntas sin tocar el código.
 */

import { Question, Answer } from "@/app/lib/types";
import { GAME_QUESTIONS } from "@/app/data/questions";

const STORAGE_KEY = "mexas-question-bank";

export function loadQuestionBank(): Question[] {
  if (typeof window === "undefined") return GAME_QUESTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return GAME_QUESTIONS;
    const parsed = JSON.parse(raw) as Question[];
    return parsed.length > 0 ? parsed : GAME_QUESTIONS;
  } catch {
    return GAME_QUESTIONS;
  }
}

export function saveQuestionBank(questions: Question[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

export function resetQuestionBank() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function createQuestion(text: string, answers: { text: string; points: number }[]): Question {
  const id = `q-${Date.now()}`;
  return {
    id,
    text,
    answers: answers.map((a, i) => ({
      id: `${id}-${i + 1}`,
      text: a.text,
      points: a.points,
      revealed: false,
    })),
  };
}

/** Normaliza puntos para que sumen 100 */
export function normalizePoints(answers: { text: string; points: number }[]) {
  const total = answers.reduce((s, a) => s + a.points, 0);
  if (total === 0) return answers;
  return answers.map((a) => ({ ...a, points: Math.round((a.points / total) * 100) }));
}
