// json-utils.ts — utilidades para manipular JSON de forma inmutable y segura en Astro

export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export interface JSONObject { [key: string]: JSONValue }
export interface JSONArray extends Array<JSONValue> {}

// Convierte paths como "works[0].teams[1]" en ["works", "0", "teams", "1"]
const parsePath = (path: string): string[] => path.replace(/\[(\w+)\]/g, ".$1").split('.');

// Obtiene un clon profundo para evitar mutar el original
const deepClone = <T>(obj: T): T => structuredClone(obj);

// Navega hasta el penúltimo nivel del path
const getTarget = (obj: any, path: string[]): [any, string] | null => {
  const last = path.pop();
  if (!last) return null;
  let current = obj;
  for (const part of path) {
    if (current[part] == null) return null;
    current = current[part];
  }
  return [current, last];
};

export function addAttribute<T extends JSONObject>(obj: T, path: string, key: string, value: JSONValue): T {
  const copy = deepClone(obj);
  const parsed = parsePath(path);
  const target = getTarget(copy, parsed);
  if (target) {
    const [current] = target;
    if (typeof current === 'object') (current as JSONObject)[key] = value;
  }
  return copy;
}

export function pushToArray<T extends JSONObject>(obj: T, path: string, value: JSONValue): T {
  const copy = deepClone(obj);
  const parsed = parsePath(path);
  const target = getTarget(copy, parsed);
  if (target) {
    const [current, last] = target;
    if (Array.isArray(current[last])) (current[last] as JSONArray).push(value);
  }
  return copy;
}

export function mergeObject<T extends JSONObject>(obj: T, path: string, data: JSONObject): T {
  const copy = deepClone(obj);
  const parsed = parsePath(path);
  const target = getTarget(copy, parsed);
  if (target) {
    const [current, last] = target;
    if (typeof current[last] === 'object') Object.assign(current[last], data);
  }
  return copy;
}

export function deleteAttribute<T extends JSONObject>(obj: T, path: string): T {
  const copy = deepClone(obj);
  const parsed = parsePath(path);
  const target = getTarget(copy, parsed);
  if (target) {
    const [current, last] = target;
    if (typeof current === 'object' && last in current) delete current[last];
  }
  return copy;
}

export function removeFromArray<T extends JSONObject>(
  obj: T,
  path: string,
  condition: number | ((item: any, index: number) => boolean)
): T {
  const copy = deepClone(obj);
  const parsed = parsePath(path);
  const target = getTarget(copy, parsed);
  if (target) {
    const [current, last] = target;
    const arr = current[last];
    if (Array.isArray(arr)) {
      if (typeof condition === 'number') arr.splice(condition, 1);
      else {
        const index = arr.findIndex(condition);
        if (index !== -1) arr.splice(index, 1);
      }
    }
  }
  return copy;
}
