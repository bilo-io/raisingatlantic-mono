
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `***@${domain}`;
  return `${local.substring(0, 2)}***@${domain}`;
}

export function maskPhone(phone: string): string {
  if (!phone) return phone;
  // Assumes a general format, masks all but the first few and last few characters
  // Example: +27 82 123 4567 -> +27 82 *** 4567
  const cleaned = phone.trim();
  if (cleaned.length < 7) return '***-***-****';
  return `${cleaned.substring(0, 4)} *** ${cleaned.substring(cleaned.length - 4)}`;
}
