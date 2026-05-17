/**
 * Sincronización entre ventanas usando BroadcastChannel API.
 * - HOST: emite estado completo cada vez que el store cambia.
 * - PLAYERS: recibe y aplica el estado sin triggear emit de vuelta.
 */

import { useGameStore } from "@/app/lib/game-store";
import { GameState } from "@/app/lib/types";

const CHANNEL_NAME = "mexas-game-sync";

type SyncMessage = {
  type: "state_update";
  state: Partial<GameState>;
};

let channel: BroadcastChannel | null = null;
let unsubscribeStore: (() => void) | null = null;
let isApplyingRemote = false;

// viewMode se excluye intencionalmente — cada ventana mantiene el suyo
const STATE_KEYS: (keyof GameState)[] = [
  "phase", "teams", "questions", "currentQuestionIndex",
  "currentQuestion", "controllingTeam", "strikes", "roundMultiplier",
  "roundPoints", "faceoffState", "faceoffBuzzedTeam", "faceoffAnswers",
  "faceoffStrike", "revealQueue",
];

function extractState(): Partial<GameState> {
  const s = useGameStore.getState();
  return STATE_KEYS.reduce((acc, key) => {
    (acc as any)[key] = (s as any)[key];
    return acc;
  }, {} as Partial<GameState>);
}

export function initSync(hostMode: boolean) {
  if (typeof window === "undefined") return;

  cleanup();

  channel = new BroadcastChannel(CHANNEL_NAME);

  if (hostMode) {
    // Host: suscribirse al store y emitir cada cambio
    unsubscribeStore = useGameStore.subscribe(() => {
      if (isApplyingRemote) return;
      const msg: SyncMessage = { type: "state_update", state: extractState() };
      channel?.postMessage(msg);
    });
  } else {
    // Players: escuchar y aplicar estado remoto
    channel.onmessage = (event: MessageEvent<SyncMessage>) => {
      if (event.data?.type !== "state_update") return;
      isApplyingRemote = true;
      useGameStore.setState(event.data.state);
      isApplyingRemote = false;
    };
  }
}

export function cleanup() {
  unsubscribeStore?.();
  unsubscribeStore = null;
  channel?.close();
  channel = null;
}
