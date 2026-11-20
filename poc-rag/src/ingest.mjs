// Step 1 of RAG (indexing): read documents -> split into chunks -> embed -> save the index.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { embed, MODEL } from './embed.mjs'

const DOCS = new URL('../docs/', import.meta.url)
const INDEX = new URL('../index.json', import.meta.url)

const chunks = []
for (const file of readdirSync(DOCS).filter((f) => f.endsWith('.md')).sort()) {
  const [title, ...paragraphs] = readFileSync(new URL(file, DOCS), 'utf8').trim().split(/\n\s*\n/)
  const heading = title.replace(/^#\s*/, '')
  // One chunk per paragraph. The title goes with it, so each chunk keeps its context.
  for (const p of paragraphs) chunks.push({ source: file, text: `${heading}: ${p.trim()}` })
}

console.log(`Read ${new Set(chunks.map((c) => c.source)).size} documents -> ${chunks.length} chunks`)
console.log(`Embedding with ${MODEL} (the first run downloads the model, about 23 MB)...`)

const vectors = await embed(chunks.map((c) => c.text))
chunks.forEach((c, i) => (c.vector = vectors[i]))

writeFileSync(INDEX, JSON.stringify({ model: MODEL, chunks }))
console.log(`Saved index.json: ${chunks.length} chunks x ${vectors[0].length} dimensions`)
