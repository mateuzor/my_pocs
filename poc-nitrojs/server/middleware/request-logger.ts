import { defineEventHandler, getMethod, getRequestURL } from 'h3'

// Request logger middleware (DX helper)
export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const method = getMethod(event)
  const start = performance.now()
  event.node.res.on('finish', () => {
    const ms = (performance.now() - start).toFixed(1)
    console.log(`[${new Date().toISOString()}] ${method} ${url.pathname} -> ${ms}ms`)
  })
})
