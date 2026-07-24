/*
  `install` simulado. Es la excusa del motor de tareas: anima fases con el
  lenguaje visual de la terminal (etiquetas en mayúsculas, barras ASCII, sin
  emoji) y termina en un error rotativo o, si el paquete ya está a bordo, en un
  "ya está instalado". NO imita la salida literal de bun: eso chocaría con el CRT.

  Oculto (`hidden`): el chiste es mejor encontrado que ofrecido. Alias de gestor
  (bun/npm/pnpm/yarn) que aceptan su subcomando de instalación.

  El comando escribe por el sink (salida progresiva), así que devuelve `ok()` SIN
  líneas: si devolviera contenido, renderResult lo pintaría otra vez tras animar.
*/

import type { Command } from '../core/registry';
import type { Lang } from '../core/i18n';
import type { Line, Tone } from '../core/output';
import type { TaskScript } from '../tasks/script';
import type { KnownPackage } from '../constants/INSTALL';
import { fail, ok, seg } from '../core/output';
import { t } from '../core/i18n';
import { runTask } from '../tasks/runner';
import { createBag } from '../tasks/random';
import {
  ALREADY_INSTALLED,
  INSTALL_ERRORS,
  INSTALL_PHASES,
  INSTALL_USAGE,
  KNOWN_PACKAGES,
} from '../constants/INSTALL';

const MAX_PACKAGES = 5;
const MAX_NAME_LEN = 64;
const LABEL_WIDTH = 9;

/** Subcomandos de instalación que aceptan los alias (bun add, npm i, …). */
const INSTALL_SUBCOMMANDS = new Set(['install', 'add', 'i']);

/**
 * Bolsa de errores a nivel de módulo: persiste entre invocaciones para no
 * repetir el mismo error dos veces seguidas dentro de una sesión.
 */
const nextError = createBag(INSTALL_ERRORS);

/** Saneado del nombre que se hace eco en pantalla: sin control chars, ≤64. */
const sanitize = (raw: string): string =>
  raw.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, MAX_NAME_LEN);

/** Línea de fase: etiqueta en mayúsculas (ancho fijo) + descripción. */
const phaseLine = (label: string, desc: string, labelTone: Tone): Line => [
  seg(label.padEnd(LABEL_WIDTH), labelTone),
  seg(desc, 'default'),
];

type PkgClass =
  | { kind: 'installed'; pkg: string }
  | { kind: 'known'; pkg: string; known: KnownPackage }
  | { kind: 'unknown'; pkg: string };

const classify = (pkg: string, installed: Set<string>): PkgClass => {
  const lower = pkg.toLowerCase();
  if (installed.has(lower)) return { kind: 'installed', pkg };
  const known = KNOWN_PACKAGES.find((k) => k.names.includes(lower));
  if (known) return { kind: 'known', pkg, known };
  return { kind: 'unknown', pkg };
};

const usageResult = (lang: Lang) => ok([[seg(t(INSTALL_USAGE, lang), 'dim')]]);

export const install: Command = {
  name: 'install',
  summary: { es: '', en: '' },
  usage: INSTALL_USAGE,
  aliases: ['bun', 'npm', 'pnpm', 'yarn'],
  hidden: true,
  run: async (input, ctx) => {
    const lang = ctx.lang;

    // 1) Resolver el subcomando cuando se invoca por alias (bun/npm/…).
    let args = input.args;
    if (input.name !== 'install') {
      const sub = args[0];
      // `bun` a secas → uso, como el binario real.
      if (sub === undefined) return usageResult(lang);
      // `bun run`, `npm test` → error normal, sin animación.
      if (!INSTALL_SUBCOMMANDS.has(sub.toLowerCase())) {
        return fail(
          t(
            {
              es: `${input.name}: subcomando no soportado: ${sanitize(sub)}`,
              en: `${input.name}: unsupported subcommand: ${sanitize(sub)}`,
            },
            lang,
          ),
        );
      }
      args = args.slice(1);
    }

    // 2) Sanear y limitar la lista de paquetes.
    const packages = args
      .map(sanitize)
      .filter((p) => p.length > 0)
      .slice(0, MAX_PACKAGES);
    if (packages.length === 0) return usageResult(lang);

    // 3) Clasificar contra el árbol real y los paquetes con nombre propio.
    const installed = new Set(ctx.packages.map((p) => p.toLowerCase()));
    const classes = packages.map((p) => classify(p, installed));
    const anyUnknown = classes.some((c) => c.kind === 'unknown');

    const sink = ctx.effects.task;
    const signal = ctx.effects.taskSignal();
    const subject = packages.join(', ');

    if (anyUnknown) {
      // Animación completa → error de la bolsa → guiño. Presupuesto ~2.4s.
      const err = nextError();
      const script: TaskScript = {
        steps: [
          { kind: 'spinner', label: phaseLine('RESOLVE', `${t(INSTALL_PHASES.resolve, lang)} ${subject}`, 'data'), ms: 500 },
          { kind: 'progress', label: phaseLine('FETCH', t(INSTALL_PHASES.fetch, lang), 'data'), ms: 900 },
          { kind: 'spinner', label: phaseLine('VERIFY', t(INSTALL_PHASES.verify, lang), 'data'), ms: 400 },
          { kind: 'progress', label: phaseLine('LINK', t(INSTALL_PHASES.link, lang), 'data'), ms: 600 },
          { kind: 'fail', line: phaseLine('ERROR', `${err.code}: ${t(err.message, lang)}`, 'alert') },
        ],
      };
      await runTask(script, sink, signal);
      // El guiño va DESPUÉS del `fail` (que termina la tarea) y solo si no se
      // abortó. No anunciado: la única línea anunciada es el error.
      if (!signal.aborted) sink.write([seg(t(err.wink, lang), 'accent')], false);
      return ok([]);
    }

    // Todos conocidos/instalados → animación corta → respuesta(s), sin error.
    const script: TaskScript = {
      steps: [
        { kind: 'spinner', label: phaseLine('RESOLVE', `${t(INSTALL_PHASES.resolve, lang)} ${subject}`, 'data'), ms: 400 },
        { kind: 'progress', label: phaseLine('LINK', t(INSTALL_PHASES.link, lang), 'data'), ms: 350 },
      ],
    };
    await runTask(script, sink, signal);
    if (!signal.aborted) {
      let announced = false;
      for (const c of classes) {
        const resp = c.kind === 'known' ? c.known.response : ALREADY_INSTALLED(c.pkg);
        // Anuncia solo la primera línea de resultado; el resto va silenciado.
        sink.write([seg(t(resp, lang), 'ok')], !announced);
        announced = true;
      }
    }
    return ok([]);
  },
};
