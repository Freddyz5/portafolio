/*
  Contenido de `install`: frases de fase, errores rotativos y respuestas de
  paquetes conocidos. Todo bilingüe (I18nText). Regla que gobierna el contenido:
  realista en la FORMA, imposible de confundir con un fallo real en el FONDO —
  cada error va seguido de un guiño de FR-3D que deja claro que es intencional
  sin explicar el chiste.

  NOTA: PASO/FASE 4 amplía este archivo a los 5 errores (5 ejes distintos) y a
  las respuestas de paquetes con nombre propio. Aquí va la base funcional.
*/

import type { I18nText } from '../core/i18n';

/** Etiquetas de fase (mayúsculas) + su descripción, con el lenguaje de la HLCS. */
export const INSTALL_PHASES = {
  resolve: { es: 'resolviendo', en: 'resolving' } as I18nText,
  fetch: { es: 'descargando desde el registro', en: 'downloading from registry' } as I18nText,
  verify: { es: 'verificando integridad', en: 'verifying integrity' } as I18nText,
  link: { es: 'enlazando dependencias', en: 'linking dependencies' } as I18nText,
};

/** Uso del comando, mostrado sin animación cuando falta el paquete. */
export const INSTALL_USAGE: I18nText = {
  es: 'uso: install <paquete> · alias: bun / npm / pnpm / yarn add <paquete>',
  en: 'usage: install <package> · aliases: bun / npm / pnpm / yarn add <package>',
};

/** Respuesta cuando el paquete ya está en el árbol real del proyecto. */
export const ALREADY_INSTALLED = (pkg: string): I18nText => ({
  es: `${pkg} ya está instalado — esta nave ya lo lleva a bordo.`,
  en: `${pkg} is already installed — this ship already carries it.`,
});

/**
 * Un error imita la forma de un fallo real (código, sujeto, causa); el `wink`
 * inmediatamente posterior, en personaje, aclara que es a propósito.
 */
export interface InstallError {
  code: string;
  message: I18nText;
  wink: I18nText;
}

// Base funcional (2 ejes). FASE 4 completa a 5 ejes distintos.
export const INSTALL_ERRORS: InstallError[] = [
  {
    code: 'ENOTFOUND',
    message: {
      es: 'no se pudo resolver el registro: el sandbox no tiene salida a la red',
      en: 'could not resolve registry: the sandbox has no network egress',
    },
    wink: {
      es: 'FR-3D> A bordo no hay antena hacia npm. Aquí todo llega ya cargado.',
      en: 'FR-3D> No antenna to npm on board. Up here everything ships preloaded.',
    },
  },
  {
    code: 'ETIMEDOUT',
    message: {
      es: 'tiempo de espera agotado: el registro no respondió',
      en: 'request timed out: the registry did not respond',
    },
    wink: {
      es: 'FR-3D> El registro está a varios años luz. La HLCS no espera tanto.',
      en: 'FR-3D> The registry is light-years out. The HLCS does not wait that long.',
    },
  },
];

/**
 * Paquete con respuesta propia (react/vue/…, y un guiño único como `fr3d`). Se
 * empareja por nombre en minúsculas. FASE 4 rellena esta lista.
 */
export interface KnownPackage {
  names: string[];
  response: I18nText;
}

export const KNOWN_PACKAGES: KnownPackage[] = [];
