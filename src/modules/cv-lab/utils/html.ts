// Helpers para construir el preview con template literals en el cliente.

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

// El JSON pegado es arbitrario: se escapa todo lo que se interpola.
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

export function byPriority<T>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => ((a as any)?.priority ?? 0) - ((b as any)?.priority ?? 0)
  );
}
