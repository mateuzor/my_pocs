"use client";

import ProductList from "@/components/ProductList";
import SearchBox from "@/components/SearchBox";
import { useStore } from "@/store/useStore";

export default function Home() {
  const products = useStore((state) => state.products);
  const searchTerm = useStore((state) => state.searchTerm);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recommended = products
    .filter((p) => {
      if (!p.rating.count) return false;
      return p.rating.rate >= 4.5;
    })
    .slice(0, 4);

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-xl font-semibold mb-4 text-black">Products</h1>
      <div className="mb-6">
        <SearchBox />
      </div>

      <ProductList products={filtered} />

      <div className="mt-10">
        <ProductList title="You may also like" products={recommended} />
      </div>
    </main>
  );
}
