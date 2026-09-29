// src/lib/format.ts — Indian currency & date formatting
export function formatINR(amount: number, showZero: boolean = false): string {
  if (amount === 0 && !showZero) {
    return 'Free';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateIndian(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  const day = d.toLocaleDateString('en-IN', { day: '2-digit' });
  const month = d.toLocaleDateString('en-IN', { month: 'short' });
  const year = d.toLocaleDateString('en-IN', { year: 'numeric' });
  return `${day} ${month} ${year}`;
}
