import { defineEventHandler } from "h3";

const APP_NAME = process.env.APP_NAME || "poc-nitrojs-todos";

export default defineEventHandler(() => {
  return { message: `Hello from ${APP_NAME}!`, at: new Date().toISOString() };
});
