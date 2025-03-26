import { create } from "zustand";
import { Product } from "@/types/Product";

interface StoreState {
  products: Product[];
  searchTerm: string;
  rateProduct: (id: number, rating: number) => void;
  setSearchTerm: (term: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  products: [
    {
      id: 1,
      name: "Notebook Dell XPS 13",
      description: 'Ultra leve, tela 13" Full HD, Intel i7',
      ratings: [5, 4, 5],
      price: 8999.99,
    },
    {
      id: 2,
      name: "Smartphone Pixel 7",
      description: "Android puro, excelente câmera e performance",
      ratings: [4, 5],
      price: 4499.9,
    },
    {
      id: 3,
      name: "Apple MacBook Pro M2",
      description: "Poderoso, silencioso e eficiente com chip M2",
      ratings: [5, 5, 5],
      price: 14999.0,
    },
    {
      id: 4,
      name: "Monitor LG UltraWide",
      description: 'Tela 34" para produtividade e imersão total',
      ratings: [4, 4, 5],
      price: 2999.9,
    },
    {
      id: 5,
      name: "Fone Sony WH-1000XM5",
      description: "Cancelamento de ruído líder de mercado",
      ratings: [5, 4, 4],
      price: 1899.0,
    },
    {
      id: 6,
      name: "Kindle Paperwhite",
      description: "Leve, com tela antirreflexo e bateria duradoura",
      ratings: [5, 5],
      price: 649.9,
    },
    {
      id: 7,
      name: "Teclado Mecânico Keychron K8",
      description: "Wireless com switches hot-swappable",
      ratings: [4, 5, 4],
      price: 599.9,
    },
    {
      id: 8,
      name: "Mouse Logitech MX Master 3S",
      description: "Confortável, preciso e recarregável via USB-C",
      ratings: [5, 5],
      price: 499.0,
    },
    {
      id: 9,
      name: "Cadeira Ergonômica Flexform",
      description: "Ajustes completos para postura ideal",
      ratings: [4, 4, 4],
      price: 1399.0,
    },
    {
      id: 10,
      name: "Hub USB-C Anker 7 em 1",
      description: "Expanda suas portas com praticidade e estilo",
      ratings: [5],
      price: 349.0,
    },
  ],
  searchTerm: "",
  rateProduct: (id, rating) => {},
  setSearchTerm: (term) => set({ searchTerm: term }),
}));
