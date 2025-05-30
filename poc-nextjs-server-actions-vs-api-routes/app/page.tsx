export default function Home() {
  async function handleServerAction(formData: FormData) {
    "use server";
    const start = Date.now();
    await new Promise((res) => setTimeout(res, 100));
    const duration = Date.now() - start;
    console.log("Server Action duration:", duration);
  }

  return (
    <main>
      <h1>Compare Server Actions vs API Routes</h1>
      <form action={handleServerAction}>
        <button type="submit">Trigger Server Action</button>
      </form>
      <form method="POST" action="/api/delay">
        <button type="submit">Trigger API Route</button>
      </form>
    </main>
  );
}
