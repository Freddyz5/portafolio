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
  return [
    [
      seg('╭─ ', 'dim'),
      seg(state.env.USER, 'alert'),
      seg(' at ', 'dim'),
      seg(state.env.HOST, 'accent'),
      seg(' in ', 'dim'),
      seg(path, 'data'),
    ],
    [seg('╰─', 'dim'), seg('λ', 'accent')],
  ];
}
