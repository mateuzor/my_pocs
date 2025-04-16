"use client";

import React from "react";
import { Product } from "@/types/Product";
import { useStore } from "@/store/useStore";
import ProductRating from "@/components/ProductRating";

interface ProductListProps {
  title?: string;
  products?: Product[];
}

export default function ProductList({ title, products }: ProductListProps) {
  const allProducts = useStore((state) => state.products);
  const searchTerm = useStore((state) => state.searchTerm);
  const currentPage = useStore((state) => state.currentPage);
  const itemsPerPage = useStore((state) => state.itemsPerPage);

  const list =
    products ??
    allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const paginated = list.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full px-2">
      {title && (
        <h2
          className="text-lg font-semibold mb-4 text-black"
          tabIndex={0}
          aria-label={title}
        >
          {title}
        </h2>
      )}

      <div className="grid gap-4 grid-cols-1 [@media(min-width:480px)]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {paginated.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          paginated.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl p-3 shadow bg-white flex flex-col gap-2"
              tabIndex={0}
              aria-label={`${product.name}, price R$ ${product.price.toFixed(
                2
              )}`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-28 object-contain rounded-lg"
              />
              <h2 className="text-sm font-medium text-black truncate">
                {product.name}
              </h2>
              <p className="text-xs text-gray-700 line-clamp-2">
                {product.description}
              </p>
              <span className="text-sm font-semibold text-black">
                R$ {product.price.toFixed(2)}
              </span>
              <ProductRating rating={product?.rating} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
