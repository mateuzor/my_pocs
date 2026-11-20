# RAG: retrieval before generation

RAG (Retrieval-Augmented Generation) gives an LLM the right pieces of your own data at question time, so it can answer from facts it never saw in training.

This POC shows the **retrieval** half, end to end, with **no API key and no cost**:

1. Split a small internal handbook (6 fictional documents) into chunks.
2. Turn each chunk into an embedding (a vector of 384 numbers) with a small model that runs on your machine.
3. For a question: embed it, find the closest chunks by cosine similarity, and build the prompt that would go to an LLM.

The final LLM call is **not** implemented here. The POC prints the augmented prompt, which is the "A" in RAG.

Requires Node 20 or newer (tested on 20 and 22; it fails on Node 18). The first `npm run ingest` downloads a model of about 23 MB from huggingface.co into `.cache/`.

## Run it

```bash
npm install
npm run ingest        # docs/ -> 20 chunks -> embeddings -> index.json
npm run ask:remote    # "Can I work from another country, and for how long?"
npm run ask:oncall    # "Production is down at night, who do I call?"
npm run ask -- "your own question"
npm run demo:reset    # delete index.json (the model stays cached)
```

## Files

| File | What it is |
|---|---|
| `docs/*.md` | The knowledge base: a fictional company handbook |
| `src/embed.mjs` | Loads the local embedding model (`all-MiniLM-L6-v2`, quantized) |
| `src/ingest.mjs` | Chunking (one paragraph per chunk) + embeddings, saved to `index.json` |
| `src/ask.mjs` | Embeds the question, ranks chunks by cosine similarity, prints the prompt |
| `index.json` | The "vector store": a JSON file, git-ignored, created by `ingest` |

## Demo walkthrough (optional: the talk uses a static slide with this output)

Before starting: `nvm use 22`, `npm run demo:reset`, zoom the terminal in.

1. **The knowledge** (20s). Open `docs/remote-work.md`. "Six documents, an internal handbook. A normal LLM has never seen it."
2. **Index it** (20s). `npm run ingest`. Six documents became 20 chunks, each with 384 numbers.
3. **Ask** (30s). `npm run ask:remote`. Point at three things:
   - chunk #1 is the right one (score about 0.7);
   - chunk #3 is noise (score about 0.3): top-k always returns k chunks;
   - the prompt has 3 chunks, not the whole handbook.
4. **Meaning, not words** (20s). `npm run ask:oncall`. The question says "call", the document says "page the on-call engineer". Embeddings match meaning.

## What I verified

- `ingest` creates 20 chunks of 384 dimensions.
- 7 of 7 test questions returned the right document as the top result (scores from 0.41 to 0.72).
- An off-topic question ("capital of France") scored only 0.19.
- A query takes under a second once the model is cached.

## Limits (be honest about these)

- **Tiny data.** 20 chunks. Real systems have thousands or millions, and then you need a vector database or an index like HNSW. A JSON file and a loop do not scale.
- **Weak chunking.** One paragraph per chunk works here because the documents are short and clean. Real documents need smarter chunking (size, overlap, structure).
- **Top-k is blind.** It always returns k chunks, even irrelevant ones. Real systems use a score threshold or a reranker.
- **No generation.** The LLM step is not implemented, so I did not test answer quality, citations, or hallucination.
- **Small English model.** `all-MiniLM-L6-v2` is English-focused. For Portuguese, use a multilingual embedding model.
- **Not measured.** I did not measure recall on a real dataset, only the 7 sample questions above.
