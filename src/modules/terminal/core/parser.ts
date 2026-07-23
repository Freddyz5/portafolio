/*
  Tokenizador + parser de línea de comandos. Sin `eval`, sin ejecución: solo
  parte la línea en nombre, argumentos, flags y opciones. Respeta comillas
  simples y dobles; un token entrecomillado nunca se interpreta como flag
  (`echo "-n"` imprime `-n`).
*/

export interface ParsedCommand {
  name: string;
  args: string[];
  /** Flags booleanas: `-la` → {l, a}; `--all` → {all}. */
  flags: Set<string>;
  /** Opciones con valor: `--key=value` → { key: 'value' }. */
  options: Record<string, string>;
  /** Línea original ya recortada, para el eco en el log. */
  raw: string;
}

interface Token {
  value: string;
  quoted: boolean;
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;
  let started = false; // hay un token en construcción (incluye "" vacío)
  let wasQuoted = false;

  const flush = () => {
    if (started) tokens.push({ value: current, quoted: wasQuoted });
    current = '';
    started = false;
    wasQuoted = false;
  };

  for (const ch of input) {
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      started = true;
      wasQuoted = true;
    } else if (ch === ' ' || ch === '\t') {
      flush();
    } else {
      current += ch;
      started = true;
    }
  }
  flush();
  return tokens;
}

export function parse(input: string): ParsedCommand | null {
  const tokens = tokenize(input);
  if (tokens.length === 0) return null;

  const name = tokens[0].value;
  const args: string[] = [];
  const flags = new Set<string>();
  const options: Record<string, string> = {};

  for (const token of tokens.slice(1)) {
    const { value, quoted } = token;

    // Un token entrecomillado siempre es argumento literal.
    if (!quoted && value.startsWith('--') && value.length > 2) {
      const body = value.slice(2);
      const eq = body.indexOf('=');
      if (eq >= 0) options[body.slice(0, eq)] = body.slice(eq + 1);
      else flags.add(body);
    } else if (!quoted && value.startsWith('-') && value.length > 1) {
      for (const ch of value.slice(1)) flags.add(ch);
    } else {
      args.push(value);
    }
  }

  return { name, args, flags, options, raw: input.trim() };
}
