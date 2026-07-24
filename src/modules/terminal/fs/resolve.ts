/*
  Resolución de rutas del VFS: normalización estilo Unix (`~`, `/`, `.`, `..`)
  y navegación del árbol. Puro: no toca estado ni DOM.
*/

import type { DirNode, FsNode } from './types';

/** Contexto mínimo para `lookup` (ShellContext es asignable a esto). */
interface LookupCtx {
  fs: DirNode;
  state: { cwd: string; env: Record<string, string> };
}

/** Colapsa `.`/`..`/segmentos vacíos. `..` desde `/` se queda en `/`. */
function normalize(path: string): string {
  const stack: string[] = [];
  for (const part of path.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      stack.pop(); // pop de [] es no-op → nunca subimos por encima de la raíz
      continue;
    }
    stack.push(part);
  }
  return '/' + stack.join('/');
}

/** Convierte un destino (relativo/absoluto/`~`) en una ruta absoluta normalizada. */
export function resolvePath(target: string, cwd: string, home: string): string {
  let path: string;
  if (target === '') path = cwd;
  else if (target === '~') path = home;
  else if (target.startsWith('~/')) path = `${home}/${target.slice(2)}`;
  else if (target.startsWith('/')) path = target;
  else path = `${cwd}/${target}`;
  return normalize(path);
}

/** Devuelve el nodo en una ruta absoluta ya normalizada, o `null`. */
export function resolveNode(root: DirNode, absPath: string): FsNode | null {
  if (absPath === '/') return root;
  let node: FsNode = root;
  for (const part of absPath.split('/').filter(Boolean)) {
    if (node.type !== 'dir') return null;
    const child: FsNode | undefined = node.children.find((c) => c.name === part);
    if (!child) return null;
    node = child;
  }
  return node;
}

/** Resuelve un destino relativo al cwd y devuelve ruta + nodo (o null). */
export function lookup(
  target: string,
  ctx: LookupCtx,
): { path: string; node: FsNode | null } {
  const path = resolvePath(target, ctx.state.cwd, ctx.state.env.HOME);
  return { path, node: resolveNode(ctx.fs, path) };
}

export function isHidden(name: string): boolean {
  return name.startsWith('.');
}

/** Directorios primero, luego alfabético. No muta el array de entrada. */
export function sortNodes(nodes: FsNode[]): FsNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}
