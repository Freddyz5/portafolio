/*
  Navegación: `open` y `lang`. Vocabulario unificado — los comandos de nav en
  español desaparecen como comandos y sobreviven como ALIAS DE DESTINO de
  `open`. `open <archivo>` también ejecuta la `action` del nodo del VFS, de modo
  que `open about.md` y `open home` convergen.
*/

import type { Command, ShellEffects } from '../core/registry';
import type { Lang } from '../core/i18n';
import type { Line } from '../core/output';
import type { FileAction } from '../fs/types';
import { fail, line, ok, seg } from '../core/output';
import { t } from '../core/i18n';
import { lookup } from '../fs/resolve';

interface Destination {
  id: string;
  aliases: string[];
  action: FileAction;
}

const DESTINATIONS: Destination[] = [
  { id: 'home', aliases: ['inicio', 'about', 'start'], action: { kind: 'section', id: 'home' } },
  { id: 'experience', aliases: ['experiencia'], action: { kind: 'section', id: 'experience' } },
  { id: 'projects', aliases: ['proyectos'], action: { kind: 'section', id: 'projects' } },
  { id: 'contact', aliases: ['contacto'], action: { kind: 'section', id: 'contact' } },
  { id: 'cv', aliases: [], action: { kind: 'page', path: 'cv' } },
  {
    id: 'design-system',
    aliases: ['sistema-de-diseno', 'ds'],
    action: { kind: 'page', path: 'design-system' },
  },
];

/** Ejecuta una acción del VFS a través de los efectos de UI del shell. */
export function runAction(action: FileAction, effects: ShellEffects): void {
  if (action.kind === 'section') effects.openSection(action.id);
  else if (action.kind === 'page') effects.navigate(action.path);
  else effects.open(action.url);
}

function openingLine(id: string, lang: Lang): Line {
  return [seg(lang === 'es' ? `→ abriendo ${id}` : `→ opening ${id}`, 'ok')];
}

export const open: Command = {
  name: 'open',
  summary: { es: 'Abre una sección o página del sitio', en: 'Open a site section or page' },
  usage: { es: 'open <destino>', en: 'open <target>' },
  aliases: ['goto'],
  run: (input, ctx) => {
    const target = input.args[0];

    // Sin argumentos: lista los destinos disponibles.
    if (!target) {
      const lines: Line[] = [
        line(t({ es: 'Destinos disponibles:', en: 'Available targets:' }, ctx.lang), 'accent'),
      ];
      for (const d of DESTINATIONS) {
        const aliases = d.aliases.length ? `  (${d.aliases.join(', ')})` : '';
        lines.push([seg('  ' + d.id, 'data'), seg(aliases, 'dim')]);
      }
      return ok(lines);
    }

    // 1) Destino conocido (canónico o alias).
    const dest = DESTINATIONS.find((d) => d.id === target || d.aliases.includes(target));
    if (dest) {
      runAction(dest.action, ctx.effects);
      return ok([openingLine(dest.id, ctx.lang)]);
    }

    // 2) Archivo del VFS con acción.
    const { node } = lookup(target, ctx);
    if (node && node.type === 'file' && node.action) {
      runAction(node.action, ctx.effects);
      return ok([openingLine(target, ctx.lang)]);
    }

    // 3) Sin destino.
    return fail(
      t({ es: `open: destino desconocido: ${target}`, en: `open: unknown target: ${target}` }, ctx.lang),
    );
  },
};

export const lang: Command = {
  name: 'lang',
  summary: { es: 'Cambia de idioma (es/en)', en: 'Switch language (es/en)' },
  aliases: ['idioma', 'language'],
  run: (_input, ctx) => {
    ctx.effects.toggleLang(); // recarga la página en el otro idioma
    return ok([]);
  },
};
