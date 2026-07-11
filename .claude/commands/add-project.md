---
description: Analiza un repositorio (propio o ajeno) o una descripción y agrega el proyecto a la sección de proyectos del portafolio, en el formato bilingüe exacto de resume.json.
argument-hint: <url-del-repo | ruta-local | descripción-libre del proyecto>
---

# Agregar proyecto al portafolio

Tu tarea es tomar la entrada del usuario y producir **una entrada de proyecto** en el
formato exacto que consume este portafolio, insertarla en
`src/constants/resume.json` y abrir un PR en draft.

La entrada del usuario es:

$ARGUMENTS

Si `$ARGUMENTS` está vacío, pregunta al usuario por la URL del repo, la ruta local
o una descripción del proyecto antes de continuar.

---

## Identidad del dueño del portafolio

Este portafolio es de **Freddy Tacuri**. Para decidir qué commits/contribuciones son
"suyos", considera estas identidades de git como el autor:

- Nombre: `Freddy Tacuri`, `Freddyz5`, `freddyz5`
- Email: `freddyltacuri@gmail.com`
- Usuario de GitHub: `Freddyz5` (también aparece como `freddyz5`)

Si sospechas que el usuario usó otra identidad en ese repo, pregúntale antes de filtrar.

---

## Paso 1 — Conseguir el código o la información

Según lo que entregó el usuario:

- **URL de GitHub** → si el repo no está en la sesión, agrégalo con `add_repo` (o
  clónalo) para poder leer el código y el historial. Si es privado y no tienes acceso,
  dilo y pide que lo agregue o que pegue una descripción.
- **Ruta local** → léela directamente.
- **Descripción libre / prompt pegado** (sin repo) → trabaja solo con ese texto; no
  inventes tecnologías ni logros que el usuario no mencione. Si falta información
  clave (stack, qué hizo, si está terminado, URL de demo), pregúntala.

## Paso 2 — Determinar si el repo es suyo o ajeno

Revisa los autores del historial (`git log --format='%an <%ae>'` o `git shortlog -sne`).

- **Es su repo / es el autor principal:** resume el proyecto completo: qué es, qué
  problema resuelve, arquitectura y stack. Los `highlights` describen lo que él
  construyó/lideró en general.
- **Repo ajeno / colaborativo:** filtra **solo sus commits** por las identidades de
  arriba (`git log --author="freddyltacuri@gmail.com"`, y también por nombre/usuario).
  Los `highlights` deben reflejar **solo su contribución real** (los archivos/áreas que
  él tocó, features que implementó), no el proyecto entero. Sé honesto: si su aporte
  fue acotado, descríbelo con precisión, sin inflarlo. Menciona en el `summary`/`
  description` que fue una colaboración cuando aplique.

## Paso 3 — Detectar el stack tecnológico

No adivines. Infiere las tecnologías de evidencia real:

- `package.json` (dependencies/devDependencies), `requirements.txt`, `pom.xml`,
  `go.mod`, `Cargo.toml`, `composer.json`, etc.
- Archivos de config (`astro.config`, `next.config`, `tailwind.config`, `Dockerfile`,
  `docker-compose`, `.github/workflows`, ORMs, proveedores de DB/hosting).
- El README del proyecto.

Lista en `technologies` los nombres tal como se muestran normalmente
(`TypeScript`, `Next.js`, `React Native`, `PostgreSQL`, `Tailwind CSS`, `GraphQL`…).
Ordena de más relevante a menos. No metas dependencias triviales (linters, prettier).

## Paso 4 — Redactar el contenido bilingüe

Todo texto va en español **y** inglés. Tono: profesional, orientado a impacto, en
primera persona para los highlights. Nada de relleno tipo "lorem ipsum".

- `summary`: 1–2 frases. Qué es el proyecto y su valor. Aparece en la card.
- `description`: 1 párrafo. Contexto, qué resuelve, enfoque de arquitectura.
- `highlights`: 4–7 viñetas, cada una empezando con un verbo de acción
  (Diseñé, Implementé, Construí, Integré…). En repos ajenos = solo su aporte.
- `status`: si está en curso → `{ "es": "En desarrollo", "en": "In Development" }`;
  si está terminado → `{ "es": "Completado", "en": "Completed" }`. Pregunta al usuario
  si no es evidente.

## Paso 5 — Construir el objeto en el esquema EXACTO

Usa esta forma (respeta las claves y el anidamiento `{es,en}`):

```json
{
  "id": "proj-<slug-corto-en-kebab-case>",
  "name": { "es": "<Nombre>", "en": "<Name>" },
  "startDate": "<AÑO>",
  "endDate": null,
  "status": { "es": "En desarrollo", "en": "In Development" },
  "summary": { "es": "…", "en": "…" },
  "description": { "es": "…", "en": "…" },
  "highlights": {
    "es": ["…", "…"],
    "en": ["…", "…"]
  },
  "technologies": ["TypeScript", "…"],
  "url": "<url-del-demo-o-cadena-vacía>",
  "repo": "<url-del-repo-si-es-público-o-cadena-vacía>"
}
```

Reglas:
- `id` único (no repetir uno existente en `resume.json`); prefijo `proj-`.
- `startDate`/`endDate`: año como string (ej. `"2025"`). `endDate` = `null` si sigue
  en desarrollo; si terminó, el año de término.
- `name` normalmente igual en ambos idiomas (nombres propios no se traducen).
- `url` = demo desplegado; `""` si no hay. `repo` = URL del repo si es público y el
  usuario quiere mostrarlo; `""` si es privado o no quiere exponerlo (confírmalo).
- `image` es **opcional**. Si el usuario tiene un screenshot, colócalo en `public/` y
  agrega `"image": "/portafolio/<archivo>"`. Si no, omítelo (usa un placeholder).

## Paso 6 — Insertar y abrir PR

1. Lee `src/constants/resume.json`, agrega el objeto al **final del array `projects`**,
   manteniendo el formato/identación existente. Verifica que el JSON siga siendo válido.
2. No toques `src/shared/languages/es.json` ni `en.json`: no alimentan el render del
   portafolio (`getData` usa `resume.json`).
3. Commitea en la rama de trabajo con un mensaje claro
   (ej. `feat: agregar proyecto <nombre> al portafolio`).
4. Abre un **PR en draft** describiendo el proyecto agregado y, si el repo era ajeno,
   aclarando que los highlights reflejan solo la contribución del usuario.

Al terminar, muestra al usuario el objeto JSON que insertaste para que lo valide.
