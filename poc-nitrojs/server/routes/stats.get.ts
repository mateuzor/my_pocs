import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => ({ cached: true, at: new Date().toISOString() }))
