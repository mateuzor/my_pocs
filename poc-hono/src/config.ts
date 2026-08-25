// Lesson 8 — shared config, extracted so route modules (src/routes/*) don't
// need to import from app.ts and create a circular dependency.
export const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-only-secret';
export const COOKIE_SECRET = process.env.COOKIE_SECRET ?? 'dev-only-cookie-secret';
