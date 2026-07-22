# DESIGN_SYSTEM · HLCS (Hardcode Labs Computer Systems)

> **Fuente de verdad** de la identidad visual del portafolio de Freddy Tacuri.
> Cualquier página o componente nuevo se construye siguiendo estas reglas.
> Estética: terminal de película de los 80 (referencia: Alien), CRT de fósforo.
>
> **Marca:** sistema = **HLCS** (Hardcode Labs Computer Systems). Voz de la computadora (boot/terminal) = **FR-3D**. No usar "Nostromo" ni "MU-TH-UR" como nombres de marca (IP de terceros); sirven solo como referencia estética.
>
> Mantener este archivo sincronizado con el CSS de tokens del sitio. Si cambia un color en el código, se actualiza aquí.

---

## 00 · Principio rector

Una idea gobierna todo: **casi todo está apagado; muy pocas cosas encienden.** El fondo es negro-casi; la mayoría del contenido es tenue. Los colores con glow son escasos — por eso pegan. **La escasez es potencia.**

Regla de significado que ordena la paleta sola:
- **Cálido = identidad / acción / alerta** (rojo, ámbar)
- **Frío = sistema / datos / calma** (cian)

Asigna los colores por lo que *significan* y no tendrás que adivinar.

---

## 01 · Color — 3 registros

### Rojo · identidad / alerta — ESCASO
| Token | Hex | Uso |
|---|---|---|
| `--red-glow` | `#FF2D0F` | Nombre, headings, prompt `>`, CTA principal, alertas |
| `--red-accent` | `#BF0600` | Bordes, estados intermedios |
| `--red-muted` | `#893F3B` | La mayoría del rojo en pantalla (tenue) |
| `--red-core` | `#FFE3DE` | Texto sobre fondo rojo / fill claro |

**Regla:** máximo **1–2 elementos en rojo brillante por pantalla**. Todo el demás rojo es `muted` o fondo.

### Cian · datos / nominal — el que más trabaja
| Token | Hex | Uso |
|---|---|---|
| `--cyan-glow` | `#00F7FF` | Links, acentos de datos, estados OK, hover |
| `--cyan-accent` | `#00B8BF` | Bordes secundarios |
| `--cyan-muted` | `#1F4345` | Bordes tenues, divisores |
| `--cyan-core` | `#E4FBFB` | Texto de lectura de volumen |

Es el color de trabajo: más luminancia, cansa menos la vista. Aquí va el grueso del texto.

### Ámbar · señal — dosis mínimas
| Token | Hex | Uso |
|---|---|---|
| `--amber-glow` | `#FFB000` | Cursor, boot, timestamps, un warning puntual |
| `--amber-core` | `#FFE9C2` | Texto ámbar puntual |

**Nunca en bloques de texto.** Es la firma del sistema — pierde efecto si se reparte.

### Proporción por pantalla
`~74% campo oscuro · ~15% cian · ~8% rojo · ~3% ámbar`
Nunca tercios iguales. Siempre uno lidera (cian), uno puntúa (rojo), uno es chispa (ámbar).

---

## 02 · Fondo — rampa cálida

El fondo **no es un color, es una rampa de 3 pasos** (da profundidad de CRT). **Nunca negro puro `#000`** — el glow de fósforo necesita un negro apenas levantado para leerse.

| Token | Hex | Uso |
|---|---|---|
| `--bg-field` | `#080404` | Fondo general |
| `--bg-base` | `#151111` | Paneles / cards |
| `--bg-raised` | `#1F1616` | Elementos elevados |

El tinte cálido (rojizo) refuerza el mood de "alerta" y es parte de la identidad.

---

## 03 · Tipografía — 3 voces

| Fuente | Rol | Uso |
|---|---|---|
| **Orbitron** (700) | Display | Nombre, etiquetas de panel, **botones de acción / CTAs** (Ver proyectos, Contacto, Enviar, currículum…) |
| **IBM Plex Mono** (400/500/600 + italic) | Cuerpo | Lectura, datos, UI, párrafos |
| **VT323** | Terminal | Boot, timestamps, cursor, códigos de estado — *nunca párrafos largos* |

### Escala (IBM Plex Mono, salvo el nombre en Orbitron)
| Nivel | Tamaño | Uso |
|---|---|---|
| Display | ~48px / 600 | Nombre |
| Título | ~28px / 600 | Headers de sección |
| Lead | ~18px | Subtítulos / intro |
| Cuerpo | ~15px | Texto de lectura |
| Meta | ~12px | Timestamps, pies, metadatos |

