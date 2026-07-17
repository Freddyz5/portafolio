// "Vista ATS": plantilla plana y sin adornos para PDFs que pasen filtros ATS.
// Jerarquía simple con encabezados reales, sin columnas, tablas ni iconos, e
// imprime el stack de cada equipo/proyecto (los ATS hacen match por keywords).
import { highlightText } from 'src/shared/utils/highlightText';
import { PREVIEW_LABELS, type PreviewLabels } from '../constants/PREVIEW_LABELS';
import { byPriority, escapeHtml as esc } from './html';

type Ctx = { t: PreviewLabels };

function range(
  start: string | undefined,
  end: string | null | undefined,
  { t }: Ctx
): string {
  const from = start ? esc(start) : '';
  const to = end ? esc(end) : esc(t.present);
  if (!from && !end) return esc(t.present);
  return from ? `${from} – ${to}` : to;
}

function highlights(list: unknown): string {
  if (!Array.isArray(list) || list.length === 0) return '';
  return `<ul>${byPriority(list)
    .map((h) => `<li>${esc(highlightText(h ?? ''))}</li>`)
    .join('')}</ul>`;
}

function section(title: string, body: string): string {
  return `<section><h2>${esc(title)}</h2>${body}</section>`;
}

function contact(basics: any): string {
  const location = basics?.location ?? {};
  const cityUtc = location.city
    ? `${esc(location.city)}${location.utcOffset ? ` (${esc(location.utcOffset)})` : ''}`
    : location.utcOffset
      ? esc(location.utcOffset)
      : '';

  return [basics?.email, basics?.phone, basics?.url]
    .filter(Boolean)
    .map(esc)
    .concat(cityUtc ? [cityUtc] : [])
    .join(' · ');
}

function team(item: any, ctx: Ctx): string {
  const parts: string[] = ['<div class="team">'];
  parts.push(
    `<h4>${[item.teamName, item.role].filter(Boolean).map(esc).join(' — ')}</h4>`
  );
  if (item.startDate || item.endDate)
    parts.push(`<p class="meta">${range(item.startDate, item.endDate, ctx)}</p>`);
  if (Array.isArray(item.stack) && item.stack.length)
    parts.push(
      `<p class="stack"><strong>${esc(ctx.t.stack)}:</strong> ${esc(item.stack.join(', '))}</p>`
    );
  if (item.summary) parts.push(`<p>${esc(item.summary)}</p>`);
  parts.push(highlights(item.highlights));
  parts.push('</div>');
  return parts.join('');
}

function work(item: any, ctx: Ctx): string {
  const parts: string[] = ['<div class="entry">'];
  parts.push(
    `<h3>${[item.position, item.name].filter(Boolean).map(esc).join(' — ')}</h3>`
  );
  parts.push(
    `<p class="meta">${range(item.startDate, item.endDate, ctx)}${item.url ? ` · ${esc(item.url)}` : ''}</p>`
  );
  if (item.summary) parts.push(`<p>${esc(item.summary)}</p>`);
  parts.push(highlights(item.highlights));
  if (Array.isArray(item.teams))
    parts.push(item.teams.map((t: any) => team(t, ctx)).join(''));
  parts.push('</div>');
  return parts.join('');
}

function project(item: any, ctx: Ctx): string {
  const parts: string[] = ['<div class="entry">'];
  parts.push(
    `<h3>${esc(item.name)}${item.status ? ` — ${esc(item.status)}` : ''}</h3>`
  );
  const links = [item.url, item.repo].filter(Boolean).map(esc).join(' · ');
  parts.push(
    `<p class="meta">${range(item.startDate, item.endDate, ctx)}${links ? ` · ${links}` : ''}</p>`
  );
  if (item.summary) parts.push(`<p>${esc(item.summary)}</p>`);
  parts.push(highlights(item.highlights));
  if (Array.isArray(item.technologies) && item.technologies.length)
    parts.push(
      `<p class="stack"><strong>${esc(ctx.t.stack)}:</strong> ${esc(item.technologies.join(', '))}</p>`
    );
  parts.push('</div>');
  return parts.join('');
}

function education(item: any, ctx: Ctx): string {
  return (
    `<div class="entry"><h3>${[item.area, item.institution].filter(Boolean).map(esc).join(' — ')}</h3>` +
    `<p class="meta">${range(item.startDate, item.endDate, ctx)}</p></div>`
  );
}

function certificate(item: any): string {
  const meta = [item.issuer, item.date].filter(Boolean).map(esc).join(' · ');
  return (
    `<div class="entry"><h3>${esc(item.name)}</h3>` +
    `<p class="meta">${meta}${item.url ? ` · ${esc(item.url)}` : ''}</p></div>`
  );
}

export function buildATSView(data: any, lang: 'es' | 'en'): string {
  const ctx: Ctx = { t: PREVIEW_LABELS[lang] };

  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new Error(ctx.t.notObject);

  const basics = data.basics ?? {};
  const out: string[] = [];

  out.push(
    `<header class="cv-head"><h1>${esc(basics.name)}</h1>` +
      (basics.label ? `<p class="role-title">${esc(basics.label)}</p>` : '') +
      `<p class="contact">${contact(basics)}</p></header>`
  );

  if (basics.summary)
    out.push(section(ctx.t.summary, `<p>${esc(basics.summary)}</p>`));

  if (Array.isArray(data.works) && data.works.length)
    out.push(
      section(ctx.t.experience, data.works.map((w: any) => work(w, ctx)).join(''))
    );

  if (Array.isArray(data.projects) && data.projects.length)
    out.push(
      section(
        ctx.t.projects,
        byPriority(data.projects)
          .map((p: any) => project(p, ctx))
          .join('')
      )
    );

  if (Array.isArray(data.education) && data.education.length)
    out.push(
      section(
        ctx.t.education,
        data.education.map((e: any) => education(e, ctx)).join('')
      )
    );

  if (Array.isArray(data.certificates) && data.certificates.length)
    out.push(
      section(ctx.t.certificates, data.certificates.map(certificate).join(''))
    );

  if (Array.isArray(data.skills) && data.skills.length)
    out.push(
      section(
        ctx.t.skills,
        `<ul class="plain">${data.skills
          .map(
            (s: any) =>
              `<li><strong>${esc(s.name)}:</strong> ${esc(Array.isArray(s.keywords) ? s.keywords.join(', ') : '')}</li>`
          )
          .join('')}</ul>`
      )
    );

  if (Array.isArray(data.languages) && data.languages.length)
    out.push(
      section(
        ctx.t.languages,
        `<ul class="plain">${data.languages
          .map(
            (l: any) =>
              `<li><strong>${esc(l.language)}:</strong> ${esc(l.fluency)}</li>`
          )
          .join('')}</ul>`
      )
    );

  return `<article class="ats">${out.join('')}</article>`;
}
