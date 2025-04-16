"use client";

import { useStore } from "@/store/useStore";

export default function Pagination() {
  const currentPage = useStore((state) => state.currentPage);
  const setCurrentPage = useStore((state) => state.setCurrentPage);
  const itemsPerPage = useStore((state) => state.itemsPerPage);
  const totalItems = useStore((state) => state.products.length);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8 text-sm">
      <button
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        aria-label="First page"
      >
        &laquo;
      </button>
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        aria-label="Previous page"
      >
        &lt;
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`px-3 py-1 rounded font-medium transition-colors duration-150 ${
            page === currentPage
              ? "bg-blue-600 text-white border border-blue-600"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        aria-label="Next page"
      >
        &gt;
      </button>
      <button
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        aria-label="Last page"
      >
        &raquo;
      </button>
    </div>
  );
}
