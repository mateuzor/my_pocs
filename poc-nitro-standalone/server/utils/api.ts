// Anything EXPORTED from server/utils/ is AUTO-IMPORTED everywhere on the
// server — no import statements in handlers. Nitro scans this folder and
// generates the types + imports for you, so shared helpers stay DRY.
export function ok<T>(data: T) {
  return { success: true as const, data };
}
