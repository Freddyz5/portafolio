// Tipos base para la estructura multiidioma
type MultiLangValue = {
  es: string;
  en: string;
};

type Language = 'es' | 'en';

// Función auxiliar para verificar si un objeto es un valor multiidioma
function isMultiLangValue(value: unknown): value is MultiLangValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'es' in value &&
    'en' in value &&
    Object.keys(value).length === 2
  );
}

// Función principal que separa los idiomas
export function separateLanguages<T>(data: T, language: Language): T {
  // Caso base: null o undefined
  if (data === null || data === undefined) {
    return data;
  }

  // Si es un valor multiidioma, retorna el valor del idioma específico
  if (isMultiLangValue(data)) {
    return data[language] as T;
  }

  // Si es un array, procesa cada elemento
  if (Array.isArray(data)) {
    return data.map((item) => separateLanguages(item, language)) as T;
  }

  // Si es un objeto, procesa cada propiedad
  if (typeof data === 'object') {
    const result: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(data)) {
      result[key] = separateLanguages(value, language);
    }
    
    return result as T;
  }

  // Para valores primitivos (string, number, boolean), retorna tal cual
  return data;
}

