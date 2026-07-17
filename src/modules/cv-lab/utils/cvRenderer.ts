// "Vista CV": replica la estética y el markup de /[lang]/cv (src/modules/cv).
// Se duplica aquí porque el lab renderiza en el cliente y no puede instanciar los
// componentes .astro. Si cambia el diseño del CV real, hay que reflejarlo aquí y
// en los estilos globales de components/Preview.astro.
import { highlightText } from 'src/shared/utils/highlightText';
import { CV_ICONS } from '../constants/CV_ICONS';
import { PREVIEW_LABELS, type PreviewLabels } from '../constants/PREVIEW_LABELS';
import { byPriority, escapeHtml as esc } from './html';

type Ctx = { t: PreviewLabels; locale: string };

// Se replica EXACTAMENTE el formateo del CV real: toLocaleString sin `timeZone` y
// getUTCFullYear en educación. Para fechas de solo mes (p. ej. "2025-04") el
// resultado depende de la zona horaria, igual que en /[lang]/cv.
function monthYear(date: string | null | undefined, { t, locale }: Ctx): string {
  if (!date) return esc(t.present);
  const d = new Date(date);
  if (isNaN(d.getTime())) return esc(date);
  const formatted = d.toLocaleString(locale, { year: 'numeric', month: 'long' });
  return esc(
    formatted.charAt(0).toUpperCase() + formatted.slice(1).replace(' de', '')
  );
}

function year(date: string): string {
  const d = new Date(date);
  return isNaN(d.getTime()) ? esc(date) : String(d.getUTCFullYear());
}

function monthShort(date: string, { locale }: Ctx): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return esc(date);
  return esc(d.toLocaleString(locale, { year: 'numeric', month: 'short' }));
}

// Experience.astro ordena los highlights de equipo por priority; los de work y los
// de projects se pintan en el orden del array.
function highlights(list: unknown, sort: boolean): string {
  if (!Array.isArray(list) || list.length === 0) return '';
  const items = sort ? byPriority(list) : list;
  return `<ul class="highlights">${items
    .map((h) => `<li><p>${esc(highlightText(h ?? ''))}</p></li>`)
    .join('')}</ul>`;
}

function section(title: string, body: string): string {
  return `<section class="cv-section">${title ? `<h2>${esc(title)}</h2>` : ''}${body}</section>`;
}

function hero(basics: any, ctx: Ctx): string {
  const location = basics?.location ?? {};
  const bits: string[] = [];

  if (location.city && location.country)
    bits.push(
      `<span><div class="no-print">${CV_ICONS.mapPin}</div>${esc(location.city)} - ${esc(location.country)}</span>`
    );
  // Los " • " solo se ven al imprimir, cuando los iconos se ocultan.
  bits.push('<div class="print"> • </div>');
  if (basics.email)
    bits.push(
      `<a href="mailto:${esc(basics.email)}" target="_blank" rel="noopener noreferrer"><div class="no-print">${CV_ICONS.mail}</div>${esc(basics.email)}</a>`
    );
  bits.push('<div class="print"> • </div>');
  if (basics.phone)
    bits.push(
      `<a href="tel:${esc(basics.phone)}" target="_blank" rel="noopener noreferrer"><div class="no-print">${CV_ICONS.phone}</div>${esc(basics.phone)}</a>`
    );
  if (basics.url)
    bits.push(
      `<a href="${esc(basics.url)}" target="_blank" rel="noopener noreferrer" class="no-print">${CV_ICONS.link}${esc(ctx.t.portfolio)}</a>`
    );

  if (Array.isArray(basics.socialProfiles)) {
    for (const profile of basics.socialProfiles) {
      if (profile?.network === 'Instagram') continue;
      const icon = CV_ICONS[profile?.network];
      if (!icon) continue;
      bits.push(
        `<a href="${esc(profile.url)}" target="_blank" rel="noopener noreferrer" class="no-print">${icon}${esc(profile.username)}</a>`
      );
    }
  }

  return `<header class="cv-hero"><h1>${esc(basics.name)}</h1><div class="container">${bits.join('')}</div></header>`;
}

function team(item: any): string {
  const parts: string[] = ['<li>'];
  parts.push(`<h5 class="teamName">${esc(item.teamName)}</h5>`);
  if (item.role) parts.push(`<p class="teamRole">${esc(item.role)}</p>`);
  if (Array.isArray(item.stack) && item.stack.length)
    parts.push(`<p class="teamStack">${esc(item.stack.join(' • '))}</p>`);
  if (item.summary) parts.push(`<p>${esc(item.summary)}</p>`);
  parts.push(highlights(item.highlights, true));
  parts.push('</li>');
  return parts.join('');
}

