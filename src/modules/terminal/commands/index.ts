/*
  Barrel de comandos. Se registran en el shell desde Terminal.astro. `open` y
  `lang` (navegación) se añaden en el PASO 4 junto al cableado de la UI.
*/

import type { Command } from '../core/registry';
import { clear, echo, help, history, whoami } from './system';
import { cat, cd, ls, pwd, tree } from './fs';

export const COMMANDS: Command[] = [help, echo, clear, whoami, history, pwd, cd, ls, cat, tree];
