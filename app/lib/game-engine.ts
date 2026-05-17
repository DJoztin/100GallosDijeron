import { Answer, GameState, TeamId, FaceoffAnswerEntry } from "@/app/lib/types";

export const MAX_STRIKES = 3;

export function calculateRoundPoints(answers: Answer[], multiplier: number): number {
  return answers
    .filter((a) => a.revealed)
    .reduce((sum, a) => sum + a.points, 0) * multiplier;
}

export function getOpponentTeam(team: TeamId): TeamId {
  return team === "A" ? "B" : "A";
}

export function checkAnswerMatch(input: string, answer: Answer): boolean {
  const normalize = (s: string) =>
    s.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .trim();
  const normalInput = normalize(input);
  const normalAnswer = normalize(answer.text);
  if (normalAnswer.includes(normalInput) || normalInput.includes(normalAnswer)) return true;
  const inputWords = normalInput.split(/\s+/);
  const answerWords = normalAnswer.split(/\s+/);
  return inputWords.some((w) => w.length > 3 && answerWords.some((aw) => aw.includes(w)));
}

export function findMatchingAnswer(input: string, answers: Answer[]): Answer | null {
  const unrevealed = answers.filter((a) => !a.revealed);
  return unrevealed.find((a) => checkAnswerMatch(input, a)) ?? null;
}

export function findMatchingAnswerAll(input: string, answers: Answer[]): Answer | null {
  return answers.find((a) => checkAnswerMatch(input, a)) ?? null;
}

export function allAnswersRevealed(answers: Answer[]): boolean {
  return answers.every((a) => a.revealed);
}

export function getUnrevealedAnswers(answers: Answer[]): Answer[] {
  return answers.filter((a) => !a.revealed);
}

export function resolveFaceoff(entries: FaceoffAnswerEntry[]): TeamId | null {
  if (entries.length === 0) return null;
  if (entries.length === 1) return entries[0].teamId;
  const [a, b] = entries;
  if (a.points > b.points) return a.teamId;
  if (b.points > a.points) return b.teamId;
  // empate: gana quien presionó primero (primer entry)
  return a.teamId;
}

export function shouldTriggerSteal(strikes: number): boolean {
  return strikes >= MAX_STRIKES;
}
