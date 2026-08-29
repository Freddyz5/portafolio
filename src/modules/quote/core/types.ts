/*
  Forma de los datos DESPUÉS de aplanar el idioma con separateLanguages: donde
  quote.json tiene { es, en }, aquí ya hay un string. El módulo entero trabaja
  sobre esta forma, así que el idioma deja de existir como problema pasada la
  frontera de la página.
*/

export interface UnitLabels {
  singular: string;
  plural: string;
}

/** Pieza que se marca o no. */
export interface ToggleItem {
  kind: 'toggle';
  id: string;
  name: string;
  days: number;
  initial: boolean;
  description: string;
  /** Frase que se añade a la descripción según la opción elegida en un grupo. */
  variants?: Record<string, string>;
  requires?: string;
}

/** Pieza de cantidad variable: secciones extra, horas de soporte. */
export interface CounterItem {
  kind: 'counter';
  id: string;
  name: string;
  daysPerUnit: number;
  initial: number;
  min: number;
  max: number;
  unit: UnitLabels;
  description: string;
  requires?: string;
}

export interface ChoiceOption {
  id: string;
  name: string;
  days: number;
  description: string;
  recommended?: boolean;
}

/** Grupo excluyente: hay que elegir una de las alternativas. */
export interface ChoiceGroup {
  kind: 'choice';
  id: string;
  question: string;
  initial: string;
  options: ChoiceOption[];
  requires?: string;
}

export type QuoteItem = ToggleItem | CounterItem | ChoiceGroup;

export interface Phase {
  id: string;
  name: string;
  note?: string;
  items: QuoteItem[];
}

export interface QuoteSettings {
  /** Tarifa por jornada. Se cambia en quote.json, nunca desde la página. */
  ratePerDay: number;
  validityDays: number;
  quotePrefix: string;
  preparedBy: string;
  client: string;
  subject: string;
}

export interface QuoteData {
  meta: { title: string; description: string };
  settings: QuoteSettings;
  phases: Phase[];
  recurringCosts: string[];
  notIncluded: string[];
  ui: Record<string, string>;
  document: Record<string, string>;
}

/*
  El estado. Objetos planos y no Map a propósito: así la selección se serializa
  a la URL y se vuelca al DOM sin conversiones intermedias.
*/
export interface Selection {
  toggles: Record<string, boolean>;
  counters: Record<string, number>;
  choices: Record<string, string>;
}

export interface QuoteLine {
  id: string;
  phaseId: string;
  name: string;
  quantity: number;
  days: number;
  amount: number;
}

export interface PhaseTotal {
  phaseId: string;
  days: number;
  amount: number;
  lines: QuoteLine[];
}

export interface QuoteResult {
  lines: QuoteLine[];
  byPhase: PhaseTotal[];
  totalDays: number;
  totalAmount: number;
  partCount: number;
  /** id → su requisito está satisfecho. Incluye piezas, grupos y opciones. */
  available: Record<string, boolean>;
  /** Opciones que además de elegidas están contando (su grupo no está bloqueado). */
  activeOptions: string[];
}
