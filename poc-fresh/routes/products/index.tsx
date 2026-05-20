import { type Handlers, type PageProps } from "$fresh/server.ts";

// A Fresh route can EXPORT both a default component AND a `handler` object.
// The handler runs on the server before rendering — it can:
//   - fetch data from a database or API
//   - check authentication
//   - handle POST/PUT/DELETE requests (form submissions)
//   - return a Response directly (redirect, JSON, etc.)
//
// The handler passes data to the component via `ctx.render(data)`.
// This is conceptually like Next.js `getServerSideProps` + route handlers combined.

interface Product {
  id: number;
  name: string;
  price: number;
}

// Same in-memory list across requests for demo purposes
const PRODUCTS: Product[] = [
  { id: 1, name: "Mechanical keyboard", price: 149 },
  { id: 2, name: "Wireless mouse", price: 49 },
  { id: 3, name: "USB-C dock", price: 89 },
];
let nextId = 4;

interface Data {
  products: Product[];
  flash?: string; // optional success message after a POST
}

// `handler` exports HTTP method handlers — GET, POST, PUT, DELETE, etc.
// Each one receives `req` (standard Request) and `ctx` (Fresh context).
export const handler: Handlers<Data> = {
  // GET runs before the page renders — load data here
  GET(_req, ctx) {
    return ctx.render({ products: PRODUCTS });
  },

  // POST runs on form submissions to this route
  async POST(req, ctx) {
    const form = await req.formData();
    const name = String(form.get("name") ?? "").trim();
    const price = Number(form.get("price") ?? 0);

    if (name && price > 0) {
      PRODUCTS.push({ id: nextId++, name, price });
    }

    // Re-render the page with the updated list and a flash message
    return ctx.render({ products: PRODUCTS, flash: `Added "${name}"` });
  },
};

// The component receives the data passed to ctx.render()
export default function ProductsPage(props: PageProps<Data>) {
  const { products, flash } = props.data;

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 720 }}>
      <h1>Products</h1>

      {flash && (
        <p style={{
          background: "#c6f6d5",
          color: "#22543d",
          padding: "0.5rem 0.75rem",
          borderRadius: "4px",
        }}>
          {flash}
        </p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map((p) => (
          <li key={p.id} style={{ padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
            <strong>{p.name}</strong> — ${p.price}
          </li>
        ))}
      </ul>

      {/* Native HTML form — no JavaScript required.
          When submitted, the POST handler above runs and re-renders the page. */}
      <h3>Add a product</h3>
      <form method="POST" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input name="name" placeholder="Name" required style={{ padding: "0.4rem" }} />
        <input name="price" type="number" placeholder="Price" required style={{ padding: "0.4rem", width: 100 }} />
        <button type="submit">Add</button>
      </form>

      <p style={{ marginTop: "2rem" }}><a href="/">← Home</a></p>
    </main>
  );
}
