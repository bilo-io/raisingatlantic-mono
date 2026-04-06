/**
 * Calculates the age of a person in a human-readable format based on their date of birth.
 * @param dateOfBirth - The date of birth as a Date object or an ISO string.
 * @returns A string representing the age (e.g., "6 Months", "2.5 Years").
 */
export function getAgeFromDate(dateOfBirth: string | Date): string {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const now = new Date();
  
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  
  if (months < 0 || (months === 0 && now.getDate() < dob.getDate())) {
    years--;
    months += 12;
  }

  if (years === 0) {
    return `${months} Month${months !== 1 ? 's' : ''}`;
  }
  
  if (years < 2) {
    const totalMonths = years * 12 + months;
    return `${totalMonths} Month${totalMonths !== 1 ? 's' : ''}`;
  }

  const decimalAge = years + months / 12;
  return `${decimalAge.toFixed(1).replace('.0', '')} Year${years !== 1 ? 's' : ''}`;
}

/**
 * Formats a date string or Date object into a standard representation.
 * @param date - The date to format.
 * @returns A formatted date string.
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
