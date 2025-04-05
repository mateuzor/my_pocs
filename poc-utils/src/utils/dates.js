export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US').format(new Date(date));
}

export function daysBetween(date1, date2) {
  const diff = Math.abs(new Date(date2) - new Date(date1));
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
