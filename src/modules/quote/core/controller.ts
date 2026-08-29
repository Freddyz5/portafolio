/*
  Puente entre el modelo y el DOM. El estado vive aquí, en un único objeto
  Selection; el DOM es la vista y nunca la fuente de verdad. Cada interacción
  hace lo mismo: cambia la selección, la normaliza contra los requisitos,
  recalcula y vuelve a pintar.
*/
import {
  clampCounter,
  computeQuote,
  indexQuote,
  pruneSelection,
  type QuoteIndex,
} from './quote';
import { decodeSelection, isReadonly, syncUrl } from './url';
import { formatDays, formatIssueDate, formatMoney, pluralize, quoteNumber, type Lang } from './format';
import type { CounterItem, QuoteData, QuoteResult, Selection } from './types';

/** Cuánto dura el aviso del botón de guardar antes de volver a su etiqueta. */
const NOTICE_MS = 2600;

interface Refs {
  pieces: HTMLElement[];
  options: HTMLElement[];
  variants: HTMLElement[];
  totalAmount: HTMLElement | null;
  totalCount: HTMLElement | null;
  docPhases: HTMLElement[];
  docTotalDays: HTMLElement | null;
  docTotalAmount: HTMLElement | null;
}

function collect(root: ParentNode): Refs {
  return {
    pieces: Array.from(root.querySelectorAll<HTMLElement>('[data-piece]')),
    options: Array.from(root.querySelectorAll<HTMLElement>('[data-option]')),
    variants: Array.from(root.querySelectorAll<HTMLElement>('[data-variant]')),
    totalAmount: root.querySelector('[data-total-amount]'),
    totalCount: root.querySelector('[data-total-count]'),
    docPhases: Array.from(root.querySelectorAll<HTMLElement>('[data-doc-phase]')),
    docTotalDays: root.querySelector('[data-doc-total-days]'),
    docTotalAmount: root.querySelector('[data-doc-total-amount]'),
  };
}

export function mountQuote(root: HTMLElement, data: QuoteData, lang: Lang): void {
  const index = indexQuote(data);
  const refs = collect(root);
  const rate = data.settings.ratePerDay;
  const ui = data.ui;

  const params = new URLSearchParams(location.search);
  const readonly = isReadonly(params);
  let selection: Selection = decodeSelection(params, data, index);

  const days = (value: number) =>
    `${formatDays(value, lang)} ${pluralize(value, ui.daySingular, ui.dayPlural)}`;

  /** Precio de línea de una pieza fija: «2 días · $40». */
  const fixedPrice = (value: number) => `${days(value)} · ${formatMoney(value * rate, lang)}`;

  function priceForCounter(item: CounterItem, count: number): string {
    if (count === 0) return `${days(item.daysPerUnit)} ${ui.each}`;
    const unit = pluralize(count, item.unit.singular, item.unit.plural);
    const total = count * item.daysPerUnit;
    return `${count} ${unit} · ${days(total)} · ${formatMoney(total * rate, lang)}`;
  }

  function paintPieces(result: QuoteResult): void {
    const counted = new Set(result.lines.map((line) => line.id));

    for (const element of refs.pieces) {
      const id = element.dataset.id ?? '';
      const item = index.items.get(id);
      if (!item) continue;

      const free = result.available[id] !== false;
      element.classList.toggle('is-locked', !free);

      const lock = element.querySelector<HTMLElement>('[data-lock]');
      if (lock) lock.hidden = free;

      const price = element.querySelector<HTMLElement>('[data-line-price]');

      if (item.kind === 'toggle') {
        const on = counted.has(id);
        element.classList.toggle('is-on', on);
        element.setAttribute('aria-pressed', String(on));
        if (element instanceof HTMLButtonElement) element.disabled = !free;
        if (price) price.textContent = fixedPrice(item.days);
        continue;
      }

      if (item.kind === 'counter') {
        const count = selection.counters[id] ?? 0;
        element.classList.toggle('is-on', count > 0);
        if (price) price.textContent = priceForCounter(item, count);

        const value = element.querySelector<HTMLElement>('[data-counter-value]');
        if (value) value.textContent = String(count);

        for (const step of element.querySelectorAll<HTMLButtonElement>('[data-step]')) {
          const delta = Number(step.dataset.step);
          step.disabled = !free || (delta < 0 ? count <= item.min : count >= item.max);
        }
        continue;
      }

      element.classList.toggle('is-locked', !free);
    }

    for (const element of refs.options) {
      const id = element.dataset.id ?? '';
      const groupId = element.dataset.group ?? '';
      const chosen = selection.choices[groupId] === id;
      element.classList.toggle('is-on', chosen);
      element.setAttribute('aria-checked', String(chosen));

      const group = index.items.get(groupId);
      if (group?.kind !== 'choice') continue;
      const option = group.options.find((candidate) => candidate.id === id);
      const price = element.querySelector<HTMLElement>('[data-line-price]');
      if (option && price) price.textContent = fixedPrice(option.days);
    }

    const active = new Set(result.activeOptions);
    for (const element of refs.variants) {
      element.hidden = !active.has(element.dataset.variant ?? '');
    }
  }

  function paintTotals(result: QuoteResult): void {
    if (refs.totalAmount) refs.totalAmount.textContent = formatMoney(result.totalAmount, lang);
    if (refs.totalCount) {
      const parts = pluralize(result.partCount, ui.partSingular, ui.partPlural);
      refs.totalCount.textContent = `${result.partCount} ${parts} · ${days(result.totalDays)}`;
    }
  }

  /**
   * El documento ya tiene todas las filas en el marcado: aquí sólo se tapan las
   * que no se contrataron y se completan días y valores. Una fase sin nada
   * elegido desaparece entera, subtotal incluido.
   */
  function paintDocument(result: QuoteResult): void {
    const byId = new Map(result.lines.map((line) => [line.id, line]));

    refs.docPhases.forEach((body, position) => {
      const phase = result.byPhase[position];
      let visible = 0;

      for (const row of body.querySelectorAll<HTMLElement>('[data-doc-row]')) {
        const line = byId.get(row.dataset.id ?? '');
        row.hidden = !line;
        if (!line) continue;
        visible += 1;

        const quantity = row.querySelector<HTMLElement>('[data-doc-quantity]');
        if (quantity) quantity.textContent = line.quantity > 1 ? ` ×${line.quantity}` : '';
        const rowDays = row.querySelector<HTMLElement>('[data-doc-days]');
        if (rowDays) rowDays.textContent = formatDays(line.days, lang);
        const rowAmount = row.querySelector<HTMLElement>('[data-doc-amount]');
        if (rowAmount) rowAmount.textContent = formatMoney(line.amount, lang);
      }

      body.hidden = visible === 0;

      const subtotal = body.querySelector<HTMLElement>('[data-doc-subtotal]');
      if (subtotal && phase) {
        const cellDays = subtotal.querySelector<HTMLElement>('[data-doc-days]');
        if (cellDays) cellDays.textContent = formatDays(phase.days, lang);
        const cellAmount = subtotal.querySelector<HTMLElement>('[data-doc-amount]');
        if (cellAmount) cellAmount.textContent = formatMoney(phase.amount, lang);
      }
    });

    if (refs.docTotalDays) refs.docTotalDays.textContent = days(result.totalDays);
    if (refs.docTotalAmount) {
      refs.docTotalAmount.textContent = formatMoney(result.totalAmount, lang);
    }
  }

  let latest: QuoteResult;

  function render(): void {
    selection = pruneSelection(data, index, selection);
    latest = computeQuote(data, index, selection);
    paintPieces(latest);
    paintTotals(latest);
    paintDocument(latest);
    syncUrl(selection, readonly);
  }

  if (!readonly) wireEvents(root, index, () => selection, render);
  wireActions(root, data, () => latest);

  stampDocument(root, data, lang);
  render();
}

