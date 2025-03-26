"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import ProductRating from "@/components/ProductRating";

export default function ProductList() {
  const { products, searchTerm } = useStore();

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full px-0">
      <div className="grid gap-4 grid-cols-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          filtered.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl p-3 shadow bg-white flex flex-col gap-2"
            >
              <img
                src="https://placehold.co/300x200?text=Product"
                alt={product.name}
                className="w-full h-28 object-cover rounded-lg"
              />
              <h2 className="text-xs font-medium text-black truncate">
                {product.name}
              </h2>
              <ProductRating productId={product.id} ratings={product.ratings} />
              <span className="text-xs font-semibold text-gray-600">
                R$ {product.price.toFixed(2)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
