/**
 * Shared helpers — src/lib/utils.ts
 *
 * THE ONE RULE, "NEVER PUBLISH A PLACEHOLDER":
 * a value counts as "set" only if isSet(v) returns true. Treated as NOT set:
 * undefined, null, '' (or whitespace only), and any string starting with
 * "TODO". No other helper of this kind may exist anywhere else in the
 * codebase (enforced by scripts/check.mjs).
 */

export function isSet(v: unknown): boolean {
  if (v === undefined || v === null) return false;
  if (typeof v === 'string') {
    const t = v.trim();
    return t !== '' && !t.startsWith('TODO');
  }
  if (typeof v === 'number') return Number.isFinite(v);
  if (typeof v === 'boolean') return v;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

/**
 * Displayed number -> value for a tel: link, in international format.
 * "01234 567890"  -> "+441234567890"
 * "07700 900000"  -> "+447700900000"
 * "+44 20 7946 0000" is kept as "+442079460000".
 */
export function phoneHref(phone: string): string {
  if (!isSet(phone)) return '';
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;
  if (digits.startsWith('0')) return `+44${digits.slice(1)}`;
  return digits;
}

/** Slug for an anchor id: "Roofing & repairs" -> "roofing-repairs". */
export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