---

## 04 · Glow de fósforo — la técnica

Es el ~70% del efecto. El glow **no es un color plano, son 3 capas** de `text-shadow`: núcleo + halo saturado + bloom oscuro.

```css
/* Texto grande (nombre, headings) — el fill ES el color */
color: var(--red-glow);
text-shadow:
  0 0 1px currentColor,                                        /* núcleo nítido */
  0 0 8px var(--red-glow),                                     /* halo saturado */
  0 0 22px color-mix(in srgb, var(--red-glow) 55%, transparent); /* bloom */

/* Cuerpo — legibilidad: fill claro, glow sutil */
color: var(--cyan-core);
text-shadow: 0 0 6px color-mix(in srgb, var(--cyan-glow) 45%, transparent);
```

**Regla de legibilidad:** los párrafos van en el *core* claro (`#FFE3DE` / `#E4FBFB`), nunca en el glow saturado puro. El glow brillante se reserva para títulos, el `>` y acentos.

---

## 05 · Tratamiento CRT

Overlay global sutil por encima de todo:
- **Scanlines** — líneas horizontales tenues (`repeating-linear-gradient`, `mix-blend-mode: multiply`).
- **Viñeta** — oscurecimiento radial en los bordes (pantalla curva).
- **Flicker** — parpadeo muy ocasional, casi imperceptible.

No debe afectar la legibilidad. Mantener sutil.

---

## 06 · Cómo armar una página nueva (checklist de jerarquía)

Sigue en orden y la jerarquía sale sola:

1. **¿Cuál es la ÚNICA cosa más importante?** Solo esa lleva rojo brillante + mayor tamaño. Es el ancla.
2. **¿Qué es lectura y datos?** Todo eso en cian, tamaño de cuerpo. Es la mayoría de la página.
3. **¿Hay una acción decisiva?** Ese es el CTA principal (rojo, puede glitchear). Las demás acciones = botones cian tranquilos.
4. **¿Dónde va una chispa de ámbar?** Un cursor, un timestamp, un estado. Uno o dos puntos, no más.
5. **Revisa el conteo:** ¿más de 1–2 cosas en rojo brillante a la vista? Baja las de menor prioridad a `muted`.
6. **Todo lo demás** es campo oscuro y texto tenue. El vacío también comunica "terminal".

---

## 07 · Componentes con carácter

### ButtonGlitch
Botón que "glitchea" al hover/focus (error a propósito, desdoble rojo↔cian, intensidad marcada: ±5px, 0.5s).
- **Solo en acciones decisivas** (CTA principal, submit, descarga de CV).
- **Máximo uno glitcheando por vista.**
- Siempre por interacción, nunca en loop.
- Conserva el fallback de `prefers-reduced-motion`.

### Callouts esquemáticos + línea de escaneo (hero)
Etiquetas tipo diagnóstico (`CABINA`, `PROPULSIÓN`) y barrido ámbar. **Con moderación:** 1–2 callouts, escaneo tenue. No repartir por todo el sitio.

### Convención de prompt
- Prefijo `>` en rojo antes de subtítulos y líneas de sistema.
- Nombres de sección en formato terminal: `REGISTRO_PERSONAL`, `HISTORIAL_PROFESIONAL`.

### (Planeado) Navegación terminal + boot
Feature de firma, a especificar aparte: secuencia de boot con barra de carga (voz **FR-3D**, saltable, una vez, respeta reduced-motion) + barra de comandos opcional. **Mejora progresiva:** el sitio es 100% usable sin comandos; la CLI es una capa para jugar. Cada comando tiene equivalente visible.

---

## 08 · Interacción — hover y revelado

La intensidad de la interacción **escala con la información** detrás del elemento. Regla base: **una interacción protagonista por sección**, el mismo lenguaje de *hover* en todo el sitio, y **hover ≠ click**.

### Hover = resaltar (lenguaje base, igual en todo el sitio)
El hover **no repinta** la card, solo señala que es interactiva. Cambian 3 cosas como máximo; el cuerpo, la meta y los chips **se quedan quietos**.

