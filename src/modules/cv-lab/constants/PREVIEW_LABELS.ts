// Textos que se usan en el cliente al construir el preview.
//
// PREVIEW_LABELS: títulos de sección del CV renderizado. Replican los de
// src/modules/cv (Skills usa el título con isDev = true, igual que /[lang]/cv).
// STATUS_LABELS: mensajes de estado/error del panel.

export type PreviewLabels = {
  summary: string;
  experience: string;
  projects: string;
  education: string;
  certificates: string;
  skills: string;
  languages: string;
  present: string;
  stack: string;
  portfolio: string;
  notObject: string;
};

export const PREVIEW_LABELS: Record<'es' | 'en', PreviewLabels> = {
  es: {
    summary: "Resumen profesional",
    experience: "Experiencia Laboral",
    projects: "Proyectos",
    education: "Educación",
    certificates: "Educación Suplementaria",
    skills: "Habilidades de programación",
    languages: "Idiomas",
    present: "Actualidad",
    stack: "Stack",
    portfolio: "Portafolio",
    notObject: "El JSON raíz debe ser un objeto",
  },
  en: {
    summary: "Professional Summary",
    experience: "Work Experience",
    projects: "Projects",
    education: "Education",
    certificates: "Supplementary Education",
    skills: "Programming Skills",
    languages: "Languages",
    present: "Present",
    stack: "Stack",
    portfolio: "Portafolio",
    notObject: "Root JSON must be an object",
  },
};

export type StatusLabels = {
  viewing: string;
  noVariant: string;
  invalidJson: string;
  renderFail: string;
  vocabMissing: string;
  unknownTags: string;
  copied: string;
  copyFail: string;
};

export const STATUS_LABELS: Record<'es' | 'en', StatusLabels> = {
  es: {
    viewing: "Viendo variante",
    noVariant: "JSON sin meta.variant",
    invalidJson: "JSON inválido",
    renderFail: "No se pudo renderizar el CV",
    vocabMissing:
      "meta.tagVocabulary ausente o inválido: no se pueden validar los tags",
    unknownTags: "Tags fuera de meta.tagVocabulary",
    copied: "¡Copiado!",
    copyFail: "No se pudo copiar al portapapeles",
  },
  en: {
    viewing: "Viewing variant",
    noVariant: "JSON has no meta.variant",
    invalidJson: "Invalid JSON",
    renderFail: "Could not render the CV",
    vocabMissing: "meta.tagVocabulary missing or invalid: cannot validate tags",
    unknownTags: "Tags outside meta.tagVocabulary",
    copied: "Copied!",
    copyFail: "Could not copy to clipboard",
  },
};
