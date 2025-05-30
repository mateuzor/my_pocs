# POC - Compare Server Actions vs API Routes in Next.js

This Proof of Concept compares **Server Actions** and **API Routes** in Next.js by simulating a delay and measuring performance.

## 🔍 What is This?

- **Server Actions**: Functions declared with `'use server'` and run during form submissions.
- **API Routes**: Traditional REST-like endpoints under `/pages/api`.

---

## ✅ Pros and Cons

### Server Actions

✅ Integrated with components  
✅ Avoids client JS round-trips  
✅ Ideal for form actions and direct data mutations  
❌ Requires latest App Router + React Server Components  
❌ Harder to debug

### API Routes

✅ Familiar REST interface  
✅ Works with any client  
✅ Easy to test independently  
❌ Adds network overhead  
❌ Requires client-side logic to trigger

---

## 🌐 Real-World Use Cases

- Server Actions: submitting forms, creating records, updating DB.
- API Routes: third-party integrations, external tools, public APIs.

---

## 🚀 How to Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧪 What to Observe

1. Click **Trigger Server Action** → runs a server-side delay with no network call.
2. Click **Trigger API Route** → triggers `/api/delay` with a network request.
3. Use DevTools to compare:
   - No request for Server Action
   - Actual fetch for API Route

---
