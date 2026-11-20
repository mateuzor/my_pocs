// Shared helper: a small embedding model that runs locally (no API key, no cost).
import { pipeline, env } from '@huggingface/transformers'
import { fileURLToPath } from 'node:url'

export const MODEL = 'Xenova/all-MiniLM-L6-v2'

// Keep the downloaded model inside the project, so it is downloaded only once.
env.cacheDir = fileURLToPath(new URL('../.cache', import.meta.url))

let extractor
export async function embed(texts) {
  extractor ??= await pipeline('feature-extraction', MODEL, { dtype: 'q8' }) // q8 = smaller model (about 23 MB)
  const out = await extractor(texts, { pooling: 'mean', normalize: true })
  return out.tolist() // one vector (384 numbers) per text
}
