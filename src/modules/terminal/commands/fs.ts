/*
  Comandos de filesystem: pwd, cd, ls, cat, tree. Solo lectura sobre el VFS.
  Los errores empiezan con el nombre del comando y salen de MSG en el idioma
  activo (convención Unix). `cd` es silencioso en éxito.
*/

import type { Command } from '../core/registry';
import type { Lang } from '../core/i18n';
import type { Line, Segment } from '../core/output';
import type { DirNode, FileAction, FileNode, FsNode } from '../fs/types';
import { blank, fail, line, ok, seg } from '../core/output';
import { MSG, t } from '../core/i18n';
import { isHidden, lookup, resolveNode, resolvePath, sortNodes } from '../fs/resolve';

/* ---- Helpers de presentación -------------------------------------------- */

/** Segmento de una entrada: dir con `/` en `data`, oculto en `dim`, resto default. */
function entrySeg(node: FsNode): Segment {
  if (node.type === 'dir') return seg(node.name + '/', 'data');
  if (isHidden(node.name)) return seg(node.name, 'dim');
  return seg(node.name, 'default');
}

/**
 * Codifica la acción de un archivo como href para el segmento enlazado. El
 * renderer (Terminal.astro) decodifica el prefijo y lo enruta por ctx.effects,
 * de modo que `cat about.md` y el clic en "ver completo" convergen con `open`.
 */
export function actionHref(action: FileAction): string {
  if (action.kind === 'section') return `section:${action.id}`;
  if (action.kind === 'page') return `page:${action.path}`;
  return `link:${action.url}`;
}

/** Línea final enlazada de un archivo con `action`: "ver completo en el sitio". */
function actionLine(node: FileNode, lang: Lang): Line {
  const text = lang === 'es' ? '→ ver completo en el sitio' : '→ see full version on the site';
  return [{ text, tone: 'ok', href: actionHref(node.action!) }];
}

function catLine(text: string): Line {
  if (text.startsWith('# ')) return line(text, 'accent');
  return line(text, 'data');
}

/* ---- Comandos ------------------------------------------------------------ */

export const pwd: Command = {
  name: 'pwd',
  summary: { es: 'Muestra el directorio actual', en: 'Print working directory' },
  run: (_input, ctx) => ok([line(ctx.state.cwd, 'data')]),
};

export const cd: Command = {
  name: 'cd',
  summary: { es: 'Cambia de directorio', en: 'Change directory' },
  usage: { es: 'cd [ruta]', en: 'cd [path]' },
  run: (input, ctx) => {
    const { state } = ctx;
    let target = input.args[0] ?? '~'; // cd sin args → HOME
    if (target === '-') target = state.env.OLDPWD; // cd - → directorio previo

    const path = resolvePath(target, state.cwd, state.env.HOME);
    const node = resolveNode(ctx.fs, path);
    if (!node) return fail(`cd: ${t(MSG.noSuchFile(target), ctx.lang)}`);
    if (node.type !== 'dir') return fail(`cd: ${t(MSG.notADirectory(target), ctx.lang)}`);

    state.env.OLDPWD = state.cwd;
    state.cwd = path;
    return ok([]); // silencioso en éxito
  },
};

export const ls: Command = {
  name: 'ls',
  summary: { es: 'Lista el contenido de un directorio', en: 'List directory contents' },
  usage: { es: 'ls [-la] [ruta]', en: 'ls [-la] [path]' },
  run: (input, ctx) => {
    const showAll = input.flags.has('a') || input.flags.has('all');
    const long = input.flags.has('l');
    const target = input.args[0] ?? '.';
    const { node } = lookup(target, ctx);
    if (!node) return fail(`ls: ${t(MSG.noSuchFile(target), ctx.lang)}`);

    let entries: FsNode[] = node.type === 'dir' ? sortNodes(node.children) : [node];
    if (!showAll) entries = entries.filter((e) => !isHidden(e.name));

    if (long) {
      return ok(
        entries.map((e) => [
          seg((e.mode ?? '') + '  ', 'dim'),
          seg((e.mtime ?? '') + '  ', 'dim'),
          entrySeg(e),
        ]),
      );
    }

    // Sin -l: una sola fila separada por espacios.
    const row: Segment[] = [];
    entries.forEach((e, i) => {
      if (i > 0) row.push(seg('  '));
      row.push(entrySeg(e));
    });
    return ok([row]);
  },
};

export const cat: Command = {
  name: 'cat',
  summary: { es: 'Muestra el contenido de un archivo', en: 'Show file contents' },
  usage: { es: 'cat <archivo> [...]', en: 'cat <file> [...]' },
  run: (input, ctx) => {
    if (input.args.length === 0) return fail(`cat: ${t(MSG.missingOperand(), ctx.lang)}`);

    const lines: Line[] = [];
    let code = 0;
    input.args.forEach((target, idx) => {
      if (idx > 0) lines.push(blank());
      const { node } = lookup(target, ctx);
      if (!node) {
        lines.push(line(`cat: ${t(MSG.noSuchFile(target), ctx.lang)}`, 'alert'));
        code = 1;
        return;
      }
      if (node.type === 'dir') {
        lines.push(line(`cat: ${t(MSG.isADirectory(target), ctx.lang)}`, 'alert'));
        code = 1;
        return;
      }
      for (const text of node.content.split('\n')) lines.push(catLine(text));
      if (node.action) lines.push(actionLine(node, ctx.lang));
    });
    return { lines, code };
  },
};

export const tree: Command = {
  name: 'tree',
  summary: { es: 'Dibuja el árbol de directorios', en: 'Draw the directory tree' },
  usage: { es: 'tree [ruta]', en: 'tree [path]' },
  run: (input, ctx) => {
    const target = input.args[0] ?? '.';
    const { node } = lookup(target, ctx);
    if (!node) return fail(`tree: ${t(MSG.noSuchFile(target), ctx.lang)}`);

    const lines: Line[] = [];
    let dirs = 0;
    let files = 0;

    lines.push([seg(node.name === '/' ? '/' : node.name + '/', 'data')]);
    if (node.type === 'dir') {
      const counts = walkTree(node, '', lines);
      dirs = counts.dirs;
      files = counts.files;
    } else {
      files = 1;
    }

    lines.push(blank());
    lines.push(
      line(
        t(
          { es: `${dirs} directorios, ${files} archivos`, en: `${dirs} directories, ${files} files` },
          ctx.lang,
        ),
        'dim',
      ),
    );
    return ok(lines);
  },
};

function walkTree(
  dirNode: DirNode,
  prefix: string,
  lines: Line[],
): { dirs: number; files: number } {
  let dirs = 0;
  let files = 0;
  const children = sortNodes(dirNode.children).filter((c) => !isHidden(c.name));

  children.forEach((child, i) => {
    const last = i === children.length - 1;
    lines.push([seg(prefix + (last ? '└── ' : '├── '), 'dim'), entrySeg(child)]);
    if (child.type === 'dir') {
      dirs++;
      const sub = walkTree(child, prefix + (last ? '    ' : '│   '), lines);
      dirs += sub.dirs;
      files += sub.files;
    } else {
      files++;
    }
  });

  return { dirs, files };
}
