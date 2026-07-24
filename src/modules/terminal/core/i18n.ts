/*
  Internacionalización del shell. El contenido del VFS ya viene resuelto al
  idioma en build time (ver fs/build.ts); esto cubre solo los mensajes de
  sistema (errores, cabeceras de `help`, etc.) que se generan en el cliente.
*/

export type Lang = 'es' | 'en';

export interface I18nText {
  es: string;
  en: string;
}

/** Resuelve un texto bilingüe (o un string ya resuelto) al idioma activo. */
export const t = (text: I18nText | string, lang: Lang): string =>
  typeof text === 'string' ? text : text[lang];

/**
 * Mensajes de sistema. Los parametrizados son funciones que devuelven
 * `I18nText`; el llamador antepone el nombre del comando y resuelve con `t`.
 */
export const MSG = {
  unknownCommand: (name: string): I18nText => ({
    es: `comando no encontrado: ${name}. Escribe help.`,
    en: `command not found: ${name}. Type help.`,
  }),
  noSuchFile: (path: string): I18nText => ({
    es: `no existe el archivo o directorio: ${path}`,
    en: `no such file or directory: ${path}`,
  }),
  notADirectory: (path: string): I18nText => ({
    es: `no es un directorio: ${path}`,
    en: `not a directory: ${path}`,
  }),
  isADirectory: (path: string): I18nText => ({
    es: `es un directorio: ${path}`,
    en: `is a directory: ${path}`,
  }),
  missingOperand: (): I18nText => ({
    es: 'falta un operando',
    en: 'missing operand',
  }),
} as const;