function wireEvents(
  root: HTMLElement,
  index: QuoteIndex,
  current: () => Selection,
  render: () => void,
): void {
  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const option = target.closest<HTMLElement>('[data-option]');
    if (option) {
      const group = option.dataset.group ?? '';
      const id = option.dataset.id ?? '';
      if (group && id) {
        current().choices[group] = id;
        render();
      }
      return;
    }

    const step = target.closest<HTMLElement>('[data-step]');
    if (step) {
      const piece = step.closest<HTMLElement>('[data-piece="counter"]');
      const item = index.items.get(piece?.dataset.id ?? '');
      if (piece && item?.kind === 'counter') {
        const selection = current();
        const now = selection.counters[item.id] ?? 0;
        selection.counters[item.id] = clampCounter(item, now + Number(step.dataset.step));
        render();
      }
      return;
    }

    const toggle = target.closest<HTMLElement>('[data-piece="toggle"]');
    if (toggle) {
      const id = toggle.dataset.id ?? '';
      const selection = current();
      selection.toggles[id] = !selection.toggles[id];
      render();
    }
  });
}

/**
 * La selección no se guarda en ningún lado porque no hace falta: viaja entera
 * en la URL. Guardarla es quedarse con el enlace.
 */
function wireActions(root: HTMLElement, data: QuoteData, latest: () => QuoteResult): void {
  const print = root.querySelector<HTMLButtonElement>('[data-print]');
  print?.addEventListener('click', () => window.print());

  const save = root.querySelector<HTMLButtonElement>('[data-save]');
  const label = root.querySelector<HTMLElement>('[data-save-label]');
  let timer = 0;

  const notify = (text: string) => {
    if (!label) return;
    label.textContent = text;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      label.textContent = data.ui.save;
    }, NOTICE_MS);
  };

  save?.addEventListener('click', async () => {
    if (!latest().partCount) {
      notify(data.ui.saveEmpty);
      return;
    }
    try {
      await navigator.clipboard.writeText(location.href);
      notify(data.ui.saveDone);
    } catch {
      notify(data.ui.saveFallback);
    }
  });
}

function stampDocument(root: HTMLElement, data: QuoteData, lang: Lang): void {
  const today = new Date();

  const date = root.querySelector<HTMLElement>('[data-doc-date]');
  if (date) date.textContent = formatIssueDate(today, lang);

  const number = root.querySelector<HTMLElement>('[data-doc-number]');
  if (number) number.textContent = quoteNumber(today, data.settings.quotePrefix);
}
