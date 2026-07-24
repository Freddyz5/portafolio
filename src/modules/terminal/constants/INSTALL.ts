/*
  Contenido de `install`: frases de fase, errores rotativos y respuestas de
  paquetes conocidos. Todo bilingüe (I18nText).

  Regla que gobierna todo el contenido: realista en la FORMA, imposible de
  confundir con un fallo real en el FONDO. La línea de error imita un error de
  verdad (código, sujeto, causa); la línea inmediatamente posterior de FR-3D
  deja claro que es intencional SIN explicar el chiste. El guiño va en personaje
  (nave, sandbox, sistema HLCS), nunca metahumor tipo "jaja es broma".
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

// Cinco ejes distintos para que no se parezcan entre sí:
// 1 ENOTFOUND  — el sandbox no tiene salida a la red
// 2 EACCES     — sistema de archivos de solo lectura
// 3 ENOSPC     — sin espacio en el volumen
// 4 EINTEGRITY — suma de verificación que no coincide
// 5 ETIMEDOUT  — el registro no respondió
export const INSTALL_ERRORS: InstallError[] = [
  {
    code: 'ENOTFOUND',
    message: {
      es: 'no se pudo resolver el registro: el sandbox no tiene salida a la red',
      en: 'could not resolve registry: the sandbox has no network egress',
    },
    wink: {
      es: 'FR-3D> A bordo no hay antena hacia npm. Aquí todo llega ya cargado.',
      en: 'FR-3D> No antenna to npm on board. Everything up here ships preloaded.',
    },
  },
  {
    code: 'EACCES',
    message: {
      es: 'permiso denegado al escribir en node_modules: montado en solo lectura',
      en: 'permission denied writing to node_modules: mounted read-only',
    },
    wink: {
      es: 'FR-3D> El casco de la HLCS va sellado. Nada nuevo se atornilla en pleno vuelo.',
      en: 'FR-3D> The HLCS hull is sealed. Nothing new gets bolted on mid-flight.',
    },
  },
  {
    code: 'ENOSPC',
    message: {
      es: 'no queda espacio en el dispositivo: volumen /hlcs al 100%',
      en: 'no space left on device: volume /hlcs at 100%',
    },
    wink: {
      es: 'FR-3D> Las bodegas van llenas de portafolio. No cabe una dependencia más.',
      en: 'FR-3D> The holds are packed with portfolio. Not one more dependency fits.',
    },
  },
  {
    code: 'EINTEGRITY',
    message: {
      es: 'fallo de integridad: la suma de verificación del paquete no coincide',
      en: 'integrity check failed: package checksum does not match',
    },
    wink: {
      es: 'FR-3D> Ese paquete no pasa el control de la esclusa. Procedencia sin confirmar.',
      en: 'FR-3D> That package fails the airlock check. Provenance unconfirmed.',
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
      en: "FR-3D> The registry is light-years out. The HLCS doesn't wait that long.",
    },
  },
];

/**
 * Paquete con respuesta propia. Se empareja por nombre en minúsculas. Cubre a
 * quien teclea `install react` en un sitio hecho con Astro, más un guiño único
 * para `fr3d` / `hardcode-labs`.
 */
export interface KnownPackage {
  names: string[];
  response: I18nText;
}

export const KNOWN_PACKAGES: KnownPackage[] = [
  {
    names: ['react', 'react-dom'],
    response: {
      es: 'react — este sitio corre sobre Astro; las islas van sin framework. Buen intento.',
      en: 'react — this site runs on Astro; the islands ship frameworkless. Nice try.',
    },
  },
  {
    names: ['vue'],
    response: {
      es: 'vue — bonito framework, pero aquí el render es HTML plano de Astro.',
      en: 'vue — lovely framework, but here the render is plain Astro HTML.',
    },
  },
  {
    names: ['svelte'],
    response: {
      es: 'svelte — compilar a casi nada es elegante; Astro ya envía casi nada.',
      en: 'svelte — compiling to almost nothing is elegant; Astro already ships almost nothing.',
    },
  },
  {
    names: ['next', 'nextjs'],
    response: {
      es: 'next — el SSR aquí lo hace Astro. No hace falta traer todo Next a bordo.',
      en: 'next — Astro handles the SSR here. No need to bring all of Next aboard.',
    },
  },
  {
    names: ['tailwind', 'tailwindcss'],
    response: {
      es: 'tailwind — los estilos van con tokens propios y CSS scopeado. Sin utilidades.',
      en: 'tailwind — styling uses in-house tokens and scoped CSS. No utility classes.',
    },
  },
  {
    names: ['fr3d', 'fr-3d', 'hardcode-labs', 'hardcodelabs'],
    response: {
      es: 'fr3d ya está a bordo — soy yo. No puedo instalarme dos veces.',
      en: "fr3d is already aboard — that's me. I can't install myself twice.",
    },
  },
];
