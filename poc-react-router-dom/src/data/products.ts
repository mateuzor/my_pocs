export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
};

// Mock de API - simula delay de rede
export async function fetchProducts(): Promise<Product[]> {
  // Simula delay de 500ms
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { id: "1", name: "Laptop", price: 1299.99, category: "Electronics", inStock: true },
    { id: "2", name: "Mouse", price: 29.99, category: "Electronics", inStock: true },
    { id: "3", name: "Keyboard", price: 79.99, category: "Electronics", inStock: false },
    { id: "4", name: "Monitor", price: 349.99, category: "Electronics", inStock: true },
    { id: "5", name: "Headphones", price: 149.99, category: "Audio", inStock: true },
    { id: "6", name: "Webcam", price: 89.99, category: "Electronics", inStock: false },
  ];
}

export async function fetchProductById(id: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const products = await fetchProducts();
  return products.find((p) => p.id === id) || null;
}
