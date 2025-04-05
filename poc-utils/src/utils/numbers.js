export function formatCurrency(value, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function round(value, decimals = 2) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
