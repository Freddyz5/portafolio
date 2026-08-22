/*
  El número se guarda en services.json en formato local ecuatoriano (0995781302);
  wa.me exige el internacional sin signos. Estas dos funciones son la única
  traducción entre ambos.
*/
const COUNTRY_CODE = '593';

/** 0995781302 → 593995781302 */
export function toInternational(raw: string): string {
  const digits = String(raw ?? '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.startsWith(COUNTRY_CODE)
    ? digits
    : COUNTRY_CODE + digits.replace(/^0/, '');
}

/** 0995781302 → «099 578 1302» */
export function toLocalLabel(raw: string): string {
  const local = toInternational(raw).replace(new RegExp('^' + COUNTRY_CODE), '0');
  return local.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3');
}

export function whatsappHref(raw: string, message: string): string {
  return `https://wa.me/${toInternational(raw)}?text=${encodeURIComponent(message)}`;
}
