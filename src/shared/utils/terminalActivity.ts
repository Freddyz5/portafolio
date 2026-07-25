/*
  Estado compartido de "terminal activa": true mientras el input de la
  terminal tiene foco o está en pantalla completa. Un módulo importado por
  Terminal.astro (emisor) y por cualquier otro componente (lector, ej. el
  cursor del hero) evita acoplar ese componente directamente al DOM/eventos
  internos de la terminal — ambos lados solo conocen este contrato.
*/

const EVENT_NAME = 'terminal:active-change';

let active = false;

export function setTerminalActive(next: boolean): void {
  if (active === next) return;
  active = next;
  document.dispatchEvent(
    new CustomEvent<boolean>(EVENT_NAME, { detail: next }),
  );
}

export function isTerminalActive(): boolean {
  return active;
}

/** Devuelve una función para desuscribirse. */
export function onTerminalActiveChange(
  handler: (active: boolean) => void,
): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<boolean>).detail);
  document.addEventListener(EVENT_NAME, listener);
  return () => document.removeEventListener(EVENT_NAME, listener);
}
