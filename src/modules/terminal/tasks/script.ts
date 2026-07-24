/*
  Un script de tarea es una lista DECLARATIVA de pasos. No hace nada por sí
  mismo: `runner.ts` lo interpreta contra un `TerminalSink`. Reutiliza `Line` y
  `Tone` de core/output, así que un paso habla el mismo vocabulario de salida
  que cualquier comando.
*/

import type { Line, Tone } from '../core/output';

export type TaskStep =
  /** Imprime una línea estática y sigue. */
  | { kind: 'print'; line: Line }
  /** Pausa `ms` sin escribir nada. */
  | { kind: 'wait'; ms: number }
  /** Línea con spinner giratorio durante `ms`; acaba en estado final sin spinner. */
  | { kind: 'spinner'; label: Line; ms: number }
  /** Línea con barra que llega al 100% en `ms`; avance no lineal. */
  | { kind: 'progress'; label: Line; ms: number; tone?: Tone }
  /** Línea de error anunciada; TERMINA la tarea. */
  | { kind: 'fail'; line: Line };

export interface TaskScript {
  steps: TaskStep[];
}
