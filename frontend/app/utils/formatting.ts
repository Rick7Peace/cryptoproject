/**
 * Type for values that can be formatted (number, string or undefined)
 */
export type FormattableValue = number | string | undefined;

/**
 * Format a number as currency
 */
export function formatCurrency(
  value: FormattableValue, 
  currency = 'usd', 
  decimals = 2
): string {
  if (value === undefined || value === null) return '-';
  
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Handle large numbers differently
  if (numberValue >= 1e9) {
    // Convert to billions
    return formatCurrency(numberValue / 1e9, currency, 2) + 'B';
  } else if (numberValue >= 1e6) {
    // Convert to millions
    return formatCurrency(numberValue / 1e6, currency, 2) + 'M';
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  
  return formatter.format(numberValue);
}

/**
 * Format a number with commas
 */
export function formatNumber(
  value: FormattableValue, 
  decimals = 2
): string {
  if (value === undefined || value === null) return '-';
  
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(numberValue);
}

/**
 * Format a number as a percentage
 */
export function formatPercent(
  value: FormattableValue, 
  decimals = 2
): string {
  if (value === undefined || value === null) return '-';
  
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    signDisplay: 'exceptZero'
  }).format(numberValue / 100); // Dividing by 100 because percentages come as numbers already
  
  return formattedValue;
}