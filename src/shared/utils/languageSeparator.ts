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

// Función de conveniencia para obtener ambas versiones
export function getLocalizedVersions<T>(data: T): {
  es: T;
  en: T;
} {
  return {
    es: separateLanguages(data, 'es'),
    en: separateLanguages(data, 'en'),
  };
}

// Ejemplo de uso con tu servicio
export const getLocalizedData = async (): Promise<{
  es: unknown;
  en: unknown;
}> => {
  const accessKey = import.meta.env.PUBLIC_ACCESS_KEY;
  const endpoint = import.meta.env.PUBLIC_JSON_ENDPOINT;

  if (!accessKey || !endpoint) {
    throw new Error(
      'Missing required environment variables: PUBLIC_ACCESS_KEY and/or PUBLIC_JSON_ENDPOINT'
    );
  }

  try {
    const headers = new Headers();
    headers.append('X-Access-Key', accessKey);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }

    const responseJson = await response.json();

    if (!responseJson || typeof responseJson !== 'object') {
      throw new Error('Invalid response format: expected an object');
    }

    if (!('record' in responseJson)) {
      throw new Error('Invalid response structure: missing "record" property');
    }

    const record = responseJson.record;

    // Separar los idiomas
    return getLocalizedVersions(record);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unexpected error while fetching data: ${String(error)}`);
  }
};

// Función alternativa si quieres obtener solo un idioma específico
export const getData = async (language: Language = 'es'): Promise<unknown> => {
  const accessKey = import.meta.env.PUBLIC_ACCESS_KEY;
  const endpoint = import.meta.env.PUBLIC_JSON_ENDPOINT;

  if (!accessKey || !endpoint) {
    throw new Error(
      'Missing required environment variables: PUBLIC_ACCESS_KEY and/or PUBLIC_JSON_ENDPOINT'
    );
  }

  try {
    const headers = new Headers();
    headers.append('X-Access-Key', accessKey);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }

    const responseJson = await response.json();

    if (!responseJson || typeof responseJson !== 'object') {
      throw new Error('Invalid response format: expected an object');
    }

    if (!('record' in responseJson)) {
      throw new Error('Invalid response structure: missing "record" property');
    }

    const record = responseJson.record;

    // Retornar solo el idioma solicitado
    return separateLanguages(record, language);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unexpected error while fetching data: ${String(error)}`);
  }
};

/* 
 * EJEMPLO DE USO:
 * 
 * // Obtener ambas versiones
 * const { es, en } = await getLocalizedData();
 * 
 * // Obtener solo español
 * const dataEs = await getData('es');
 * 
 * // Obtener solo inglés
 * const dataEn = await getData('en');
 * 
 * // Si tienes el JSON en memoria:
 * const originalData = { ... };
 * const versions = getLocalizedVersions(originalData);
 * console.log(versions.es); // Versión en español
 * console.log(versions.en); // Versión en inglés
 */