function work(item: any, ctx: Ctx): string {
  const end = item.endDate ? monthYear(item.endDate, ctx) : esc(ctx.t.present);
  const teams =
    Array.isArray(item.teams) && item.teams.length
      ? `<ul class="teams">${item.teams.map(team).join('')}</ul>`
      : '';

  return (
    `<li><article>` +
    `<header><div><h3><a href="${esc(item.url)}" target="_blank">${esc(item.name)}</a></h3>` +
    `<h4>${esc(item.position)}</h4></div>` +
    `<time>${monthYear(item.startDate, ctx)} - ${end}</time></header>` +
    `<footer>${item.summary ? `<p>${esc(item.summary)}</p>` : ''}` +
    `${highlights(item.highlights, false)}${teams}</footer>` +
    `</article></li>`
  );
}

function project(item: any, ctx: Ctx): string {
  const end = item.endDate ? monthYear(item.endDate, ctx) : esc(ctx.t.present);
  const tech = Array.isArray(item.technologies)
    ? esc(item.technologies.join(' • '))
    : '';

  return (
    `<li><article>` +
    `<header><div><h3><a href="${esc(item.url)}" target="_blank">${esc(item.name)}</a></h3>` +
    `<h4>${esc(item.status)}</h4><h5>${tech}</h5></div>` +
    `<time>${monthYear(item.startDate, ctx)} - ${end}</time></header>` +
    `<footer>${item.summary ? `<p>${esc(item.summary)}</p>` : ''}` +
    `${highlights(item.highlights, false)}</footer>` +
    `</article></li>`
  );
}

function education(item: any, ctx: Ctx): string {
  const end = item.endDate != null ? year(item.endDate) : esc(ctx.t.present);
  return (
    `<li><article><header><div><h3>${esc(item.institution)}</h3></div>` +
    `<time>${year(item.startDate)} - ${end}</time></header>` +
    `<footer><p>${esc(item.area)}</p></footer></article></li>`
  );
}

function certificate(item: any, ctx: Ctx): string {
  return (
    `<li><article><header><div><h3>${esc(item.issuer)}</h3></div>` +
    `<time>${monthShort(item.date, ctx)}</time></header>` +
    `<footer><a href="${esc(item.url)}" target="_blank">${esc(item.name)}</a></footer></article></li>`
  );
}

export function buildCVView(data: any, lang: 'es' | 'en'): string {
  const ctx: Ctx = {
    t: PREVIEW_LABELS[lang],
    locale: lang === 'es' ? 'es-ES' : 'en-US',
  };

  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new Error(ctx.t.notObject);

  const basics = data.basics ?? {};
  const out: string[] = [hero(basics, ctx)];

  if (basics.summary)
    out.push(section('', `<p class="cv-about">${esc(basics.summary)}</p>`));

  if (Array.isArray(data.works) && data.works.length)
    out.push(
      section(
        ctx.t.experience,
        `<ul class="works">${data.works.map((w: any) => work(w, ctx)).join('')}</ul>`
      )
    );

  if (Array.isArray(data.projects) && data.projects.length)
    out.push(
      section(
        ctx.t.projects,
        `<ul class="projects">${data.projects.map((p: any) => project(p, ctx)).join('')}</ul>`
      )
    );

  if (Array.isArray(data.education) && data.education.length)
    out.push(
      section(
        ctx.t.education,
        `<ul class="edu-list">${data.education.map((e: any) => education(e, ctx)).join('')}</ul>`
      )
    );

  if (Array.isArray(data.certificates) && data.certificates.length)
    out.push(
      section(
        ctx.t.certificates,
        `<ul class="cert-list">${data.certificates.map((c: any) => certificate(c, ctx)).join('')}</ul>`
      )
    );

  if (Array.isArray(data.skills) && data.skills.length)
    out.push(
      section(
        ctx.t.skills,
        `<ul class="skills">${data.skills
          .map(
            (s: any) =>
              `<li><span>${esc(s.name)}:</span> ${esc(Array.isArray(s.keywords) ? s.keywords.join(', ') : '')}</li>`
          )
          .join('')}</ul>`
      )
    );

  if (Array.isArray(data.languages) && data.languages.length)
    out.push(
      section(
        ctx.t.languages,
        `<ul class="langs">${data.languages
          .map(
            (l: any) =>
              `<li><span>${esc(l.language)}:</span> ${esc(l.fluency)}</li>`
          )
          .join('')}</ul>`
      )
    );

  return `<div class="cv-view"><main class="cv-main">${out.join('')}</main></div>`;
}
