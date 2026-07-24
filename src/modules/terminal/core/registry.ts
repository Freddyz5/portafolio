/*
  Contrato de comandos y su registro. Regla de dependencias: `core/` NO conoce
  `commands/`; los comandos se registran desde fuera. Un comando nunca toca el
  DOM: usa `ctx.effects` para efectos de UI (limpiar, abrir, navegar).
*/

import type { ShellState } from './state';
import type { I18nText, Lang } from './i18n';
import type { CommandResult } from './output';
import type { ParsedCommand } from './parser';
import type { TerminalSink } from './sink';
import type { DirNode } from '../fs/types';

/** Efectos de UI que un comando puede pedir; los implementa Terminal.astro. */
export interface ShellEffects {
  clear(): void;
  open(url: string): void;
  navigate(path: string): void;
  openSection(id: string): void;
  /** Recarga la página en el idioma opuesto (comando `lang`). */
  toggleLang(): void;
  /** Alterna entre barra acoplada y pantalla completa (comando `fullscreen`). */
  toggleFullscreen(): void;
  /**
   * Sink de salida progresiva: un comando animado escribe por aquí (vía
   * `runTask`) en vez de devolver líneas. La terminal lo implementa reutilizando
   * `appendLine`/`fillSegments`.
   */
  task: TerminalSink;
  /**
   * Señal de la tarea en curso, para pasarla a `runTask`. La terminal es dueña
   * del `AbortController`; Ctrl+C y Esc lo abortan. Se renueva por comando.
   */
  taskSignal(): AbortSignal;
}

export interface ShellContext {
  state: ShellState;
  fs: DirNode;
  registry: Registry;
  lang: Lang;
  effects: ShellEffects;
}

export interface Command {
  name: string;
  summary: I18nText;
  usage?: I18nText;
  aliases?: string[];
  hidden?: boolean;
  run(input: ParsedCommand, ctx: ShellContext): CommandResult | Promise<CommandResult>;
}

export class Registry {
  private commands = new Map<string, Command>();
  private aliasMap = new Map<string, string>();

  register(command: Command): void {
    this.commands.set(command.name, command);
    for (const alias of command.aliases ?? []) {
      this.aliasMap.set(alias, command.name);
    }
  }

  get(name: string): Command | undefined {
    const canonical = this.aliasMap.get(name) ?? name;
    return this.commands.get(canonical);
  }

  has(name: string): boolean {
    return this.get(name) !== undefined;
  }

  /** Comandos únicos, no ocultos, ordenados por nombre (para `help`). */
  list(): Command[] {
    return Array.from(this.commands.values())
      .filter((c) => !c.hidden)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Nombres invocables (canónicos + alias) no ocultos, para autocompletado. */
  names(): string[] {
    const names = new Set<string>();
    for (const command of this.commands.values()) {
      if (!command.hidden) names.add(command.name);
    }
    for (const [alias, target] of this.aliasMap) {
      const command = this.commands.get(target);
      if (command && !command.hidden) names.add(alias);
    }
    return Array.from(names).sort();
  }
}
