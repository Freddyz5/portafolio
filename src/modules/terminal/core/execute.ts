/*
  Orquestador: recibe la línea cruda, la registra en el historial, la parsea,
  resuelve el comando y lo ejecuta con try/catch. `run` se espera con `await`
  aunque hoy sea síncrono — habilita latencia FR-3D, output progresivo y
  comandos asíncronos sin refactorizar el resto.
*/

import { parse } from './parser';
import { fail } from './output';
import type { CommandResult } from './output';
import type { ShellContext } from './registry';
import { MSG, t } from './i18n';

/**
 * Ejecuta una línea. Devuelve `null` si la línea está vacía (el llamador solo
 * reimprime el prompt sin generar salida).
 */
export async function execute(
  input: string,
  ctx: ShellContext,
): Promise<CommandResult | null> {
  const trimmed = input.trim();
  if (trimmed) ctx.state.history.push(trimmed);

  const parsed = parse(input);
  if (!parsed) return null;

  const command = ctx.registry.get(parsed.name);
  if (!command) {
    return {
      lines: fail(t(MSG.unknownCommand(parsed.name), ctx.lang)).lines,
      code: 127,
    };
  }

  try {
    return await command.run(parsed, ctx);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(`${parsed.name}: ${message}`);
  }
}
