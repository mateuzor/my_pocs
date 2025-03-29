import { create } from "zustand";
import { Product } from "@/types/Product";

interface StoreState {
  products: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useStore = create<StoreState>((set) => {
  (async () => {
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();

      set({
        products: data.map((item: any) => ({
          id: item.id,
          name: item.title,
          description: item.description,
          price: item.price,
          rating: item.rating,
          image: item.image,
        })),
      });
    } catch (error) {
      console.error("Failed to fetch products from Fake Store API", error);
    }
  })();

  return {
    products: [],
    searchTerm: "",

    setSearchTerm: (term) => set({ searchTerm: term }),
  };
});
