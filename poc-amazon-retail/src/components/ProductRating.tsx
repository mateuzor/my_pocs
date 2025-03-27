"use client";

import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from "react-icons/io";

interface ProductRatingProps {
  productId: number;
  ratings: number[];
}

export default function ProductRating({ ratings }: ProductRatingProps) {
  const averageNumber =
    ratings.length > 0
      ? ratings.reduce((acc, val) => acc + val, 0) / ratings.length
      : 0;
  const average = ratings.length > 0 ? averageNumber.toFixed(1) : "No ratings";

  const renderStar = (index: number) => {
    if (averageNumber >= index) return <IoMdStar />;
    if (averageNumber >= index - 0.5) return <IoMdStarHalf />;
    return <IoMdStarOutline />;
  };

  return (
    <div className="flex items-center justify-between text-xs mt-1">
      <span className="text-gray-600">
        {average}
        {typeof average === "string" ? "" : ` (${ratings.length})`}
      </span>
      <div className="flex gap-0.5 text-yellow-500 text-base">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} className="hover:text-yellow-400">
            {renderStar(star)}
          </button>
        ))}
      </div>
    </div>
  );
}
