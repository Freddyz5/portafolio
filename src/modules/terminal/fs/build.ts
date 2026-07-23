/*
  Construye el sistema de archivos virtual a partir de resume.json.

  IMPORTANTE — se ejecuta en BUILD TIME (frontmatter de Terminal.astro), nunca
  en el cliente. Recibe datos YA monolingües (pasar por `separateLanguages`
  antes) para que al bundle del cliente solo viaje el árbol recortado y resuelto
  al idioma de la página, no el resume.json maestro completo.

  resume.json es la única fuente de verdad: aquí se deriva, se trunca y se
  enlaza a la sección real del sitio vía `action`. La línea "ver completo en el
  sitio" NO se guarda en `content`; la añade el comando `cat` cuando el nodo
  tiene `action` (ver commands/fs.ts).
*/

import type { Lang } from '../core/i18n';
import type { DirNode, FileNode, FsNode } from './types';
import {
  MAX_CHARS_PER_LINE,
  MAX_HIGHLIGHTS,
  MAX_SUMMARY_CHARS,
} from '../constants/TRUNCATION';

/* ---- Forma monolingüe (post-separateLanguages) de lo que leemos ---------- */

interface Highlight {
  id: string;
  priority: number;
  text: string;
}
interface Team {
  teamId: string;
  teamName: string;
  role: string;
  startDate?: string;
  endDate?: string | null;
  stack: string[];
  summary: string;
  highlights: Highlight[];
}
interface Work {
  id: string;
  name: string;
  position: string;
  teams: Team[];
}
interface Skill {
  id: string;
  name: string;
  keywords: string[];
}
interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string | null;
  status: string;
  priority: number;
  summary: string;
  highlights: Highlight[];
}
interface SocialProfile {
  network: string;
  url: string;
}
interface Basics {
  name: string;
  label: string;
  email: string;
  url: string;
  summary: string;
  socialProfiles: SocialProfile[];
}
interface ResolvedResume {
  basics: Basics;
  works: Work[];
  skills: Skill[];
  projects: Project[];
}

/* ---- Helpers ------------------------------------------------------------- */

const MODE_DIR = 'drwxr-xr-x';
const MODE_FILE = '-rw-r--r--';
const MODE_HIDDEN = '-rw-------';
const DEFAULT_MTIME = '2026-07-15';

const pick = (es: string, en: string, lang: Lang): string =>
  lang === 'es' ? es : en;

const present = (lang: Lang): string => pick('Presente', 'Present', lang);
const ym = (d?: string | null): string => (d ? d.slice(0, 7) : '');
const dateRange = (start: string | undefined, end: string | null | undefined, lang: Lang): string =>
  `${ym(start)} — ${end ? ym(end) : present(lang)}`;

/** Recorta en el último espacio antes de `max` y cierra con «…». */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice) + '…';
}

/** Top-N highlights por `priority` (empate → orden del array), truncados. */
function topHighlights(highlights: Highlight[]): string[] {
  return [...highlights]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, MAX_HIGHLIGHTS)
    .map((h) => `- ${truncate(h.text, MAX_CHARS_PER_LINE)}`);
}

/**
 * `team-mediaValue` → `media-value`; `proj-vision-craft` → `vision-craft`.
 * Los slugs salen del `id`, nunca escritos a mano: añadir un equipo/proyecto al
 * CV lo hace aparecer en el VFS sin tocar código.
 */
