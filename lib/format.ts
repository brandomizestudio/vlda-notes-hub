/**
 * Formats paise integer to Rupees string with no decimals (e.g. 29900 paise -> "₹299")
 */
export function formatRupees(paise: number): string {
  const rupees = Math.round(paise / 100);
  return `₹${rupees.toLocaleString('en-IN')}`;
}

/**
 * Formats bytes to human-readable string (e.g. 1048576 -> "1.0 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1);
  return `${size} ${units[i]}`;
}

/**
 * Formats date into Indian locale readable format
 */
export function formatDate(dateInput: string | Date | number): string {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats time / relative or short timestamp
 */
export function formatTime(dateInput: string | Date | number): string {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}
