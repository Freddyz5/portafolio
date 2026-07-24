/*
  Puerto entre el motor de tareas (`tasks/`) y la terminal. La dependencia va
  SIEMPRE tarea → terminal: el motor habla con esta interfaz y nunca con el DOM.
  Lo implementa Terminal.astro (ver PASO/FASE 2) reutilizando `appendLine` y
  `fillSegments`; en tests se implementa con un doble de mentira.

  Reutiliza `Line`/`Tone` de core/output: los tonos de una tarea son los mismos
  tonos semánticos que ya usa cualquier comando, sin capa de traducción.
*/

import type { Line } from './output';

/**
 * Handle opaco de una línea ya escrita, para poder reescribirla. El motor no
 * asume nada de su forma (hoy es el `HTMLDivElement` creado por `appendLine`).
 */
export type LineHandle = unknown;

export interface TerminalSink {
  /**
   * Añade una línea al log y devuelve su handle. `announce` por defecto es
   * `false`: la línea se marca `aria-hidden` para no leerla con lector de
   * pantalla (las líneas de progreso no deben anunciar cada actualización).
   */
  write(line: Line, announce?: boolean): LineHandle;
  /** Reemplaza el contenido de una línea ya escrita (spinner, barra, %). */
  update(handle: LineHandle, line: Line): void;
  /** Bloquea (`true`) o libera (`false`) el input mientras corre una tarea. */
  busy(running: boolean): void;
  /** `true` si el usuario pidió reducir movimiento (prefers-reduced-motion). */
  reducedMotion(): boolean;
}
