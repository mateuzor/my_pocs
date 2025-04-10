"use client";

import HeaderBanner from "@/components/Header";
import ProductList from "@/components/ProductList";
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
    <main className="min-h-screen bg-gray-100">
      <HeaderBanner />
      <ProductList products={filtered} />

      <div className="mt-10">
        <ProductList title="You may also like" products={recommended} />
      </div>
    </main>
  );
}
