// Step 2 of RAG (query): embed the question -> find the closest chunks -> build the prompt.
import { readFileSync } from 'node:fs'
import { embed } from './embed.mjs'

const TOP_K = 3
const question = process.argv.slice(2).join(' ').trim()
if (!question) {
  console.error('Usage: npm run ask -- "your question"')
  process.exit(1)
}

const { chunks } = JSON.parse(readFileSync(new URL('../index.json', import.meta.url), 'utf8'))

const [q] = await embed([question])
// Vectors are normalized, so the dot product is the cosine similarity (1 = same meaning).
const score = (v) => v.reduce((sum, x, i) => sum + x * q[i], 0)
const top = chunks
  .map((c) => ({ ...c, score: score(c.vector) }))
  .sort((a, b) => b.score - a.score)
  .slice(0, TOP_K)

const bold = (s) => `\x1b[1m${s}\x1b[0m`
const dim = (s) => `\x1b[2m${s}\x1b[0m`
const green = (s) => `\x1b[32m${s}\x1b[0m`

console.log(`\n${bold('Question:')} ${question}\n`)
console.log(bold(`Top ${TOP_K} chunks (out of ${chunks.length}):`))
top.forEach((c, i) => {
  console.log(`\n${green(`#${i + 1}  score ${c.score.toFixed(2)}`)}  ${dim(c.source)}`)
  console.log(`    ${c.text}`)
})

const context = top.map((c) => `- ${c.text}`).join('\n')
const prompt = `Answer the question using only the context below. If the answer is not in the context, say you don't know.

Context:
${context}

Question: ${question}`

console.log(`\n${bold('Prompt that would be sent to the LLM:')}\n${dim('-'.repeat(60))}\n${prompt}\n${dim('-'.repeat(60))}`)
console.log(dim(`Chunks sent: ${top.length} of ${chunks.length}  (not the whole handbook)\n`))
