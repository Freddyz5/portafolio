// Red de seguridad contra tags mal escritos: recoge todos los `tags` usados en el
// JSON (highlights, skills, projects…) y los contrasta con meta.tagVocabulary.
// Es puro: quien llama decide cómo avisar en pantalla.

export type TagCheck = {
  vocabMissing: boolean;
  unknown: string[];
};

function collectTags(node: unknown, acc: Set<string>): void {
  if (!node || typeof node !== 'object') return;

  if (Array.isArray(node)) {
    node.forEach((child) => collectTags(child, acc));
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key === 'tags' && Array.isArray(value)) {
      value.forEach((tag) => {
        if (typeof tag === 'string') acc.add(tag);
      });
    } else {
      collectTags(value, acc);
    }
  }
}

export function checkTags(raw: any): TagCheck {
  const vocabulary = raw?.meta?.tagVocabulary;
  const used = new Set<string>();

  // `meta` se excluye: tagVocabulary es la fuente de verdad, no un uso.
  const { meta: _meta, ...rest } = raw ?? {};
  collectTags(rest, used);

  if (!Array.isArray(vocabulary)) {
    return { vocabMissing: used.size > 0, unknown: [] };
  }

  const known = new Set(vocabulary.filter((t: unknown) => typeof t === 'string'));
  return {
    vocabMissing: false,
    unknown: [...used].filter((tag) => !known.has(tag)),
  };
}
