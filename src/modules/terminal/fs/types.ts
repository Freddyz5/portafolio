/*
  Tipos del sistema de archivos virtual (VFS). El contenido de cada archivo ya
  viene resuelto al idioma en build time (ver fs/build.ts), por eso `content`
  es `string` y no `{es,en}`. Los nombres de archivo/directorio NO se traducen:
  son rutas, no copia.

  Estos tipos son consumidos por el core (ShellContext.fs) y por los comandos
  de filesystem, por eso viven junto al núcleo aunque el árbol se construya en
  el PASO 2.
*/

interface NodeBase {
  name: string;
  mtime?: string;
  mode?: string;
}

export interface DirNode extends NodeBase {
  type: 'dir';
  children: FsNode[];
}

/** Acción asociada a un archivo: enlaza el VFS con el sitio real. */
export type FileAction =
  | { kind: 'section'; id: string } // ancla del sitio → habilita `open`
  | { kind: 'page'; path: string }
  | { kind: 'link'; url: string };

export interface FileNode extends NodeBase {
  type: 'file';
  content: string; // resuelto al idioma en build time
  action?: FileAction;
}

export type FsNode = DirNode | FileNode;
