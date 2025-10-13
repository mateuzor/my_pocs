import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return {
    message: "Start by editing server/routes/index.ts",
    nextSteps: ["/hello", "/time"],
    docs: "https://nitro.unjs.io/"
  }
})