```css
/* Aplicar a toda card/panel interactivo (clase reutilizable) */
.interactive {
  transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease;
}
.interactive:hover,
.interactive:focus-visible,
.interactive:has(:focus-visible) {      /* paridad de teclado cuando el
                                            elemento clicable es un hijo
                                            anidado (p. ej. un <a> que cubre
                                            la card vía ::after) */
  transform: translateY(-4px);            /* elevación */
  border-color: var(--cyan-glow);         /* borde cian = interactivo */
  box-shadow: 0 0 10px var(--cyan-glow);  /* glow sutil */
  outline: none;
}
/* SOLO el título se enciende; cuerpo/meta/chips no cambian */
.interactive:hover  .card-title,
.interactive:focus-visible .card-title,
.interactive:has(:focus-visible) .card-title { color: var(--cyan-glow); }

@media (prefers-reduced-motion: reduce){
  .interactive:hover,
  .interactive:focus-visible,
  .interactive:has(:focus-visible) { transform: none; }
}
```

Reposo: los títulos de card van en `--red-core` o `--cyan-core` (claros), **no** en `--red-glow`. El único rojo brillante de cada sección es su **header** — así el rojo sigue siendo escaso.

### Click = revelar (jerarquía de 3 niveles)
| Nivel | Sección | Hover | Click |
|---|---|---|---|
| **Alto** | Proyectos | resaltar | View Transition a **página completa** de detalle |
| **Medio** | Experiencia | resaltar | la card se **morfea al centro** (`<dialog>` + `startViewTransition` en la misma página) y revela más info |
| **Bajo** | Tecnologías | resaltar + **shake de "acceso denegado"** | nada que revelar (solo el gesto) |

El revelado del nivel medio usa **la misma familia de View Transition** que proyectos, pero destino en la misma página. `<dialog>` nativo da foco atrapado, Esc y accesibilidad; funciona en móvil (a diferencia de un revelado por hover).

### Shake de "acceso denegado" (Tecnologías)
Gesto lúdico para algo sin destino: al hacer click, la bahía "se sacude" un poco (como una clave incorrecta), fiel al mundo terminal. Corto, no se repite, respeta reduced-motion.

```css
@keyframes denied-shake{
  0%,100%{ transform: translateX(0) }
  20%{ transform: translateX(-4px) }  40%{ transform: translateX(4px) }
  60%{ transform: translateX(-3px) }  80%{ transform: translateX(3px) }
}
.bay.denied{ animation: denied-shake .35s ease; border-color: var(--red-glow); }
@media (prefers-reduced-motion: reduce){ .bay.denied{ animation: none; } }
```
```js
// al click: bay.classList.add('denied'); quitar al terminar la animación.
bay.addEventListener('animationend', () => bay.classList.remove('denied'));
```

### Reglas para no saturar
- **Revelar = solo información útil**, una vez por sección (Experiencia). Un gesto que solo brilla, satura.
- **Resaltar = en todas, pero contenido** (nunca repintar la card entera).
- Todo respeta `prefers-reduced-motion`.

---

## 09 · Do / Don't

**Hacer**
- Reservar el rojo brillante para 1–2 cosas por pantalla
- Poner el volumen de texto en cian / core claro
- Glow en 3 capas de `text-shadow`
- Ámbar solo en cursor / boot / estado
- Fondo como rampa de 3 pasos
- Glitch solo en el CTA decisivo

**Evitar**
- Párrafos largos en rojo saturado
- Tres colores en proporciones iguales
- Negro puro `#000` de fondo
- VT323 en textos largos
- Ámbar en bloques de contenido
- Glitch en nav o botones frecuentes

---

## 10 · Tokens — copiar/pegar

```css
:root{
  /* ROJO · identidad / alerta (escaso) */
  --red-glow:#FF2D0F; --red-accent:#BF0600; --red-muted:#893F3B; --red-core:#FFE3DE;
  /* CIAN · datos / nominal (workhorse) */
  --cyan-glow:#00F7FF; --cyan-accent:#00B8BF; --cyan-muted:#1F4345; --cyan-core:#E4FBFB;
  /* ÁMBAR · señal (dosis mínima) */
  --amber-glow:#FFB000; --amber-core:#FFE9C2;
  /* FONDO · rampa cálida (no usar #000) */
  --bg-field:#080404; --bg-base:#151111; --bg-raised:#1F1616;
}
/* Fuentes: Orbitron (display) · IBM Plex Mono (cuerpo) · VT323 (terminal) */
```

---

*FIN · mantener sincronizado con el sitio en producción.*