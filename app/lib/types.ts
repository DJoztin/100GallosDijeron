export type GamePhase =
  | "idle"
  | "faceoff"
  | "playing"
  | "steal"
  | "roundEnd"
  | "reveal";

export type TeamId = "A" | "B";

export type ViewMode = "host" | "players";

export interface Answer {
  id: string;
  text: string;
  points: number;
  revealed: boolean;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

export interface Team {
  id: TeamId;
  name: string;
  score: number;
}

export type FaceoffState =
  | "waiting"
  | "team_a_buzzed"
  | "team_b_buzzed"
  | "team_a_answered"
  | "team_b_answered"
  | "done";

export interface FaceoffAnswerEntry {
  teamId: TeamId;
  answerId: string | null;
  points: number;
  inputText: string;
}

// Evento de sonido que el store emite — el SoundManager lo consume
export type SoundEvent =
  | "correct"
  | "strike"
  | "buzzer"
  | "roundEnd"
  | "gameOver"
  | "steal"
  | null;

export interface GameState {
  phase: GamePhase;
  viewMode: ViewMode;
  teams: Record<TeamId, Team>;
  questions: Question[];
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  controllingTeam: TeamId | null;
  strikes: number;
  roundMultiplier: 1 | 2 | 3;
  roundPoints: number;
  faceoffState: FaceoffState;
  faceoffBuzzedTeam: TeamId | null;
  faceoffAnswers: FaceoffAnswerEntry[];
  faceoffStrike: boolean;
  revealQueue: string[];
  soundEvent: SoundEvent;       // ← nuevo: señal de sonido
  soundEventId: number;         // ← nuevo: timestamp para re-trigger del mismo evento
}
