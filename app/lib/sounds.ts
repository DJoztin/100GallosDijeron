/**
 * Sistema de sonido.
 * 
 * Para usar tus propios archivos:
 *   1. Pon tus .wav/.wav en /public/sounds/
 *   2. En cada función cambia playTone(...) por playFile("/sounds/tu_archivo.wav")
 * 
 * Archivos esperados (opcionales — si no existen usa sonido sintético):
 *   /public/sounds/strike.wav
 *   /public/sounds/correct.wav
 *   /public/sounds/buzzer.wav
 *   /public/sounds/round_end.wav
 *   /public/sounds/game_over.wav
 *   /public/sounds/steal.wav
 *   /public/sounds/idle_music.wav
 */

// ── Web Audio (sonidos sintéticos de respaldo) ────────────────────
let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.4,
  delay = 0
) {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ac.currentTime + delay);
    gain.gain.setValueAtTime(0, ac.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, ac.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration);
    osc.start(ac.currentTime + delay);
    osc.stop(ac.currentTime + delay + duration + 0.05);
  } catch {}
}

// ── Reproductor de archivos ───────────────────────────────────────
/**
 * Intenta reproducir un archivo de /public/sounds/.
 * Si no existe o falla, ejecuta el fallback sintético.
 */
function playFile(src: string, volume = 1.0, fallback?: () => void) {
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(() => fallback?.());
  } catch {
    fallback?.();
  }
}

// ── Sounds API ────────────────────────────────────────────────────
export const Sounds = {
  /** ✗ Strike — buzzer grave */
  strike() {
    playFile("/sounds/strik.wav", 1.0, () => {
      playTone(120, 0.6, "sawtooth", 0.5);
      playTone(100, 0.5, "sawtooth", 0.4, 0.1);
    });
  },

  /** ✓ Respuesta correcta */
  correct() {
    playFile("/sounds/correct.wav", 1.0, () => {
      playTone(600, 0.12, "sine", 0.35);
      playTone(800, 0.12, "sine", 0.35, 0.13);
      playTone(1000, 0.18, "sine", 0.35, 0.26);
    });
  },

  /** 🔔 Buzzer presionado */
  buzzer() {
    playFile("/sounds/buzzer.wav", 1.0, () => {
      playTone(440, 0.08, "square", 0.3);
      playTone(500, 0.08, "square", 0.3, 0.09);
    });
  },

  /** 🎉 Fin de ronda */
  roundEnd() {
    playFile("/sounds/next-round.wav", 1.0, () => {
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => playTone(freq, 0.18, "sine", 0.4, i * 0.13));
    });
  },

  /** 🏆 Fin de partida */
  gameOver() {
    playFile("/sounds/win.wav", 1.0, () => {
      const melody: [number, number][] = [
        [523, 0], [659, 0.15], [784, 0.30], [1047, 0.45],
        [784, 0.65], [1047, 0.80], [1319, 1.0],
      ];
      melody.forEach(([freq, delay]) => playTone(freq, 0.22, "sine", 0.45, delay));
    });
  },

  /** ⚡ Robo exitoso */
  steal() {
    playFile("/sounds/steal.wav", 1.0, () => {
      playTone(300, 0.08, "square", 0.3);
      playTone(450, 0.08, "square", 0.3, 0.09);
      playTone(600, 0.08, "square", 0.3, 0.18);
      playTone(900, 0.2,  "sine",   0.4, 0.27);
    });
  },
};

// ── Música de fondo en idle ───────────────────────────────────────
let idleAudio: HTMLAudioElement | null = null;
let idleInterval: ReturnType<typeof setInterval> | null = null;

export function startIdleMusic() {
  stopIdleMusic();

  // Intenta con archivo primero
  try {
    idleAudio = new Audio("/sounds/home.mp3");
    idleAudio.loop = true;
    idleAudio.volume = 0.4;
    idleAudio.play().catch(() => {
      // Si falla, usa el loop sintético
      idleAudio = null;
      startSyntheticIdle();
    });
    return;
  } catch {}

  startSyntheticIdle();
}

function startSyntheticIdle() {
  let beat = 0;
  idleInterval = setInterval(() => {
    const base = [220, 247, 262, 247];
    playTone(base[beat % 4], 0.1, "sine", 0.1);
    beat++;
  }, 600);
}

export function stopIdleMusic() {
  if (idleAudio) {
    idleAudio.pause();
    idleAudio.currentTime = 0;
    idleAudio = null;
  }
  if (idleInterval) {
    clearInterval(idleInterval);
    idleInterval = null;
  }
}
