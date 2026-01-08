import { useLoaderData } from "react-router-dom";
import type { Product } from "../data/products";

/**
 * Página de produtos usando loader function.
 *
 * useLoaderData() retorna os dados carregados pelo loader configurado na rota.
 * Isso elimina a necessidade de useState/useEffect para carregar dados.
 */
export default function Products() {
  const { products } = useLoaderData() as { products: Product[] };

  return (
    <div>
      <h1>Products</h1>
      <p>
        Os dados abaixo foram carregados usando <strong>loader function</strong> antes
        da página renderizar.
      </p>

      <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>{product.name}</h3>
              <p style={{ margin: "4px 0", color: "#666", fontSize: 14 }}>
                {product.category}
              </p>
              <p
                style={{
                  margin: "4px 0",
                  color: product.inStock ? "green" : "red",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 24, fontWeight: "bold", margin: 0 }}>
                ${product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
