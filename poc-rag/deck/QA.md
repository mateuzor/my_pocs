# RAG talk: audience Q&A (5 min talk)

Tags: **[tested]** I ran it in the POC. **[general]** common knowledge, not tested here. **[not tested]** the POC does not cover it.

If you don't know: "Good question, I haven't tested that. I'll check and share it after." That is a fine answer.

**Is RAG better than fine-tuning?**
They solve different problems. Fine-tuning changes the model's behavior or style. RAG gives the model facts at question time. RAG is easier to update (re-index the changed documents) and can show sources. You can also use both. [general]

**Does RAG stop hallucinations?**
It reduces them when the search finds the right text, but it does not remove them. The search can return the wrong chunks, and the model can ignore the context. The demo prompt says "if the answer is not in the context, say you don't know", which helps. I did not test the LLM step. [general, not tested]

**What is an embedding?**
A list of numbers that represents the meaning of a text. Texts with a similar meaning get close numbers. In the demo, each chunk is 384 numbers. [tested]

**Why cut documents into chunks?**
A whole document mixes many ideas, so its numbers are blurry. One chunk with one idea matches a question better, and the prompt stays small. The demo uses one paragraph per chunk because the documents are short and clean. Real documents need tuning of size and overlap. [tested for the demo, general for the rest]

**Which vector database should we use?**
The demo uses a JSON file and a loop, which is fine for 20 chunks and does not scale. For real data people use pgvector, Qdrant, Chroma, Pinecone and others. I did not test any of them. [general, not tested]

**How many chunks should I send (top-k)?**
More chunks give a better chance to include the right one, but add noise and tokens. The demo uses 3, and chunk #3 was noise. Tune it with real questions, and consider a minimum score or a reranker. [tested for the noise, general for the rest]

**How do we know it works?**
Build a list of real questions, with the document that should answer each one, and check if that document is in the top results. I did this with 7 questions: the right document came first in 7 of 7, and an off-topic question scored only 0.19. That is a very small test. [tested, small]

**Is our data sent to a third party?**
In the demo, no: the embeddings run on the laptop and there is no LLM call. In a real system the chunks go into the prompt, so they reach the LLM provider. Check the provider's terms. [tested for the demo, general for the rest]

**Does it work in Portuguese?**
The demo model (all-MiniLM-L6-v2) is focused on English. For Portuguese, use a multilingual embedding model. I did not test one. [general, not tested]

**What if the data changes?**
Re-index the changed documents. The demo re-embeds everything when you run `npm run ingest`, which is fine for 6 documents. [tested for the demo, general for the rest]

**How do we control who sees which document?**
Store the access rules with each chunk, and filter by the user's permissions before or during the search. If you skip this, RAG can leak documents to people who should not see them. [general, not tested]

**Why not just paste everything into the prompt?**
For small data it can be simpler, and it works. But you pay for all the tokens in every question, and there is a size limit. RAG sends only the pieces that matter. [general]

**Which LLM should we use for the last step?**
RAG is independent of the LLM. Any model can write the answer from the prompt. I did not implement this step in the POC. [general, not tested]

**How much does it cost?**
The demo costs nothing: local model, no API. A real system pays for embeddings (once per chunk), for the tokens of the retrieved chunks at every question, and for the vector store. I have no numbers. [general]
