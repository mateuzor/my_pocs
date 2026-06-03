// Pretend this module is "heavy" (a big date/markdown/chart lib). We want it
// OUT of the initial bundle and only fetched when the user actually needs it.
export function format(input: string): string {
  return `« ${input.trim().toUpperCase()} »`;
}
