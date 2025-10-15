import { defineEventHandler } from 'h3'

export default defineEventHandler(() => ({ message: 'Nitro Todos API', endpoints: ['/todos'] }))
