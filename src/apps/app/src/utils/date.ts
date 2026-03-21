import { format } from 'date-fns';

/**
 * Formats a date to DD/MM/YYYY.
 * @param date - The date to format (string, number, or Date object).
 * @returns The formatted date string, or an empty string if date is invalid.
 */
export function formatDateStandard(date: string | number | Date): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return format(d, 'dd/MM/yyyy');
  } catch (error) {
    return '';
  }
}

/**
 * Formats a date to DD Mon YYYY.
 * @param date - The date to format (string, number, or Date object).
 * @returns The formatted date string, or an empty string if date is invalid.
 */
export function formatDatePretty(date: string | number | Date): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return format(d, 'dd MMM yyyy');
  } catch (error) {
    return '';
  }
}
