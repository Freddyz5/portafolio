// Normaliza un highlight a texto plano.
//
// Tras separateLanguages(), resume.json entrega highlights como objetos
// ({ id, priority, tags, text }) mientras que resumeSound.json los mantiene
// como strings. Este helper permite que ambos schemas convivan en el mismo
// renderer.
export function highlightText(h: unknown): string {
  return typeof h === 'string' ? h : (h as { text: string }).text;
}
