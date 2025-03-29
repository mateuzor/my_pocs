import { create } from "zustand";
import { Product } from "@/types/Product";

interface StoreState {
  products: Product[];
  searchTerm: string;
  addProduct: (product: Product) => void;
  rateProduct: (id: number, rating: number) => void;
  setSearchTerm: (term: string) => void;
}

function generateRandomRatings(): number[] {
  const ratingsCount = Math.floor(Math.random() * 50) + 1; // between 1 and 50 ratings
  const ratings: number[] = [];
  for (let i = 0; i < ratingsCount; i++) {
    // Force high scores to ensure products show up in recommendations
    const highRating = Math.random() < 0.95; // 95% chance of being a 4 or 5 star
    ratings.push(
      highRating
        ? Math.floor(Math.random() * 2) + 4
        : Math.floor(Math.random() * 3) + 1
    );
  }
  return ratings;
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
          ratings: generateRandomRatings(),
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
    addProduct: (product) =>
      set((state) => ({
        products: [...state.products, product],
      })),
    rateProduct: (id, rating) =>
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ratings: [...(p.ratings || []), rating] } : p
        ),
      })),
    setSearchTerm: (term) => set({ searchTerm: term }),
  };
});
