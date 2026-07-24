/*
  Barrel de comandos. Se registran en el shell desde Terminal.astro.
*/

import type { Command } from '../core/registry';
import { clear, echo, fullscreen, help, history, konami, sudo, whoami } from './system';
import { cat, cd, ls, pwd, tree } from './fs';
import { lang, open } from './open';
import { demo } from './__demo';

export const COMMANDS: Command[] = [
  help,
  echo,
  clear,
  whoami,
  history,
  pwd,
  cd,
  ls,
  cat,
  tree,
  open,
  lang,
  fullscreen,
  // Easter eggs (hidden).
  sudo,
  konami,
  // Comando de humo del motor de tareas (hidden).
  demo,
];