function slugify(id: string): string {
  return id
    .replace(/^(team|proj|work)-/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function file(
  name: string,
  content: string,
  extra: Partial<Pick<FileNode, 'action' | 'mtime' | 'mode'>> = {},
): FileNode {
  return {
    type: 'file',
    name,
    content,
    mode: extra.mode ?? MODE_FILE,
    mtime: extra.mtime ?? DEFAULT_MTIME,
    ...(extra.action ? { action: extra.action } : {}),
  };
}

function dir(name: string, children: FsNode[], mtime = DEFAULT_MTIME): DirNode {
  return { type: 'dir', name, children, mode: MODE_DIR, mtime };
}

/* ---- Constructores de contenido ----------------------------------------- */

function aboutContent(b: Basics): string {
  return [
    `# ${b.name}`,
    b.label,
    '',
    truncate(b.summary, MAX_SUMMARY_CHARS),
  ].join('\n');
}

function contactContent(b: Basics, lang: Lang): string {
  const lines = [
    pick('# Contacto', '# Contact', lang),
    '',
    `Email:  ${b.email}`,
    `${pick('Sitio', 'Site', lang)}:  ${b.url}`,
  ];
  for (const p of b.socialProfiles) lines.push(`${p.network}:  ${p.url}`);
  return lines.join('\n');
}

function skillsContent(skills: Skill[], lang: Lang): string {
  const header = pick('# Habilidades', '# Skills', lang);
  const rows = skills.map((s) => `${s.name}: ${s.keywords.join(', ')}`);
  return [header, '', ...rows].join('\n');
}

function projectContent(p: Project, lang: Lang): string {
  return [
    `# ${p.name}`,
    `${dateRange(p.startDate, p.endDate, lang)} · ${p.status}`,
    '',
    truncate(p.summary, MAX_CHARS_PER_LINE),
    '',
    ...topHighlights(p.highlights),
  ].join('\n');
}

function teamContent(t: Team, work: Work, lang: Lang): string {
  return [
    `# ${t.teamName}`,
    `${t.role} · ${work.name}`,
    dateRange(t.startDate, t.endDate, lang),
    '',
    truncate(t.summary, MAX_CHARS_PER_LINE),
    '',
    ...topHighlights(t.highlights),
  ].join('\n');
}

/* ---- Contenido estático (sabor, exclusivo de la terminal) ---------------- */

const MOTD_BANNER = [
  '  ██╗  ██╗██╗      ██████╗███████╗',
  '  ██║  ██║██║     ██╔════╝██╔════╝',
  '  ███████║██║     ██║     ███████╗',
  '  ██╔══██║██║     ██║     ╚════██║',
  '  ██║  ██║███████╗╚██████╗███████║',
  '  ╚═╝  ╚═╝╚══════╝ ╚═════╝╚══════╝',
  '  Hardcode Labs Computer Systems',
].join('\n');

function motdContent(lang: Lang): string {
  return [
    MOTD_BANNER,
    '',
    pick(
      'Sistema en línea. Escribe `help` para ver los comandos.',
      'System online. Type `help` to list commands.',
      lang,
    ),
  ].join('\n');
}

const RELEASE_CONTENT = [
  'NAME="HLCS"',
  'PRETTY_NAME="Hardcode Labs Computer Systems"',
  'VERSION="1.0 (Nostromo)"',
  'KERNEL="FR-3D 4.8.0-phosphor"',
  'ARCH="phosphor-crt"',
].join('\n');

function readmeContent(lang: Lang): string {
  return [
    '# README',
    '',
    pick(
      'Bienvenido a la terminal FR-3D del portafolio de Freddy Tacuri.',
      "Welcome to the FR-3D terminal of Freddy Tacuri's portfolio.",
      lang,
    ),
    '',
    pick(
      'Esto es un sistema de archivos virtual. Explora con: ls, cd, cat, tree.',
      'This is a virtual filesystem. Explore with: ls, cd, cat, tree.',
      lang,
    ),
    pick(
      'Toda la información también está en el sitio: usa `open <destino>`.',
      'Everything is also on the site: use `open <target>`.',
      lang,
    ),
    '',
    pick('Empieza por:  cat about.md', 'Start with:  cat about.md', lang),
  ].join('\n');
}

function fr3dContent(lang: Lang): string {
  return [
    'FR-3D // núcleo de a bordo',
    pick('"Aquí no hay nada. ¿O sí?"', '"Nothing to see here. Or is there?"', lang),
    '▓▓▒▒░░  01000110 01010010',
  ].join('\n');
}

function bootLogContent(lang: Lang): string {
  return [
    '[    0.000000] HLCS FR-3D 4.8.0-phosphor booting…',
    '[    0.128000] phosphor-crt: warming cathode ray tube',
    '[    0.512000] scanline generator: OK',
    '[    1.024000] mounting virtual filesystem: OK',
    `[    1.536000] ${pick('cargando perfil de freddytacuri', 'loading freddytacuri profile', lang)}: OK`,
    '[    2.048000] command interpreter /bin/frsh: ready',
    `[    2.560000] ${pick('sistema listo', 'system ready', lang)}.`,
  ].join('\n');
}

/* ---- Ensamblado del árbol ------------------------------------------------ */

export function buildTree(resume: unknown, lang: Lang): DirNode {
  const data = resume as ResolvedResume;
  const b = data.basics;

  const projectFiles: FileNode[] = data.projects.map((p) =>
    file(`${slugify(p.id)}.md`, projectContent(p, lang), {
      action: { kind: 'section', id: 'projects' },
      mtime: ym(p.startDate) || DEFAULT_MTIME,
    }),
  );

  const teamFiles: FileNode[] = data.works.flatMap((w) =>
    w.teams.map((tm) =>
      file(`${slugify(tm.teamId)}.md`, teamContent(tm, w, lang), {
        action: { kind: 'section', id: 'experience' },
        mtime: ym(tm.startDate) || DEFAULT_MTIME,
      }),
    ),
  );

  const homeDir = dir('freddytacuri', [
    file('README.md', readmeContent(lang)),
    file('.fr3d', fr3dContent(lang), { mode: MODE_HIDDEN }),
    file('about.md', aboutContent(b), {
      action: { kind: 'section', id: 'home' },
    }),
    file('contact.md', contactContent(b, lang), {
      action: { kind: 'section', id: 'contact' },
    }),
    file('skills.txt', skillsContent(data.skills, lang)),
    dir('projects', projectFiles),
    dir('experience', teamFiles),
  ]);

  return dir('/', [
    dir('etc', [
      file('motd', motdContent(lang)),
      file('hlcs-release', RELEASE_CONTENT),
    ]),
    dir('home', [homeDir]),
    dir('var', [dir('log', [file('boot.log', bootLogContent(lang))])]),
  ]);
}
