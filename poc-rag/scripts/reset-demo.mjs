// Back to the "before the demo" state: no index. The downloaded model stays in .cache.
import { rmSync } from 'node:fs'

rmSync('index.json', { force: true })
console.log('Demo reset. Next: npm run ingest')
