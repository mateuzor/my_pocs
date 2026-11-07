// Puts the POC back in the "before the demo" state:
// base spec, no generated code, and index.ts using pet.name.
import { copyFileSync, rmSync, writeFileSync } from 'node:fs'

copyFileSync('petStore.base.yaml', 'petStore.yaml')
rmSync('src/gen', { recursive: true, force: true })
writeFileSync(
  'src/index.ts',
  `import { getPetById } from './gen/clients/getPetById'
import type { Pet } from './gen/models/Pet'

// Fully typed from the OpenAPI spec: path params, response, errors.
const pet: Pet = await getPetById({ path: { petId: 1n } }).unwrap()

console.log(pet.name)
`,
)
console.log('Demo reset. Next: npm run generate')
