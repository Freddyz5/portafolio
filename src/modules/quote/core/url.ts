/*
  La selección entera viaja en la URL: al terminar la reunión se copia el enlace
  y ése es el presupuesto acordado, sin captura ni PDF de por medio. Se escribe
  con replaceState para no ensuciar el historial con cada clic.

  Al leer NO se confía en nada: cada id se contrasta contra los datos y cada
  cantidad se encierra entre su mínimo y su máximo, porque el enlace lo puede
  editar cualquiera.
*/
import { clampCounter, createSelection, type QuoteIndex } from './quote';
import type { QuoteData, Selection } from './types';

const PARAM_TOGGLES = 'p';
const PARAM_COUNTERS = 'n';
const PARAM_CHOICES = 'g';
const PARAM_READONLY = 'readonly';

export function encodeSelection(selection: Selection): URLSearchParams {
  const params = new URLSearchParams();

  const on = Object.entries(selection.toggles)
    .filter(([, marked]) => marked)
    .map(([id]) => id);
  params.set(PARAM_TOGGLES, on.join(','));

  const counts = Object.entries(selection.counters)
    .filter(([, value]) => value > 0)
    .map(([id, value]) => `${id}:${value}`);
  if (counts.length) params.set(PARAM_COUNTERS, counts.join(','));

  const choices = Object.entries(selection.choices).map(([id, option]) => `${id}:${option}`);
  if (choices.length) params.set(PARAM_CHOICES, choices.join(','));

  return params;
}

function parsePairs(raw: string | null): Map<string, string> {
  if (raw === null) return new Map();
  return new Map(
    raw
      .split(',')
      .filter(Boolean)
      .map((pair) => {
        const separator = pair.indexOf(':');
        return separator === -1
          ? ([pair, ''] as const)
          : ([pair.slice(0, separator), pair.slice(separator + 1)] as const);
      }),
  );
}

/** Selección inicial de los datos, pisada por lo que traiga el enlace. */
export function decodeSelection(
  params: URLSearchParams,
  data: QuoteData,
  index: QuoteIndex,
): Selection {
  const selection = createSelection(data);

  const toggles = params.get(PARAM_TOGGLES);
  if (toggles !== null) {
    const marked = new Set(toggles.split(',').filter(Boolean));
    for (const id of Object.keys(selection.toggles)) selection.toggles[id] = marked.has(id);
  }

  const counters = parsePairs(params.get(PARAM_COUNTERS));
  if (counters.size || params.get(PARAM_COUNTERS) !== null) {
    for (const id of Object.keys(selection.counters)) {
      const item = index.items.get(id);
      if (item?.kind !== 'counter') continue;
      selection.counters[id] = clampCounter(item, Number(counters.get(id) ?? 0));
    }
  }

  for (const [groupId, optionId] of parsePairs(params.get(PARAM_CHOICES))) {
    const belongs = index.groupOfOption.get(optionId) === groupId;
    if (belongs && groupId in selection.choices) selection.choices[groupId] = optionId;
  }

  return selection;
}

export function isReadonly(params: URLSearchParams): boolean {
  const raw = params.get(PARAM_READONLY);
  return raw !== null && raw !== '0' && raw !== 'false';
}

/** Escribe la selección en la barra de direcciones sin tocar el historial. */
export function syncUrl(selection: Selection, readonly: boolean): void {
  const params = encodeSelection(selection);
  if (readonly) params.set(PARAM_READONLY, '1');
  history.replaceState(null, '', `${location.pathname}?${params}`);
}
