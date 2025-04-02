"use client";

import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from "react-icons/io";

interface Rating {
  rate: number;
  count: number;
}

interface ProductRatingProps {
  rating: Rating;
}

export default function ProductRating({ rating }: ProductRatingProps) {
  const { rate, count } = rating;

  const renderStar = (index: number) => {
    if (rate >= index) return <IoMdStar />;
    if (rate >= index - 0.5) return <IoMdStarHalf />;
    return <IoMdStarOutline />;
  };

  return (
    <div
      className="flex items-center justify-between text-xs mt-1"
      tabIndex={0}
      aria-label={`Rating: ${rate?.toFixed(1) ?? "No ratings"}, based on ${
        count ?? 0
      } reviews`}
    >
      <span className="text-black">{rate?.toFixed(1) ?? "No ratings"}</span>
      <div className="flex gap-0.5 text-yellow-500 text-base">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="hover:text-yellow-400">
            {renderStar(star)}
          </span>
        ))}
      </div>
      <span className="text-black">{count ?? 0}</span>
    </div>
  );
}
