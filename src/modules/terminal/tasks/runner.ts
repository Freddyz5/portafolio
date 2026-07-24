/*
  Intérprete de un `TaskScript` contra un `TerminalSink`. Emite líneas DURANTE
  la ejecución (no al final) y reescribe la misma línea para animar spinner y
  barra — las dos capacidades que el contrato comando→renderer no tiene.

  Reglas duras:
  - `sink.busy(true)` al empezar y `busy(false)` en un `finally`, también si se
    aborta o si lanza: si esa liberación se escapa, el input queda muerto.
  - Toda espera y todo tick comprueban `signal.aborted` y salen limpios.
  - Con `reducedMotion()`: sin esperas, imprimiendo solo el estado final de cada
    paso. Sigue siendo legible y llega al mismo error.
  - `fail` es la ÚNICA línea anunciada de toda la tarea, y la termina.

  Glifos: VT323 (la fuente del log) NO cubre braille/bloques/box-drawing en su
  propio archivo; esos solo salen por fallback del sistema, con métricas que no
  encajan en una barra. Se usa ASCII, que la fuente SÍ trae, para que la barra
  mantenga ancho constante sin depender del fallback.
*/

import type { Line, Tone } from '../core/output';
import type { TerminalSink, LineHandle } from '../core/sink';
import type { TaskScript, TaskStep } from './script';

const SPINNER_FRAMES = ['|', '/', '-', '\\'] as const;
const SPINNER_INTERVAL = 90; // ms por fotograma
const PROGRESS_INTERVAL = 60; // ms por tick de barra
const BAR_WIDTH = 14;

/** Espera `ms`; resuelve de inmediato si el signal ya abortó o aborta antes. */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal?.aborted) return resolve();
    const id = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(id);
      resolve();
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

/** Avance no lineal: rápido al principio, se atasca cerca del final. */
function ease(t: number): number {
  const clamped = t < 0 ? 0 : t > 1 ? 1 : t;
  return Math.pow(clamped, 0.45);
}

function barText(pct: number): string {
  const filled = Math.round((pct / 100) * BAR_WIDTH);
  const clamped = Math.max(0, Math.min(BAR_WIDTH, filled));
  return '[' + '#'.repeat(clamped) + '-'.repeat(BAR_WIDTH - clamped) + ']';
}

const spinnerLine = (label: Line, frame: string): Line => [
  ...label,
  { text: '  ' + frame, tone: 'accent' },
];

const spinnerDone = (label: Line): Line => [
  ...label,
  { text: '  ok', tone: 'ok' },
];

const progressLine = (label: Line, pct: number, tone: Tone): Line => [
  ...label,
  { text: '  ' + barText(pct) + ' ' + String(Math.round(pct)).padStart(3, ' ') + '%', tone },
];

async function runStep(
  step: TaskStep,
  sink: TerminalSink,
  reduced: boolean,
  signal?: AbortSignal,
): Promise<void> {
  switch (step.kind) {
    case 'print': {
      sink.write(step.line);
      return;
    }

    case 'wait': {
      if (reduced) return;
      await sleep(step.ms, signal);
      return;
    }

    case 'spinner': {
      const handle: LineHandle = sink.write(spinnerLine(step.label, SPINNER_FRAMES[0]));
      if (reduced) {
        sink.update(handle, spinnerDone(step.label));
        return;
      }
      const start = Date.now();
      let frame = 0;
      while (!signal?.aborted) {
        const elapsed = Date.now() - start;
        if (elapsed >= step.ms) break;
        sink.update(handle, spinnerLine(step.label, SPINNER_FRAMES[frame % SPINNER_FRAMES.length]));
        frame++;
        await sleep(Math.min(SPINNER_INTERVAL, step.ms - elapsed), signal);
      }
      if (!signal?.aborted) sink.update(handle, spinnerDone(step.label));
      return;
    }

    case 'progress': {
      const tone: Tone = step.tone ?? 'data';
      const handle: LineHandle = sink.write(progressLine(step.label, 0, tone));
      if (reduced) {
        sink.update(handle, progressLine(step.label, 100, tone));
        return;
      }
      const start = Date.now();
      while (!signal?.aborted) {
        const elapsed = Date.now() - start;
        if (elapsed >= step.ms) break;
        const pct = ease(elapsed / step.ms) * 100;
        sink.update(handle, progressLine(step.label, pct, tone));
        await sleep(Math.min(PROGRESS_INTERVAL, step.ms - elapsed), signal);
      }
      if (!signal?.aborted) sink.update(handle, progressLine(step.label, 100, tone));
      return;
    }

    case 'fail': {
      // Única línea anunciada de toda la tarea.
      sink.write(step.line, true);
      return;
    }
  }
}

/**
 * Ejecuta un script contra un sink. Resuelve cuando termina, se aborta o
 * alcanza un paso `fail`. Nunca deja el input bloqueado: `busy(false)` va en
 * `finally`.
 */
export async function runTask(
  script: TaskScript,
  sink: TerminalSink,
  signal?: AbortSignal,
): Promise<void> {
  sink.busy(true);
  const reduced = sink.reducedMotion();
  try {
    for (const step of script.steps) {
      if (signal?.aborted) return;
      await runStep(step, sink, reduced, signal);
      if (step.kind === 'fail') return; // `fail` termina la tarea
    }
  } finally {
    sink.busy(false);
  }
}
