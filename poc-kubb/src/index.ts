import { getPetById } from './gen/clients/getPetById'
import type { Pet } from './gen/models/Pet'

// Fully typed from the OpenAPI spec: path params, response, errors.
const pet: Pet = await getPetById({ path: { petId: 1n } }).unwrap()

console.log(pet.name)
