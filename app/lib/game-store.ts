import { create } from "zustand";
import { GameState, TeamId, Answer, ViewMode } from "@/app/lib/types";
import {
  findMatchingAnswer,
  findMatchingAnswerAll,
  allAnswersRevealed,
  getOpponentTeam,
  calculateRoundPoints,
  shouldTriggerSteal,
  resolveFaceoff,
  getUnrevealedAnswers,
} from "@/app/lib/game-engine";
import { GAME_QUESTIONS } from "@/app/data/questions";
import { loadQuestionBank } from "@/app/lib/question-bank";
import { Sounds } from "@/app/lib/sounds";

interface GameActions {
  startGame: () => void;
  setViewMode: (mode: ViewMode) => void;
  buzzerPress: (team: TeamId) => void;
  submitFaceoffAnswer: (team: TeamId, input: string) => {
    matched: boolean;
    points: number;
    strike: boolean;
  };
  submitAnswer: (input: string) => { matched: boolean; answer: Answer | null; strike: boolean };
  addStrike: () => void;
  submitStealAnswer: (input: string) => { success: boolean };
  revealNextAnswer: () => void;
  skipReveal: () => void;
  revealAnswerById: (answerId: string) => void;
  nextRound: () => void;
  setMultiplier: (m: 1 | 2 | 3) => void;
  resetGame: () => void;
}

function freshQuestions() {
  const bank = typeof window !== "undefined" ? loadQuestionBank() : GAME_QUESTIONS;
  return bank.map((q) => ({
    ...q,
    answers: q.answers.map((a) => ({ ...a, revealed: false })),
  }));
}

