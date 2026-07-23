/*
  Límites de truncado del VFS. El árbol deriva de resume.json y NO duplica el
  contenido íntegro: lo recorta y enlaza a la sección real del sitio. Estos son
  los topes, centralizados para que no haya números mágicos en build.ts.
*/

/** Máximo de bullets (highlights) por archivo, elegidos por `priority`. */
export const MAX_HIGHLIGHTS = 3;

/** Máximo de caracteres por bullet; se corta en el último espacio + «…». */
export const MAX_CHARS_PER_LINE = 180;

/** Máximo de caracteres del resumen en about.md. */
export const MAX_SUMMARY_CHARS = 400;
