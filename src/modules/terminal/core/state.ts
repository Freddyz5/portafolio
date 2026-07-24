/*
  Estado mutable de una sesión del shell: directorio actual, variables de
  entorno, historial e idioma. Se crea una vez por página y lo comparten todos
  los comandos a través del `ShellContext`.
*/

import type { Lang } from './i18n';

export interface ShellState {
  cwd: string;
  env: Record<string, string>;
  history: string[];
  lang: Lang;
}

/** Directorio HOME del usuario ficticio; también es el cwd inicial. */
export const HOME = '/home/freddytacuri';

export function createState(lang: Lang): ShellState {
  return {
    cwd: HOME,
    env: {
      USER: 'freddytacuri',
      HOST: 'hlcs',
      HOME,
      SHELL: '/bin/frsh',
      OLDPWD: HOME,
    },
    history: [],
    lang,
  };
}

/** `/home/freddytacuri/projects` → `~/projects`. No toca rutas fuera de HOME. */
export function shortenPath(path: string, home: string): string {
  if (path === home) return '~';
  if (path.startsWith(home + '/')) return '~' + path.slice(home.length);
  return path;
}