const initialState: GameState = {
  phase: "idle",
  viewMode: "host",
  teams: {
    A: { id: "A", name: "Equipo A", score: 0 },
    B: { id: "B", name: "Equipo B", score: 0 },
  },
  questions: freshQuestions(),
  currentQuestionIndex: 0,
  currentQuestion: null,
  controllingTeam: null,
  strikes: 0,
  roundMultiplier: 1,
  roundPoints: 0,
  faceoffState: "waiting",
  faceoffBuzzedTeam: null,
  faceoffAnswers: [],
  faceoffStrike: false,
  revealQueue: [],
  soundEvent: null,
  soundEventId: 0
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  setViewMode: (mode) => set({ viewMode: mode }),

  startGame: () => {
    const questions = freshQuestions();
    Sounds.roundEnd();
    set({
      ...initialState,
      questions,
      phase: "faceoff",
      currentQuestion: questions[0],
      currentQuestionIndex: 0,
      faceoffState: "waiting",
      faceoffAnswers: [],
      faceoffBuzzedTeam: null,
      faceoffStrike: false,
    });
  },

  buzzerPress: (team) => {
    const { faceoffState } = get();
    if (faceoffState !== "waiting") return;
    set({
      faceoffBuzzedTeam: team,
      faceoffState: team === "A" ? "team_a_buzzed" : "team_b_buzzed",
      faceoffStrike: false,
    });
  },

  submitFaceoffAnswer: (team, input) => {
    const state = get();
    const { currentQuestion, faceoffAnswers } = state;
    if (!currentQuestion) return { matched: false, points: 0, strike: false };

    const match = findMatchingAnswerAll(input, currentQuestion.answers);

    const resolveTo = (entries: typeof faceoffAnswers) => {
      const winner = resolveFaceoff(entries);
      const revealedIds = new Set(entries.filter((e) => e.answerId).map((e) => e.answerId));
      const updatedAnswers = currentQuestion.answers.map((a) =>
        revealedIds.has(a.id) ? { ...a, revealed: true } : a
      );
      const updatedQuestion = { ...currentQuestion, answers: updatedAnswers };
      const updatedQuestions = state.questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      );
      set({
        faceoffAnswers: entries,
        faceoffState: "done",
        controllingTeam: winner!,
        currentQuestion: updatedQuestion,
        questions: updatedQuestions,
        phase: "playing",
        strikes: 0,
        faceoffStrike: false,
      });
    };

    if (match) {
      const entry = { teamId: team, answerId: match.id, points: match.points, inputText: input };
      const newAnswers = [...faceoffAnswers, entry];

      // Revelar inmediatamente + sonido correcto
      const immediateAnswers = currentQuestion.answers.map((a) =>
        a.id === match.id ? { ...a, revealed: true } : a
      );
      const immediateQuestion = { ...currentQuestion, answers: immediateAnswers };
      const immediateQuestions = state.questions.map((q) =>
        q.id === immediateQuestion.id ? immediateQuestion : q
      );
      set({ currentQuestion: immediateQuestion, questions: immediateQuestions });
      Sounds.correct(); // ✅ correcto en faceoff

      const topAnswer = [...currentQuestion.answers].sort((a, b) => b.points - a.points)[0];
      const isTopAnswer = match.id === topAnswer.id;

      if (newAnswers.length === 1 && !isTopAnswer) {
        const nextState = team === "A" ? "team_a_answered" : "team_b_answered";
        set({ faceoffAnswers: newAnswers, faceoffState: nextState, faceoffStrike: false });
        return { matched: true, points: match.points, strike: false };
      }

      resolveTo(newAnswers);
      return { matched: true, points: match.points, strike: false };

    } else {
      const entry = { teamId: team, answerId: null, points: 0, inputText: input };
      const newAnswers = [...faceoffAnswers, entry];
      Sounds.strike(); // ✅ strike siempre suena al fallar en faceoff

      if (newAnswers.length === 1) {
        // Primer equipo falló → contrarrespuesta del otro
        const nextState = team === "A" ? "team_a_answered" : "team_b_answered";
        set({ faceoffAnswers: newAnswers, faceoffState: nextState, faceoffStrike: true });
        return { matched: false, points: 0, strike: true };
      }

      // ✅ FIX: Ambos fallaron → se resuelve YA, gana quien buzzó primero, NO se sigue turnando
      resolveTo(newAnswers);
      return { matched: false, points: 0, strike: true };
    }
  },

  submitAnswer: (input) => {
    const state = get();
    if (!state.currentQuestion) return { matched: false, answer: null, strike: false };

    const match = findMatchingAnswer(input, state.currentQuestion.answers);
    if (match) {
      Sounds.correct(); // ✅ correcto al responder bien
      const updatedAnswers = state.currentQuestion.answers.map((a) =>
        a.id === match.id ? { ...a, revealed: true } : a
      );
      const updatedQuestion = { ...state.currentQuestion, answers: updatedAnswers };
      const updatedQuestions = state.questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      );
      const roundPoints = calculateRoundPoints(updatedAnswers, state.roundMultiplier);

      if (allAnswersRevealed(updatedAnswers)) {
        const teamScore = state.teams[state.controllingTeam!].score + roundPoints;
        Sounds.gameOver(); // ✅ win al completar todas las respuestas
        set({
          currentQuestion: updatedQuestion,
          questions: updatedQuestions,
          roundPoints,
          phase: "roundEnd",
          teams: {
            ...state.teams,
            [state.controllingTeam!]: {
              ...state.teams[state.controllingTeam!],
              score: teamScore,
            },
          },
        });
      } else {
        set({ currentQuestion: updatedQuestion, questions: updatedQuestions, roundPoints });
      }
      return { matched: true, answer: match, strike: false };
    } else {
      const newStrikes = state.strikes + 1;
      Sounds.strike(); // ✅ strike al fallar respuesta normal
      if (shouldTriggerSteal(newStrikes)) {
        set({ strikes: newStrikes, phase: "steal" });
      } else {
        set({ strikes: newStrikes });
      }
      return { matched: false, answer: null, strike: true };
    }
  },

  addStrike: () => {
    const state = get();
    const newStrikes = state.strikes + 1;
    Sounds.strike();
    if (shouldTriggerSteal(newStrikes)) {
      set({ strikes: newStrikes, phase: "steal" });
    } else {
      set({ strikes: newStrikes });
    }
  },

  submitStealAnswer: (input) => {
    const state = get();
    if (!state.currentQuestion || !state.controllingTeam) return { success: false };

    const stealingTeam = getOpponentTeam(state.controllingTeam);
    const match = findMatchingAnswer(input, state.currentQuestion.answers);
    const unrevealed = getUnrevealedAnswers(state.currentQuestion.answers);

    if (match) {
      Sounds.correct(); // ✅ correcto al acertar el robo
      setTimeout(() => Sounds.gameOver(), 500); // ✅ steal como fanfarria extra con delay
      const updatedAnswers = state.currentQuestion.answers.map((a) =>
        a.id === match.id ? { ...a, revealed: true } : a
      );
      const updatedQuestion = { ...state.currentQuestion, answers: updatedAnswers };
      const updatedQuestions = state.questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      );
      const roundPoints = calculateRoundPoints(updatedAnswers, state.roundMultiplier);
      const newScore = state.teams[stealingTeam].score + roundPoints;
      const stillUnrevealed = updatedAnswers.filter((a) => !a.revealed).map((a) => a.id);
      const nextPhase = stillUnrevealed.length > 0 ? "reveal" : "roundEnd";
      if (nextPhase === "roundEnd") setTimeout(() => Sounds.gameOver(), 1000); // ✅ win si no quedan respuestas
      set({
        currentQuestion: updatedQuestion,
        questions: updatedQuestions,
        phase: nextPhase,
        revealQueue: stillUnrevealed,
        teams: {
          ...state.teams,
          [stealingTeam]: { ...state.teams[stealingTeam], score: newScore },
        },
      });
      return { success: true };
    } else {
      Sounds.strike(); // ✅ strike al fallar el robo
      Sounds.gameOver(); // ✅ fin de juego inmediato al fallar el robo
      const roundPoints = calculateRoundPoints(state.currentQuestion.answers, state.roundMultiplier);
      const newScore = state.teams[state.controllingTeam].score + roundPoints;
      const stillUnrevealed = unrevealed.map((a) => a.id);
      const nextPhase = stillUnrevealed.length > 0 ? "reveal" : "roundEnd";
      set({
        phase: nextPhase,
        revealQueue: stillUnrevealed,
        teams: {
          ...state.teams,
          [state.controllingTeam]: {
            ...state.teams[state.controllingTeam],
            score: newScore,
          },
        },
      });
      return { success: false };
    }
  },

  revealNextAnswer: () => {
    const state = get();
    if (!state.currentQuestion || state.revealQueue.length === 0) {
      Sounds.roundEnd();
      set({ phase: "roundEnd" });
      return;
    }
    const [nextId, ...rest] = state.revealQueue;
    Sounds.correct(); // ✅ correcto al revelar cada respuesta
    const updatedAnswers = state.currentQuestion.answers.map((a) =>
      a.id === nextId ? { ...a, revealed: true } : a
    );
    const updatedQuestion = { ...state.currentQuestion, answers: updatedAnswers };
    const updatedQuestions = state.questions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    const isLast = rest.length === 0;
    set({
      currentQuestion: updatedQuestion,
      questions: updatedQuestions,
      revealQueue: rest,
      phase: isLast ? "roundEnd" : "reveal",
    });
  },

  skipReveal: () => {
    const state = get();
    if (!state.currentQuestion) return;
    const updatedAnswers = state.currentQuestion.answers.map((a) => ({ ...a, revealed: true }));
    const updatedQuestion = { ...state.currentQuestion, answers: updatedAnswers };
    const updatedQuestions = state.questions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    set({
      currentQuestion: updatedQuestion,
      questions: updatedQuestions,
      revealQueue: [],
      phase: "roundEnd",
    });
  },

  revealAnswerById: (answerId) => {
    const state = get();
    if (!state.currentQuestion) return;
    Sounds.correct(); // ✅ correcto al revelar manualmente
    const updatedAnswers = state.currentQuestion.answers.map((a) =>
      a.id === answerId ? { ...a, revealed: true } : a
    );
    const updatedQuestion = { ...state.currentQuestion, answers: updatedAnswers };
    const updatedQuestions = state.questions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    const roundPoints = calculateRoundPoints(updatedAnswers, state.roundMultiplier);
    if (allAnswersRevealed(updatedAnswers) && state.phase === "playing" && state.controllingTeam) {
      const teamScore = state.teams[state.controllingTeam].score + roundPoints;
      set({
        currentQuestion: updatedQuestion,
        questions: updatedQuestions,
        roundPoints,
        phase: "roundEnd",
        teams: {
          ...state.teams,
          [state.controllingTeam]: {
            ...state.teams[state.controllingTeam],
            score: teamScore,
          },
        },
      });
    } else {
      set({ currentQuestion: updatedQuestion, questions: updatedQuestions, roundPoints });
    }
  },

  nextRound: () => {
    const state = get();
    const nextIndex = state.currentQuestionIndex + 1;
    if (nextIndex >= state.questions.length) {
      Sounds.gameOver(); // ✅ win.wav al terminar el juego
      set({ phase: "idle" });
      return;
    }
    Sounds.roundEnd(); // ✅ next-round.wav al avanzar de ronda
    set({
      phase: "faceoff",
      currentQuestionIndex: nextIndex,
      currentQuestion: state.questions[nextIndex],
      strikes: 0,
      roundPoints: 0,
      controllingTeam: null,
      faceoffState: "waiting",
      faceoffAnswers: [],
      faceoffBuzzedTeam: null,
      faceoffStrike: false,
      revealQueue: [],
    });
  },

  setMultiplier: (m) => set({ roundMultiplier: m }),

  resetGame: () => {
    set({ ...initialState, questions: freshQuestions() });
  },
}));