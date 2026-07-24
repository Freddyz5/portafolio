/*
  Comandos de sistema: help, echo, clear, whoami, history.
  Regla de dependencias: commands/ → core/ + fs/. Nunca tocan el DOM; los
  efectos de UI pasan por ctx.effects.
*/

import type { Command } from '../core/registry';
import type { Line } from '../core/output';
import { blank, fail, line, ok, seg } from '../core/output';
import { t } from '../core/i18n';

export const help: Command = {
  name: 'help',
  summary: { es: 'Lista los comandos disponibles', en: 'List available commands' },
  aliases: ['ayuda', '?'],
  run: (input, ctx) => {
    // Easter egg: `help --easter` muestra la secuencia konami.
    if (input.flags.has('easter')) {
      return ok([line('↑ ↑ ↓ ↓ ← → ← → B A', 'accent')]);
    }

    const cmds = ctx.registry.list();
    const width = Math.max(...cmds.map((c) => c.name.length));
    const lines: Line[] = [
      line(t({ es: 'Comandos disponibles:', en: 'Available commands:' }, ctx.lang), 'accent'),
    ];
    for (const c of cmds) {
      lines.push([
        seg('  ' + c.name.padEnd(width + 2), 'data'),
        seg(t(c.summary, ctx.lang), 'default'),
      ]);
    }
    lines.push(blank());
    lines.push(
      line(
        t(
          {
            es: 'Todo esto también está en el menú, el footer y los botones.',
            en: 'All of this is also in the menu, footer and buttons.',
          },
          ctx.lang,
        ),
        'dim',
      ),
    );
    return ok(lines);
  },
};

export const echo: Command = {
  name: 'echo',
  summary: { es: 'Imprime el texto recibido', en: 'Print the given text' },
  run: (input) => ok([line(input.args.join(' '))]),
};

export const clear: Command = {
  name: 'clear',
  summary: { es: 'Limpia la consola', en: 'Clear the console' },
  aliases: ['cls'],
  run: (_input, ctx) => {
    ctx.effects.clear();
    return ok([]);
  },
};

export const whoami: Command = {
  name: 'whoami',
  summary: { es: '¿Quién es FR-3D?', en: 'Who is FR-3D?' },
  aliases: ['fr3d'],
  run: (_input, ctx) =>
    ok([
      line(
        t(
          {
            es: 'FR-3D · núcleo de a bordo del portafolio de Freddy Tacuri.',
            en: "FR-3D · onboard core of Freddy Tacuri's portfolio.",
          },
          ctx.lang,
        ),
        'accent',
      ),
    ]),
};

export const history: Command = {
  name: 'history',
  summary: { es: 'Muestra el historial de comandos', en: 'Show command history' },
  run: (_input, ctx) => {
    const lines: Line[] = ctx.state.history.map((cmd, i) => [
      seg(`  ${String(i + 1).padStart(3)}  `, 'dim'),
      seg(cmd, 'default'),
    ]);
    return ok(lines);
  },
};

export const fullscreen: Command = {
  name: 'fullscreen',
  summary: { es: 'Alterna pantalla completa', en: 'Toggle fullscreen' },
  aliases: ['max'],
  run: (_input, ctx) => {
    ctx.effects.toggleFullscreen();
    return ok([]);
  },
};

/* ---- Easter eggs (hidden: no aparecen en `help`) ------------------------- */

export const sudo: Command = {
  name: 'sudo',
  summary: { es: '', en: '' },
  hidden: true,
  run: (_input, ctx) =>
    fail(
      t(
        {
          es: 'Permiso denegado: aquí mandas tú de otra forma :)',
          en: 'Permission denied: you already run this show :)',
        },
        ctx.lang,
      ),
    ),
};

export const konami: Command = {
  name: 'konami',
  summary: { es: '', en: '' },
  hidden: true,
  run: () => ok([line('↑ ↑ ↓ ↓ ← → ← → B A', 'accent')]),
};
