import { create } from "zustand";
import { Product } from "@/types/Product";

interface StoreState {
  products: Product[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
}

export const useStore = create<StoreState>((set) => {
  (async () => {
    try {
      const res = await fetch("https://api.escuelajs.co/api/v1/products");
      const data = await res.json();

      set({
        products: data.map((item: any) => ({
          id: item.id,
          name: item.title,
          description: item.description,
          price: item.price,
          rating: Math.round(Math.random() * 5),
          image: item.images?.[0] || "",
        })),
      });
    } catch (error) {
      console.error(
        "Failed to fetch products from Platzi Fake Store API",
        error
      );
    }
  })();

  return {
    products: [],
    searchTerm: "",
    currentPage: 1,
    itemsPerPage: 4,
    setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),
    setCurrentPage: (page) => set({ currentPage: page }),
  };
});
