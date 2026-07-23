// Gesto reutilizable de "acceso denegado": sacude el elemento y muestra un
// micro-texto (aria-live) que se limpia solo. Nace en las bahías de
// Tecnologías (paso C de interacción) y lo reusa cualquier otro elemento
// clicable sin nada que revelar (ej. la foto de About). Requiere que el
// elemento tenga las clases globales .denied/.denied-msg (Layout.astro) y,
// opcionalmente, un hijo .denied-msg con data-text para el mensaje.
export function wireDeniedGesture(el: HTMLElement) {
  const msg = el.querySelector<HTMLElement>(".denied-msg");

  function trigger() {
    el.classList.add("denied");
    if (msg) {
      // Escribir el texto (no solo alternar visibilidad) es lo que hace que
      // aria-live="polite" lo anuncie cada vez, no solo la primera.
      msg.textContent = msg.dataset.text ?? "";
      msg.classList.add("show");
      window.setTimeout(() => {
        msg.classList.remove("show");
        msg.textContent = "";
      }, 900);
    }
  }

  el.addEventListener("click", trigger);
  el.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      trigger();
    }
  });
  // El shake es de un solo ciclo (no infinite): al terminar, se limpia sola.
  el.addEventListener("animationend", () => el.classList.remove("denied"));
}
