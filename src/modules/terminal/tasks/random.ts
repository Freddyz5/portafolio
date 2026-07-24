/*
  Bolsa barajada sin repetición inmediata. `createBag(items)` devuelve una
  función que va entregando los items en orden aleatorio; al agotarse rebaraja,
  GARANTIZANDO que el primero de la nueva tanda no repita el último de la
  anterior. Con `Math.random()` puro sobre 5 elementos el mismo sale dos veces
  seguidas más a menudo de lo que la gente intuye, y ahí se rompe la ilusión.
*/

/** Fisher–Yates sobre una copia; no muta el original. */
function shuffled<T>(source: readonly T[]): T[] {
  const arr = source.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createBag<T>(items: readonly T[]): () => T {
  if (items.length === 0) throw new Error('createBag: items vacío');
  const source = items.slice();
  let bag: T[] = [];
  let last: T | undefined;

  return () => {
    if (bag.length === 0) {
      bag = shuffled(source);
      // Se entrega desde el final (pop O(1)). Si el próximo a salir repite el
      // último de la tanda anterior, se intercambia con otra posición.
      if (source.length > 1 && bag[bag.length - 1] === last) {
        const j = Math.floor(Math.random() * (bag.length - 1));
        [bag[bag.length - 1], bag[j]] = [bag[j], bag[bag.length - 1]];
      }
    }
    const next = bag.pop() as T;
    last = next;
    return next;
  };
}
