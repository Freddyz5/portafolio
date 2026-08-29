/*
  Formato de cifras. Los decimales aparecen sólo cuando existen: hay piezas de
  tres cuartos de jornada y otras de una hora (un octavo), así que redondear a
  jornada entera descuadraría el documento — pero «2 días» tampoco debe salir
  como «2,000 días».
*/
export type Lang = 'es' | 'en';

const LOCALES: Record<Lang, string> = { es: 'es-EC', en: 'en-US' };

export function locale(lang: Lang): string {
  return LOCALES[lang] ?? LOCALES.en;
}

/** Importe en dólares, con centavos sólo si los hay. */
export function formatMoney(amount: number, lang: Lang): string {
  return `$${amount.toLocaleString(locale(lang), {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Días con hasta tres decimales. Con menos, la pantalla mostraría un número y
 * el total sumaría otro: una hora es 0,25 de jornada y tres cuartos es 0,75.
 */
export function formatDays(days: number, lang: Lang): string {
  return days.toLocaleString(locale(lang), { maximumFractionDigits: 3 });
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

/** Fecha larga de emisión del documento. */
export function formatIssueDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(locale(lang), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** N.º FT-20260822 — sello estable, legible y ordenable. */
export function quoteNumber(date: Date, prefix: string): string {
  const stamp = [
    String(date.getFullYear()).padStart(4, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('');
  return `${prefix}-${stamp}`;
}
