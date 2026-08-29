/*
  El cálculo del presupuesto, sin DOM y sin idioma. Todo lo de aquí son
  funciones puras sobre (datos, selección), de modo que el precio se puede
  razonar —y probar— sin abrir un navegador.

  Ésta es la diferencia de fondo con la versión de Palsabi: allá el estado vivía
  en atributos data-* y el total se recalculaba leyendo el DOM, así que la única
  forma de saber cuánto costaba algo era renderizarlo.
*/
import type {
  ChoiceGroup,
  CounterItem,
  Phase,
  QuoteData,
  QuoteItem,
  QuoteLine,
  QuoteResult,
  Selection,
  ToggleItem,
} from './types';

export interface QuoteIndex {
  items: Map<string, QuoteItem>;
  /** id de opción → id del grupo al que pertenece. */
  groupOfOption: Map<string, string>;
  /** id de cualquier cosa nombrable → su nombre, para el cartel «Necesita: …». */
  nameById: Map<string, string>;
  phaseOfItem: Map<string, string>;
}

export function indexQuote(data: QuoteData): QuoteIndex {
  const items = new Map<string, QuoteItem>();
  const groupOfOption = new Map<string, string>();
  const nameById = new Map<string, string>();
  const phaseOfItem = new Map<string, string>();

  for (const phase of data.phases) {
    for (const item of phase.items) {
      items.set(item.id, item);
      phaseOfItem.set(item.id, phase.id);
      if (item.kind === 'choice') {
        for (const option of item.options) {
          groupOfOption.set(option.id, item.id);
          nameById.set(option.id, option.name);
          phaseOfItem.set(option.id, phase.id);
        }
      } else {
        nameById.set(item.id, item.name);
      }
    }
  }

  return { items, groupOfOption, nameById, phaseOfItem };
}

export function createSelection(data: QuoteData): Selection {
  const selection: Selection = { toggles: {}, counters: {}, choices: {} };

  for (const phase of data.phases) {
    for (const item of phase.items) {
      if (item.kind === 'toggle') selection.toggles[item.id] = item.initial;
      else if (item.kind === 'counter') selection.counters[item.id] = item.initial;
      else selection.choices[item.id] = item.initial;
    }
  }

  return selection;
}

/**
 * ¿Está activo lo que otra pieza necesita? Se resuelve en cadena: una pieza
 * puede necesitar el panel, y el panel necesitar el catálogo público. El set
 * `seen` sólo está para que un `requires` mal escrito no cuelgue la página.
 */
function isActive(
  id: string | undefined,
  index: QuoteIndex,
  selection: Selection,
  seen: Set<string>,
): boolean {
  if (!id || seen.has(id)) return true;
  seen.add(id);

  const groupId = index.groupOfOption.get(id);
  if (groupId) {
    return selection.choices[groupId] === id && isAvailable(groupId, index, selection, seen);
  }

  const item = index.items.get(id);
  if (!item) return true;
  if (item.kind === 'toggle') {
    return selection.toggles[id] === true && isAvailable(id, index, selection, seen);
  }
  if (item.kind === 'counter') {
    return (selection.counters[id] ?? 0) > 0 && isAvailable(id, index, selection, seen);
  }
  return isAvailable(id, index, selection, seen);
}

/** ¿El requisito de esta pieza está satisfecho? Sin requisito, siempre sí. */
export function isAvailable(
  id: string,
  index: QuoteIndex,
  selection: Selection,
  seen: Set<string> = new Set(),
): boolean {
  const requires =
    index.items.get(id)?.requires ??
    index.items.get(index.groupOfOption.get(id) ?? '')?.requires;
  return requires ? isActive(requires, index, selection, seen) : true;
}

/**
 * Normaliza la selección contra los requisitos: lo que perdió su requisito se
 * apaga. Devuelve una selección nueva —no muta la recibida— y NO vuelve a
 * encender nada cuando el requisito regresa: eso lo decide quien cotiza.
 */
export function pruneSelection(
  data: QuoteData,
  index: QuoteIndex,
  selection: Selection,
): Selection {
  const next: Selection = {
    toggles: { ...selection.toggles },
    counters: { ...selection.counters },
    choices: { ...selection.choices },
  };

  for (const phase of data.phases) {
    for (const item of phase.items) {
      if (isAvailable(item.id, index, selection)) continue;
      if (item.kind === 'toggle') next.toggles[item.id] = false;
      else if (item.kind === 'counter') next.counters[item.id] = item.min;
    }
  }

  return next;
}

/** Encierra un contador entre su mínimo y su máximo. */
export function clampCounter(item: CounterItem, value: number): number {
  if (!Number.isFinite(value)) return item.min;
  return Math.min(item.max, Math.max(item.min, Math.round(value)));
}

function toggleLine(item: ToggleItem, phaseId: string, rate: number): QuoteLine {
  return {
    id: item.id,
    phaseId,
    name: item.name,
    quantity: 1,
    days: item.days,
    amount: item.days * rate,
  };
}

function counterLine(item: CounterItem, phaseId: string, count: number, rate: number): QuoteLine {
  const days = count * item.daysPerUnit;
  return { id: item.id, phaseId, name: item.name, quantity: count, days, amount: days * rate };
}

function choiceLine(group: ChoiceGroup, phaseId: string, optionId: string, rate: number): QuoteLine | null {
  const option = group.options.find((candidate) => candidate.id === optionId);
  if (!option) return null;
  return {
    id: option.id,
    phaseId,
    name: option.name,
    quantity: 1,
    days: option.days,
    amount: option.days * rate,
  };
}

function lineForItem(
  item: QuoteItem,
  phase: Phase,
  selection: Selection,
  rate: number,
): QuoteLine | null {
  if (item.kind === 'toggle') {
    return selection.toggles[item.id] ? toggleLine(item, phase.id, rate) : null;
  }
  if (item.kind === 'counter') {
    const count = selection.counters[item.id] ?? 0;
    return count > 0 ? counterLine(item, phase.id, count, rate) : null;
  }
  return choiceLine(item, phase.id, selection.choices[item.id], rate);
}

/**
 * El presupuesto entero a partir de la selección. Espera una selección ya
 * normalizada por pruneSelection: aquí no se apaga nada, solo se suma.
 */
export function computeQuote(
  data: QuoteData,
  index: QuoteIndex,
  selection: Selection,
): QuoteResult {
  const rate = data.settings.ratePerDay;
  const available: Record<string, boolean> = {};
  const activeOptions: string[] = [];
  const lines: QuoteLine[] = [];
  const byPhase = [];

  for (const phase of data.phases) {
    const phaseLines: QuoteLine[] = [];

    for (const item of phase.items) {
      const free = isAvailable(item.id, index, selection);
      available[item.id] = free;

      if (item.kind === 'choice') {
        const chosen = selection.choices[item.id];
        for (const option of item.options) available[option.id] = free;
        if (free && chosen) activeOptions.push(chosen);
        if (!free) continue;
      } else if (!free) {
        continue;
      }

      const line = lineForItem(item, phase, selection, rate);
      if (line) phaseLines.push(line);
    }

    const days = phaseLines.reduce((sum, line) => sum + line.days, 0);
    byPhase.push({ phaseId: phase.id, days, amount: days * rate, lines: phaseLines });
    lines.push(...phaseLines);
  }

  const totalDays = lines.reduce((sum, line) => sum + line.days, 0);

  return {
    lines,
    byPhase,
    totalDays,
    totalAmount: totalDays * rate,
    partCount: lines.length,
    available,
    activeOptions,
  };
}
