// Base limpia: el esqueleto del schema para crear una variante desde cero.
//
// NO se escribe a mano: se DERIVA de resume.json vaciando los valores. Así el
// esqueleto sigue al maestro solo — si se añade o se quita un campo del schema,
// la base lo refleja sin tocar este archivo.
//
// Reglas de vaciado:
//   - string  -> ''            (a rellenar)
//   - boolean -> false         (una variante no es la canónica)
//   - number  -> se conserva   (priority: del primer elemento sale un 1 sensato)
//   - null    -> null          (p. ej. endDate en curso)
//   - array de objetos    -> se deja UN elemento de ejemplo, vaciado
//   - array de primitivos -> []  (stack, keywords, technologies…)
import resume from 'src/constants/resume.json';

// Claves cuyo valor se conserva tal cual: son contrato del schema, no datos a rellenar.
const KEEP_VALUE = new Set(['tagVocabulary', 'stackSemantics']);

// Arrays donde cada elemento es una ranura fija: se conservan todos (con su
// `network` como etiqueta) en vez de dejar solo uno de ejemplo.
const KEEP_ALL_ITEMS = new Set(['socialProfiles']);
const KEEP_ITEM_VALUE = new Set(['network']);

function blankValue(value: unknown): unknown {
  if (value === null) return null;
  if (Array.isArray(value)) return blankArray(value);
  if (typeof value === 'object') return blankObject(value as Record<string, unknown>);
  if (typeof value === 'string') return '';
  if (typeof value === 'boolean') return false;
  return value;
}

function blankArray(items: unknown[], keepAll = false): unknown[] {
  const objects = items.filter((i) => i !== null && typeof i === 'object');
  // Array de primitivos (o vacío): se entrega vacío para rellenar.
  if (objects.length === 0) return [];
  return (keepAll ? objects : [objects[0]]).map(blankValue);
}

function blankObject(source: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(source)) {
    if (KEEP_VALUE.has(key) || KEEP_ITEM_VALUE.has(key)) {
      out[key] = value;
    } else if (Array.isArray(value)) {
      out[key] = blankArray(value, KEEP_ALL_ITEMS.has(key));
    } else {
      out[key] = blankValue(value);
    }
  }

  return out;
}

export const SKELETON_RESUME = blankObject(resume as unknown as Record<string, unknown>);
