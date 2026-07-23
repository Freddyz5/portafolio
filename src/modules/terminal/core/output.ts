/*
  Modelo de salida del shell. Un comando NO pinta el DOM: devuelve datos
  (`CommandResult`) que el renderer del componente Astro traduce a nodos de
  texto. Cada `Segment` lleva un `tone` semántico; el mapeo tono → token de
  color vive en la capa visual (PASO 7), no aquí.
*/

export type Tone = 'default' | 'dim' | 'data' | 'accent' | 'alert' | 'ok';

export interface Segment {
  text: string;
  tone?: Tone;
  href?: string;
}
export type Line = Segment[];
export interface CommandResult {
  lines: Line[];
  code?: number;
}

export const seg = (text: string, tone?: Tone): Segment => ({ text, tone });
export const line = (text: string, tone?: Tone): Line => [seg(text, tone)];
export const blank = (): Line => [];
export const ok = (lines: Line[] = []): CommandResult => ({ lines, code: 0 });
export const fail = (msg: string): CommandResult => ({
  lines: [line(msg, 'alert')],
  code: 1,
});
