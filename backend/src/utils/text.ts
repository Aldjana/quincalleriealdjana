/** Texte obligatoire/optionnel, nettoyé et borné. Renvoie null si invalide. */
export function cleanText(value: unknown, { min = 0, max }: { min?: number; max: number }): string | null {
  if (value === undefined || value === null) return min === 0 ? '' : null;
  if (typeof value !== 'string') return null;
  const text = value.trim().replace(/\s+\n/g, '\n');
  return text.length >= min && text.length <= max ? text : null;
}

/** Numéro de téléphone : chiffres, espaces, +, -, (, ), . — entre 7 et 15 chiffres. */
export function cleanPhone(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const phone = value.trim();
  const digits = phone.replace(/\D/g, '');
  return /^[0-9+ ().-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15 ? phone : null;
}

export function cleanEmail(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string') return null;
  const email = value.trim();
  return email.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}
