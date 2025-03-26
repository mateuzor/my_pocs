"use client";

import { useStore } from "@/store/useStore";

interface ProductRatingProps {
  productId: number;
  ratings: number[];
}

export default function ProductRating({
  productId,
  ratings,
}: ProductRatingProps) {
  const rateProduct = useStore((state) => state.rateProduct);

  const handleRate = (rating: number) => {};

  const average =
    ratings.length > 0
      ? (ratings.reduce((acc, val) => acc + val, 0) / ratings.length).toFixed(1)
      : "No ratings";

  return (
    <div className="flex items-center justify-between text-xs mt-1">
      <span className="text-gray-600">{average}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            className="text-yellow-500 hover:text-yellow-400 text-sm"
          >
            {star <= Math.round(Number(average)) ? "★" : "☆"}
          </button>
        ))}
      </div>
      <span className="text-gray-600">{ratings.length}</span>
    </div>
  );
}
