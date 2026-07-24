/*
  Prompt segmentado multilínea, construido SIEMPRE desde `state` (nunca
  hardcodeado) para que `cd` lo actualice solo:

    ╭─ freddytacuri at hlcs in ~/projects
    ╰─λ

  Devuelve dos líneas de segmentos con tono, que renderiza Terminal.astro.
*/

import type { Line } from '../core/output';
import { seg } from '../core/output';
import type { ShellState } from '../core/state';
import { shortenPath } from '../core/state';

export function buildPrompt(state: ShellState): [Line, Line] {
  const path = shortenPath(state.cwd, state.env.HOME);
  // Colores agrupados por significado: cian = tú y tu ubicación (usuario en
  // cian brillante, ruta en cian medio); ámbar = la máquina (host y el prompt
  // λ); dim = el andamiaje (cajas y conectores). Coherente, no alarmante.
  return [
    [
      seg('╭─ ', 'dim'),
      seg(state.env.USER, 'data'), // cian brillante
      seg(' at ', 'dim'),
      seg(state.env.HOST, 'accent'), // ámbar
      seg(' in ', 'dim'),
      seg(path, 'ok'), // cian medio
    ],
    [seg('╰─', 'dim'), seg('λ', 'accent')], // λ en ámbar
  ];
}
