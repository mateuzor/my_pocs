// useRuntimeConfig(event) returns the merged config: defaults from
// nitro.config.ts overlaid with environment variables at runtime. Secrets
// live here instead of being hard-coded, and they can be changed per
// deployment without rebuilding.
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  return {
    appName: config.public.appName,
    // Never leak the secret itself — just prove it was resolved.
    hasSecret: Boolean(config.apiSecret),
  };
});
