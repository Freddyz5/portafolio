// Textos del panel de control del lab (se renderizan en el servidor).
export type UiLabels = {
  title: string;
  hint: string;
  placeholder: string;
  load: string;
  loadBase: string;
  copy: string;
  clear: string;
  print: string;
  viewCv: string;
  viewAts: string;
  empty: string;
  noscript: string;
};

export const UI_LABELS: Record<'es' | 'en', UiLabels> = {
  es: {
    title: "CV Lab",
    hint: "Pega el JSON de una variante y previsualiza el CV. Imprime a PDF con Ctrl/Cmd+P.",
    placeholder: "Pega aquí el JSON de la variante…",
    load: "Cargar maestro",
    loadBase: "Cargar base",
    copy: "Copiar",
    clear: "Limpiar",
    print: "Imprimir",
    viewCv: "Vista CV",
    viewAts: "Vista ATS",
    empty: "Pega un JSON o pulsa «Cargar maestro» para ver el CV.",
    noscript: "Esta herramienta requiere JavaScript.",
  },
  en: {
    title: "CV Lab",
    hint: "Paste a variant JSON and preview the CV. Print to PDF with Ctrl/Cmd+P.",
    placeholder: "Paste the variant JSON here…",
    load: "Load master",
    loadBase: "Load blank",
    copy: "Copy",
    clear: "Clear",
    print: "Print",
    viewCv: "CV view",
    viewAts: "ATS view",
    empty: 'Paste a JSON or click "Load master" to see the CV.',
    noscript: "This tool requires JavaScript.",
  },
};
