import { defineEventHandler } from 'h3'

export default defineEventHandler(() => ({ now: new Date().toISOString() }))
