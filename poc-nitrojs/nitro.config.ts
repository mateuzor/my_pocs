import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  srcDir: 'server',
  preset: 'node-server',
  routeRules: {
    '/stats': { cache: { maxAge: 60 } }
  }
})
